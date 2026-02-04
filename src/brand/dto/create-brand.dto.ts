import { IsMongoId, IsString, Length } from "class-validator";
import { Types } from "mongoose";

export class CreateBrandDto {
@IsString()
@Length(3,25)
name : string;

@IsMongoId()
createdBy :Types.ObjectId;

@IsString()
image : string;
}
