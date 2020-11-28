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
    <FlowerStandCreateForm @create="onCreate" @progress-change="onProgressChange"/>
    <v-dialog v-model="showResult" ref="successDialog" persistent>
      <v-card>
        <v-card-title class="headline">成功</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <div>フラワースタンドを作成しました。以下の「管理キー」と「参加コード」を必ず記録してください。このダイアログを閉じると以降確認できません。</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  label="管理キー"
                  ref="adminKeyField"
                  class="ma-2"
                  :value="newStand ? newStand.adminKey : ''"
                  readonly
                  append-outer-icon="mdi-content-copy"
                  @click:append-outer="onCopyAdminKey"/>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-text-field
                  label="参加コード"
                  ref="participationCodeField"
                  class="ma-2"
                  :value="newStand ? newStand.participationCode : ''"
                  readonly
                  append-outer-icon="mdi-content-copy"
                  @click:append-outer="onCopyParticipationCode"/>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" :to="`/detail/${newStand ? newStand.id : ''}`">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="copied" timeout="2000">Copied!</v-snackbar>
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

  showResult = false;
  newStand: FlowerStandCreateResponse | null = null;
  copied = false;

  private isVue = (x: unknown): x is Vue => x instanceof Vue;

  private onProgressChange(isProgress: boolean) {
    this.progress = isProgress;
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
      prefix: data.prefix,
      panel: imageData
    }
    try {
      const res: AxiosResponse<FlowerStandCreateResponse> = await axios.post<FlowerStandCreateResponse>(`${process.env.VUE_APP_API_URL}/flowerstands`, request);
      if (res.status !== 200) {
        this.errorText = `フラワースタンド作成に失敗しました code:${res.status}`;
        this.progress = false;
        this.isError = true;
      }
      this.newStand = res.data;
      this.showResult = true;
    } catch (err) {
      const e: AxiosError<FlowerStandCreateResponse> = err;
      this.errorText = `フラワースタンド作成に失敗しました code:${e.response ? e.response.status : 'unknown'}`;
      this.progress = false;
      this.isError = true;
    }
  }

  private async onCopyAdminKey(): Promise<void> {
    if (!this.newStand) {
      return;
    }

    const { adminKeyField } = this.$refs;
    if (!this.isVue(adminKeyField)) {
      return;
    }

    await this.$copyText(this.newStand.adminKey, adminKeyField.$el);
    this.copied = true;
  }

  private async onCopyParticipationCode(): Promise<void> {
    if (!this.newStand) {
      return;
    }

    const { participationCodeField } = this.$refs;
    if (!this.isVue(participationCodeField)) {
      return;
    }

    await this.$copyText(this.newStand.participationCode, participationCodeField.$el);
    this.copied = true;
  }
}
</script>
