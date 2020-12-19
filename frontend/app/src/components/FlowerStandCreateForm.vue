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
            <ValidationProvider name="宛名名義" rules="required|max:20" v-slot="{ errors, valid }">
              <v-text-field
                v-model="presentTo"
                :counter="20"
                label="宛名名義"
                suffix="様"
                :success="valid"
                :error-messages="errors"
                @change="onChangeTo"
                required/>
            </ValidationProvider>
            <v-alert dense text color="grey" v-model="isYoshiko">ヨハネよ</v-alert>
            <v-alert dense text color="rgb(225, 208, 11)" v-model="isKasuKasu">かすみんです！</v-alert>
          </v-col>
          <v-col cols="12">
            <ValidationProvider name="贈り主名義" rules="required|max:20" v-slot="{ errors, valid }">
              <v-text-field
                v-model="presentFrom"
                :counter="20"
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
            <ValidationProvider name="description" rules="max:1000" v-slot="{ errors, valid }">
              <v-textarea
                v-model="description"
                :counter="1000"
                label="詳細説明・メッセージなど（任意）"
                :success="valid"
                :error-messages="errors"
                hint="改行は反映されません"
                persistent-hint/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12">
            <ValidationProvider name="URL" rules="regex:^http[s]?://.+$|max:2048" v-slot="{ errors, valid }">
              <v-text-field
                v-model="projectUrl"
                :counter="2048"
                :success="valid"
                :error-messages="errors"
                label="URL（任意）"/>
            </ValidationProvider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <ValidationProvider name="パネルイラスト" rules="mimes:image/jpeg,image/png|size:4096" v-slot="{ errors, valid }">
              <v-file-input
                v-model="panel"
                accept=".jpg,.jpeg,.png"
                label="パネルイラスト（任意）"
                :success="valid"
                :error-messages="errors"
                hint="JPEGもしくはPNG形式・4MB以内・アスペクト比4:3推奨"
                persistent-hint
                prepend-icon="mdi-image"/>
            </ValidationProvider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-checkbox
              v-model="participateAfterCreate"
              label="作成後にこのフラワースタンドに参加する"/>
          </v-col>
        </v-row>
        <v-row v-if="participateAfterCreate">
          <v-col cols="12" sm="12" md="6">
            <ValidationProvider name="Twitter ID" rules="alpha_dash|max:15|regex:^(?!@).*$" v-slot="{ errors, valid }">
              <v-text-field
                prefix="@"
                v-model="participant.twitterId"
                :counter="15"
                label="Twitter ID（任意）"
                :success="valid"
                :error-messages="errors"/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <ValidationProvider name="Instagram ID" rules="alpha_dash|max:30|regex:^(?!@).*$" v-slot="{ errors, valid }">
              <v-text-field
                prefix="@"
                v-model="participant.instagramId"
                :counter="30"
                label="Instagram ID（任意）"
                :success="valid"
                :error-messages="errors"/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <ValidationProvider name="Facebook ID" rules="alpha_dash|max:50|regex:^(?!@).*$" v-slot="{ errors, valid }">
              <v-text-field
                prefix="@"
                v-model="participant.facebookId"
                :counter="50"
                label="Facebook ID（任意）"
                :success="valid"
                :error-messages="errors"/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <ValidationProvider name="Mastodon ID" rules="max:255|regex:^(?!@).+@.+$" v-slot="{ errors, valid }">
              <v-text-field
                prefix="@"
                v-model="participant.mastodonId"
                :counter="255"
                label="Mastodon ID（任意）"
                hint="@foo@example.com"
                persistent-hint
                :success="valid"
                :error-messages="errors"/>
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
              @click="onClickPreview">
              プレビュー
            </v-btn>
            <v-btn
              color="primary"
              class="ma-4"
              :disabled="invalid"
              @click="onClickSubmit">
              作成
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </ValidationObserver>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse, AxiosError } from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, max, mimes, size, regex, alpha_dash as alphaDash } from 'vee-validate/dist/rules';
import { FlowerStandPreviewRequest, FlowerStandPreviewResponse } from '../models/FlowerStand';
import { Event } from '../models/Event';
import { Group } from '../models/Group';
import { BaseDesign } from '../models/BaseDesign';
import { ParticipantCreateData } from '../models/Participant';
import { LoadMasterDataResult } from '../plugins/store';

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
  participateAfterCreate: boolean;
  participant: ParticipantCreateData;
}

extend('required', required);
extend('max', max);
extend('mimes', mimes);
extend('size', size);
extend('regex', regex);
extend('alpha_dash', alphaDash);

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
  isYoshiko = false;
  isKasuKasu = false;

  preview = false;

  participateAfterCreate = false;
  participant: ParticipantCreateData = {
    flowerStandId: NaN,
    name: '',
    twitterId: '',
    instagramId: '',
    facebookId: '',
    mastodonId: '',
    participationCode: ''
  }

  events: Event[] = [];
  baseDesigns: BaseDesign[] = [];

  private allEvents: Event[] = [];
  private allBaseDesigns: BaseDesign[] = [];

  get prefixes(): Array<string> {
    return ['祝公演', '祝', '祝ご出演'];
  }

  async created(): Promise<void> {
    if (!this.$store.isLoaded) {
      const res: LoadMasterDataResult = await this.$store.loadMasterData();
      if (res.isError) {
        throw new Error(res.errorText);
      }
    }
    this.allEvents = this.$store.allEvents;
    dayjs.extend(customParseFormat);
    this.events = this.$store.allEvents.filter((event: Event): event is Event => {return dayjs(event.endDate, 'YYYY-MM-DD') >= dayjs().startOf('day')});
    this.allBaseDesigns = this.$store.allBaseDesigns;
    this.baseDesigns = this.$store.allBaseDesigns;
  }

  private onChangeEvent(): void {
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

  private onChangeBaseDesign(): void {
    if (!this.baseDesign) {
      this.events = this.allEvents.filter((event: Event): event is Event => {return dayjs(event.endDate, 'YYYY-MM-DD') >= dayjs().startOf('day')});
      return;
    }

    const groupId = this.baseDesign.group.id;
    this.events = this.allEvents.filter((event: Event): event is Event => {
      return event.groups.map((group: Group): number => group.id).indexOf(groupId) >= 0 && dayjs(event.endDate, 'YYYY-MM-DD') >= dayjs().startOf('day');
    });

    if (this.event && this.event.groups.map((group: Group): number => group.id).indexOf(groupId) < 0) {
      this.event = null;
    }
  }

  private onChangeTo(to: string): void {
    if (to.indexOf('善子') >= 0) {
      this.isYoshiko = true;
    } else {
      this.isYoshiko = false;
    }

    if (to.indexOf('かすかす') >= 0) {
      this.isKasuKasu = true;
    } else {
      this.isKasuKasu = false;
    }
  }

  private onClickPreview(): void {
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
      if (res.status !== 200 ) {
        if (res.status === 400 && res.data.isError === 1 && res.data.errorType === 'SENSITIVE_IMAGE') {
          this.$emit('error', `画像に不適切な要素が含まれています code:${res.status}`);
          return;
        }else {
          this.$emit('error', `プレビュー生成に失敗しました code:${res.status}`);
          return;
        }
      }

      if (res.data.isError === 0) {
        this.imageUrl = res.data.imageUrl;
        this.$emit('progress-change', false);
        this.preview = true;
      }
    } catch (err: any) {
      const e: AxiosError = err;
      if (e.response && e.response.data.isError === 1 && e.response.data.errorType === 'SENSITIVE_IMAGE') {
        this.$emit('error', `画像に不適切な要素が含まれています code:${e.response.status}`);
      } else if (e.response) {
        this.$emit('error', `プレビュー生成に失敗しました code:${e.response.status}`);
      } else {
        this.$router.push('/error');
      }
    }
  }

  private onClickSubmit(): void {
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
      panel: this.panel,
      participateAfterCreate: this.participateAfterCreate,
      participant: this.participant
    }
    this.$emit('create', data);
  }
}
</script>
