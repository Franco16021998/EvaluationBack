import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { AmazonSecretsManager } from "src/infrastructure/shared/amazon-secrets-manager";
import { MyDataSourceOptions } from "./datasourceoptions";

interface RdsParameter {
  username: string,
  password: string,
  engine: string,
  host: string,
  port: number,
}

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const awsAccessKeyId: string = process.env.AWS_ACCESS_KEY_ID;
    const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const jsonRDS = await AmazonSecretsManager.getSecret(
      awsAccessKeyId,
      awsSecretAccessKey,
      "Production_PulsoApiNet_RDSMySQLConnection",
      "us-east-2");
    let rdsParameter: RdsParameter = JSON.parse(jsonRDS);
    MyDataSourceOptions.password = rdsParameter.password;
    return {
      type: "mysql",
      host: rdsParameter.host,
      port: 3306,
      username: rdsParameter.username,
      password: rdsParameter.password,
      database: 'pulso',
      migrationsRun: true,
      logging: true,
      timezone: '+00:00',
      bigNumberStrings: false,
      extra: {
        decimalNumbers: true
      },
      entities: [
        'dist/infrastructure/persistence/entities/*{.ts,.js}'
      ],
      subscribers: [],
      migrations: [
        'dist/infrastructure/persistence/migrations/*{.ts,.js}'
      ],
      migrationsTableName: "migrations-typeorm",
    };
  }
}