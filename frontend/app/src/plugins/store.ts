import _Vue from "vue";
import axios, { AxiosResponse } from 'axios';
import { Event } from '../models/Event';
import { Group } from '../models/Group';
import { BaseDesign } from '../models/BaseDesign';

export interface LoadMasterDataResult {
  errorText: string;
  isError: boolean;
}

export class MasterData {
  allEvents: Event[];
  allGroups: Group[];
  allBaseDesigns: BaseDesign[];
  isLoaded: boolean;

  constructor() {
    this.allEvents = [];
    this.allGroups = [];
    this.allBaseDesigns = [];
    this.isLoaded = false;
  }

  loadMasterData = async (): Promise<LoadMasterDataResult> => {
    const events: AxiosResponse<Event[]> = await axios.get<Event[]>(`${process.env.VUE_APP_API_URL}/events`);
    if (events.status !== 200) {
      return {errorText: `イベントデータ取得に失敗しました code:${events.status}`, isError: true};
    }
    this.allEvents = events.data;

    const groups: AxiosResponse<Group[]> = await axios.get<Group[]>(`${process.env.VUE_APP_API_URL}/groups`);
    if (groups.status !== 200) {
      return {errorText: `グループデータ取得に失敗しました code:${groups.status}`, isError: true};
    }
    this.allGroups = groups.data;
    
    const baseDesigns: AxiosResponse<BaseDesign[]> = await axios.get<BaseDesign[]>(`${process.env.VUE_APP_API_URL}/basedesigns`);
    if (baseDesigns.status !== 200) {
      return {errorText: `デザインータ取得に失敗しました code:${groups.status}`, isError: true};
    }
    this.allBaseDesigns = baseDesigns.data;

    this.isLoaded = true;
    return {errorText: '', isError: false};
  }
}

export function StorePlugin(Vue: typeof _Vue): void {
  Vue.prototype.$store = new MasterData();
}

declare module 'vue/types/vue' {
  interface Vue {
    $store: MasterData;
  }
}
