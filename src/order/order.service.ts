import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Cart, CartDocument } from 'src/DB/models/Cart.model';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from 'src/DB/models/order.model';
import { InjectModel } from '@nestjs/mongoose';
import { orderStatusEnum, paymentMethodEnum } from 'src/common/enums/enum';

@Injectable()
export class OrderService {
  constructor(  @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
      @InjectModel(Cart.name) private cartModel: Model<CartDocument>,){}
 
 
      async create(cartid:string,address:string,userid:Types.ObjectId) {
const cart = await this.cartModel.findOne({_id:cartid,user:userid}).populate('coupon');
if(!cart) throw new NotFoundException('Cart not found');

if(!cart.items.length) throw new BadRequestException('Cart is empty');

const order = await this.orderModel.create({
  user: userid,
  cart: cart._id,
  subtotal: cart.subtotal,
  coupon: cart.coupon?._id || null,
  discount: cart.discount || null,
  totalAfterDiscount: cart.totalAfterDiscount || cart.subtotal,
  address,
  paymentMethod: paymentMethodEnum.CASH,
  statues:orderStatusEnum.PENDING
})
cart.items = [];
await cart.save();
return order ; 
   
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
