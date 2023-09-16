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