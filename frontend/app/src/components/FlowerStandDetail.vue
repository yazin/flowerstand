<template>
  <v-card class="mx-auto my-12" max-width="80%" :loading="loading">
    <template slot="progress">
      <v-progress-circular
        :size="70"
        :width="7"
        color="#e4007f"
        indeterminate/>
    </template>
    <v-img :src="flowerStand.imageUrl"/>
    <v-card-title>{{flowerStand.name}}</v-card-title>
    <v-card-subtitle>for {{flowerStand.event.name}}<br/>企画：{{flowerStand.organizerName}}</v-card-subtitle>
    <v-divider class="mx-4"></v-divider>
    <v-card-text v-if="flowerStand.description || flowerStand.projectUrl">
      {{flowerStand.description}}<br/>
      <a v-if="flowerStand.projectUrl" :href="flowerStand.projectUrl" target="_blank" rel="noopner">{{flowerStand.projectUrl}}</a>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" class="mr-2" @click="onClickParticipate"><v-icon>mdi-account-plus</v-icon>参加</v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="success" class="ml-2" v-bind="attrs" v-on="on"><v-icon>mdi-cog</v-icon>管理</v-btn>
        </template>
        <v-list>
          <v-list-item @click="onClickUpdate">
            <v-list-item-title>情報変更</v-list-item-title>
          </v-list-item>
          <v-list-item @click="onClickParticipantManage">
            <v-list-item-title>参加者管理</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>
    <v-divider class="mx-4"></v-divider>
    <v-subheader>参加者</v-subheader>
    <v-list dense flat>
      <v-list-item v-for="participant in flowerStand.participants" :key="participant.id">
        <v-list-item-content>
          <v-list-item-title class="text-subtitle-1">{{participant.name}}</v-list-item-title>
          <v-list-item-subtitle>
            <v-btn v-if="participant.twitterId" icon :href="`https://twitter.com/${participant.twitterId}`" target="_blank">
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
            <v-btn v-if="participant.instagramId" icon :href="`https://www.instagram.com/${participant.instagramId}/`" target="_blank">
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
            <v-btn v-if="participant.facebookId" icon :href="`https://www.facebook.com/${participant.facebookId}`" target="_blank">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn v-if="participant.mastodonId" icon :href="convertMastodonIdToUrl(participant.mastodonId)" target="_blank">
              <v-icon>mdi-mastodon</v-icon>
            </v-btn>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-dialog v-model="checkAdminKey" persistent>
      <v-card>
        <v-card-title class="headline">管理キー</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="adminKey"
            label="管理キー"/>
        </v-card-text>
        <v-card-text v-if="adminKeyError"><strong class="red--text text--lighten-1">管理キーが無効です</strong></v-card-text>
        <v-card-actions>
          <v-btn dark color="primary" @click="verifyAdminKey">確認</v-btn>
          <v-btn @click="cancelVerify">キャンセル</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';
import { FlowerStand, FlowerStandVerifyAdminKeyRequestBody } from '../models/FlowerStand';

@Component
export default class FlowerStandDetail extends Vue {
  @Prop() private readonly flowerStand!: FlowerStand;
  loading = true;
  adminKey = '';
  checkAdminKey = false;
  adminKeyError = false;
  nextPath = '';

  mounted() {
    this.loading = false;
  }

  private convertMastodonIdToUrl(mastodonId: string): string {
    if (!mastodonId) {
      return '';
    }

    const parts: string[] = mastodonId.split('@');
    if (parts.length < 3) {
      console.error(`invalid mastodonId ${mastodonId}`);
      return '';
    }

    return `https://${parts[2]}/@${parts[1]}`;
  }

  private onClickParticipate() {
    if (!this.flowerStand.id) {
      this.$router.push('/error');
      return;
    }
    this.$router.push(`/participate/${this.flowerStand.id}`);
  }

  private onClickUpdate() {
    this.nextPath = `/update/${this.flowerStand.id}`;
    this.adminKeyError = false;
    this.adminKey = '';
    this.checkAdminKey = true;
  }

  private onClickParticipantManage() {
    this.nextPath = `/participantmanage/${this.flowerStand.id}`;
    this.adminKeyError = false;
    this.adminKey = '';
    this.checkAdminKey = true;
  }

  private async verifyAdminKey(): Promise<void> {
    if (!this.flowerStand.id) {
      this.$router.push('/error');
      return;
    }
    this.loading = true;
    try {
      const params: FlowerStandVerifyAdminKeyRequestBody = {
        flowerStandId: this.flowerStand.id,
        adminKey: this.adminKey
      };
      const res: AxiosResponse<void> = await axios.post<void>(`${process.env.VUE_APP_API_URL}/flowerstands/verify`, params);

      if (res.status === 200) {
        this.adminKeyError = false;
        this.checkAdminKey = false;
        this.loading = false;
        this.$router.push(`${this.nextPath}?adminKey=${this.adminKey}`);
      }
    } catch (err) {
      this.adminKeyError = true;
      this.loading = false;
    }

    this.adminKeyError = true;
    this.loading = false;
  }

  private cancelVerify() {
    this.adminKey = '';
    this.adminKeyError = false;
    this.checkAdminKey = false;
  }
}
</script>
