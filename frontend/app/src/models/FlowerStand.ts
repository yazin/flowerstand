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
  panel: string | ArrayBuffer | null;
}

export interface FlowerStandPreviewResponse {
  imageUrl: string;
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
  panel: string | ArrayBuffer | null;
}

export interface FlowerStandCreateResponse {
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
}

export interface FlowerStandUpdateRequest {
  adminKey: string;
  name: string;
  organizerName: string;
  description: string;
  projectUrl: string;
}
