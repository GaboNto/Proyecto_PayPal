/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
    providers: [EmailService],
    exports: [EmailService], // <- necesario si lo usarás desde otros módulos
})
export class EmailModule { }
