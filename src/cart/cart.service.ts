import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Model, Types } from 'mongoose';
import { Cart } from 'src/DB/models/Cart.model';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/DB/models/product.model';
import { Coupon } from 'src/DB/models/Coupon.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel:Model<Cart>,
    @InjectModel(Product.name) private readonly productModel:Model<Product>,
        @InjectModel(Coupon.name) private readonly CouponModel:Model<Coupon>
){}
  async AddtoCart(userid:Types.ObjectId, productId: string, quantity: number) {
  const product = await this.productModel.findById(new Types.ObjectId(productId));

if(!product){
  return new NotFoundException('Product not found');
}

const price = product.saleprice;
const total = price * quantity;   
let cart =  await this.cartModel.findOne({user:userid}); 
if(!cart){
  cart = await this.cartModel.create({
    user :userid , 
    items:[{
      product: new Types.ObjectId(productId),
      quantity,
      price : price,
      total : total,
    }],
    subtotal: total,
  })
}
else{
const itemIndex =cart.items.findIndex((item)=>item.product.toString()===productId);
if(itemIndex >-1){
  cart.items[itemIndex].quantity+= quantity;
cart.items[itemIndex].total = cart.items[itemIndex].quantity * price;
}else{
  cart.items.push({
    product: new Types.ObjectId(productId),
    quantity,
    price : price,
    total : total,
  });
}
cart.subtotal = cart.items.reduce((sum,item)=> sum + item.total ,0);
await cart.save();

}

return cart ; 
  }



  async update(userid:Types.ObjectId,productId:string, quantity: number) {
   const cart = await this.cartModel.findOne({user:userid});
if(!cart) throw new NotFoundException('cart not found');

const itemIndex = cart.items.findIndex((item)=> item.product.toString()=== productId); 
if(itemIndex === -1) throw new NotFoundException('Product not found in cart'); 
if(quantity<=0){
  cart.items.splice(itemIndex,1);
}else {
cart.items[itemIndex].quantity = quantity;
cart.items[itemIndex].total = cart.items[itemIndex].price* quantity ; 

}
cart.subtotal = cart.items.reduce((sum,item)=>sum+ item.total,0);
await cart.save();

return cart ;
  }


    async findOne(userid : Types.ObjectId) {
const cart  = await this.cartModel.findOne({user:userid}).populate({path:'items.product' , select:'name descrption saleprice images -_id'});
return cart ; 
  }

 async remove(userid : Types.ObjectId,productId : string) {
 const cart = await this.cartModel.findOne({user:userid});
if(!cart) throw new NotFoundException('cart not found');
const itemIndex = cart.items.findIndex((item)=> item.product.toString() === productId); 

if(itemIndex === -1) throw new NotFoundException('Product not found in cart'); 
  cart.items.splice(itemIndex,1);
  cart.subtotal = cart.items.reduce((sum,item)=>sum+ item.total,0);
await cart.save();
return cart ;




  }
  

   async applyCoupon(userid : Types.ObjectId, code : string) {
    const cart = await this.cartModel.findOne({ user: userid });
    if (!cart) throw new NotFoundException('cart not found');
    if (!cart.subtotal || cart.subtotal <= 0) throw new BadRequestException('Cart is empty');

    const now = new Date();
    const coupon = await this.CouponModel.findOne({ code });
    if (!coupon) throw new NotFoundException('Coupon not found');

    const expiresAt = coupon.expiresAt ? new Date(coupon.expiresAt) : null;
    if (expiresAt && expiresAt < now) throw new NotFoundException('Coupon expired');

    const discountPercentage = typeof coupon.discountpercentage === 'number' ? coupon.discountpercentage : 0;
    const amountDiscount = (cart.subtotal * discountPercentage) / 100;

    cart.coupon = coupon._id;
    cart.discount = amountDiscount;
    cart.totalAfterDiscount = cart.subtotal - amountDiscount;

    await cart.save();
    return cart;
  }
}
