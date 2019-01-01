import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Thread } from './Thread'

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column() title: string

  @CreateDateColumn({ type: 'timestamp' })
  insertedAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @Column({ nullable: true })
  slug?: string

  @OneToMany(type => Thread, thread => thread.category)
  threads: Thread[]
}
