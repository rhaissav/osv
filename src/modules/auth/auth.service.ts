import { Role } from '../../generated/prisma/index.js';
import { AuthRepository } from './auth.repository.ts';
import type { RegisterDTO, LoginDTO, AuthResponse } from './auth.types.ts';
import { hash, compare } from 'bcryptjs';
import { v7 as uuidv7 } from 'uuid';

export class AuthService {
  private readonly repository: AuthRepository;
  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

 async register(data: RegisterDTO) {
  try {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new Error('E-mail já cadastrado.');
    }
    const password_hash = await hash(data.password, 10);
    return this.repository.createUser({
      id: uuidv7(),
      name: data.name,
      email: data.email,
      password_hash,
      role: Role.USER,
    });
  } catch (err) {
    console.error("ERRO NO REGISTER", err);
    throw err;
  }
}

  async login(
    data: LoginDTO,
    jwtSign: (payload: object, options?: object) => string
  ): Promise<AuthResponse | null> {
    const user = await this.repository.findByEmail(data.email);
    if (!user || !(await compare(data.password, user.password_hash))) {
      return null;
    }
    const token = jwtSign({ sub: user.id, role: user.role }, { expiresIn: '1h' });
    return { token };
  }
}
