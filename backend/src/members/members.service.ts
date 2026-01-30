import { Injectable } from '@nestjs/common';
import { MemberDto, PaginatedMembersDto } from './dto';
import members from '../config/members.json';

@Injectable()
export class MembersService {
  private members: MemberDto[];

  constructor() {
    // TODO: Implement proper data fetching from a database
    this.members = members as MemberDto[];
  }

  findAll(page: number = 1, limit: number = 20): PaginatedMembersDto {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = this.members.slice(startIndex, endIndex);
    const total = this.members.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
