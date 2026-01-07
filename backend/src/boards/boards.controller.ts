import { Body, Controller, Get, Post, Request, UseGuards, Delete, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@UseGuards(AuthGuard('jwt')) // All endpoints here require login
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateBoardDto) {
    // req.user.userId comes from the JWT Strategy created before
    return this.boardsService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.boardsService.findAll(req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
    return this.boardsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardsService.remove(id);
  }
}
