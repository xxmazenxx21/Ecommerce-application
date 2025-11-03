// import { IsEmail, IsEnum, IsInt, IsPositive, IsString,  Length } from "class-validator";
import { genderEnum, providerEnum, roleEnum } from 'src/common/enums/enum';
import { otp } from 'src/DB/models/otp.model';
import z from 'zod';


// export class SignUpDto {
//   @IsString({ message: 'first name should be a string' })
//   @Length(2, 20, { message: 'first name should be 2-20 characters' })

//   firstName: string;
//   @IsString({ message: 'last name should be a string' })
//   @Length(2, 20, { message: 'last name should be 2-20 characters' })

//   lastName: string;

//   @IsEmail({}, { message: 'email is not valid' })

//   email: string;
//   @IsString({ message: 'password should be a string' })

//   password: string;

//   confirmpassword: string;
//   @IsEnum(role, { message: 'role should be admin or user' })
//   role: string;

//   @IsEnum(gender, { message: 'gender should be male or female' })
//   gender: string;
// @IsInt()
// @IsPositive()
//   age: number;
// }


export const signUpSchema =z.strictObject({
firstName : z.string().min(2).max(20).optional(),
lastName:z.string().min(2).max(20).optional(),
userName:z.string().min(2).max(45),
email:z.email(),
password:z.string(),
confirmpassword:z.string(),
role:z.enum(roleEnum).optional(),
gender:z.enum(genderEnum).optional(),
age:z.number().int().positive().optional(),
provider : z.enum(providerEnum).optional(),


}).refine((value)=>value.password === value.confirmpassword,{
  message:'password does not match',
  path:["confirmpassword"],
})


export type SignUpDto = z.infer<typeof signUpSchema>





export const resendOtpSchema =z.strictObject({

email:z.email(),


})


export type ResendotpDto = z.infer<typeof resendOtpSchema>






export const confirmEmailSchema =z.strictObject({

email:z.email(),
otp:z.string()


})


export type ConfirmEmailDto = z.infer<typeof confirmEmailSchema>










export const loginSchema =z.strictObject({

email:z.email(),
password:z.string()


})


export type LoginDto = z.infer<typeof loginSchema>







