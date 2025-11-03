import {  Body,  Controller,  Patch,  Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {type ResendotpDto, resendOtpSchema, signUpSchema, type SignUpDto, type ConfirmEmailDto, confirmEmailSchema, loginSchema, type LoginDto} from './dto/auth.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipes';

@Controller('auth')
export class AuthController {

constructor(private readonly authService :AuthService){}

@UsePipes(new ZodValidationPipe(signUpSchema))
@Post('/signup')
SignUp(@Body() signUpDto : SignUpDto){

return this.authService.SignUp(signUpDto);

}

@UsePipes(new ZodValidationPipe(resendOtpSchema))
@Post('/resend-otp')
resendOtp(@Body() resendotp : ResendotpDto){

return this.authService.resendOtp(resendotp);

}



@UsePipes(new ZodValidationPipe(confirmEmailSchema))
@Patch('/confirm-email')
ConfirmEmail(@Body() confirmEmailDto : ConfirmEmailDto){

return this.authService.ConfirmEmail(confirmEmailDto);
}


@UsePipes(new ZodValidationPipe(loginSchema))
@Post('/login')
Login(@Body() loginDto : LoginDto){

return this.authService.Login(loginDto);
}





}
