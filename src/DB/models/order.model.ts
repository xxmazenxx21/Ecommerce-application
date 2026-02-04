import {  Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { orderStatusEnum, paymentMethodEnum } from "src/common/enums/enum";
import { object } from "zod";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  
    required: true,
   
    unique: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",  
    required: true,
   
    unique: true,
  })
  cart: Types.ObjectId;



@Prop({
    type: Number,
  default: 0,
  })

subtotal: number;


@Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",

  })
coupon?: Types.ObjectId| null;


@Prop({
    type: Number,
  default: 0,

  })
discount?: number | null;


@Prop({
    type: Number,
 default: 0,

  })
totalAfterDiscount?: number;



@Prop({
    type: String,
    required:true


  })
address: string;





@Prop({
    type: String,
 enum: Object.values(orderStatusEnum),
  default: orderStatusEnum.PENDING,


  })
statues: string;




@Prop({
    type: String,
 enum: Object.values(paymentMethodEnum),
  default: paymentMethodEnum.CASH,


  })
payment: string;




}

export const orderSchema = SchemaFactory.createForClass(Order);

  

