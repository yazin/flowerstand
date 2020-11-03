<template>
  <div class="update">
    <v-alert color="error" icon="mdi-alert-circle" dark transition="fade-transition" v-model="isError">{{errorText}}</v-alert>
    <FlowerStandUpdateForm :flowerStand="flowerStand" @update="onUpdate"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse, AxiosError } from 'axios';
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
    console.error(err);
    this.errorText = err.message;
    this.isError = true;
    return false;
  }

  async mounted() {
    if (!this.$route.query.adminKey || typeof this.$route.query.adminKey !== 'string' || this.$route.query.adminKey.length === 0) {
      this.$router.push('/error');
      return;
    }else {
      this.adminKey = this.$route.query.adminKey;
    }
    try {
      const res: AxiosResponse<FlowerStand> = await axios.get<FlowerStand>(`${process.env.VUE_APP_API_URL}/flowerstands/${this.$route.params.id}`);
      if (res.status !== 200) {
        this.errorText = `データ取得に失敗しました code:${res.status}`;
        this.isError = true;
        return;
      }
      this.flowerStand = res.data;
    } catch (err) {
      const e: AxiosError<FlowerStand> = err;
      this.errorText = `データ取得に失敗しました code:${e.response ? e.response.status : 'unknown'}`;
      this.isError = true;
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
        this.errorText = `データ更新に失敗しました code:${res.status}`;
        this.isError = true;
        return;
      }
      this.$router.push(`/detail/${this.flowerStand.id}`);
    } catch (err) {
      const e: AxiosError<void> = err;
      this.errorText = `データ更新に失敗しました code:${e.response ? e.response.status : 'unknown'}`;
      this.isError = true;
    }
  }
}
</script>
