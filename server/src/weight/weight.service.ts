import { Injectable } from '@nestjs/common';
import { WeightLog } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AddWeightDto } from './dto/add-weight.dto';
import type { WeightEntryResponseDto } from './dto/weight-entry-response.dto';

@Injectable()
export class WeightService {
  constructor(private readonly prisma: PrismaService) {}

  async getEntries(
    userId: string,
    from?: string,
    to?: string,
  ): Promise<WeightEntryResponseDto[]> {
    const entries = await this.prisma.weightLog.findMany({
      where: {
        userId,
        ...(from || to
          ? {
              date: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
      orderBy: { date: 'desc' },
    });
    return entries.map(e => this.toDto(e));
  }

  async addEntry(
    userId: string,
    dto: AddWeightDto,
  ): Promise<WeightEntryResponseDto> {
    const entry = await this.prisma.weightLog.create({
      data: {
        userId,
        weight: dto.weightKg,
        unit: 'kg',
        date: dto.date,
        note: dto.note,
      },
    });
    return this.toDto(entry);
  }

  async deleteEntry(userId: string, id: string): Promise<void> {
    await this.prisma.weightLog.deleteMany({ where: { id, userId } });
  }

  private toDto(entry: WeightLog): WeightEntryResponseDto {
    return {
      id: entry.id,
      weightKg: entry.weight,
      date: entry.date,
      note: entry.note,
    };
  }
}
