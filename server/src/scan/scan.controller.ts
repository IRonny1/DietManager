import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScanService } from './scan.service';
import { AnalyzeFoodDto } from './dto/analyze-food.dto';
import type { FoodScanResultDto } from './dto/food-scan-result.dto';

@ApiTags('scan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze a food image and return nutrition data' })
  analyzeFood(@Body() dto: AnalyzeFoodDto): Promise<FoodScanResultDto> {
    return this.scanService.analyzeFood(dto.imageBase64);
  }
}
