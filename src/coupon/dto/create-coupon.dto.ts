import { IsNotEmpty, IsNumber, IsString, IsUppercase } from "class-validator";


export class CreateCouponDto {

@IsString()
@IsUppercase()
@IsNotEmpty()
code: string;
@IsNumber()
@IsNotEmpty()
 discountpercentage: number;
@IsNotEmpty()
 expiresAt: Date;

}
