import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartDocument } from 'src/DB/models/Cart.model';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from 'src/DB/models/order.model';
import { InjectModel } from '@nestjs/mongoose';
import { orderStatusEnum, paymentMethodEnum } from 'src/common/enums/enum';
import { UserDocument } from 'src/DB/models/user.model';
import { PaymentService } from 'src/common/services/payment/payment.service';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  constructor(  @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
      @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private readonly paymentservice:PaymentService
    ){}
 
 
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


      async createCheckoutSession(orderid:Types.ObjectId,userid:Types.ObjectId) {
const order = await this.orderModel.findOne({_id:orderid,user:userid,payment:paymentMethodEnum.ONLINE}).populate('cart').populate('coupon').populate('user');
if(!order) throw new NotFoundException('Order not found');

const amount = order.totalAfterDiscount ?? order.subtotal ?? 0 ; 

const line_items = [{
  price_data: {
    currency: 'egp',
    product_data: {
      name: `Order ${(order.user as unknown as UserDocument).firstName}`,
      description: `Payment for order ${order.address}`,
  },
  unit_amount: amount * 100,
  

},quantity: 1,

}];

const discounts:Stripe.Checkout.SessionCreateParams.Discount[] = [];

if(order.discount){
  const coupon = await this.paymentservice.createCoupon({
    percent_off: order.discount,
    duration:'once',
    currency:'egp'
  })
discounts.push({
  coupon: coupon.id})
}


const session = await this.paymentservice.checkOutSession({
  line_items,
  customer_email:(order.user as unknown as UserDocument).email,
  metadata:{
    orderId:order._id.toString(),
  },
  discounts
})

const paymentMethod = await this.paymentservice.createPaymentMethod({
  type:'card',
  card:{token:'tok_visa'}
})

const intent = await this.paymentservice.createPaymentIntent({
  amount: amount * 100,
  currency:'egp',
  payment_method: paymentMethod.id,
  payment_method_types:['card']  
})

order.intentId = intent.id;
await order.save();

await this.paymentservice.confirmPaymentintent(intent.id);

   return session;
  }








        async refundOrder(orderid:Types.ObjectId,userid:Types.ObjectId) {
const order = await this.orderModel.findOne({_id:orderid,user:userid,payment:paymentMethodEnum.ONLINE})
if(!order) throw new NotFoundException('Order not found');

if(!order.intentId) throw new BadRequestException('Payment intent not found');

const refund =await this.paymentservice.refundPayment(order.intentId);
const neworder = await this.orderModel.findByIdAndUpdate(orderid,{
  statues:orderStatusEnum.CANCELLED,
  refundId: refund.id,
  refundAt: new Date(),
  $unset:{intentId:true}

}, {new:true});
return neworder;
  }






}
