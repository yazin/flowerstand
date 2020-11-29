<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="text-h4 my-4">フラワースタンド作成</div>
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col cols="12" sm="12" md="6">
            <ValidationProvider name="イベント" rules="required" v-slot="{ errors, valid }">
              <v-select
                dense
                clearable
                v-model="event"
                :items="events"
                item-text="name"
                item-value="id"
                return-object
                @change="onChangeEvent"
                :success="valid"
                :error-messages="errors"
                label="イベント"/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <ValidationProvider name="デザイン" rules="required" v-slot="{ errors, valid }">
              <v-select
                dense
                clearable
                v-model="baseDesign"
                :items="baseDesigns"
                item-text="name"
                item-value="id"
                return-object
                @change="onChangeBaseDesign"
                :success="valid"
                :error-messages="errors"
                label="デザイン"/>
            </ValidationProvider>
          </v-col>
        </v-row>
        <v-row v-if="baseDesign">
          <v-col cols="12" xl="12">
            <v-img v-bind:src="baseDesign.imageUrl" max-width="25%"/>
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col cols="12">
            <ValidationProvider name="タイトル" rules="required|max:100" v-slot="{ errors, valid }">
              <v-text-field
                v-model="name"
                :counter="100"
                label="タイトル"
                :success="valid"
                :error-messages="errors"
                required/>
            </ValidationProvider>
          </v-col>
          <v-col cols="4">
            <ValidationProvider name="頭書" rules="required" v-slot="{ errors, valid }">
              <v-select
                v-model="prefix"
                :items="prefixes"
                :success="valid"
                :error-messages="errors"
                label="頭書"/>
            </ValidationProvider>
          </v-col>
          <v-col cols="8">
            <ValidationProvider name="宛名名義" rules="required|max:100" v-slot="{ errors, valid }">
              <v-text-field
                v-model="presentTo"
                :counter="100"
                label="宛名名義"
                suffix="様"
                :success="valid"
                :error-messages="errors"
                required/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12">
            <ValidationProvider name="贈り主名義" rules="required|max:100" v-slot="{ errors, valid }">
              <v-text-field
                v-model="presentFrom"
                :counter="100"
                label="贈り主名義"
                suffix="より"
                :success="valid"
                :error-messages="errors"
                required/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12">
            <ValidationProvider name="企画者名" rules="required|max:100" v-slot="{ errors, valid }">
              <v-text-field
                v-model="organizerName"
                :counter="100"
                label="企画者名"
                :success="valid"
                :error-messages="errors"
                required/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="description"
              label="フラワースタンドの詳細説明・メッセージなど（任意）"/>
          </v-col>
          <v-col cols="12">
            <ValidationProvider name="URL" rules="regex:^http[s]?://.+$" v-slot="{ errors, valid }">
              <v-text-field
                v-model="projectUrl"
                :success="valid"
                :error-messages="errors"
                label="URL（任意）"/>
            </ValidationProvider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <ValidationProvider name="パネルイラスト" rules="mimes:image/jpeg,image/png|size:1024" v-slot="{ errors, valid }">
              <v-file-input
                v-model="panel"
                accept=".jpg,.jpeg,.png"
                label="パネルイラスト（任意・JPEGもしくはPNG形式・1MB以内）"
                :success="valid"
                :error-messages="errors"
                prepend-icon="mdi-image"/>
            </ValidationProvider>
          </v-col>
        </v-row>
        <v-row v-if="preview">
          <v-col cols="12">
            <v-img v-bind:src="imageUrl" max-width="300" class="mx-auto"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              color="success"
              class="ma-4"
              :disabled="invalid"
              @click="onPreview">
              プレビュー
            </v-btn>
            <v-btn
              color="primary"
              class="ma-4"
              :disabled="invalid"
              @click="onSubmit">
              作成
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </ValidationObserver>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, max, mimes, size, regex } from 'vee-validate/dist/rules';
import { FlowerStandPreviewRequest, FlowerStandPreviewResponse } from '../models/FlowerStand';
import { Event } from '../models/Event';
import { Group } from '../models/Group';
import { BaseDesign } from '../models/BaseDesign';

export interface FlowerStandCreateData {
  name: string;
  presentTo: string;
  presentFrom: string;
  description: string;
  projectUrl: string;
  organizerName: string;
  eventId: number;
  baseDesignId: number;
  prefix: string;
  panel: Blob | null;
}

extend('required', required);
extend('max', max);
extend('mimes', mimes);
extend('size', size);
extend('regex', regex);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver
  }
})
export default class FlowerStandCreateForm extends Vue {
  event: Event | null = null;
  baseDesign: BaseDesign | null = null;
  name = '';
  prefix = '祝公演';
  presentTo = '';
  presentFrom = '';
  description = '';
  projectUrl = '';
  organizerName = '';
  imageUrl = '';
  panel: Blob | null = null;

  prefixes = ['祝公演', '祝', '祝ご出演'];

  preview = false;

  events: Event[] = [];
  baseDesigns: BaseDesign[] = [];

  private allEvents: Event[] = [];
  private allBaseDesigns: BaseDesign[] = [];

  async mounted() {
    const events: AxiosResponse<Event[]> = await axios.get<Event[]>(`${process.env.VUE_APP_API_URL}/events`);
    if (events.status === 200) {
      this.events = events.data;
      this.allEvents = events.data;
    } else {
      throw new Error(`データ取得に失敗しました code:${events.status}`);
    }

    const baseDesigns: AxiosResponse<BaseDesign[]> = await axios.get<BaseDesign[]>(`${process.env.VUE_APP_API_URL}/basedesigns`);
    if (baseDesigns.status === 200) {
      this.baseDesigns = baseDesigns.data;
      this.allBaseDesigns = baseDesigns.data;
    } else {
      throw new Error(`データ取得に失敗しました code:${events.status}`);
    }
  }

  onChangeEvent() {
    if (!this.event) {
      this.baseDesigns = this.allBaseDesigns;
      return;
    }

    const groupIds: number[] = this.event.groups.map((group: Group): number => group.id);
    this.baseDesigns = this.allBaseDesigns.filter((baseDesign: BaseDesign): baseDesign is BaseDesign => {
      return groupIds.indexOf(baseDesign.group.id) >= 0;
    });

    const availableGroups = this.event.groups.map((group: Group): number => group.id);
    if (this.baseDesign && availableGroups.indexOf(this.baseDesign.group.id) < 0) {
      this.baseDesign = null;
    }
  }

  onChangeBaseDesign() {
    if (!this.baseDesign) {
      this.events = this.allEvents;
      return;
    }

    const groupId = this.baseDesign.group.id;
    this.events = this.allEvents.filter((event: Event): event is Event => {
      return event.groups.map((group: Group): number => group.id).indexOf(groupId) >= 0;
    });

    if (this.event && this.event.groups.map((group: Group): number => group.id).indexOf(groupId) < 0) {
      this.event = null;
    }
  }

  onPreview() {
    this.$emit('progress-change', true);
    if (this.panel) {
      let imageData: string | ArrayBuffer | null = null;
      const reader: FileReader = new FileReader();
      reader.onload = (): void => {
        imageData = reader.result;
        this.postPreview(imageData);
      }
      reader.readAsDataURL(this.panel);
    } else {
      this.postPreview();
    }
  }

  private async postPreview(panel: string | ArrayBuffer | null = null): Promise<void> {
    if (!this.baseDesign || !this.event) {
      this.$emit('progress-change', false);
      return;
    }
    const request: FlowerStandPreviewRequest = {
      presentTo: this.presentTo,
      presentFrom: this.presentFrom,
      baseDesignId: this.baseDesign.id,
      eventId: this.event.id,
      prefix: this.prefix,
      panel: panel
    };

    try {
      const res: AxiosResponse<FlowerStandPreviewResponse> = await axios.post<FlowerStandPreviewResponse>(`${process.env.VUE_APP_API_URL}/flowerstands/preview`, request);
      if (res.status !== 200) {
        this.$emit('error', `プレビュー生成に失敗しました code:${res.status}`);
        return;
      }

      this.imageUrl = res.data.imageUrl;
      this.$emit('progress-change', false);
      this.preview = true;
    } catch (err: any) {
      const e: AxiosError = err;
      this.$emit('error', `プレビュー生成に失敗しました code:${e.response ? e.response.status : 'unknown'}`);
    }
  }

  @Emit('create')
  onSubmit() {
    if (!this.event || !this.baseDesign) {
      return;
    }
    const data: FlowerStandCreateData = {
      name: this.name,
      presentTo: this.presentTo,
      presentFrom: this.presentFrom,
      description: this.description,
      projectUrl: this.projectUrl,
      organizerName: this.organizerName,
      eventId: this.event.id,
      baseDesignId: this.baseDesign.id,
      prefix: this.prefix,
      panel: this.panel
    }
    return data;
  }
}
</script>
