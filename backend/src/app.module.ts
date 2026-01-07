import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { ColumnsModule } from './columns/columns.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, BoardsModule, TasksModule, ColumnsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
