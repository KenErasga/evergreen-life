import { ApiProperty } from '@nestjs/swagger';
import { MemberDto } from './member.dto';

export class PaginatedMembersDto {
  @ApiProperty({ type: [MemberDto] })
  data: MemberDto[];

  @ApiProperty({ example: 50000 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 2500 })
  totalPages: number;

  @ApiProperty({ example: '2 days, 3 hours, 45 minutes' })
  totalExerciseTime: string;
}
