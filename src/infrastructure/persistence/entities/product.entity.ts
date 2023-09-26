import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductTypeEntity } from "./product.type.entity";

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('varchar', { name: 'image_url', length: 500, nullable: false })
  imageUrl: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  price: number;

  @ManyToOne(() => ProductTypeEntity, (productType) => productType.products)
  @JoinColumn({name: 'product_type_id'})
  productType: ProductTypeEntity
}