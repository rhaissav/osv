import { UserRepository } from '../user/user.repository';
import { hash } from 'bcryptjs';

export class CompleteSignupService {
  private readonly userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async completeSignup(email: string, name: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('Usuário não encontrado.');
    if (user.password_hash && user.password_hash.length > 0) {
      throw new Error('Usuário já possui cadastro completo.');
    }
    const password_hash = await hash(password, 10);
    await this.userRepository.update(user.id, { name, password_hash });
    return true;
  }
}
