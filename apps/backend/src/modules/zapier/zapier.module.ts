import { Module } from '@nestjs/common';
import { ZapierController } from './zapier.controller';
import { ZapierService } from './zapier.service';

@Module({
  controllers: [ZapierController],
  providers: [ZapierService],
  exports: [ZapierService]
})
export class ZapierModule {} 