/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { User } from '../users/user.entity';
import { ResetToken } from '../auth/entities/reset-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ResetToken])],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController]
})
export class EmailModule { }
