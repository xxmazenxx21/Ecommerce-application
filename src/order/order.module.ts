import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, orderSchema } from 'src/DB/models/order.model';
import { Cart, cartSchema } from 'src/DB/models/Cart.model';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Order.name, schema: orderSchema }]),
    MongooseModule.forFeature([{ name: Cart.name, schema: cartSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService, JwtService],
})
export class OrderModule {}
