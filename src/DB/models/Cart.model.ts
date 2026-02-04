import {  Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  
    required: true,
   
    unique: true,
  })
  user: Types.ObjectId;


 @Prop([{
  product : {type : mongoose.Schema.Types.ObjectId, ref: 'Product',required: true},
  quantity : {type :Number, required: true},
  price : {type :Number, required: true},
  total : {type :Number, required: true},
 }])


items:{
product: Types.ObjectId ;
quantity: number ;
price : number ;
total  : number ;
}[];


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


}

export const cartSchema = SchemaFactory.createForClass(Cart);

  

