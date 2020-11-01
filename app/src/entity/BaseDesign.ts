import { Entity, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { BaseDataSet } from './BaseDataSet';
import { FlowerStand } from './FlowerStand';
import { Group } from './Group';

@Entity()
export class BaseDesign extends BaseDataSet {
  @Column({length: 100})
  name: string;

  @ManyToOne(type => Group, group => group.baseDesigns)
  group: Group;

  @Column({length: 1024})
  imageUrl: string;

  @Column()
  sortOrder: number;

  @OneToMany(type => FlowerStand, flowerStand => flowerStand.baseDesign)
  @JoinColumn()
  flowerStands?: FlowerStand[];

  constructor(name: string, group: Group, imageUrl: string, sortOrder: number) {
    super();
    this.name = name;
    this.group = group;
    this.imageUrl = imageUrl;
    this.sortOrder = sortOrder;
  }
}
