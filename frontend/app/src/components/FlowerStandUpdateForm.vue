<template>
  <ValidationObserver v-slot="{ invalid }">
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
            <ValidationProvider name="URL" rules="regex:^http[s]?://.+$" v-slot="{ errors, valid }">
              <v-text-field
                v-model="flowerStand.projectUrl"
                hint="https://example.com/"
                persistent-hint
                :success="valid"
                :error-messages="errors"
                label="URL（任意）"/>
            </ValidationProvider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              color="success"
              class="ma-4"
              :disabled="invalid"
              @click="onUpdate">
              変更
            </v-btn>
            <v-btn
              class="ma-4"
              color="red"
              dark
              @click="confirm = true">
              削除
            </v-btn>
            <v-btn
              class="ma-4"
              @click="onCancel">
              キャンセル
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-dialog v-model="confirm" persistent>
        <v-card>
          <v-card-title class="headline">フラワースタンド削除</v-card-title>
          <v-card-text>フラワースタンドを削除します。この操作は取り消せません。削除しますか？</v-card-text>
          <v-card-actions>
            <v-btn dark color="red" @click="onDelete">削除</v-btn>
            <v-btn @click="confirm = false">キャンセル</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-form>
  </ValidationObserver>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, max, regex } from 'vee-validate/dist/rules';
import { FlowerStand } from '../models/FlowerStand'

extend('required', required);
extend('max', max);
extend('regex', regex);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver
  }
})
export default class FlowerStandUpdatePage extends Vue {
  @Prop() private flowerStand!: FlowerStand
  confirm = false;

  @Emit('update')
  private onUpdate(): FlowerStand {
    return this.flowerStand;
  }

  @Emit('delete')
  private onDelete(): void {
    return;
  }

  private onCancel(): void {
    this.$router.push(`/detail/${this.flowerStand.id}`);
  }
}
</script>
