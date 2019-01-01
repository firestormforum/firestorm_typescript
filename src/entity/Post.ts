import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Thread } from './Thread'
import { User } from './User'

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column('text') body: string

  @Column() threadId: string

  @Column() userId: string

  @CreateDateColumn({ type: 'timestamp' })
  insertedAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @ManyToOne(type => Thread, thread => thread.posts)
  thread: Thread

  @ManyToOne(type => User, user => user.posts)
  user: User
}
