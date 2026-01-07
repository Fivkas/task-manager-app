import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    const count = await this.prisma.task.count({
      where: { columnId: dto.columnId },
    });

    return this.prisma.task.create({
      data: {
        content: dto.content,
        columnId: dto.columnId,
        order: count,
      },
    });
  }
  async remove(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: { ...dto }, // Updates whatever we send (e.g. content)
    });
  }

  async moveTask(taskId: string, dto: MoveTaskDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Find the Task and its old location
      const task = await tx.task.findUnique({ where: { id: taskId } });
      if (!task) throw new Error('Task not found');

      const oldColumnId = task.columnId;
      const oldOrder = task.order;

      // 2. If it moves within the SAME column
      if (oldColumnId === dto.newColumnId) {
        if (oldOrder < dto.newOrder) {
          // Move down: Decrease the order of those in between
          await tx.task.updateMany({
            where: {
              columnId: oldColumnId,
              order: { gt: oldOrder, lte: dto.newOrder },
            },
            data: { order: { decrement: 1 } },
          });
        } else if (oldOrder > dto.newOrder) {
          // Move up: Increase the order of those in between
          await tx.task.updateMany({
            where: {
              columnId: oldColumnId,
              order: { gte: dto.newOrder, lt: oldOrder },
            },
            data: { order: { increment: 1 } },
          });
        }
      } 
      // 3. If moved to ANOTHER column
      else {
        // Α. In the OLD column: Close the gap (reduce what was below)
        await tx.task.updateMany({
          where: {
            columnId: oldColumnId,
            order: { gt: oldOrder },
          },
          data: { order: { decrement: 1 } },
        });

        // Β. In the NEW column: Make space (increase everything from the new position down)
        await tx.task.updateMany({
          where: {
            columnId: dto.newColumnId,
            order: { gte: dto.newOrder },
          },
          data: { order: { increment: 1 } },
        });
      }

      // 4. Final Task update
      return tx.task.update({
        where: { id: taskId },
        data: {
          columnId: dto.newColumnId,
          order: dto.newOrder,
        },
      });
    });
  }
}