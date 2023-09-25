import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './features/products/products.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './infrastructure/persistence/database/typeorm.config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      imports: [ConfigModule],
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
}