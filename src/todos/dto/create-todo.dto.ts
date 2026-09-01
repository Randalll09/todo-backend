import { PickType } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Todo } from '../entities/todo.entity';

export class CreateTodoBodyDto extends PickType(Todo, [
  'title',
  'tags',
  'dueDate',
] as const) {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[] | null;

  @IsOptional()
  @IsDateString()
  dueDate: Date | null;
}
