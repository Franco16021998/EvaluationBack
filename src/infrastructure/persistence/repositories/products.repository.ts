import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from 'src/infrastructure/persistence/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProducts } from 'src/features/products/queries/get-products';
import { MyDataSourceOptions } from '../database/datasourceoptions';

@Injectable()
export class ProductRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(ProductEntity)
    private repository: Repository<ProductEntity>
  ) {
  }

  async getProducts(query: GetProducts) {
    if (!this.dataSource.isInitialized)
      this.dataSource = await MyDataSourceOptions.getNewDataSource();
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
    if (!this.repository.manager.connection.isInitialized) {
      const dataSource = await MyDataSourceOptions.getNewDataSource();
      this.repository = dataSource.getRepository(ProductEntity);
    }
    productEntity = await this.repository.save(productEntity);
    return productEntity;
  }
}