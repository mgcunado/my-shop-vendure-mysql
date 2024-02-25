import {MigrationInterface, QueryRunner} from "typeorm";

export class stripe1708132582629 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `customer` ADD `customFieldsStripecustomerid` varchar(255) NULL", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `customer` DROP COLUMN `customFieldsStripecustomerid`", undefined);
   }

}
