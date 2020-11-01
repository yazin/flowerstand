import { Entity, Column, OneToMany, ManyToMany, JoinColumn } from 'typeorm';
import { BaseDataSet } from './BaseDataSet';
import { FlowerStand } from './FlowerStand';
import { Group } from './Group';

@Entity()
export class Event extends BaseDataSet {
  @Column({length: 100})
  name: string;

  @ManyToMany(type => Group, group => group.events)
  groups?: Group[];

  @Column({type: 'date'})
  startDate: Date;

  @Column({type: 'date'})
  endDate: Date;

  @OneToMany(type => FlowerStand, flowerStand => flowerStand.event)
  @JoinColumn()
  flowerStands?: FlowerStand[];

  constructor(name: string, startDate: Date, endDate: Date) {
    super();
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
