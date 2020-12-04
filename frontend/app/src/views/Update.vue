<template>
  <div class="update">
    <v-alert color="error" icon="mdi-alert-circle" dark transition="fade-transition" v-model="isError">{{errorText}}</v-alert>
    <FlowerStandUpdateForm :flowerStand="flowerStand" @update="onUpdate" @delete="onDelete"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse, AxiosError } from 'axios';
import VueScrollTo from 'vue-scrollto';
import { FlowerStand, FlowerStandUpdateRequest } from '../models/FlowerStand';
import FlowerStandUpdateForm from '../components/FlowerStandUpdateForm.vue';

@Component({
  components: {
    FlowerStandUpdateForm
  }
})
export default class Update extends Vue {
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
  adminKey = '';
  isError = false;
  errorText = '';
  errorCaptured(err: Error): boolean {
    this.onError(err.message);
    return false;
  }

  private onError(message: string): void {
    this.errorText = message;
    this.isError = true;
    VueScrollTo.scrollTo('body');
  }

  created() {
    if (!this.$route.query.adminKey || typeof this.$route.query.adminKey !== 'string' || this.$route.query.adminKey.length === 0) {
      this.$router.push('/error');
    }else {
      this.adminKey = this.$route.query.adminKey;
    }
  }

  async mounted() {
    try {
      const res: AxiosResponse<FlowerStand> = await axios.get<FlowerStand>(`${process.env.VUE_APP_API_URL}/flowerstands/${this.$route.params.id}`);
      if (res.status !== 200) {
        this.onError(`データ取得に失敗しました code:${res.status}`);
        return;
      }
      this.flowerStand = res.data;
    } catch (err) {
      const e: AxiosError<FlowerStand> = err;
      this.onError(`データ取得に失敗しました code:${e.response ? e.response.status : 'unknown'}`);
    }
  }

  private async onUpdate(flowerStand: FlowerStand) {
    try {
      const params: FlowerStandUpdateRequest = {
        adminKey: this.adminKey,
        name: flowerStand.name,
        organizerName: flowerStand.organizerName,
        description: flowerStand.description ? flowerStand.description : '',
        projectUrl: flowerStand.projectUrl ? flowerStand.projectUrl : ''
      }
      const res: AxiosResponse<void> = await axios.put<void>(`${process.env.VUE_APP_API_URL}/flowerstands/${this.flowerStand.id}`, params);
      if (res.status !== 200) {
        this.onError(`データ更新に失敗しました code:${res.status}`);
        return;
      }
      this.$router.push(`/detail/${this.flowerStand.id}`);
    } catch (err) {
      const e: AxiosError<void> = err;
      this.onError(`データ更新に失敗しました code:${e.response ? e.response.status : 'unknown'}`);
    }
  }

  private async onDelete(): Promise<void> {
    try {
      const res: AxiosResponse<void> = await axios.delete<void>(`${process.env.VUE_APP_API_URL}/flowerstands/${this.flowerStand.id}?adminKey=${this.adminKey}`);
      if (res.status !== 200) {
        this.onError(`データ更新に失敗しました code:${res.status}`);
        return;
      }
      this.$router.push(`/`);
    } catch (err: any) {
      const e: AxiosError<void> = err;
      this.onError(`データ削除に失敗しました code:${e.response ? e.response.status : 'unknown'}`);
    }
  }
}
</script>
