import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MembersService } from './members.service';
import { PaginatedMembersDto } from './dto';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @ApiOperation({ summary: 'List all members with pagination and optional date filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 20, max: 100)' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Filter members registered on or after this date (ISO 8601 format)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Filter members registered on or before this date (ISO 8601 format)' })
  @ApiResponse({ status: 200, description: 'Paginated list of members', type: PaginatedMembersDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): PaginatedMembersDto {
    // TODO: create DTO for query params and use ValidationPipe
    const pageNum = parseInt(page ?? '1', 10);
    if (isNaN(pageNum) || pageNum < 1) {
      throw new BadRequestException('page must be a positive integer');
    }

    const limitNum = parseInt(limit ?? '20', 10);
    if (isNaN(limitNum) || limitNum < 1) {
      throw new BadRequestException('limit must be a positive integer');
    }
    if (limitNum > 100) {
      throw new BadRequestException('limit must not exceed 100');
    }

    let start: Date | undefined;
    if (startDate) {
      start = new Date(startDate);
      if (isNaN(start.getTime())) {
        throw new BadRequestException('startDate must be a valid date');
      }
    }

    let end: Date | undefined;
    if (endDate) {
      end = new Date(endDate);
      if (isNaN(end.getTime())) {
        throw new BadRequestException('endDate must be a valid date');
      }
    }

    if (start && end && start > end) {
      throw new BadRequestException('startDate must be before or equal to endDate');
    }

    return this.membersService.findAll(pageNum, limitNum, start, end);
  }
}
