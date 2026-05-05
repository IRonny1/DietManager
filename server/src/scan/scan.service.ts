import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { FoodScanResultDto } from './dto/food-scan-result.dto';

const SYSTEM_PROMPT = `You are a nutrition expert. Analyze the food in the image and return a JSON object with:
{
  "name": "Food name",
  "category": "Food category",
  "calories": number,
  "protein": number,
  "fat": number,
  "carbs": number,
  "portionGrams": number,
  "confidence": "high" | "medium" | "low",
  "ingredients": ["ingredient1", "ingredient2"],
  "recognized": true | false
}

If you cannot identify the food, return { "recognized": false }.
Base nutrition values on a standard portion size for the identified food.
All values must be numbers (not strings). Return ONLY the JSON object, no other text.`;

@Injectable()
export class ScanService {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('openai.apiKey') ?? '';
    this.openai = new OpenAI({ apiKey });
  }

  async analyzeFood(imageBase64: string): Promise<FoodScanResultDto> {
    let content: string;
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
              },
              { type: 'text', text: SYSTEM_PROMPT },
            ],
          },
        ],
      });
      content = completion.choices[0]?.message?.content ?? '';
    } catch {
      throw new InternalServerErrorException('Failed to analyze food image');
    }

    let parsed: FoodScanResultDto;
    try {
      parsed = JSON.parse(content) as FoodScanResultDto;
    } catch {
      throw new BadRequestException('Food could not be analyzed');
    }

    return parsed;
  }
}
