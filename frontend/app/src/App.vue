<template>
  <v-app>

    <v-navigation-drawer app fixed clipped temporary :value="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Virtual Flower Stand
          </v-list-item-title>
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
        <v-list-item to="/about">
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
      color="#e4007f"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>

      <v-toolbar-title>Virtual Flower Stand</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn text to="/" class="hidden-sm-and-down"><v-icon>mdi-flower-tulip</v-icon>フラワースタンド一覧</v-btn>
      <v-btn text to="/create" class="hidden-sm-and-down"><v-icon>mdi-plus-circle</v-icon>フラワースタンド作成</v-btn>
      <v-btn text to="/about" class="hidden-sm-and-down"><v-icon>mdi-information</v-icon>このサイトについて</v-btn>
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
}
</script>
