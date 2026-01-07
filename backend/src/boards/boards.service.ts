import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  // 1. Create Board
  async create(userId: string, dto: CreateBoardDto) {
    return this.prisma.board.create({
      data: {
        title: dto.title,
        ownerId: userId, // Connect the board to the user who created it
      },
    });
  }

  // 2. Finding all Boards of a user
  async findAll(userId: string) {
    return this.prisma.board.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc', // Most recent first
      },
    });
  }

  async update(id: string, dto: UpdateBoardDto) {
    return this.prisma.board.update({
      where: { id },
      data: { title: dto.title },
    });
  }

  async remove(id: string) {
    // Because we have Cascade in the database, this will
    // automatically delete all the columns/tasks of the board!
    return this.prisma.board.delete({
      where: { id },
    });
  }
}
