import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductEntity } from 'src/infrastructure/persistence/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProducts } from 'src/features/products/queries/get-products';
import { MyDataSourceOptions } from '../database/datasourceoptions';
import { GetProductByName } from 'src/features/products/queries/get-product-by-name';
import { ProductTypeEntity } from '../entities/product.type.entity';

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
      p.id,
      p.name,
      p.image_url,
      p.price,
      pt.name AS type
    FROM 
      products p
      JOIN product_types pt ON p.product_type_id = pt.id
    ORDER BY
      p.id;`;
    const rows = await manager.query(sql);
    return rows;
  }

  async getProductByName(query: GetProductByName) {
    if (!this.dataSource.isInitialized)
      this.dataSource = await MyDataSourceOptions.getNewDataSource();
      const manager = this.dataSource.createEntityManager();
      const sql = `
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
        p.name = ?
      ORDER BY
        p.id;`;
      const row = await manager.query(sql, [query.name]);
      return row;
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