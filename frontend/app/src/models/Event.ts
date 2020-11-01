import { Group } from './Group';

export interface Event {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  groups: Group[];
}
