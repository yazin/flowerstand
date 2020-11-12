<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-h4 my-4">フラワースタンドに参加</div>
        </v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col cols="12" sm="12" md="12">
          <ValidationProvider name="名前" rules="required|max:100" v-slot="{ errors, valid }">
            <v-text-field
              clearable
              v-model="participant.name"
              :counter="100"
              label="名前"
              :scuuess="valid"
              :error-message="errors"
              required/>
          </ValidationProvider>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <ValidationProvider name="参加コード" rules="required|length:19" v-slot="{ errors, valid }">
            <v-text-field
              clearable
              v-model="participant.participationCode"
              label="参加コード"
              hint="XXXX-XXXX-XXXX-XXXX"
              persistent-hint
              :scuuess="valid"
              :error-message="errors"
              required/>
          </ValidationProvider>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <ValidationProvider name="Twitter ID" rules="required|max:15|regex:^(?!@).*$" v-slot="{ errors, valid }">
            <v-text-field
              clearable
              prefix="@"
              v-model="participant.twitterId"
              :counter="15"
              label="Twitter ID（任意）"
              :scuuess="valid"
              :error-message="errors"/>
          </ValidationProvider>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <ValidationProvider name="Instagram ID" rules="required|max:30|regex:^(?!@).*$" v-slot="{ errors, valid }">
            <v-text-field
              clearable
              prefix="@"
              v-model="participant.instagramId"
              :counter="30"
              label="Instagram ID（任意）"
              :scuuess="valid"
              :error-message="errors"/>
          </ValidationProvider>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <ValidationProvider name="Facebook ID" rules="required|max:50|regex:^(?!@).*$" v-slot="{ errors, valid }">
            <v-text-field
              clearable
              prefix="@"
              v-model="participant.facebookId"
              :counter="50"
              label="Facebook ID（任意）"
              :scuuess="valid"
              :error-message="errors"/>
          </ValidationProvider>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <ValidationProvider name="Mastodon ID" rules="required|max:255|regex:^(?!@).+@.+$" v-slot="{ errors, valid }">
            <v-text-field
              clearable
              prefix="@"
              v-model="participant.mastodonId"
              :counter="255"
              label="Mastodon ID（任意）"
              hint="@foo@example.com"
              persistent-hint
              :scuuess="valid"
              :error-message="errors"/>
          </ValidationProvider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn
            color="primary"
            class="ma-4"
            @click="onClickParticipate">
            参加
          </v-btn>
          <v-btn
            class="ma^4"
            @click="onCancel">
            キャンセル
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import { ValidationProvider, extend } from 'vee-validate';
import { required, length, max, regex } from 'vee-validate/dist/rules';

export interface ParticipantData {
  name: string;
  twitterId: string;
  instagramId: string;
  facebookId: string;
  mastodonId: string;
  participationCode: string;
}

extend('required', required);
extend('length', length);
extend('max', max);
extend('regex', regex);

@Component({
  components: {
    ValidationProvider
  }
})
export default class ParticipateForm extends Vue {
  participant: ParticipantData = {
    name: '',
    twitterId: '',
    instagramId: '',
    facebookId: '',
    mastodonId: '',
    participationCode: ''
  }

  @Emit('participate')
  onClickParticipate(): ParticipantData {
    return this.participant;
  }

  @Emit('cancel')
  onCancel(): void {
    return;
  }
}
</script>
