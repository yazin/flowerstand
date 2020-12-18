<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-h2 text-center my-4">404 NOT FOUND</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-img :src="require('@/assets/404neko.jpg')" class="mx-auto" max-width="600"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ErrorP404 extends Vue {
  
}
</script>
