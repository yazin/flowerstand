<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <FlowerStandFilterForm
          @change-event="changeFilter"
          @change-group="changeFilter"
          @change-design="changeFilter">
        </FlowerStandFilterForm>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col v-for="item in flowerStands" :key="item.id" cols="12" sm="12" md="6" lg="3">
        <FlowerStandListItem v-bind:flowerStand="item"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';
import { FlowerStand } from '../models/FlowerStand';
import FlowerStandListItem from './FlowerStandListItem.vue';
import FlowerStandFilterForm, { FilterCondition } from './FlowerStandFilterForm.vue';

@Component({
  components: {
    FlowerStandListItem,
    FlowerStandFilterForm
  }
})
export default class FlowerStandList extends Vue {
  flowerStands: FlowerStand[] = [];
  errorText = '';

  private allFlowerStands: FlowerStand[] = [];

  async mounted() {
    const flowerStands: AxiosResponse<FlowerStand[]> = await axios.get<FlowerStand[]>(`${process.env.VUE_APP_API_URL}/flowerstands`);
    if (flowerStands.status !== 200) {
      throw new Error(`データ取得に失敗しました code:${flowerStands.status}`);
    }

    this.flowerStands = flowerStands.data;
    this.allFlowerStands = flowerStands.data;
  }

  changeFilter(condition: FilterCondition) {
    if (!condition.event && !condition.group && !condition.baseDesign) {
      this.flowerStands = this.allFlowerStands;
      return;
    }

    this.flowerStands = this.allFlowerStands.filter((flowerStand: FlowerStand): flowerStand is FlowerStand => {
      return (flowerStand.event.id === condition.event
        && flowerStand.baseDesign.group.id === condition.group
        && flowerStand.baseDesign.id === condition.baseDesign);
    });
  }
}
</script>
