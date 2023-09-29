import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiExtraModels, ApiOperation, ApiTags, refs } from '@nestjs/swagger';
import { GetProducts } from './queries/get-products';
import { RegisterProduct, RegisterProductMapper, RegisterProductRequest, RegisterProductResponse } from './commands/register-product';
import { GetProductByName } from './queries/get-product-by-name';

const RegisterProductExample = {
  name: 'Test Product',
  imageUrl: 'Test Url',
  price: 50.50,
  typeId: 1
};

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiOperation({
    summary: 'Get products',
    description: 'Get product list',
  })
  @Get()
  async getProducts() {
    const products = await this.queryBus.execute(new GetProducts());
    return products;
  }

  @ApiOperation({
    summary: 'Get product',
    description: 'Get product by name',
  })
  @Get('/:name')
  async getProductByName(@Param('name') name: string) {
    const product = await this.queryBus.execute(new GetProductByName(name));
    return product;
  }

  @ApiOperation({
    summary: 'Register product',
    description: 'Register a new product',
  })
  @ApiExtraModels(RegisterProductRequest)
  @ApiBody({
    schema: {
      oneOf: refs(RegisterProductRequest),
      example: RegisterProductExample,
    },
  })
  @Post()
  async registerProduct(@Body() request: RegisterProductRequest): Promise<RegisterProductResponse> {
    let command: RegisterProduct = RegisterProductMapper.toCommand(request);
    return await this.commandBus.execute(command);
  }
}