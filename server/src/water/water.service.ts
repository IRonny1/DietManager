import { Injectable } from '@nestjs/common';
import { WaterLog } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { todayStr } from '../common/utils/date.utils';
import { AddWaterDto } from './dto/add-water.dto';
import type {
  WaterEntryDto,
  WaterLogResponseDto,
} from './dto/water-log-response.dto';

@Injectable()
export class WaterService {
  constructor(private readonly prisma: PrismaService) {}

  async getTodayLog(userId: string): Promise<WaterLogResponseDto> {
    const today = todayStr();
    const entries = await this.prisma.waterLog.findMany({
      where: { userId, date: today },
      orderBy: { createdAt: 'desc' },
    });
    const total = entries.reduce((sum, e) => sum + e.amount, 0);
    const goal = await this.getGoalMl(userId);
    return {
      entries: entries.map(e => this.toEntryDto(e)),
      total,
      goal,
    };
  }

  async addEntry(userId: string, dto: AddWaterDto): Promise<WaterEntryDto> {
    const today = todayStr();
    const entry = await this.prisma.waterLog.create({
      data: { userId, amount: dto.amountMl, unit: 'ml', date: today },
    });
    return this.toEntryDto(entry);
  }

  async deleteEntry(userId: string, id: string): Promise<void> {
    await this.prisma.waterLog.deleteMany({ where: { id, userId } });
  }

  async clearToday(userId: string): Promise<void> {
    const today = todayStr();
    await this.prisma.waterLog.deleteMany({ where: { userId, date: today } });
  }

  async getGoal(userId: string): Promise<{ goalMl: number }> {
    const goalMl = await this.getGoalMl(userId);
    return { goalMl };
  }

  async updateGoal(userId: string, goalMl: number): Promise<void> {
    await this.prisma.waterGoal.upsert({
      where: { userId },
      create: { userId, goalMl },
      update: { goalMl },
    });
  }

  private async getGoalMl(userId: string): Promise<number> {
    const goal = await this.prisma.waterGoal.findUnique({ where: { userId } });
    return goal?.goalMl ?? 2000;
  }

  private toEntryDto(entry: WaterLog): WaterEntryDto {
    return {
      id: entry.id,
      amountMl: entry.amount,
      loggedAt: entry.createdAt.toISOString(),
      date: entry.date,
    };
  }
}
