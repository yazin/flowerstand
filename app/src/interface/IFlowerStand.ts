import { IEvent } from './IEvent';
import { IParticipant } from './IParticipant';
import { IBaseDesign } from './IBaseDesign';

export interface IFlowerStandError {
  errorType: string;
  isError: 1;
}
export interface IFlowerStandResponse {
  id: number;
  name: string;
  presentTo: string;
  presentFrom: string;
  event: IEvent;
  description?: string;
  projectUrl?: string;
  organizerName: string;
  participants: IParticipant[];
  baseDesign: IBaseDesign;
  imageUrl: string;
  isError: 0;
}

export type FlowerStandResponse = IFlowerStandResponse | IFlowerStandError;

export interface IFlowerStandResponseWithKeys extends IFlowerStandResponse {
  adminKey: string;
  participationCode: string;
}

export type FlowerStandResponseWithKeys = IFlowerStandResponseWithKeys | IFlowerStandError;

export interface IFlowerStandPreviewResponse {
  imageUrl: string;
  isError: 0;
}

export type FlowerStandPreviewResponse = IFlowerStandPreviewResponse | IFlowerStandError;

export interface IFlowerStandGetRequestParams {
  id: number;
}

export interface IFlowerStandSearchRequestQuery {
  eventId?: number;
  baseDesignId?: number;
  groupId?: number;
  offset?: number;
  limit?: number;
  showPastEvents?: number;
}

export interface IFlowerStandVerifyAdminKeyRequestBody {
  flowerStandId: number;
  adminKey: string;
}

export interface IFlowerStandPreviewRequestBody {
  presentTo: string;
  presentFrom: string;
  baseDesignId: number;
  eventId: number;
  prefix: string;
  panel: string;
}

export interface IFlowerStandAddRequestBody {
  name: string;
  presentTo: string;
  presentFrom: string;
  organizerName: string;
  description?: string;
  projectUrl?: string;
  eventId: number;
  baseDesignId: number;
  prefix: string;
  panel: string;
}

export interface IFlowerStandUpdateRequestParams {
  id: number;
}

export interface IFlowerStandUpdateRequestBody {
  adminKey: string;
  name?: string;
  organizerName?: string;
  description?: string;
  projectUrl?: string;
}

export interface IFlowerStandDeleteRequestParams {
  id: number;
}

export interface IFlowerStandDeleteRequestQuery {
  adminKey: string;
}
