import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { AddBlockItemDto, BlockListQueryDto } from './dto';

@Injectable()
export class BlockListService {
  constructor(private db: DbService) {}

  async create(userId: number) {
    return await this.db.blockList.create({
      data: { ownerId: userId },
    });
  }

  async getByUserId(userId: number, query: BlockListQueryDto) {
    return await this.db.blockList.findUniqueOrThrow({
      where: { ownerId: userId },
      include: {
        items: {
          where: { data: { contains: query.q, mode: 'insensitive' } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async addItem(userId: number, data: AddBlockItemDto) {
    const blockList = await this.db.blockList.findUniqueOrThrow({
      where: { ownerId: userId },
    });
    return await this.db.blockItem.create({
      data: { blockListId: blockList.id, ...data },
    });
  }

  async removeItem(userId: number, itemId: number) {
    const blockList = await this.db.blockList.findUniqueOrThrow({
      where: { ownerId: userId },
    });

    return await this.db.blockItem.delete({
      where: { blockListId: blockList.id, id: itemId },
    });
  }
}
