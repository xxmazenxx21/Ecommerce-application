import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.inteceptor';
import * as express from 'express';

async function bootstrap() {

  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.use("/uploads",express.static('./src/uploads'))
app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(port);

  console.log(`🚀 Server is running on http://localhost:${port}`);
}   
 bootstrap();

