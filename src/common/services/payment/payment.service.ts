import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';


@Injectable()
export class PaymentService {
    private stripe : Stripe;
    constructor(){ this.stripe = new Stripe(process.env.SECRET_KEY as string)}

 



async checkOutSession({success_url=process.env.SUCCESS_URL as string
  , cancel_url=process.env.CANCEL_URL as string,
   line_items,metadata={},mode='payment',customer_email,discounts=[]}:Stripe.Checkout.SessionCreateParams){

    const session = await this.stripe.checkout.sessions.create({
      customer_email,
  success_url: success_url,
  cancel_url: cancel_url,
  line_items,
  mode,
  metadata,
  discounts
});
return session; 
}

async createCoupon (data:Stripe.CouponCreateParams){

const coupon = await this.stripe.coupons.create(data);
return coupon;

}

  async createPaymentIntent(data: Stripe.PaymentIntentCreateParams) {
    const intent = await this.stripe.paymentIntents.create(data);
    return intent;
  }


  async createPaymentMethod(data: Stripe.PaymentMethodCreateParams) {
    const paymentMethod = await this.stripe.paymentMethods.create(data);
    return paymentMethod;
  }

  async retrievePaymentintent(id: string) {
    const intentid = await this.stripe.paymentIntents.retrieve(id);
    return intentid;
  }



  
  async confirmPaymentintent(id:string) {
   const intentid = await this.retrievePaymentintent(id);
   if(!intentid) throw new BadRequestException('Invalid payment intent id');
   const confirmintent = this.stripe.paymentIntents.confirm(id);
   return confirmintent;
  }


  async refundPayment(id:string) {
   const intentid = await this.retrievePaymentintent(id);
   if(!intentid) throw new BadRequestException('Invalid payment intent id');
   const refund = this.stripe.refunds.create({payment_intent:id});
   return refund;;
  }


  }










