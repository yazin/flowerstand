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
import VueScrollTo from 'vue-scrollto';
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
    this.onError(err.message);
    return false;
  }

  private onError(message: string): void {
    this.errorText = message;
    this.progress = false;
    this.isError = true;
    VueScrollTo.scrollTo('body');
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
        this.onError(`データ取得に失敗しました code:${res.status}`);
        return;
      }
      this.flowerStand = res.data;
      this.progress = false;
    } catch (err: any) {
      const e: AxiosError<FlowerStand> = err;
      if (e.response) {
        this.onError(`データ取得に失敗しました code:${e.response.status}`);
      } else {
        this.$router.push('/error');
      }
    }
  }

  async deleteParticipants(participantIds: number[]): Promise<void> {
    this.progress = true;
    try {
      for (const id of participantIds) {
        const res: AxiosResponse<void> = await axios.delete<void>(`${process.env.VUE_APP_API_URL}/participants/${id}?adminKey=${this.adminKey}`);
        if (res.status !== 200) {
          this.onError(`参加者の削除に失敗しました code:${res.status}`);
          return;
        }
      }
    } catch (err: any) {
      const e: AxiosError<void> = err;
      if (e.response) {
        this.onError(`参加者の削除に失敗しました code:${e.response.status}`);
      } else {
        this.$router.push('/error');
      }
      return;
    }

    try {
      const res: AxiosResponse<Participant[]> = await axios.get<Participant[]>(`${process.env.VUE_APP_API_URL}/participants/`);
      if (res.status !== 200) {
        this.onError(`参加者情報の取得に失敗しました code:${res.status}`);
        return;
      }
      this.flowerStand.participants = res.data;
    } catch (err: any) {
      const e: AxiosError<Participant[]> = err;
      if (e.response) {
        this.onError(`参加者情報の取得に失敗しました code:${e.response.status}`);
      } else {
        this.$router.push('/error');
      }
    }
  }
}
</script>
