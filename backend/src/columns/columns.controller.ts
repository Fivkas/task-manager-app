import { Body, Controller, Get, Param, Post, UseGuards, Delete, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  create(@Body() dto: CreateColumnDto) {
    return this.columnsService.create(dto);
  }

  @Get(':boardId')
  findAll(@Param('boardId') boardId: string) {
    return this.columnsService.findAll(boardId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateColumnDto) {
    return this.columnsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnsService.remove(id);
  }
}
