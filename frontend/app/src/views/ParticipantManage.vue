<template>
  <div class="participant-manage">
    <v-alert color="error" icon="mdi-alert-circle" dark transition="fade-transition" v-model="isError">{{errorText}}</v-alert>
    <v-overlay :value="progress">
      <v-progress-circular
        :size="70"
        :width="7"
        color="#e4007f"
        indeterminate/>
    </v-overlay>
    <ParticipantManageForm :flowerStand="flowerStand" @delete="deleteParticipants"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { FlowerStand } from '../models/FlowerStand';
import { Participant } from '../models/Participant';
import ParticipantManageForm from '../components/ParticipantManageForm.vue';

@Component({
  components: {
    ParticipantManageForm
  }
})
export default class ParticipantManage extends Vue {
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
  progress = true;
  adminKey = '';

  errorCaptured(err: Error): boolean {
    console.error(err);
    this.errorText = err.message;
    this.isError = true;
    return false;
  }

  created(): void {
    if (!this.$route.query.adminKey || typeof this.$route.query.adminKey !== 'string' || this.$route.query.adminKey.length === 0) {
      this.$router.push('/error');
    }else {
      this.adminKey = this.$route.query.adminKey;
    }
  }

  async mounted(): Promise<void> {
    try {
      const res: AxiosResponse<FlowerStand> = await axios.get<FlowerStand>(`${process.env.VUE_APP_API_URL}/flowerstands/${this.$route.params.id}`);
      if (res.status !== 200) {
        this.progress = false;
        throw new Error(`データ取得に失敗しました code:${res.status}`);
      }
      this.flowerStand = res.data;
      this.progress = false;
    } catch (err: any) {
      this.progress = false;
      const e: AxiosError<FlowerStand> = err;
      this.errorText = `データ取得に失敗しました code:${e.response ? e.response.status : 'unknown'}`;
      this.isError = true;
    }
  }

  async deleteParticipants(participantIds: number[]): Promise<void> {
    this.progress = true;
    try {
      for (const id of participantIds) {
        const res: AxiosResponse<void> = await axios.delete<void>(`${process.env.VUE_APP_API_URL}/participants/${id}?adminKey=${this.adminKey}`);
        if (res.status !== 200) {
          this.progress = false;
          this.errorText = `参加者の削除に失敗しました code:${res.status}`;
          this.isError = true;
          return;
        }
      }
    } catch (err: any) {
      this.progress = false;
      const e: AxiosError<void> = err;
      this.errorText = `参加者の削除に失敗しました code:${e.response ? e.response.status : 'unknown'}`;
      this.isError = true;
      return;
    }

    try {
      const res: AxiosResponse<Participant[]> = await axios.get<Participant[]>(`${process.env.VUE_APP_API_URL}/participants/`);
      if (res.status !== 200) {
        this.progress = false;
        this.errorText = `参加者情報の取得に失敗しました code:${res.status}`;
        this.isError = true;
        return;
      }
      this.flowerStand.participants = res.data;
    } catch (err: any) {
      const e: AxiosError<Participant[]> = err;
      this.progress = false;
      this.errorText = `参加者情報の取得に失敗しました code:${e.response ? e.response.status : 'unknown'}`;
      this.isError = true;
    }
  }
}
</script>
