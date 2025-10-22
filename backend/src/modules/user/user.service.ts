import { UserRepository } from './user.repository';
import type { UpdateUserDTO } from './user.types';

export class UserService {
  private readonly repository: UserRepository;
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async getProfile(id: string) {
    return this.repository.findById(id);
  }

  async updateProfile(id: string, data: UpdateUserDTO) {
    return this.repository.update(id, data);
  }

  async deleteAccount(id: string) {
    return this.repository.delete(id);
  }
}
