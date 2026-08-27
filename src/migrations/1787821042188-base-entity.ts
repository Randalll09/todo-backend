import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseEntity1787821042188 implements MigrationInterface {
    name = 'BaseEntity1787821042188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "tags" character varying(255) array, "done" boolean NOT NULL DEFAULT false, "due_date" TIMESTAMP, "whenCreated" TIMESTAMP NOT NULL DEFAULT now(), "whenFinished" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refresh_token" character varying(255), "username" character varying(255) NOT NULL, "name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "todo"`);
    }

}
