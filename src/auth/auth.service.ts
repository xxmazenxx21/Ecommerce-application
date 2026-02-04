import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { otpEnums } from 'src/common/enums/enum';
import { generateotp } from 'src/common/utils/otp/otp.utils';
import { compareHash } from 'src/common/utils/security/hashing';
import { otp } from 'src/DB/models/otp.model';
import { User, UserDocument } from 'src/DB/models/user.model';
import { LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(otp.name) private readonly otpModel: Model<otp>, private jwtService: JwtService) { }

  private async createOtp(userid: Types.ObjectId) {

    await this.otpModel.create([{
      code: generateotp(),
      expiredAt: new Date(Date.now() + 2 * 60 * 1000),
      createdBy: userid,
      type: otpEnums.confirmEmail
    }])




  }


  async SignUp(signUpDto): Promise<{ mesage: string, user: UserDocument }> {

    const { email, userName, password } = signUpDto;
    if (await this.userModel.findOne({ email }))
      throw new ConflictException("user already exists");

    const [user] = await this.userModel.create([{ email, userName, password }]) || [];

    await this.createOtp(user._id);

    return { mesage: "user created successfully", user };

  }


  async resendOtp(resendotp) {

    const { email } = resendotp;

    const user = await this.userModel.findOne({ email, confirmEmail: { $exists: false } }).populate([{ path: 'otp', match: { type: otpEnums.confirmEmail } }]);
    if (!user)
      throw new ConflictException("user not found or already confirmed");

    if (user.otp?.length)
      throw new ConflictException("otp already sent to this email , please check your email");

    await this.createOtp(user._id);
    return { mesage: "otp created successfully" };

  }




  async ConfirmEmail(confirmEmailDto) {

    const { email, otp } = confirmEmailDto;

    const user = await this.userModel.findOne({ email, confirmEmail: { $exists: false } }).populate([{ path: 'otp', match: { type: otpEnums.confirmEmail } }]);
    if (!user)
      throw new ConflictException("user not found or already confirmed");

    if (!user.otp?.length)
      throw new ConflictException("otp donst exist");

    if (!(await compareHash({ plainText: otp, hashedText: user.otp[0].code })))
      throw new ConflictException("invalid otp");


    await this.userModel.updateOne({ _id: user._id }, { $set: { confirmEmail: new Date() }, $inc: { __v: 1 } });

    return { mesage: "otp sent successfully" };

  }


  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email, confirmEmail: { $exists: true } });
    if (!user)
      throw new ConflictException("user not found");

    if (!await compareHash({ plainText: password, hashedText: user.password }))
      throw new BadRequestException('password is incorrect');
    const jwtid = randomUUID();

    const accessToken = await this.jwtService.sign(
      { id: user._id, email: user.email } as any,
      {
        secret: process.env.ACCESS_TOKEN_SECRET as string,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as any,
        jwtid,
      },
    );

    const refreshToken = await this.jwtService.sign(
      { id: user._id, email: user.email } as any,
      {
        secret: process.env.REFRESH_TOKEN_SECRET as string,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as any,
        jwtid,
      },

    );

    return { mesage: "login  successfully", credentials: { accessToken, refreshToken } };


  }



     profile(req: any) {
    

    return { mesage: "profile get successfully",data:req.user };


  }








}
