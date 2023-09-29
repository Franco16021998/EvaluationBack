import { CqrsModule } from "@nestjs/cqrs";
import { RegisterProductHandler } from "./commands/register-product";
import { GetProductsHandler } from "./queries/get-products";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "src/infrastructure/persistence/entities/product.entity";
import { ProductsController } from "./products.controller";
import { Module } from "@nestjs/common";
import { ProductRepository } from "src/infrastructure/persistence/repositories/products.repository";
import { GetProductByNameHandler } from "./queries/get-product-by-name";

export const QueryHandlers = [GetProductsHandler, GetProductByNameHandler];
export const CommandHandlers = [RegisterProductHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProductEntity]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductRepository, 
    ...QueryHandlers,
    ...CommandHandlers
  ],
})
export class ProductsModule {}