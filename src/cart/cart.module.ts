import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { UserModule } from 'src/user/user.module';
import { Product, ProductSchema } from 'src/DB/models/product.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, cartSchema } from 'src/DB/models/Cart.model';
import { JwtService } from '@nestjs/jwt';
import { CartService } from './cart.service';
import { Coupon, couponSchema } from 'src/DB/models/Coupon.model';

@Module({
  imports:[  UserModule,
    MongooseModule.forFeature([{name:Cart.name,schema:cartSchema}]),
    MongooseModule.forFeature([{name:Product.name,schema:ProductSchema}]),
      MongooseModule.forFeature([{name:Coupon.name,schema:couponSchema}])
  ],
  controllers: [CartController],
  providers: [CartService,JwtService],
})
export class CartModule {}
