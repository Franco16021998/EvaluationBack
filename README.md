# Installation

## VS Code
https://code.visualstudio.com

## Install NodeJS (LTS)

### Option 1: nodejs.org
https://nodejs.org/en

### Option 2: nvm (recommended)
https://github.com/coreybutler/nvm-windows

https://github.com/coreybutler/nvm-windows/releases/download/1.1.11/nvm-setup.exe

```
$ nvm v
$ nvm install 18.17.1
$ nvm list
$ nvm use 18.17.1
$ npm --version
```

## Install NestJS CLI
```
$ npm i -g @nestjs/cli
$ nest -v
```

# Development
## Create NestJS App
```
$ cd /efra/workspaces/pulso
$ nest new pulso-api-nest
$ cd pulso-api-nest
$ code .
$ npm run start:dev
```

## Explain initial app module

## Create infrastructure folder
- Add persistence folder with migrations subfolder

## Database access
```
$ npm i --save mysql2 typeorm @nestjs/typeorm
```

## Create environment variable
- NODE_ENV
- PULSO_NEST_MYSQL_CONNECTION

## Db String Connection example
```
'mysql://root:root@localhost:3306/pulso'
```

## Docker Db String Connection example
```
mysql://root:root@host.docker.internal:3306/pulso
```

## RDS Db String Connection example
```
mysql://admin:admin2023@mysql8.cqte2wldqkkr.us-east-2.rds.amazonaws.com:3306/pulso
```

## Install cross-env package
```
npm install --save-dev cross-env
```

## Edit scripts in package.json to add NODE_ENV
"start": "cross-env NODE_ENV=dev nest start",
"start:dev": "cross-env NODE_ENV=dev nest start --watch",
"start:debug": "nest start --debug --watch",
"start:prod": "cross-env NODE_ENV=prod node dist/main",


## Setup database connection at app.module.ts file inside imports section
```
imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      url: process.env.PULSO_NEST_MYSQL_CONNECTION,
      migrationsRun: true,
      logging: true,
      timezone: '+00:00',
      bigNumberStrings: false,
      entities: [
        'dist/infrastructure/persistence/entities/*{.ts,.js}'
      ],
      subscribers: [],
      migrations: [
        'dist/infrastructure/persistence/migrations/*{.ts,.js}'
      ],
      migrationsTableName: "migrations-typeorm"
    }),
],
```

## Edit scripts section at package.json
Add typeorm command
```
"scripts": {
    ...,
    "typeorm": "typeorm-ts-node-commonjs"
}
```

## Create InitialSchema migration
```
$ npm run typeorm migration:create ./src/infrastructure/persistence/migrations/InitialSchema
```

## Create initial-schema.sql inside migrations folder
```
CREATE TABLE IF NOT EXISTS `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
```

## Code InitialSchema migration
- Install node-sql-reader package
```
$ npm i --save node-sql-reader
```

- Edit up method in InitialSchema.ts migration
```
public async up(queryRunner: QueryRunner): Promise<void> {
    const folder = process.env.NODE_ENV == 'dev' ? __dirname.replace('dist', 'src') : __dirname;
    const path = folder + '/initial-schema.sql';
    let queries = SqlReader.readSqlFile(path);
    for (let query of queries)
        await queryRunner.query(query);
}
```

## Create MasterData migration
```
$ npm run typeorm migration:create ./src/infrastructure/persistence/migrations/MasterData
```

## Create master-data.sql inside migrations folder
```
INSERT INTO products(name, image_url) 
VALUES
	('Consulta Medicina General', 'consulta-medicina-general.png'),
	('Consulta Ginecológica', 'consulta-ginecologica.png'),
	('Consulta Neumología', 'consulta-neumologia.jpg'),
  ('Consulta Pediatría', 'consulta-pediatria.jpg'),
  ('Teleconsulta Pediatría', 'teleconsulta-pediatria.jpg'),
  ('Consulta Geriatría', 'consulta-geriatria.jpg'),
  ('Teleconsulta Geriatría', 'teleconsulta-geriatria.jpg'),
  ('Consulta Cardiológica', 'consulta-cardialogica.jpg'),
  ('Consulta Traumatología', 'consulta-traumatologia.jpg'),
  ('Consulta Psicológica', 'consulta-psicologica.jpg'),
  ('Teleconsulta Psicológica', 'teleconsulta-psicologica.jpg'),
  ('Consulta Medicina Interna', 'consulta-medicina-interna.jpg'),
  ('Teleconsulta Medicina Interna', 'teleconsulta-medicina-interna.jpg'),
  ('Consulta Medicina General a Domicilio', 'consulta-medicina-general-a-domicilio.jpg'),
  ('Consulta con Médico del Deporte', 'consulta-con-medico-deporte.jpg');
```

## Code MasterData migration
Edit up method in MasterData.ts migration
```
public async up(queryRunner: QueryRunner): Promise<void> {
    const folder = process.env.NODE_ENV == 'dev' ? __dirname.replace('dist', 'src') : __dirname;
    const path = folder + '/master-data.sql';
    let queries = SqlReader.readSqlFile(path);
    for (let query of queries)
        await queryRunner.query(query);
}
```

## Test migrations
```
$ npm run start:dev
```

## Vertical Slice Architecture
- Add features folder

## Create products resource in features folder
```
$ nest g resource features/products
```

## Install swagger
```
npm install @nestjs/swagger
```

## Edit bootstrap method in main.ts to add swagger
```
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Pulso API')
    .setDescription('Pulso API Documentation')
    .setVersion('1.0')
    .addTag('root')
    .addTag('products')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(8080);
}
```
- Testing at http://localhost:8080/api

## Edit /src/app.controller.ts to add @ApiTags('home')
```
@Controller()
@ApiTags('root')
export class AppController { ... }
```

## Edit /src/features/products.controller.ts to add @ApiTags('products')
```
@Controller('products')
@ApiTags('products')
export class ProductsController { ... }
```

## Create product.entity.ts file inside infrastructure/persistence/entities folder
```
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('varchar', { name: 'image_url', length: 500, nullable: false })
  imageUrl: string;
}
```

## Create products.repository.ts file inside infrastructure/persistence/repositories folder
```
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from 'src/infrastructure/persistence/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProducts } from 'src/features/products/queries/get-products';

@Injectable()
export class ProductRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(ProductEntity)
    private repository: Repository<ProductEntity>,
  ) {}

  async getProducts(query: GetProducts) {
    const manager = this.dataSource.createEntityManager();
    const sql = `
    SELECT 
      id,
      name,
      image_url
    FROM 
      products
    ORDER BY
      name;`;
    const rows = await manager.query(sql);
    return rows;
  }

  async create(productEntity: ProductEntity): Promise<ProductEntity> {
    productEntity = await this.repository.save(productEntity);
    return productEntity;
  }
}
```

## Install CQRS package
```
$ npm install @nestjs/cqrs
```

## Create get-products.ts file folder inside features/products/queries
```
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
```

## Create register-product.ts file folder inside features/products/commands
```
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
```

## Edit products.controller.ts file
```
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiExtraModels, ApiOperation, ApiTags, refs } from '@nestjs/swagger';
import { GetProducts } from './queries/get-products';
import { RegisterProduct, RegisterProductMapper, RegisterProductRequest, RegisterProductResponse } from './commands/register-product';

const RegisterProductExample = {
  name: 'Test Product',
  imageUrl: 'Test Url'
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
```

## Edit products.module.ts file
```
import { CqrsModule } from "@nestjs/cqrs";
import { RegisterProductHandler } from "./commands/register-product";
import { GetProductsHandler } from "./queries/get-products";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "src/infrastructure/persistence/entities/product.entity";
import { ProductsController } from "./products.controller";
import { Module } from "@nestjs/common";
import { ProductRepository } from "src/infrastructure/persistence/repositories/products.repository";

export const QueryHandlers = [GetProductsHandler];
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
```

## Install npm-run-all package
```
$ npm i --save-dev npm-run-all
```

## Add scripts in package.json for production build
```
"copy:package": "node -e \"require('fs').copyFile('./package.json', './dist/package.json', function(err) { if (err) console.log(err); else console.log('package.json copied!') })\"",
"copy:initial-schema": "node -e \"require('fs').copyFile('src/infrastructure/persistence/migrations/initial-schema.sql', './dist/infrastructure/persistence/migrations/initial-schema.sql', function(err) { if (err) console.log(err); else console.log('initial-schema.sql copied!') })\"",
"copy:master-data": "node -e \"require('fs').copyFile('src/infrastructure/persistence/migrations/master-data.sql', './dist/infrastructure/persistence/migrations/master-data.sql', function(err) { if (err) console.log(err); else console.log('master-data.sql copied!') })\"",
"postbuild": "run-p copy:package copy:initial-schema copy:master-data"
```

## Change default port (3000) to 8080 on main.ts

## Generate build and test prod app
```
$ npm run build
$ npm run start:prod
```

## Deploy to App Runner (via GitHub)
- commands in App Runner
- Build command
```
npm install && npm run build
```
- Start command
```
node dist/main
```

## Install Docker Desktop
- https://docs.docker.com/docker-for-windows/install/
```
$ docker version
```

## Create Dockerfile at the app root
```
FROM node:18.17-alpine
RUN addgroup -S nest && adduser -S nest -G nest
USER nest:nest
WORKDIR /usr/src/app
COPY --chown=nest:nest package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD [ "node", "dist/main.js" ]
```

## Create .dockerignore at the app root
```
Dockerfile
.dockerignore
node_modules
npm-debug.log
dist
```

## Create docker-compose-dev.yml
```
services:
  pulso-api-nestjs:
    image: pulso-api-nestjs:0.0.1
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - 8080:8080
    environment:
      - PULSO_NEST_MYSQL_CONNECTION=mysql://admin:admin2023@mysql8.cqte2wldqkkr.us-east-2.rds.amazonaws.com:3306/pulso
      - NODE_ENV=dev
```

## Create docker-compose-prod.yml
```
services:
  pulso-api-nestjs:
    image: pulso-api-nestjs:0.0.1
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - 8080:8080
    environment:
      - PULSO_NEST_MYSQL_CONNECTION=
      - NODE_ENV=
```

## Run dev app
```
$ docker-compose -f docker-compose-dev.yml up
```

## AWS Console - Identity and Access Management (IAM)
- https://console.aws.amazon.com
```
Add user, set AdministratorAccess policy and set access key
```

## Install AWS CLI v2
- https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-windows.html
- https://awscli.amazonaws.com/AWSCLIV2.msi

## AWS CLI
```
$ aws --version
$ aws configure
$ aws iam list-users
```

## Docker Prod Build
```
$ docker-compose -f docker-compose-prod.yml build
```

## AWS CLI - ECR
- {aws-account-id}.dkr.ecr.{aws-region}.amazonaws.com
- {aws-account-id}.dkr.ecr.{aws-region}.amazonaws.com/{ecr-repo-name}
- {docker-image-name}:version
```
$ aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 784798437085.dkr.ecr.us-east-2.amazonaws.com

$ aws ecr create-repository --repository-name pulso-api-nest

$ docker tag pulso-api-nestjs:0.0.2 784798437085.dkr.ecr.us-east-2.amazonaws.com/pulso-api-nest:0.0.2

$ docker push 784798437085.dkr.ecr.us-east-2.amazonaws.com/pulso-api-nest:0.0.2
```

## Deploy to App Runner (via ECR)

## Install @aws-sdk/client-secrets-manager npm package
```
$ npm install --save @aws-sdk/client-secrets-manager
```

## App Runner FAQs
https://aws.amazon.com/es/apprunner/faqs

```
DELIMITER //
CREATE PROCEDURE get_products()
BEGIN
SELECT 
      p.id,
      p.name,
      p.image_url,
      p.price,
      pt.name AS type
    FROM 
      products p
      JOIN product_types pt ON p.product_type_id = pt.id
    ORDER BY
      p.id;
END //
DELIMITER ;
```

```
DELIMITER //
CREATE PROCEDURE get_products()
BEGIN
SELECT 
  p.id,
  p.name,
  p.image_url,
  p.price,
  pt.name AS type
FROM 
  products p
  JOIN product_types pt ON p.product_type_id = pt.id
ORDER BY
  p.id;
END //
DELIMITER ;
```

```
DELIMITER //
CREATE PROCEDURE `get_product_by_name`(IN name VARCHAR(255))
BEGIN
SELECT 
	p.id,
	p.name,
	p.image_url,
	p.price,
	pt.name AS type
FROM 
	products p
	JOIN product_types pt ON p.product_type_id = pt.id
WHERE
	p.name = name
ORDER BY
	p.id;
END //
DELIMITER ;
```