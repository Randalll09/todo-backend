import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'The unique identifier of the todo item',
    type: String,
    format: 'uuid',
    nullable: false,
  })
  id!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @ApiProperty({
    description: 'The title of the todo item',
    type: String,
    maxLength: 255,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    array: true,
  })
  @ApiProperty({
    description: 'The tags associated with the todo item',
    type: [String],
    nullable: true,
  })
  tags: string[] | null;

  @Column({
    type: 'boolean',
    default: false,
  })
  @ApiProperty({
    description: 'Indicates whether the todo item is completed',
    type: Boolean,
    default: false,
    nullable: false,
  })
  done: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  @ApiProperty({
    description: 'The due date of the todo item',
    type: String,
    format: 'date-time',
    nullable: true,
  })
  due_date: Date | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  whenCreated: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  whenFinished: Date;
}
