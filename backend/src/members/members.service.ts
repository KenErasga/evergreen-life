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

  private parseDate(dateString: string): Date {
    // Handle format "2020-10-23T04:03:37 -01:00" (space before timezone)
    const normalized = dateString.replace(/\s([+-]\d{2}:\d{2})$/, '$1');
    return new Date(normalized);
  }

  findAll(
    page: number = 1,
    limit: number = 20,
    startDate?: Date,
    endDate?: Date,
  ): PaginatedMembersDto {
    let filtered = this.members;

    if (startDate || endDate) {
      filtered = this.members.filter((member) => {
        const registered = this.parseDate(member.registered);

        if (startDate && registered < startDate) return false;

        if (endDate && registered > endDate) return false;
        return true;
      });
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filtered.slice(startIndex, endIndex);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
