import { Event } from './Event';
import { BaseDesign } from './BaseDesign';
import { Participant } from './Participant';

export interface FlowerStand {
  id?: number;
  name: string;
  presentTo: string;
  presentFrom: string;
  description?: string;
  projectUrl?: string;
  organizerName: string;
  imageUrl?: string;

  participants: Participant[];
  event: Event;
  baseDesign: BaseDesign;
}

export interface FlowerStandSearchRequestQuery {
  baseDesignId?: number;
  eventId?: number;
  groupId?: number;
  offset?: number;
  limit?: number;
}

export interface FlowerStandVerifyAdminKeyRequestBody {
  flowerStandId: number;
  adminKey: string;
}

export interface FlowerStandPreviewRequest {
  presentTo: string;
  presentFrom: string;
  baseDesignId: number;
  eventId: number;
  prefix: string;
  panel: string | ArrayBuffer | null;
}

export interface IFlowerStandPreviewResponse {
  imageUrl: string;
  isError: 0;
}

export interface FlowerStandCreateRequest {
  name: string;
  presentTo: string;
  presentFrom: string;
  description: string;
  projectUrl: string;
  organizerName: string;
  eventId: number;
  baseDesignId: number;
  prefix: string;
  panel: string | ArrayBuffer | null;
}

export interface IFlowerStandCreateResponse {
  id: number;
  name: string;
  presentTo: string;
  presentFrom: string;
  event: Event;
  description: string;
  projectUrl: string;
  organizerName: string;
  participants: Participant[];
  baseDesign: BaseDesign;
  imageUrl: string;
  adminKey: string;
  participationCode: string;
  isError: 0;
}

export interface FlowerStandUpdateRequest {
  adminKey: string;
  name: string;
  organizerName: string;
  description: string;
  projectUrl: string;
}

export interface IFlowerStandError {
  isError: 1;
  errorType: string;
}

export type FlowerStandCreateResponse = IFlowerStandCreateResponse | IFlowerStandError;
export type FlowerStandPreviewResponse = IFlowerStandPreviewResponse | IFlowerStandError;
