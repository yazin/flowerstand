<template>
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
        <v-col cols="12">
          <ValidationProvider name="宛名名義" rules="required|max:100" v-slot="{ errors, valid }">
            <v-text-field
              v-model="presentTo"
              :counter="100"
              label="宛名名義"
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
          <v-text-field
            v-model="projectUrl"
            label="URL（任意）"/>
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
          <v-img v-bind:src="imageUrl" max-width="50%"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn
            color="success"
            class="ma-4"
            @click="onPreview">
            プレビュー
          </v-btn>
          <v-btn
            color="primary"
            class="ma-4"
            @click="onSubmit">
            作成
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-overlay :value="progress">
            <v-progress-circular
              :size="70"
              :width="7"
              color="#e4007f"
              indeterminate/>
          </v-overlay>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';
import { ValidationProvider, extend } from 'vee-validate';
import { required, max, mimes, size } from 'vee-validate/dist/rules';
import { FlowerStandPreviewRequest, FlowerStandPreviewResponse, FlowerStandCreateRequest, FlowerStandCreateResponse } from '../models/FlowerStand';
import { Event } from '../models/Event';
import { Group } from '../models/Group';
import { BaseDesign } from '../models/BaseDesign';

extend('required', required);
extend('max', max);
extend('mimes', mimes);
extend('size', size);

@Component({
  components: {
    ValidationProvider
  }
})
export default class FlowerStandCreateForm extends Vue {
  event: Event | null = null;
  baseDesign: BaseDesign | null = null;
  name = '';
  presentTo = '';
  presentFrom = '';
  description = '';
  projectUrl = '';
  organizerName = '';
  imageUrl = '';
  panel: Blob | null = null;

  preview = false;
  progress = false;

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
    this.progress = true;
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
    this.progress = false;
  }

  private async postPreview(panel: string | ArrayBuffer | null = null) {
    if (!this.baseDesign) {
      return;
    }
    const request: FlowerStandPreviewRequest = {
      presentTo: this.presentTo,
      presentFrom: this.presentFrom,
      baseDesignId: this.baseDesign.id,
      panel: panel
    };

    const res: AxiosResponse<FlowerStandPreviewResponse> = await axios.post<FlowerStandPreviewResponse>(`${process.env.VUE_APP_API_URL}/flowerstands/preview`, request);
    console.log(res);

    if (res.status !== 200) {
      this.progress = false;
      throw new Error(`プレビュー生成に失敗しました code:${res.status}`);
    }

    this.imageUrl = res.data.imageUrl;
    this.preview = true;
  }

  onSubmit() {
    this.progress = true;
    if (this.panel) {
      let imageData: string | ArrayBuffer | null = null;
      const reader: FileReader = new FileReader();
      reader.onload = (): void => {
        imageData = reader.result;
        this.postSubmit(imageData);
      }
      reader.readAsDataURL(this.panel);
    } else {
      this.postSubmit();
    }
    this.progress = false;
  }

  private async postSubmit(panel: string | ArrayBuffer | null = null) {
    if (!this.event || !this.baseDesign) {
      return;
    }
    const request: FlowerStandCreateRequest = {
      name: this.name,
      presentTo: this.presentTo,
      presentFrom: this.presentFrom,
      description: this.description,
      projectUrl: this.projectUrl,
      organizerName: this.organizerName,
      eventId: this.event.id,
      baseDesignId: this.baseDesign.id,
      panel: panel
    }

    const res: AxiosResponse<FlowerStandCreateResponse> = await axios.post<FlowerStandCreateResponse>(`${process.env.VUE_APP_API_URL}/flowerstands`, request);
    console.log(res);
  }
}
</script>
