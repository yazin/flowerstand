export interface IParticipant {
  id: number,
  name: string,
  twitterId?: string,
  instagramId?: string,
  facebookId?: string,
  mastodonId?: string
}

export interface IParticipantGetRequestParams {
  id: number
}

export interface IParticipantGetAllRequestQuery {
  flowerStandId: number
}

export interface IParticipantAddRequestBody {
  name: string;
  flowerStandId: number;
  participationCode: string;
  twitterId?: string;
  instagramId?: string;
  facebookId?: string;
  mastodonId?: string;
}

export interface IParticipantDeleteRequestParams {
  id: number;
}

export interface IParticipantDeleteRequestQuery {
  adminKey: string;
}
