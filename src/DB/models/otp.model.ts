
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { otpEnums } from 'src/common/enums/enum';
import { emailEvent } from 'src/common/utils/events/sendEmail.event';
import { HashPlainText } from 'src/common/utils/security/hashing';

export type otpDocument = HydratedDocument<otp>;


@Schema({ timestamps: true})
export class otp {
    @Prop({ type: String,required:true })
 code :string;

@Prop({ type: Date,required:true })
    expiredAt :Date;

    @Prop({ type: mongoose.Schema.ObjectId,ref:'User',required:true })
 createdBy :Types.ObjectId;


     @Prop({ type: String,required:true,enum:otpEnums})
 type :string;



}
export const otpSchema = SchemaFactory.createForClass(otp);


otpSchema.index({ "expiredAt": 1 }, { expireAfterSeconds: 0 });

otpSchema.pre('save', async function (this:otpDocument&{plainOtp:string,wasnew:boolean},next) {
this.wasnew = this.isNew;
if (this.isModified('code')){
this.plainOtp = this.code;
    this.code = await HashPlainText({plainText:this.code});

    await this.populate('createdBy');

}
    next();

});


otpSchema.post('save', async function (docc,next) {
const that =this as otpDocument & {plainOtp:string,wasnew:boolean}
if (that.wasnew && that.plainOtp){
  await emailEvent.emit("Confirmemail",
    {to:(that.createdBy as any).email,
        otp:that.plainOtp,
        username:(that.createdBy as any).userName});
}


});





export const otpModel = MongooseModule.forFeature([{name:otp.name,schema:otpSchema}]);