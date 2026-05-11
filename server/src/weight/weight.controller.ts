import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtValidatedUser } from '../common/types/jwt.types';
import { WeightService } from './weight.service';
import { AddWeightDto } from './dto/add-weight.dto';
import type { WeightEntryResponseDto } from './dto/weight-entry-response.dto';

@ApiTags('weight')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Get()
  @ApiOperation({ summary: 'Get weight entries (optional date range)' })
  @ApiQuery({ name: 'from', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: false, description: 'YYYY-MM-DD' })
  getEntries(
    @CurrentUser() user: JwtValidatedUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<WeightEntryResponseDto[]> {
    return this.weightService.getEntries(user.userId, from, to);
  }

  @Post()
  @ApiOperation({ summary: 'Add a weight entry' })
  addEntry(
    @CurrentUser() user: JwtValidatedUser,
    @Body() dto: AddWeightDto,
  ): Promise<WeightEntryResponseDto> {
    return this.weightService.addEntry(user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a weight entry' })
  deleteEntry(
    @CurrentUser() user: JwtValidatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.weightService.deleteEntry(user.userId, id);
  }
}
