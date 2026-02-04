import {  Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  
    required: true,
    unique: false,
  })
  user: Types.ObjectId;

  @Prop({
    type: String , 
    required: true,
    unique: true,
    trim: true,
    uppercase: true,

  })
  code: string;


@Prop({
    type: Number,
    required: true,
    min: 1,
    max: 100,
  })

discountpercentage: number;

@Prop({
    type: Date,
    required: true,
  })
expiresAt: Date;


}

export const couponSchema = SchemaFactory.createForClass(Coupon);

  

