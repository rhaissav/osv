import { v7 as uuidv7 } from 'uuid';
import { UserRepository } from '../user/user.repository';
import { MailService } from '../mail/mail.service';

export class PasswordRecoveryService {
  private readonly userRepository: UserRepository;
  private readonly mailService: MailService;
  constructor(userRepository: UserRepository, mailService: MailService) {
    this.userRepository = userRepository;
    this.mailService = mailService;
  }

  async requestRecovery(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return;
    }
    const token = uuidv7();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
    await this.userRepository.update(user.id, {
      passwordRecoveryToken: token,
      passwordRecoveryTokenExpires: expires,
    });
    await this.mailService.sendPasswordRecovery(email, token);
    console.log('dados', email, token)
    return token;
  }
}
