import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './features/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      url: process.env.PULSO_DB_STRING_CONNECTION,
      migrationsRun: true,
      logging: true,
      timezone: '+00:00',
      bigNumberStrings: false,
      entities: [
        process.env.ENVIRONMENT == 'local' ? 
        'dist/infrastructure/persistence/entities/*{.ts,.js}' :
        'infrastructure/persistence/entities/*{.ts,.js}'
      ],
      subscribers: [],
      migrations: [
        process.env.ENVIRONMENT == 'local' ? 
        'dist/infrastructure/persistence/migrations/*{.ts,.js}' :
        'infrastructure/persistence/migrations/*{.ts,.js}'
      ],
      migrationsTableName: "migrations-typeorm"
    }),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
