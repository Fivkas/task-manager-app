import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateColumnDto) {
    // We find how many columns already exist to put the new one at the end
    const count = await this.prisma.column.count({
      where: { boardId: dto.boardId },
    });

    return this.prisma.column.create({
      data: {
        title: dto.title,
        boardId: dto.boardId,
        order: count, // Use of 'order' (Int)
      },
    });
  }

  async update(id: string, dto: UpdateColumnDto) {
    return this.prisma.column.update({
      where: { id },
      data: { title: dto.title },
    });
  }

  async findAll(boardId: string) {
    return this.prisma.column.findMany({
      where: { boardId },
      include: { 
        tasks: { 
          orderBy: { order: 'asc' } // Task sorting
        } 
      }, 
      orderBy: { order: 'asc' }, // Column sorting
    });
  }

  async remove(id: string) {
    return this.prisma.column.delete({
      where: { id },
    });
  }
}
