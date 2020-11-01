import { Group } from './Group';

export interface BaseDesign {
  id: number;
  name: string;
  imageUrl: string;
  sortOrder: number;
  group: Group;
}
