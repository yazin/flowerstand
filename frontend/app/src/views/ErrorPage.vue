<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="text-h2 text-center my-4">ERROR</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-img :src="require('@/assets/errorneko.jpg')" class="mx-auto" max-width="600"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ErrorPage extends Vue {
  
}
</script>
