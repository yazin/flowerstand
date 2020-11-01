<template>
  <div class="create">
    <v-alert color="error" icon="mdi-alert-circle" dark transition="fade-transition" v-model="isError">{{errorText}}</v-alert>
    <FlowerStandCreateForm />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FlowerStandCreateForm from '../components/FlowerStandCreateForm.vue';

@Component({
  components: {
    FlowerStandCreateForm
  }
})
export default class Create extends Vue {
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
