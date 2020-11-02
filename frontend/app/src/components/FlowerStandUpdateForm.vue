<template>
  <v-form ref="form">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-h4 my-4">フラワースタンド情報変更</div>
        </v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col cols="12">
          <ValidationProvider name="タイトル" rules="required|max:100" v-slot="{ errors, valid }">
            <v-text-field
              v-model="flowerStand.name"
              :counter="100"
              label="タイトル"
              :success="valid"
              :error-message="errors"
              required/>
          </ValidationProvider>
        </v-col>
        <v-col cols="12">
          <ValidationProvider name="企画者名" rules="required|max:100" v-slot="{ errors, valid }">
            <v-text-field
              v-model="flowerStand.organizerName"
              :counter="100"
              label="企画者名"
              :success="valid"
              :error-messages="errors"
              required/>
          </ValidationProvider>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="flowerStand.description"
            label="フラワースタンドの詳細説明・メッセージなど（任意）"/>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="flowerStand.projectUrl"
            label="URL（任意）"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn
            color="success"
            class="ma-4"
            @click="onUpdate">
            変更
          </v-btn>
          <v-btn
            class="ma-4"
            @click="onCancel">
            キャンセル
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import { ValidationProvider, extend } from 'vee-validate';
import { required, max } from 'vee-validate/dist/rules';
import { FlowerStand } from '../models/FlowerStand'

extend('required', required);
extend('max', max);

@Component({
  components: {
    ValidationProvider
  }
})
export default class FlowerStandUpdatePage extends Vue {
  @Prop() private flowerStand!: FlowerStand

  @Emit('update')
  private onUpdate() {
    return this.flowerStand;
  }

  private onCancel() {
    this.$router.push(`/detail/${this.flowerStand.id}`);
  }
}
</script>
