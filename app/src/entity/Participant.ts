import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseDataSet } from './BaseDataSet';
import { FlowerStand } from './FlowerStand';

@Entity()
export class Participant extends BaseDataSet {
  @Column({length: 100})
  name: string;

  @Column({length: 15, nullable: true})
  twitterId?: string;

  @Column({length: 30, nullable: true})
  instagramId?: string;

  @Column({length: 50, nullable: true})
  facebookId?: string;

  @Column({length: 255, nullable: true})
  mastodonId?: string;

  @ManyToOne(type => FlowerStand, flowerstand => flowerstand.participants)
  flowerStand: FlowerStand;

  constructor(name: string, flowerStand: FlowerStand) {
    super();
    this.name = name;
    this.flowerStand = flowerStand;
  }
}
