import { PickType } from '@nestjs/swagger';
import { Todo } from '../entities/todo.entity';

export class CreateTodoBodyDto extends PickType(Todo, [
  'title',
  'tags',
  'dueDate',
] as const) {}
