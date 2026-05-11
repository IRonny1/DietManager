export interface WaterEntryDto {
  id: string;
  amountMl: number;
  loggedAt: string;
  date: string;
}

export interface WaterLogResponseDto {
  entries: WaterEntryDto[];
  total: number;
  goal: number;
}
