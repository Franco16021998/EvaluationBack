import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ProductRepository } from "src/infrastructure/persistence/repositories/products.repository";

export class GetProducts {}

@QueryHandler(GetProducts)
export class GetProductsHandler implements IQueryHandler<GetProducts> {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(query: GetProducts) {
    const rows = await this.productRepository.getProducts(query);
    return rows;
  }
}