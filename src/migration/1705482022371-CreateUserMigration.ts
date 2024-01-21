import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserFields1705482022371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Добавляем столбец без ограничения NOT NULL
    await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying`);

    // Устанавливаем значение по умолчанию для существующих записей
    // Замените 'Default Name' на желаемое значение по умолчанию
    await queryRunner.query(
      `UPDATE "user" SET "name" = 'Default Name' WHERE "name" IS NULL`,
    );

    // Применяем ограничение NOT NULL
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL`,
    );

    // Для остальных столбцов
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isEmailConfirmed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "emailConfirmationToken" character varying`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "emailConfirmationToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "isEmailConfirmed"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
  }
}
