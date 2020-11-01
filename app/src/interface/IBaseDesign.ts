import { IGroup } from './IGroup';

export interface IBaseDesign {
  id: number,
  name: string,
  imageUrl: string,
  sortOrder: number,
  group: IGroup
}

export interface IBaseDesignGetRequestParams {
  id: number;
}
