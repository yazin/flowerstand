<template>
  <div class="participate">
    <v-alert color="error" icon="mdi-alert-circle" dark transition="fade-transition" v-model="isError">{{errorText}}</v-alert>
    <ParticipateForm @participate="onParticipate" @cancel="onCancel"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse, AxiosError } from 'axios';
import VueScrollTo from 'vue-scrollto';
import ParticipateForm, { ParticipantData } from '../components/ParticipateForm.vue';

@Component({
  components: {
    ParticipateForm
  }
})
export default class Participate extends Vue {
  isError = false;
  errorText = '';

  errorCaptured(err: Error): boolean {
    console.error(err);
    this.onError(err.message);
    return false;
  }

  private onError(message: string) {
    this.errorText = message;
    this.isError = true;
    VueScrollTo.scrollTo('body');
  }

  private async onParticipate(participant: ParticipantData): Promise<void> {
    try {
      const res: AxiosResponse<void> = await axios.post<void>(`${process.env.VUE_APP_API_URL}/participants`, participant);
      if (res.status === 401) {
        this.onError('参加コードが無効です');
        return;
      }
      if (res.status !== 200) {
        this.onError(`参加に失敗しました code:${res.status}`);
        return;
      }
      this.$router.push(`/detail/${this.$route.params.id}`);
    } catch (err: any) {
      const e: AxiosError<void> = err;
      this.onError(`参加に失敗しました code:${e.response ? e.response.status : 'unknown'}`);
    }
  }

  private onCancel(): void {
    this.$router.push(`/detail/${this.$route.params.id}`);
  }
}
</script>
