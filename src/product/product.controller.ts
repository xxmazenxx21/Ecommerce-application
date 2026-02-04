import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Req, UploadedFiles } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { multerOptions } from 'src/common/utils/multer/multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/common/guards/auth.guards';


@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
     @UseInterceptors(FilesInterceptor("images",5, multerOptions("products")))
    @UseGuards(AuthGuard)
  create(@Body() createProductDto: CreateProductDto,@UploadedFiles() files:Express.Multer.File[],@Req()req) {
    const userid = req.user.id;
    return this.productService.create(createProductDto,userid,files);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
