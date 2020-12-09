<template>
  <div class="view">
    <v-alert color="error" icon="mdi-alert-circle" dark transition="fade-transition" v-model="isError">{{errorText}}</v-alert>
    <FlowerStandDetail :flowerStand="flowerStand"/>
    <v-snackbar v-model="isSuccess" :timeout="timeout"><div class="text-center">{{successText}}</div></v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse, AxiosError } from 'axios';
import VueScrollTo from 'vue-scrollto';
import { FlowerStand } from '../models/FlowerStand';
import FlowerStandDetail from '../components/FlowerStandDetail.vue';

@Component({
  components: {
    FlowerStandDetail
  }
})
export default class Detail extends Vue {
  flowerStand: FlowerStand = {
    id: 0,
    name: '',
    presentTo: '',
    presentFrom: '',
    organizerName: '',
    participants: [],
    event: {
      id: 0,
      name: '',
      startDate: '',
      endDate: '',
      groups: []
    },
    baseDesign: {
      id: 0,
      name: '',
      imageUrl: '',
      sortOrder: 0,
      group: {
        id: 0,
        name: ''
      }
    }
  };
  isError = false;
  errorText = '';
  isSuccess = false;
  timeout=2000;
  successText = '';

  errorCaptured(err: Error): boolean {
    this.onError(err.message);
    return false;
  }

  private onError(message: string): void {
    this.errorText = message;
    this.isError = true;
    VueScrollTo.scrollTo('body');
  }

  async mounted(): Promise<void> {
    switch (this.$route.query.from) {
      case 'update':
        this.successText = '更新に成功しました';
        this.isSuccess = true;
        break;
      case 'participate':
        this.successText = 'フラワースタンドに参加しました';
        this.isSuccess = true;
        break;
      default:
        break;
    }
    try {
      const res: AxiosResponse<FlowerStand> = await axios.get<FlowerStand>(`${process.env.VUE_APP_API_URL}/flowerstands/${this.$route.params.id}`);
      if (res.status !== 200) {
        this.onError(`データ取得に失敗しました code:${res.status}`);
        return;
      }
      this.flowerStand = res.data;
    } catch (err: any) {
      const e: AxiosError<FlowerStand> = err;
      this.onError(`データ取得に失敗しました code:${e.response ? e.response.status : 'unknown'}`);
    }
  }
}
</script>
