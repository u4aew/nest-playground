import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordResetTokenToUser1234567890123
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passwordResetToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "passwordResetToken"`,
    );
  }
}
