import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, User])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
