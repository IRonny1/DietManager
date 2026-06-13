import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScanService } from './scan.service';
import { AnalyzeFoodDto } from './dto/analyze-food.dto';
import type { FoodScanResultDto } from './dto/food-scan-result.dto';

@ApiTags('scan')
@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze a food image and return nutrition data' })
  analyzeFood(@Body() dto: AnalyzeFoodDto): Promise<FoodScanResultDto> {
    return this.scanService.analyzeFood(dto.imageBase64);
  }
}
