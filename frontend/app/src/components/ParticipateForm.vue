<template>
  <ValidationObserver v-slot="{ invalid }">
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
                v-model="participant.name"
                :counter="100"
                label="名前"
                :success="valid"
                :error-messages="errors"
                required/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <ValidationProvider name="参加コード" rules="required|length:19" v-slot="{ errors, valid }">
              <v-text-field
                v-model="participant.participationCode"
                label="参加コード"
                hint="XXXX-XXXX-XXXX-XXXX"
                persistent-hint
                :success="valid"
                :error-messages="errors"
                required/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <ValidationProvider name="Twitter ID" rules="alpha_dash|max:15|regex:^(?!@).*$" v-slot="{ errors, valid }">
              <v-text-field
                prefix="@"
                v-model="participant.twitterId"
                :counter="15"
                label="Twitter ID（任意）"
                :success="valid"
                :error-messages="errors"/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <ValidationProvider name="Instagram ID" rules="alpha_dash|max:30|regex:^(?!@).*$" v-slot="{ errors, valid }">
              <v-text-field
                prefix="@"
                v-model="participant.instagramId"
                :counter="30"
                label="Instagram ID（任意）"
                :success="valid"
                :error-messages="errors"/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <ValidationProvider name="Facebook ID" rules="alpha_dash|max:50|regex:^(?!@).*$" v-slot="{ errors, valid }">
              <v-text-field
                prefix="@"
                v-model="participant.facebookId"
                :counter="50"
                label="Facebook ID（任意）"
                :success="valid"
                :error-messages="errors"/>
            </ValidationProvider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <ValidationProvider name="Mastodon ID" rules="max:255|regex:^(?!@).+@.+$" v-slot="{ errors, valid }">
              <v-text-field
                prefix="@"
                v-model="participant.mastodonId"
                :counter="255"
                label="Mastodon ID（任意）"
                hint="@foo@example.com"
                persistent-hint
                :success="valid"
                :error-messages="errors"/>
            </ValidationProvider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              color="primary"
              class="ma-4"
              :disabled="invalid"
              @click="onClickParticipate">
              参加
            </v-btn>
            <v-btn
              class="ma^4"
              @click="onClickCancel">
              キャンセル
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </ValidationObserver>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, length, max, regex, alpha_dash as alphaDash } from 'vee-validate/dist/rules';

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
extend('alpha_dash', alphaDash);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver
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
  private onClickParticipate(): ParticipantData {
    return this.participant;
  }

  @Emit('cancel')
  private onClickCancel(): void {
    return;
  }
}
</script>
