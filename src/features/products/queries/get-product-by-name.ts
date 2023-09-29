import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ProductRepository } from "src/infrastructure/persistence/repositories/products.repository";

export class GetProductByName {
  constructor(
    public name: string
  ) {}
}

@QueryHandler(GetProductByName)
export class GetProductByNameHandler implements IQueryHandler<GetProductByName> {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}

  async execute(query: GetProductByName) {
    const product = await this.productRepository.getProductByName(query);
    return product;
  }
}