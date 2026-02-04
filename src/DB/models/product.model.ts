import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxLength: 100,
    unique: true,
  })
  name: string;


    @Prop({
    type: String,
    minlength: 3,
    maxLength: 1000,
  })
  descrption: string;


  @Prop({
    type: String,
    minlength: 3,
    maxLength: 50,
  })
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: [String],
    required: true,
  })
  images: string;



  
  @Prop({
    type: Number,
    required: true,
  })
  originalPrice: number;

    
  @Prop({
    type: Number,
    required: true,
  })
  stock: number;




    @Prop({
    type: Number,
    default:0,
  })
  sale: number;

   
  @Prop({
    type: Number,
    required: true,
  })
  saleprice: number;




  @Prop({
  type: {type:mongoose.Schema.Types.ObjectId,ref:"Brand"},
  
  })
  brand : Types.ObjectId;


  
  @Prop({
  type: {type:mongoose.Schema.Types.ObjectId,ref:"Category"},
  
  })
  category : Types.ObjectId;
}
export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre("save", function(next) {
    if(this.isModified('name')){
        this.slug = slugify(this.name,{lower:true});
    }
    next();
})
