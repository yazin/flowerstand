<template>
  <v-form>
    <v-card class="mx-auto my-12" max-width="80%" :loading="loading">
      <template slot="progress">
        <v-progress-circular
          :size="70"
          :width="7"
          color="#e4007f"
          indeterminate/>
      </template>
      <v-card-title>{{flowerStand.name}}</v-card-title>
      <v-card-subtitle>削除する参加者を選択してください</v-card-subtitle>
      <v-list>
        <v-list-item v-for="participant in flowerStand.participants" :key="participant.id">
          <v-list-item-action>
            <v-checkbox v-model="selected" :value="participant.id"/>
          </v-list-item-action>
          <v-list-item-content>
          <v-list-item-title>{{participant.name}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-btn dark color="red" @click="confirm = true"><v-icon>mdi-account-multiple-remove</v-icon>削除</v-btn>
        <v-btn :to="`/detail/${flowerStand.id}`" exact><v-icon>mdi-backup-restore</v-icon>キャンセル</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="confirm" persistent>
      <v-card>
        <v-card-title class="headline">参加者削除</v-card-title>
        <v-card-text>選択した参加者を削除します。この操作は取り消せません。削除しますか？</v-card-text>
        <v-card-actions>
          <v-btn dark color="red" @click="onClickDelete">削除</v-btn>
          <v-btn @click="dialog = false">キャンセル</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator';
import { FlowerStand } from '../models/FlowerStand';

@Component
export default class ParticipantManageForm extends Vue {
  @Prop() private readonly flowerStand!: FlowerStand;
  loading = true;
  confirm = false;
  selected: number[] = [];

  mounted() {
    this.loading = false;
  }

  @Emit('delete')
  onClickDelete(): number[] {
    this.confirm = false;
    return this.selected;
  }
}
</script>
