import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./product.entity";

@Entity('product_types')
export class ProductTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => ProductEntity, (product) => product)
  products: ProductEntity[]
}