import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { FoodScanResultDto } from './dto';

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
    } catch (e) {
      console.error('Failed to analyze food image', e);
      throw new InternalServerErrorException('Failed to analyze food image');
    }

    const jsonContent = content
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    let parsed: FoodScanResultDto;
    try {
      parsed = JSON.parse(jsonContent) as FoodScanResultDto;
    } catch (e) {
      console.error('Failed to parse food analysis response', e);
      throw new BadRequestException('Food could not be analyzed');
    }

    return parsed;
  }
}
