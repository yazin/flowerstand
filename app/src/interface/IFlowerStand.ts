import { IEvent } from './IEvent';
import { IParticipant } from './IParticipant';
import { IBaseDesign } from './IBaseDesign';
import { IGroup } from './IGroup';

export interface IFlowerStand {
  id: number,
  name: string,
  presentTo: string,
  presentFrom: string,
  event: IEvent,
  description?: string,
  projectUrl?: string,
  organizerName: string,
  participants: IParticipant[],
  baseDesign: IBaseDesign,
  imageUrl: string
}

export interface IFlowerStandWithKeys extends IFlowerStand {
  adminKey: string,
  participationCode: string
}

export interface IFlowerStandPreview {
  imageUrl: string
}

export interface IFlowerStandGetRequestParams {
  id: number;
}

export interface IFlowerStandSearchRequestQuery {
  eventId?: number,
  baseDesignId?: number
}

export interface IFlowerStandPreviewRequestBody {
  presentTo: string,
  presentFrom: string,
  baseDesignId: number,
  panel: string
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
  panel: string;
}

export interface IFlowerStandUpdateRequestParams {
  id: number;
}

export interface IFlowerStandUpdateRequestBody {
  adminKey: string;
  name?: string;
  presentTo?: string;
  presentFrom?: string;
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
