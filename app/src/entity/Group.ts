import { Column, Entity, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseDataSet } from './BaseDataSet';
import { BaseDesign } from './BaseDesign';
import { Event } from './Event';

@Entity()
export class Group extends BaseDataSet{
  @Column({length: 100})
  name: string;

  @ManyToMany(type => Event, event => event.groups)
  @JoinTable()
  events?: Event[];

  @OneToMany(type => BaseDesign, baseDesign => baseDesign.group)
  @JoinColumn()
  baseDesigns?: BaseDesign[];

  constructor(name: string) {
    super();
    this.name = name;
  }
}
