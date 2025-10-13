import { v7 as uuidv7 } from 'uuid';
import { UserRepository } from '../user/user.repository.ts';
import { MailService } from '../mail/mail.service.ts';

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
    await this.mailService.sendPasswordRecovery(email, token);
    return token;
  }
}
