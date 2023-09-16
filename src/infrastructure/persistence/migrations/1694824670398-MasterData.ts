import { SqlReader } from "node-sql-reader";
import { MigrationInterface, QueryRunner } from "typeorm"

export class MasterData1694824670398 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const folder = process.env.ENVIRONMENT == 'local' ? __dirname.replace('dist', 'src') : __dirname;
        const path = folder + '/master-data.sql';
        let queries = SqlReader.readSqlFile(path);
        for (let query of queries)
            await queryRunner.query(query);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
