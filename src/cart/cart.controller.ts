import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { Product } from 'src/DB/models/product.model';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}


  @Post()
  @UseGuards(AuthGuard)
   AddtoCart(@Body() body: {productId:string, quantity: number}, @Req() req) {
    const userid = req.user._id;
    return this.cartService.AddtoCart(userid ,body.productId, body.quantity);
  }




  @Get()
  @UseGuards(AuthGuard)
  findOne(@Req() req) {
    const userid = req.user._id
    return this.cartService.findOne(userid);
  }
  @Patch(':productId')
  @UseGuards(AuthGuard)
  updateCart(@Param('productId') productId: string, @Body("quantity")quantity: number ,@Req() req) {
    const userId = req.user._id;
    return this.cartService.update(userId,productId, quantity);
  }

  @Delete(':productId')
    @UseGuards(AuthGuard)
  remove(@Param('productId') productId: string,@Req() req) {
    const userid = req.user._id;
    return this.cartService.remove(userid,productId);
  }

   @Post('apply-coupon')
    @UseGuards(AuthGuard)
  applyCoupon(@Body('code') code:string,@Req() req) {
    const userid = req.user._id;
    return this.cartService.applyCoupon(userid,code);
  }


}


