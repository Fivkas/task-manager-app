import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class MoveTaskDto {
  @IsUUID()
  @IsNotEmpty()
  newColumnId: string;

  @IsInt()
  @Min(0)
  newOrder: number;
}
