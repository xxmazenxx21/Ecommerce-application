import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/common/guards/auth.guards';
import type { UserDocument } from 'src/DB/models/user.model';
import { Types } from 'mongoose';


@Controller('api/order')
export class OrderController {
  constructor( private readonly orderService: OrderService, ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() body :{cartid:string,address:string},@Req() req) {
    const userid = req.user._id;
    const {cartid,address} = body
    return this.orderService.create(cartid,address,userid);
  }


    @UseGuards(AuthGuard)
  @Post('session/:orderid')
  createCheckoutSession(@Param('orderid') orderid: Types.ObjectId,@Req() req,user:UserDocument) {
    const userid = req.user._id;
    const session =  this.orderService.createCheckoutSession(orderid,userid);
    return session;
  }



      @UseGuards(AuthGuard)
  @Post('refund/:orderid')
  refundOrder(@Param('orderid') orderid: Types.ObjectId,@Req() req,user:UserDocument) {
    const userid = req.user._id;
    const refund =  this.orderService.refundOrder(orderid,userid);
    return refund;
  }


}
