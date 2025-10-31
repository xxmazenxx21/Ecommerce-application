import {  Body,  Controller,  Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import {signUpSchema, type SignUpDto} from './dto/Singup.dto';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipes';

@Controller('auth')
export class AuthController {

constructor(private readonly authService :AuthService){}

@UsePipes(new ZodValidationPipe(signUpSchema))
@Post('/signup')
SignUp(@Body() signUpDto : SignUpDto){

return this.authService.SignUp(signUpDto);

}

}
