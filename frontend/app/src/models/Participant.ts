export interface Participant {
  id: number;
  name: string;
  twitterId?: string;
  instagramId?: string;
  facebookId?: string;
  mastodonId?: string;
}

export interface ParticipantCreateData {
  flowerStandId: number;
  name: string;
  twitterId: string;
  instagramId: string;
  facebookId: string;
  mastodonId: string;
  participationCode: string;
}
