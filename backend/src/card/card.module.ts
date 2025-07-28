import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card]),
    forwardRef(() => AuthModule),
  ],
  providers: [CardService],
  controllers: [CardController],
  exports: [TypeOrmModule, CardService]
})
export class CardModule {}
