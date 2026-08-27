import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Todo } from 'src/todos/entities/todo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique identifier of the user',
    type: String,
    format: 'uuid',
    nullable: false,
  })
  id: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @ApiProperty({
    description: 'The refresh token associated with the user',
    type: String,
    maxLength: 255,
    nullable: true,
  })
  @Exclude()
  refreshToken: string | null;

  @Column({
    type: 'varchar',
    length: 32,
    unique: true,
  })
  @ApiProperty({
    description: 'The unique username of the user',
    type: String,
    maxLength: 32,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 32,
  })
  @ApiProperty({
    description: 'The name of the user',
    type: String,
    maxLength: 32,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @ApiProperty({
    description: 'The email address of the user',
    type: String,
    maxLength: 255,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @ApiProperty({
    description: 'The password of the user',
    type: String,
    maxLength: 255,
    nullable: false,
  })
  @Exclude()
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
