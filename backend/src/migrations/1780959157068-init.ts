import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1780959157068 implements MigrationInterface {
    name = 'Init1780959157068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_transactiontype_enum" AS ENUM('sale', 'expense')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_source_enum" AS ENUM('voice', 'manual', 'order')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemName" character varying NOT NULL, "quantity" numeric NOT NULL, "unitPrice" numeric NOT NULL, "totalAmount" numeric NOT NULL, "transactionType" "public"."transactions_transactiontype_enum" NOT NULL DEFAULT 'sale', "source" "public"."transactions_source_enum" NOT NULL DEFAULT 'voice', "languageUsed" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "traderId" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemName" character varying NOT NULL, "quantityAvailable" numeric NOT NULL, "restockThreshold" numeric NOT NULL DEFAULT '0', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "traderId" uuid, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."customer_orders_status_enum" AS ENUM('pending', 'paid', 'fulfilled')`);
        await queryRunner.query(`CREATE TABLE "customer_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerPhone" character varying NOT NULL, "items" json NOT NULL, "totalAmount" numeric NOT NULL, "paymentLink" character varying, "paymentReference" character varying, "status" "public"."customer_orders_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "traderId" uuid, CONSTRAINT "PK_ce425b6edb31cce9a80b269298e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."traders_language_enum" AS ENUM('pidgin', 'english', 'hausa', 'yoruba', 'igbo')`);
        await queryRunner.query(`CREATE TABLE "traders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "fullName" character varying NOT NULL, "language" "public"."traders_language_enum" NOT NULL DEFAULT 'english', "businessName" character varying, "opayMerchantId" character varying, "dashboardToken" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a0e4313c4fc722de12c09e9adb6" UNIQUE ("phoneNumber"), CONSTRAINT "UQ_884bdd47922095c6f44701206d4" UNIQUE ("dashboardToken"), CONSTRAINT "PK_71d374023188af2deb9d91b25c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."adashi_groups_frequency_enum" AS ENUM('weekly', 'monthly')`);
        await queryRunner.query(`CREATE TYPE "public"."adashi_groups_type_enum" AS ENUM('rotating', 'goal_based')`);
        await queryRunner.query(`CREATE TABLE "adashi_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "groupName" character varying NOT NULL, "contributionAmount" numeric NOT NULL, "frequency" "public"."adashi_groups_frequency_enum" NOT NULL, "type" "public"."adashi_groups_type_enum" NOT NULL DEFAULT 'rotating', "goalAmount" numeric, "currentRound" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_4faa371ba5f8a1484b3cc228091" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."adashi_contributions_status_enum" AS ENUM('pending', 'paid')`);
        await queryRunner.query(`CREATE TABLE "adashi_contributions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric NOT NULL, "cycleNumber" integer NOT NULL, "paymentReference" character varying, "status" "public"."adashi_contributions_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "groupId" uuid, "traderId" uuid, CONSTRAINT "PK_56988ce982c90f2230ee31f7f66" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "adashi_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "payoutReceived" boolean NOT NULL DEFAULT false, "groupId" uuid, "traderId" uuid, CONSTRAINT "PK_d742dabc76a093c298000fe529a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ai_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "originalMessage" text NOT NULL, "extractedData" json NOT NULL, "intent" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "traderId" uuid, CONSTRAINT "PK_ac5fbcd483f233f6d9a4cf0b49c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_bc547b747294ddf3a498562e46f" FOREIGN KEY ("traderId") REFERENCES "traders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_9c4547539cf4d424e330d638136" FOREIGN KEY ("traderId") REFERENCES "traders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_orders" ADD CONSTRAINT "FK_7a84aa2e7041311facf1c170b69" FOREIGN KEY ("traderId") REFERENCES "traders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adashi_groups" ADD CONSTRAINT "FK_0bf5319da09ff070fdf95ace1a2" FOREIGN KEY ("ownerId") REFERENCES "traders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adashi_contributions" ADD CONSTRAINT "FK_2abfbcdd0349f34c37d52b8988e" FOREIGN KEY ("groupId") REFERENCES "adashi_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adashi_contributions" ADD CONSTRAINT "FK_b06cbbe2d0c5c6faacb1495bc26" FOREIGN KEY ("traderId") REFERENCES "traders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adashi_members" ADD CONSTRAINT "FK_b6609d5b692f179f26da8db6226" FOREIGN KEY ("groupId") REFERENCES "adashi_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adashi_members" ADD CONSTRAINT "FK_dcc0037693cf5ac206aa7be4298" FOREIGN KEY ("traderId") REFERENCES "traders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ai_logs" ADD CONSTRAINT "FK_0c068f4058bab40b21a0f77327d" FOREIGN KEY ("traderId") REFERENCES "traders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai_logs" DROP CONSTRAINT "FK_0c068f4058bab40b21a0f77327d"`);
        await queryRunner.query(`ALTER TABLE "adashi_members" DROP CONSTRAINT "FK_dcc0037693cf5ac206aa7be4298"`);
        await queryRunner.query(`ALTER TABLE "adashi_members" DROP CONSTRAINT "FK_b6609d5b692f179f26da8db6226"`);
        await queryRunner.query(`ALTER TABLE "adashi_contributions" DROP CONSTRAINT "FK_b06cbbe2d0c5c6faacb1495bc26"`);
        await queryRunner.query(`ALTER TABLE "adashi_contributions" DROP CONSTRAINT "FK_2abfbcdd0349f34c37d52b8988e"`);
        await queryRunner.query(`ALTER TABLE "adashi_groups" DROP CONSTRAINT "FK_0bf5319da09ff070fdf95ace1a2"`);
        await queryRunner.query(`ALTER TABLE "customer_orders" DROP CONSTRAINT "FK_7a84aa2e7041311facf1c170b69"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_9c4547539cf4d424e330d638136"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_bc547b747294ddf3a498562e46f"`);
        await queryRunner.query(`DROP TABLE "ai_logs"`);
        await queryRunner.query(`DROP TABLE "adashi_members"`);
        await queryRunner.query(`DROP TABLE "adashi_contributions"`);
        await queryRunner.query(`DROP TYPE "public"."adashi_contributions_status_enum"`);
        await queryRunner.query(`DROP TABLE "adashi_groups"`);
        await queryRunner.query(`DROP TYPE "public"."adashi_groups_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."adashi_groups_frequency_enum"`);
        await queryRunner.query(`DROP TABLE "traders"`);
        await queryRunner.query(`DROP TYPE "public"."traders_language_enum"`);
        await queryRunner.query(`DROP TABLE "customer_orders"`);
        await queryRunner.query(`DROP TYPE "public"."customer_orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_source_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_transactiontype_enum"`);
    }

}
