import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  columnId: string;
}