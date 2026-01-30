import { Injectable, Logger } from '@nestjs/common';
import { MemberDto, PaginatedMembersDto } from './dto';
import members from '../config/members.json';

@Injectable()
export class MembersService {
  private readonly logger = new Logger(MembersService.name);
  private members: MemberDto[];

  constructor() {
    // TODO: Implement proper data fetching from a database
    this.members = members as MemberDto[];
    this.logger.log(`Loaded ${this.members.length} members from JSON`);
  }

  private parseDate(dateString: string): Date {
    // Handle format "2020-10-23T04:03:37 -01:00" (space before timezone)
    const normalized = dateString.replace(/\s([+-]\d{2}:\d{2})$/, '$1');
    return new Date(normalized);
  }

  private parseMinutesFromGreeting(greeting: string): number {
    const match = greeting.match(/completed (\w+) minutes/i);

    if (!match) return 0;

    const value = match[1];
    const num = parseInt(value, 10);

    if (!isNaN(num)) return num;

    // TODO: need to refactor to support more words (maybe use a library)
    const wordToNumber: Record<string, number> = {
      thirty: 30,
    };
    return wordToNumber[value.toLowerCase()] ?? 0;
  }

  private formatDuration(totalMinutes: number): string {
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);

    return parts.join(', ');
  }

  findAll(
    page: number = 1,
    limit: number = 20,
    startDate?: Date,
    endDate?: Date,
  ): PaginatedMembersDto {
    this.logger.log(`findAll called with page=${page}, limit=${limit}, startDate=${startDate?.toISOString()}, endDate=${endDate?.toISOString()}`);

    let filtered = this.members;

    // Filter by registration date if specified
    if (startDate || endDate) {
      filtered = this.members.filter((member) => {
        const registered = this.parseDate(member.registered);

        if (startDate && registered < startDate) return false;

        if (endDate && registered > endDate) return false;
        return true;
      });
    }

    this.logger.log(`Filtered ${filtered.length} members from ${this.members.length} total`);

    // Calculate total exercise time for filtered records
    const totalMinutes = filtered.reduce(
      (sum, member) => sum + this.parseMinutesFromGreeting(member.greeting),
      0,
    );
    const totalExerciseTime = this.formatDuration(totalMinutes);
    this.logger.log(`Total exercise time: ${totalMinutes} minutes (${totalExerciseTime})`);

    // Pagination
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
      totalExerciseTime,
    };
  }
}
