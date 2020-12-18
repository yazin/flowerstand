import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseDataSet } from './BaseDataSet';
import { Participant } from './Participant';
import { Event } from './Event';
import { BaseDesign } from './BaseDesign';

@Entity()
export class FlowerStand extends BaseDataSet {
  @Column({length: 100})
  name: string;

  @Column({length: 100})
  presentTo: string;

  @Column({length: 100})
  presentFrom: string;

  @ManyToOne(type => Event, event => event.flowerStands)
  event: Event;

  @Column({nullable: true})
  eventId?: number;

  @Column({type: 'text', nullable: true})
  description?: string;

  @Column({length: 2048, nullable: true})
  projectUrl?: string;

  @Column({length: 100})
  organizerName: string;

  @Column({length: 15})
  organizerIpAddress: string;

  @OneToMany(type => Participant, perticipant => perticipant.flowerStand)
  participants?: Participant[];

  @ManyToOne(type => BaseDesign, baseDesign => baseDesign.flowerStands)
  baseDesign: BaseDesign;

  @Column({nullable: true})
  baseDesignId?: number;

  @Column({length: 8})
  readonly adminKey: string;

  // XXXX-XXXX-XXXX-XXXX
  @Column({length: 19})
  readonly participationCode: string;

  @Column({length: 1024})
  imageUrl: string;

  constructor(name: string, presentTo: string, presentFrom: string, event: Event, organizerName: string, organizerIpAddress: string, adminKey: string, participationCode: string, baseDesign: BaseDesign, imageUrl: string) {
    super();
    this.name = name;
    this.presentTo = presentTo;
    this.presentFrom = presentFrom;
    this.event = event;
    this.organizerName = organizerName;
    this.organizerIpAddress = organizerIpAddress;
    this.adminKey = adminKey;
    this.participationCode = participationCode;
    this.baseDesign = baseDesign;
    this.imageUrl = imageUrl;
  }
}
