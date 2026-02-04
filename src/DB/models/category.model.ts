import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxLength: 25,
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
    type: String,
    required: true,
    unique: true,
  })
  image: string;


  @Prop({
  type: [{type:mongoose.Schema.Types.ObjectId,ref:"Brand"}],
  
  })

  brands : Types.ObjectId[];
}
export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre("save", function(next) {
    if(this.isModified('name')){
        this.slug = slugify(this.name,{lower:true});
    }
    next();
})
