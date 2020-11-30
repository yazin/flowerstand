<template>
  <div class="view">
    <v-alert color="error" icon="mdi-alert-circle" dark transition="fade-transition" v-model="isError">{{errorText}}</v-alert>
    <FlowerStandDetail :flowerStand="flowerStand"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse, AxiosError } from 'axios';
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

  errorCaptured(err: Error): boolean {
    console.error(err.message);
    this.errorText = err.message;
    this.isError = true;
    return false;
  }

  async mounted(): Promise<void> {
    try {
      const res: AxiosResponse<FlowerStand> = await axios.get<FlowerStand>(`${process.env.VUE_APP_API_URL}/flowerstands/${this.$route.params.id}`);
      if (res.status !== 200) {
        this.errorText = `データ取得に失敗しました code:${res.status}`;
        this.isError = true;
        return;
      }
      this.flowerStand = res.data;
    } catch (err: any) {
      const e: AxiosError<FlowerStand> = err;
      this.errorText = `データ取得に失敗しました code:${e.response ? e.response.status : 'unknown'}`;
      this.isError = true;
    }
  }
}
</script>
