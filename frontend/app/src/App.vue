<template>
  <v-app>

    <v-navigation-drawer app fixed clipped temporary :value="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Virtual Flower Stand
          </v-list-item-title>
          <v-list-item-subtitle>
            for LoveLive!
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider/>
      <v-list dense nav>
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-flower-tulip</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>フラワースタンド一覧</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/create">
          <v-list-item-icon>
            <v-icon>mdi-plus-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>フラワースタンド作成</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item href="https://docs.schoolidol.club/flowerstand/" rel="noopener" target="_blank">
          <v-list-item-icon>
            <v-icon>mdi-information</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>このサイトについて</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      light
      extension-height="10"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up" style="padding-left:16px"></v-app-bar-nav-icon>

      <v-toolbar-title @click="onClickTitle"><span class="text-h5">Virtual Flower Stand</span> <span class="text-subtitle-1 hidden-sm-and-down">for LoveLive!</span></v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn text to="/" class="hidden-sm-and-down"><v-icon>mdi-flower-tulip</v-icon>フラワースタンド一覧</v-btn>
      <v-btn text to="/create" class="hidden-sm-and-down"><v-icon>mdi-plus-circle</v-icon>フラワースタンド作成</v-btn>
      <v-btn text href="https://docs.schoolidol.club/flowerstand/" rel="noopener" target="_blank" class="hidden-sm-and-down"><v-icon>mdi-information</v-icon>このサイトについて</v-btn>

      <template v-slot:extension>
        <v-container fluid class="ma-0 pa-0">
          <v-row no-gutters style="min-height:10px;">
            <v-col cols="3" style="background-color:rgb(224, 17, 134)">
            </v-col>
            <v-col cols="3" style="background-color:rgb(17, 139, 226)">
            </v-col>
            <v-col cols="3" style="background-color:rgb(254, 191, 59)">
            </v-col>
            <v-col cols="3" style="background-color:rgb(29, 206, 14)">
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
    <v-footer>
      <v-container fluid>
        <v-row>
          <v-col dense cols="12" class="text-center">
            &copy;2020 URANOHOSHI System Engineering, Ltd.
          </v-col>
        </v-row>
        <v-row>
          <v-col dense cols="12" class="text-center">
            This site is NOT officially sponsored or authorized by Project LoveLive! and it's related company, organization or person.
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  drawer = false;

  private onClickTitle(): void {
    this.$router.push('/');
  }
}
</script>
