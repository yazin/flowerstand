<template>
  <div class="home">
    <v-alert color="error" icon="mdi-alert-circle" dark transition="fade-transition" v-model="isError">{{errorText}}</v-alert>
    <FlowerStandList />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
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
    this.errorText = err.message;
    this.isError = true;
    return false;
  }
}
</script>
