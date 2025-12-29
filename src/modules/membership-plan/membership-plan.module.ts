import { Module } from '@nestjs/common';
import { MembershipPlanController } from './membership-plan.controller';
import { MembershipPlanService } from './membership-plan.service';

@Module({
  controllers: [MembershipPlanController],
  providers: [MembershipPlanService]
})
export class MembershipPlanModule {}
