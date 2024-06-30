import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MagicMoverModule } from './magic-mover/magic-mover.module';
import { MagicItemModule } from './magic-item/magic-item.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    MagicMoverModule,
    MagicItemModule,
    ActivityLogModule,
  ],
})
export class AppModule {}
