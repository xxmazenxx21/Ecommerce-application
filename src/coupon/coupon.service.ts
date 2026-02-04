import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Coupon } from "src/DB/models/Coupon.model";

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private readonly couponModel: Model<Coupon>,
  ) {}
  async create(createCouponDto: CreateCouponDto, userid: Types.ObjectId) {
    const couponexists = await this.couponModel.findOne({
      code: createCouponDto.code,
    });
    if (couponexists) throw new ConflictException("Coupon code already exists");
    const coupon = await this.couponModel.create({
      user: userid,
      ...createCouponDto,
    });
    return coupon;
  }







  findAll() {
    return `This action returns all coupon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  update(id: number, updateCouponDto: UpdateCouponDto) {
    return `This action updates a #${id} coupon`;
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
