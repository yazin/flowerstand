import { IGroup } from './IGroup';

export interface IEvent {
  id: number,
  name: string,
  startDate: Date,
  endDate: Date,
  groups: IGroup[]
}

export interface IEventGetRequestParams {
  id: number;
}
