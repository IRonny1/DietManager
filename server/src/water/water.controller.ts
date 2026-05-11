import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtValidatedUser } from '../common/types/jwt.types';
import { WaterService } from './water.service';
import { AddWaterDto } from './dto/add-water.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import type {
  WaterEntryDto,
  WaterLogResponseDto,
} from './dto/water-log-response.dto';

@ApiTags('water')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('water')
export class WaterController {
  constructor(private readonly waterService: WaterService) {}

  @Get('today')
  @ApiOperation({ summary: "Get today's water log" })
  getTodayLog(
    @CurrentUser() user: JwtValidatedUser,
  ): Promise<WaterLogResponseDto> {
    return this.waterService.getTodayLog(user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a water entry' })
  addEntry(
    @CurrentUser() user: JwtValidatedUser,
    @Body() dto: AddWaterDto,
  ): Promise<WaterEntryDto> {
    return this.waterService.addEntry(user.userId, dto);
  }

  @Delete('today')
  @ApiOperation({ summary: "Clear today's water log" })
  clearToday(@CurrentUser() user: JwtValidatedUser): Promise<void> {
    return this.waterService.clearToday(user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a water entry by id' })
  deleteEntry(
    @CurrentUser() user: JwtValidatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.waterService.deleteEntry(user.userId, id);
  }

  @Get('goal')
  @ApiOperation({ summary: 'Get daily water goal' })
  getGoal(
    @CurrentUser() user: JwtValidatedUser,
  ): Promise<{ goalMl: number }> {
    return this.waterService.getGoal(user.userId);
  }

  @Patch('goal')
  @ApiOperation({ summary: 'Update daily water goal' })
  updateGoal(
    @CurrentUser() user: JwtValidatedUser,
    @Body() dto: UpdateGoalDto,
  ): Promise<void> {
    return this.waterService.updateGoal(user.userId, dto.goalMl);
  }
}
