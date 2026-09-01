import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { createHash, timingSafeEqual } from 'node:crypto';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

/** bcrypt cost. 10~12 사이가 일반적이며, 높을수록 느리고 안전하다. */
export const BCRYPT_ROUNDS = 12;

/**
 * refresh token 은 bcrypt 로 해시하지 않는다.
 * bcrypt 는 입력을 72바이트에서 잘라내므로, 같은 사용자의 JWT 들은
 * 앞부분이 동일해 서로의 해시와 일치해버린다(= 회전이 무력화된다).
 * 토큰은 이미 고엔트로피 난수이므로 SHA-256 으로 전체 길이를 해시한다.
 */
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * 비밀번호를 해시해서 저장한다.
   * username / email 중복은 DB unique 제약과 함께 사전 검사로도 막는다.
   */
  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (existing) {
      throw new ConflictException(
        existing.username === dto.username
          ? 'username already taken'
          : 'email already registered',
      );
    }

    const user = this.usersRepository.create({
      ...dto,
      password: await bcrypt.hash(dto.password, BCRYPT_ROUNDS),
    });
    return this.usersRepository.save(user);
  }

  /** password / refreshToken 은 @Exclude 대상이라 명시적으로 select 해야 한다. */
  findByUsernameWithSecrets(username: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'name', 'email', 'password'],
    });
  }

  findByIdWithRefreshToken(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      select: ['id', 'username', 'refreshToken'],
    });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByIdOrFail(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  /**
   * refresh token 도 평문으로 두면 DB 유출 시 그대로 재사용 가능하므로 해시해서 보관한다.
   */
  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.usersRepository.update(userId, {
      refreshToken: hashToken(refreshToken),
    });
  }

  /** 저장된 해시와 제시된 토큰을 상수 시간으로 비교한다. */
  verifyRefreshToken(refreshToken: string, storedHash: string): boolean {
    const provided = Buffer.from(hashToken(refreshToken), 'hex');
    const stored = Buffer.from(storedHash, 'hex');
    if (provided.length !== stored.length) return false;
    return timingSafeEqual(provided, stored);
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken: null });
  }
}
