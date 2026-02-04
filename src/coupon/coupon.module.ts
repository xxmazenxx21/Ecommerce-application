import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, couponSchema } from 'src/DB/models/Coupon.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:  [  UserModule,
      MongooseModule.forFeature([{name:Coupon.name,schema:couponSchema}])
    ],
  controllers: [CouponController],
  providers: [CouponService,JwtService],
})
export class CouponModule {}
