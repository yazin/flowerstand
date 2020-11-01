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
    <v-card-subtitle>{{flowerStand.organizerName}}</v-card-subtitle>
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
}
</script>
