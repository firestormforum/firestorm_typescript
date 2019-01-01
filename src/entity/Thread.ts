import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Category } from './Category'
import { Post } from './Post'

@Entity()
export class Thread extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column() title: string

  @Column() slug: string

  @Column() categoryId: string

  @CreateDateColumn({ type: 'timestamp' })
  insertedAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @ManyToOne(type => Category, category => category.threads)
  category: Category

  @OneToMany(type => Post, post => post.thread)
  posts: Post[]
}
