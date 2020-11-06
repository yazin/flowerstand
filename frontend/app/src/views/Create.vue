<template>
  <div class="create">
    <v-alert color="error" icon="mdi-alert-circle" dark transition="fade-transition" v-model="isError">{{errorText}}</v-alert>
    <v-overlay :value="progress">
      <v-progress-circular
        :size="70"
        :width="7"
        color="#e4007f"
        indeterminate/>
    </v-overlay>
    <FlowerStandCreateForm @create="onCreate"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { FlowerStandCreateRequest, FlowerStandCreateResponse } from '../models/FlowerStand';
import FlowerStandCreateForm, { FlowerStandCreateData } from '../components/FlowerStandCreateForm.vue';

@Component({
  components: {
    FlowerStandCreateForm
  }
})
export default class Create extends Vue {
  progress = false;
  isError = false;
  errorText = '';
  errorCaptured(err: Error): boolean {
    console.error(err);
    this.errorText = err.message;
    this.isError = true;
    return false;
  }

  private onCreate(data: FlowerStandCreateData) {
    this.progress = true;
    if (data.panel) {
      const reader: FileReader = new FileReader();
      reader.onload = (): void => {
        this.post(data, reader.result);
      };
      reader.readAsDataURL(data.panel);
    } else {
      this.post(data);
    }
  }

  private async post(data: FlowerStandCreateData, imageData: string | ArrayBuffer | null = null) {
    const request: FlowerStandCreateRequest = {
      name: data.name,
      presentTo: data.presentTo,
      presentFrom: data.presentFrom,
      description: data.description,
      projectUrl: data.projectUrl,
      organizerName: data.organizerName,
      eventId: data.eventId,
      baseDesignId: data.baseDesignId,
      panel: imageData
    }
    try {
      const res: AxiosResponse<FlowerStandCreateResponse> = await axios.post<FlowerStandCreateResponse>(`${process.env.VUE_APP_API_URL}/flowerstands`, request);
      if (res.status !== 200) {
        this.errorText = `フラワースタンド作成に失敗しました code:${res.status}`;
        this.progress = false;
        this.isError = true;
      }
      this.$router.push(`/detail/${res.data.id}`);
    } catch (err) {
      const e: AxiosError<FlowerStandCreateResponse> = err;
      this.errorText = `フラワースタンド作成に失敗しました code:${e.response ? e.response.status : 'unknown'}`;
      this.progress = false;
      this.isError = true;
    }
  }
}
</script>
