import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { ScanModule } from './scan/scan.module';
import { DiaryModule } from './diary/diary.module';
import { WaterModule } from './water/water.module';
import { WeightModule } from './weight/weight.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    ProfileModule,
    ScanModule,
    DiaryModule,
    WaterModule,
    WeightModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
