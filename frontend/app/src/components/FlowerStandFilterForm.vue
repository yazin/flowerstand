<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>絞り込み</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="6" lg="3">
                <v-select
                  dense
                  clearable
                  v-model="event"
                  :items="events"
                  item-text="name"
                  item-value="id"
                  return-object
                  @change="onChangeEvent"
                  label="イベント"/>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="3">
                <v-select
                  dense
                  clearable
                  v-model="group"
                  :items="groups"
                  item-text="name"
                  item-value="id"
                  return-object
                  @change="onChangeGroup"
                  label="グループ"/>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="3">
                <v-select
                  dense
                  clearable
                  v-model="baseDesign"
                  :items="baseDesigns"
                  item-text="name"
                  item-value="id"
                  return-object
                  @change="onChangeBaseDesign"
                  label="宛先"/>
              </v-col>
              <v-col cols="12" sm="12" md="6" lg="3">
                <v-checkbox v-model="showPastEvents" @change="onChangeShowPastEvent" label="終了したイベントを表示する"/>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Event } from '../models/Event';
import { Group } from '../models/Group';
import { BaseDesign } from '../models/BaseDesign';
import { LoadMasterDataResult } from '../plugins/store';

export interface FilterCondition {
  event: number | null;
  group: number | null;
  baseDesign: number | null;
  showPastEvent: boolean;
}

@Component
export default class FlowerStandFilterForm extends Vue {
  events: Event[] = [];
  event: Event | null = null;

  groups: Group[] = [];
  group: Group | null = null;

  baseDesigns: BaseDesign[] = [];
  baseDesign: BaseDesign | null = null;

  private allEvents: Event[] = [];
  private allGroups: Group[] = [];
  private allBaseDesigns: BaseDesign[] = [];

  showPastEvents = false;

  async created(): Promise<void>  {
    if (!this.$store.isLoaded) {
      const res: LoadMasterDataResult = await this.$store.loadMasterData();
      if (res.isError) {
        throw new Error(res.errorText);
      }
    }
    this.allEvents = this.$store.allEvents;
    dayjs.extend(customParseFormat);
    this.events = this.allEvents.filter((event: Event): event is Event => {
      return dayjs(event.endDate, 'YYYY-MM-DD') >= dayjs().startOf('day');
    });
    this.allGroups = this.$store.allGroups;
    this.groups = this.$store.allGroups;
    this.allBaseDesigns = this.$store.allBaseDesigns;
    this.baseDesigns = this.$store.allBaseDesigns;
  }

  @Emit('change-event')
  private onChangeEvent(): FilterCondition {
    if (!this.event) {
      this.groups = this.allGroups;
      this.baseDesigns = this.allBaseDesigns;
      return {
        event: null,
        group: this.group ? this.group.id : null,
        baseDesign: this.baseDesign ? this.baseDesign.id : null,
        showPastEvent: this.showPastEvents
      };
    }
    const groupIds: number[] = this.event.groups.map((group: Group): number => group.id);
    this.groups = this.allGroups.filter((group: Group): group is Group => {
      return groupIds.indexOf(group.id) >= 0;
    });
    this.baseDesigns = this.allBaseDesigns.filter((baseDesign: BaseDesign): baseDesign is BaseDesign => {
      return groupIds.indexOf(baseDesign.group.id) >= 0;
    });

    const availableGroups = this.event.groups.map((group: Group): number => group.id);
    if (this.group && availableGroups.indexOf(this.group.id) < 0) {
      this.group = null;
    }

    if (this.baseDesign && availableGroups.indexOf(this.baseDesign.group.id) < 0) {
      this.baseDesign = null;
    }

    return {
      event: this.event ? this.event.id : null,
      group: this.group ? this.group.id : null,
      baseDesign: this.baseDesign ? this.baseDesign.id : null,
      showPastEvent: this.showPastEvents
    };
  }

  @Emit('change-group')
  private onChangeGroup(): FilterCondition {
    if (!this.group) {
      this.events = this.allEvents;
      this.baseDesigns = this.allBaseDesigns;
      return {
        event: this.event ? this.event.id : null,
        group: null,
        baseDesign: this.baseDesign ? this.baseDesign.id : null,
        showPastEvent: this.showPastEvents
      };
    }
    const groupId = this.group.id;
    this.events = this.allEvents.filter((event: Event): event is Event => {
      return event.groups.map((group: Group): number => group.id).indexOf(groupId) >= 0;
    });
    this.baseDesigns = this.allBaseDesigns.filter((baseDesign: BaseDesign): baseDesign is BaseDesign => {
      return baseDesign.group.id === groupId;
    });

    if (this.event && this.event.groups.map((group: Group): number => group.id).indexOf(groupId) < 0) {
      this.event = null;
    }

    if (this.baseDesign && this.baseDesign.group.id !== groupId) {
      this.baseDesign = null;
    }

    return {
      event: this.event ? this.event.id : null,
      group: this.group ? this.group.id : null,
      baseDesign: this.baseDesign ? this.baseDesign.id : null,
      showPastEvent: this.showPastEvents
    };
  }

  @Emit('change-design')
  private onChangeBaseDesign(): FilterCondition {
    if (!this.baseDesign) {
      this.events = this.allEvents;
      this.groups = this.allGroups;
      return {
        event: this.event ? this.event.id : null,
        group: this.group ? this.group.id : null,
        baseDesign: null,
        showPastEvent: this.showPastEvents
      };
    }
    const groupId = this.baseDesign.group.id;
    this.events = this.allEvents.filter((event: Event): event is Event => {
      return event.groups.map((group: Group): number => group.id).indexOf(groupId) >= 0;
    });
    this.groups = this.allGroups.filter((group: Group): group is Group => {
      return group.id === groupId;
    });

    if (this.event && this.event.groups.map((group: Group): number => group.id).indexOf(groupId) < 0) {
      this.event = null;
    }

    if (this.group && this.group.id !== groupId) {
      this.group = null;
    }

    return {
      event: this.event ? this.event.id : null,
      group: this.group ? this.group.id : null,
      baseDesign: this.baseDesign ? this.baseDesign.id : null,
      showPastEvent: this.showPastEvents
    };
  }

  @Emit('change-show-past-events')
  onChangeShowPastEvent(): FilterCondition {
    this.events = this.allEvents.filter((event: Event): event is Event => {
      if (this.showPastEvents) {
        return true;
      } else {
        this.event = null;
        this.group = null;
        this.baseDesign = null;
        return dayjs(event.endDate, 'YYYY-MM-DD') >= dayjs().startOf('day');
      }
    }, this);
    return {
      event: this.event ? this.event.id : null,
      group: this.group ? this.group.id : null,
      baseDesign: this.baseDesign ? this.baseDesign.id : null,
      showPastEvent: this.showPastEvents
    };
  }
}
</script>
