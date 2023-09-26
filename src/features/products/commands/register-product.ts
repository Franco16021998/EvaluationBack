import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ApiProperty } from "@nestjs/swagger";
import { ProductEntity } from "src/infrastructure/persistence/entities/product.entity";
import { ProductTypeEntity } from "src/infrastructure/persistence/entities/product.type.entity";
import { ProductRepository } from "src/infrastructure/persistence/repositories/products.repository";

export class RegisterProduct {
  constructor(
    public name: string,
    public imageUrl: string,
    public price: number,
    public typeId: number 
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
  
  @ApiProperty({
    type: Number,
    description: "The product price"
  })
  public price: number

  @ApiProperty({
    type: Number,
    description: "The product type"
  })
  public typeId: number
}

export class RegisterProductResponse {
  constructor(
    public id: number,
    public name: string,
    public imageUrl: string,
    public price: number,
    public typeId: number
  ) {}
}

export class RegisterProductMapper {
  public static toCommand(request: RegisterProductRequest) {
    let command: RegisterProduct = new RegisterProduct(
      request.name,
      request.imageUrl,
      request.price,
      request.typeId
    );
    return command;
  }

  public static toEntity(command: RegisterProduct) {
    let productEntity: ProductEntity = new ProductEntity();
    productEntity.name = command.name;
    productEntity.imageUrl = command.imageUrl;
    productEntity.price = command.price;
    let productTypeEntity: ProductTypeEntity = new ProductTypeEntity();
    productTypeEntity.id = command.typeId;
    productEntity.productType = productTypeEntity;
    return productEntity;
  }

  public static toResponse(entity: ProductEntity) {
    let response: RegisterProductResponse = new RegisterProductResponse(
      entity.id,
      entity.name,
      entity.imageUrl,
      entity.price,
      entity.productType.id
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