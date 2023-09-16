import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";
import { ProductEntity } from "src/infrastructure/persistence/entities/product.entity";
import { ProductRepository } from "src/infrastructure/persistence/repositories/products.repository";

export class RegisterProduct {
  constructor(
    public name: string,
    public imageUrl: string
  ) {}
}

export class RegisterProductRequest {
  @ApiProperty({
    type: String,
    description: "The product name",
    example: 'Test Product',
    required: true
  })
  public name: string;

  @ApiProperty({
    type: String,
    description: "The product image url"
  })
  public imageUrl: string
}

export class RegisterProductResponse {
  constructor(
    public id: number,
    public name: string,
    public imageUrl: string
  ) {}
}

export class RegisterProductMapper {
  public static toCommand(request: RegisterProductRequest) {
    let command: RegisterProduct = new RegisterProduct(
      request.name,
      request.imageUrl
    );
    return command;
  }

  public static toEntity(command: RegisterProduct) {
    let productEntity: ProductEntity = new ProductEntity();
    productEntity.name = command.name;
    productEntity.imageUrl = command.imageUrl;
    return productEntity;
  }

  public static toResponse(entity: ProductEntity) {
    let response: RegisterProductResponse = new RegisterProductResponse(
      entity.id,
      entity.name,
      entity.imageUrl
    );
    return response;
  }
}

@CommandHandler(RegisterProduct)
export class RegisterProductHandler implements ICommandHandler<RegisterProduct> {
  constructor(
    private readonly productRepository: ProductRepository
  ) {}
  
  async execute(command: RegisterProduct) {
    let productEntity: ProductEntity = RegisterProductMapper.toEntity(command);
    productEntity = await this.productRepository.create(productEntity);
    let response: RegisterProductResponse = RegisterProductMapper.toResponse(productEntity);
    return response;
  }
}