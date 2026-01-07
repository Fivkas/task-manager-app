import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  boardId: string;
}
