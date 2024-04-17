import { Injectable } from '@nestjs/common';
import { AccountService } from 'src/account/account.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UsersService {
  constructor(
    private db: DbService,
    private accountService: AccountService,
  ) {}

  async findByEmail(email: string) {
    return this.db.user.findFirst({ where: { email } });
  }

  async create(email: string, hash: string, salt: string) {
    const user = await this.db.user.create({ data: { email, hash, salt } });

    await this.accountService.createAccount(user.id);

    return user;
  }
}
