<template>
  <v-card max-width="300">
    <v-img v-bind:src="flowerStand.imageUrl"></v-img>
    <v-card-title>{{flowerStand.name}}</v-card-title>
    <v-card-subtitle>{{flowerStand.organizerName}}</v-card-subtitle>
    <v-divider class="mx-4"/>
    <v-card-text>
      {{flowerStand.description}}
    </v-card-text>
    <v-card-actions>
      <v-btn class="ma-2" color="primary" dark :to="`/detail/${flowerStand.id}`"><v-icon dark light>mdi-eye</v-icon>このフラスタを見る</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FlowerStand } from '../models/FlowerStand';

@Component
export default class FlowerStandItem extends Vue {
  @Prop() private readonly flowerStand!: FlowerStand;
}
</script>
