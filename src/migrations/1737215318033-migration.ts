import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737215318033 implements MigrationInterface {
  name = 'Migration1737215318033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "client" ADD CONSTRAINT "UQ_9921dca81551c93e5a459ef03ce" UNIQUE ("cpf")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "UQ_9921dca81551c93e5a459ef03ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`,
    );
  }
}
