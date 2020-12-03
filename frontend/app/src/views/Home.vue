<template>
  <div class="home">
    <v-alert color="error" icon="mdi-alert-circle" dark transition="fade-transition" v-model="isError">{{errorText}}</v-alert>
    <FlowerStandList />
    <v-btn fab fixed bottom right color="red" dark class="hidden-md-and-up" to="/create">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueScrollTo from 'vue-scrollto';
import FlowerStandList from '../components/FlowerStandList.vue';

@Component({
  components: {
    FlowerStandList
  }
})
export default class Home extends Vue {
  isError = false;
  errorText = '';
  errorCaptured(err: Error): boolean {
    console.error(err);
    this.onError(err.message);
    return false;
  }

  private onError(message: string): void {
    this.errorText = message;
    this.isError = true;
    VueScrollTo.scrollTo('body');
  }
}
</script>
