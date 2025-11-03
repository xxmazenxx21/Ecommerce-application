import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument, Mongoose } from 'mongoose';
import { genderEnum, providerEnum, roleEnum } from 'src/common/enums/enum';
import { HashPlainText } from 'src/common/utils/security/hashing';
import { otpDocument } from './otp.model';

export type UserDocument = HydratedDocument<User>;


@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
    @Prop({ type: String,minLength: 2, maxLength: 20, trim:true})
    firstName: string;

    @Prop({ type: String, minLength: 2, maxLength: 20,trim:true})
    lastName: string;

    @Virtual({
        get: function () {
            return this.firstName  + " " + this.lastName
        }
        , set: function (value: string) {
            const [firstName,lastName] = value.split(" ");
            this.firstName = firstName;
            this.lastName = lastName;
        }
    })
userName: string;

    @Prop({ type: String, minLength: 2, maxLength: 45, unique: true,trim:true,required:true })
    email: string;

    @Prop({ type: String, enum: { values: Object.values(providerEnum) ,message:"provider should be SYSTEM or GOOGLE"} })
    provider: string;

    @Prop({ type: String, minLength: 2, maxLength: 45,required:function(){return this.provider===providerEnum.GOOGLE?false:true} })
    password: string;

    @Prop({ type: String, minLength: 2, maxLength: 45, })
    confirmpassword: string;

    @Prop({ type: String, enum: { values: Object.values(roleEnum) } })
    role: string;

    @Prop({ type: String, enum: { values: Object.values(genderEnum) } })
    gender: string;

    @Prop({ type: Number, min: 1 })
    age: number;

@Prop({ type: String})
    confirmEmailOTP: string;
@Prop({ type: Date})
    confirmEmail :Date;
    @Virtual()
    otp : otpDocument[];


}
export const UserSchema = SchemaFactory.createForClass(User);


// hash password before save to database
UserSchema.pre('save', async function (next) {
if(this.isModified('password')){
    this.password = await HashPlainText({plainText:this.password}); 
}
  next();
});

UserSchema.virtual('otp', {
    ref: 'otp',
    localField: '_id',
    foreignField: 'createdBy',

});



export const UserModel = MongooseModule.forFeature([{name:User.name,schema:UserSchema}]);