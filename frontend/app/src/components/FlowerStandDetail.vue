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
      <v-btn color="primary" class="mr-2"><v-icon>mdi-account-plus</v-icon>参加</v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="success" class="ml-2" v-bind="attrs" v-on="on"><v-icon>mdi-cog</v-icon>管理</v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>情報変更</v-list-item-title>
          </v-list-item>
          <v-list-item>
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
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FlowerStand } from '../models/FlowerStand';

@Component
export default class FlowerStandDetail extends Vue {
  @Prop() private readonly flowerStand!: FlowerStand;
  loading = true;

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
}
</script>
