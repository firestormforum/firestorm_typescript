import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Post } from './Post'
import * as bcrypt from 'bcrypt'

@Entity()
export class User extends BaseEntity {
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword () {
    if (this.password) {
      this.passwordHash = await bcrypt.hash(this.password, 10)
    }
  }

  @PrimaryGeneratedColumn('uuid') id: string

  @Column() name: string

  @Column() email: string

  @Column() username: string

  public password: string

  @Column() passwordHash: string

  @CreateDateColumn({ type: 'timestamp' })
  insertedAt: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date

  @OneToMany(type => Post, post => post.user)
  posts: Post[]
}
