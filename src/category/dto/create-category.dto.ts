
import { IsArray, IsMongoId, IsOptional, IsString, Length } from "class-validator";
import { Types } from "mongoose";


export class CreateCategoryDto {

@IsString()
@Length(3,25)
name : string;

@IsString()
@Length(3,1000)
@IsOptional()
descrption?: string;



@IsMongoId()
createdBy :Types.ObjectId;
@IsOptional()
@IsString()
image?: string;


@IsMongoId({each:true})
@IsOptional()
@IsArray()
brands:Types.ObjectId[];
}
