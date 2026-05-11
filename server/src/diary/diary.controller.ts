import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { DiaryService } from './diary.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import type { MealResponseDto } from './dto/meal-response.dto';

@ApiTags('diary')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('today')
  @ApiOperation({ summary: "Get today's meals for the authenticated user" })
  getTodayMeals(
    @CurrentUser() user: JwtValidatedUser,
  ): Promise<MealResponseDto[]> {
    return this.diaryService.getTodayMeals(user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get meals within a date range' })
  @ApiQuery({ name: 'from', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: false, description: 'YYYY-MM-DD' })
  getMeals(
    @CurrentUser() user: JwtValidatedUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<MealResponseDto[]> {
    return this.diaryService.getMeals(user.userId, from ?? '', to ?? '');
  }

  @Post()
  @ApiOperation({ summary: 'Add a meal entry' })
  addMeal(
    @CurrentUser() user: JwtValidatedUser,
    @Body() dto: CreateMealDto,
  ): Promise<MealResponseDto> {
    return this.diaryService.addMeal(user.userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a meal entry' })
  updateMeal(
    @CurrentUser() user: JwtValidatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateMealDto,
  ): Promise<MealResponseDto> {
    return this.diaryService.updateMeal(user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meal entry' })
  deleteMeal(
    @CurrentUser() user: JwtValidatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.diaryService.deleteMeal(user.userId, id);
  }
}
