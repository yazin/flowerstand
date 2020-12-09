<template>
  <v-container>
    <v-row>
      <v-col>
        <FlowerStandFilterForm
          @change-event="changeFilter"
          @change-group="changeFilter"
          @change-design="changeFilter">
        </FlowerStandFilterForm>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col v-for="item in flowerStands" :key="item.id" cols="12" xs="12" sm="6" lg="3">
        <FlowerStandListItem :flowerStand="item"/>
      </v-col>
      <InfiniteLoading ref="infiniteLoading" @infinite="onEndOfPage">
        <span slot="no-more">結果は以上です</span>
        <span slot="no-results">フラワースタンドがありません</span>
      </InfiniteLoading>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse, AxiosError } from 'axios';
import InfiniteLoading, { StateChanger } from 'vue-infinite-loading';
import { FlowerStand, FlowerStandSearchRequestQuery } from '../models/FlowerStand';
import FlowerStandListItem from './FlowerStandListItem.vue';
import FlowerStandFilterForm, { FilterCondition } from './FlowerStandFilterForm.vue';

@Component({
  components: {
    FlowerStandListItem,
    FlowerStandFilterForm,
    InfiniteLoading
  }
})
export default class FlowerStandList extends Vue {
  flowerStands: FlowerStand[] = [];
  errorText = '';
  page = 0;

  get pageSize(): number {
    return 16;
  }

  private allFlowerStands: FlowerStand[] = [];

  async mounted(): Promise<void> {
    const params: FlowerStandSearchRequestQuery = {
      offset: 0,
      limit: this.pageSize
    };
    try {
      const flowerStands: AxiosResponse<FlowerStand[]> = await axios.get<FlowerStand[]>(`${process.env.VUE_APP_API_URL}/flowerstands`, {params: params});
      if (flowerStands.status !== 200) {
        throw new Error(`データ取得に失敗しました code:${flowerStands.status}`);
      }
      this.flowerStands = flowerStands.data;

      let loading: InfiniteLoading | null = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isInfiniteLoading = (x: any): x is InfiniteLoading => (x !== null && typeof x === 'object' && typeof x.distance === 'number');
      if (isInfiniteLoading(this.$refs.infiniteLoading)) {
        loading = this.$refs.infiniteLoading;
      }

      if (!loading) {
        throw new Error('予期しないエラーが発生しました');
      }

      loading.stateChanger.loaded();

      if (flowerStands.data.length < this.pageSize) {
        loading.stateChanger.complete();
      } else {
        loading.stateChanger.loaded();
      }
    } catch (err: any) {
      const e: AxiosError<FlowerStand[]> = err;
      throw new Error(`データ取得に失敗しました code:${e.response ? e.response.status : 'unknown'}`);
    }
  }

  private async changeFilter(condition: FilterCondition): Promise<void> {
    let loading: InfiniteLoading | null = null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isInfiniteLoading = (x: any): x is InfiniteLoading => (x !== null && typeof x === 'object' && typeof x.distance === 'number');
    if (isInfiniteLoading(this.$refs.infiniteLoading)) {
      loading = this.$refs.infiniteLoading;
    }

    if (!loading) {
      throw new Error('予期しないエラーが発生しました');
    }

    loading.stateChanger.reset();
    loading.stateChanger.loaded();

    this.page = 0;
    const params: FlowerStandSearchRequestQuery = {
      offset: 0,
      limit: this.pageSize
    };

    if (condition.event) {
      params.eventId = condition.event;
    }


    if (condition.baseDesign) {
      params.baseDesignId = condition.baseDesign;
    }

    if (condition.group) {
      params.groupId = condition.group;
    }

    try {
      const flowerStands: AxiosResponse<FlowerStand[]> = await axios.get<FlowerStand[]>(`${process.env.VUE_APP_API_URL}/flowerstands`, {params: params});
      if (flowerStands.status !== 200) {
        throw new Error(`データ取得に失敗しました code:${flowerStands.status}`);
      }
      this.flowerStands = flowerStands.data;
      if (flowerStands.data.length < this.pageSize) {
        loading.stateChanger.complete();
      } else {
        loading.stateChanger.loaded();
      }
    } catch (err: any) {
      const e: AxiosError<FlowerStand[]> = err;
      throw new Error(`データ取得に失敗しました code:${e.response ? e.response.status : 'unknown'}`);
    }
  }

  private async onEndOfPage($state: StateChanger): Promise<void> {
    this.page++;
    const params: FlowerStandSearchRequestQuery = {
      offset: this.page * this.pageSize,
      limit: this.pageSize
    };
    try {
      const flowerStands: AxiosResponse<FlowerStand[]> = await axios.get<FlowerStand[]>(`${process.env.VUE_APP_API_URL}/flowerstands`, {params: params});
      if (flowerStands.status !== 200) {
        throw new Error(`データ取得に失敗しました code:${flowerStands.status}`);
      }
      this.flowerStands = this.flowerStands.concat(flowerStands.data);
      if (flowerStands.data.length < this.pageSize) {
        $state.complete();
      } else {
        $state.loaded();
      }
    } catch (err: any) {
      const e: AxiosError<FlowerStand[]> = err;
      throw new Error(`データ取得に失敗しました code:${e.response ? e.response.status : 'unknown'}`);
    }
  }
}
</script>
