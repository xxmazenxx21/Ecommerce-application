import {  BadRequestException, Body,  Controller,  Get,  Patch,  Post, Request, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {type ResendotpDto, resendOtpSchema, signUpSchema, type SignUpDto, type ConfirmEmailDto, confirmEmailSchema, loginSchema, type LoginDto} from './dto/auth.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipes';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { multerOptions } from 'src/common/utils/multer/multer';

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


@UseGuards(AuthGuard)
@Get('/profile')
profile(@Request() req : any){

return this.authService.profile(req);
}





@Post('/upload')
@UseInterceptors(FileInterceptor('image',multerOptions('products')))
upload(@UploadedFile()file : Express.Multer.File){
console.log(file);


// return this.authService.profile(req);
}




}
