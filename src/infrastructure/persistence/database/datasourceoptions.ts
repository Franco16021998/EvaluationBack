import { AmazonSecretsManager } from "src/infrastructure/shared/amazon-secrets-manager";
import { DataSource, DataSourceOptions } from "typeorm";

interface RdsParameter {
  username: string,
  password: string,
  engine: string,
  host: string,
  port: number,
}

export class MyDataSourceOptions {
  public static password: string;
  public static newPassword: boolean;

  static async get(): Promise<DataSourceOptions> {
    const awsAccessKeyId: string = process.env.AWS_ACCESS_KEY_ID;
    const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const jsonRDS = await AmazonSecretsManager.getSecret(
      awsAccessKeyId,
      awsSecretAccessKey,
      "Production_PulsoApiNet_RDSMySQLConnection",
      "us-east-2");
    let rdsParameter: RdsParameter = JSON.parse(jsonRDS);
    this.newPassword = false;
    if (this.password != rdsParameter.password)
      this.newPassword = true;
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
    }
  }

  static async getNewDataSource() {
    const options = await this.get();
      let dataSource = new DataSource(options);
      await dataSource.initialize();
      return dataSource;
  }
}