import { Exclude } from 'class-transformer';
import { Todo } from 'src/todos/entities/todo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @Exclude()
  refreshToken: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @Exclude()
  password: string;

  /** Supabase Storage 안의 파일 경로. URL은 저장하지 않는다 */
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  profileImg: string | null;

  /** DB 컬럼이 아니라 응답에만 채워주는 값 */
  profileImgUrl?: string;

  @OneToMany(() => Todo, (todo) => todo)
  todos: Todo[];
}
import { Exclude } from 'class-transformer';
import { Todo } from 'src/todos/entities/todo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @Exclude()
  refreshToken: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  @Exclude()
  password: string;

  /** Supabase Storage 안의 파일 경로. URL은 저장하지 않는다 */
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  profileImg: string | null;

  /** DB 컬럼이 아니라 응답에만 채워주는 값 */
  profileImgUrl?: string;

  @OneToMany(() => Todo, (todo) => todo)
  todos: Todo[];
}
