import { Injectable, NotFoundException } from '@nestjs/common';
import { Meal } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { MealResponseDto } from './dto/meal-response.dto';

@Injectable()
export class DiaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getTodayMeals(userId: string): Promise<MealResponseDto[]> {
    const today = this.todayStr();
    const meals = await this.prisma.meal.findMany({
      where: { userId, date: today },
      orderBy: { loggedAt: 'desc' },
    });
    return meals.map(this.toResponse);
  }

  async getMeals(
    userId: string,
    from: string,
    to: string,
  ): Promise<MealResponseDto[]> {
    const meals = await this.prisma.meal.findMany({
      where: {
        userId,
        date: { gte: from, lte: to },
      },
      orderBy: { loggedAt: 'desc' },
    });
    return meals.map(this.toResponse);
  }

  async addMeal(userId: string, dto: CreateMealDto): Promise<MealResponseDto> {
    const meal = await this.prisma.meal.create({
      data: {
        userId,
        name: dto.name,
        category: dto.category,
        calories: Math.round(dto.calories),
        protein: dto.protein,
        fat: dto.fat,
        carbs: dto.carbs,
        portionSize: dto.portionGrams,
        imageUrl: dto.imageUri,
        loggedAt: new Date(dto.loggedAt),
        date: dto.date,
      },
    });
    return this.toResponse(meal);
  }

  async updateMeal(
    userId: string,
    id: string,
    dto: UpdateMealDto,
  ): Promise<MealResponseDto> {
    await this.assertOwnership(userId, id);
    const meal = await this.prisma.meal.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.calories !== undefined && { calories: Math.round(dto.calories) }),
        ...(dto.protein !== undefined && { protein: dto.protein }),
        ...(dto.fat !== undefined && { fat: dto.fat }),
        ...(dto.carbs !== undefined && { carbs: dto.carbs }),
        ...(dto.portionGrams !== undefined && { portionSize: dto.portionGrams }),
        ...(dto.imageUri !== undefined && { imageUrl: dto.imageUri }),
        ...(dto.loggedAt !== undefined && { loggedAt: new Date(dto.loggedAt) }),
        ...(dto.date !== undefined && { date: dto.date }),
      },
    });
    return this.toResponse(meal);
  }

  async deleteMeal(userId: string, id: string): Promise<void> {
    await this.assertOwnership(userId, id);
    await this.prisma.meal.delete({ where: { id } });
  }

  private async assertOwnership(userId: string, id: string): Promise<void> {
    const meal = await this.prisma.meal.findUnique({ where: { id } });
    if (!meal || meal.userId !== userId) {
      throw new NotFoundException(`Meal ${id} not found`);
    }
  }

  private toResponse(meal: Meal): MealResponseDto {
    return {
      id: meal.id,
      name: meal.name,
      category: meal.category,
      calories: meal.calories,
      protein: meal.protein,
      fat: meal.fat,
      carbs: meal.carbs,
      portionGrams: meal.portionSize,
      imageUri: meal.imageUrl,
      loggedAt: meal.loggedAt.toISOString(),
      date: meal.date,
    };
  }

  private todayStr(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
