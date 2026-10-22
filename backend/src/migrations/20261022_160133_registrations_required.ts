import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   -- Entries saved while these fields were optional: fill blanks so NOT NULL applies.
  UPDATE "registrations" SET "occupation" = '' WHERE "occupation" IS NULL;
  UPDATE "registrations" SET "address" = '' WHERE "address" IS NULL;
  UPDATE "registrations" SET "email" = '' WHERE "email" IS NULL;
  ALTER TABLE "registrations" ALTER COLUMN "occupation" SET NOT NULL;
  ALTER TABLE "registrations" ALTER COLUMN "address" SET NOT NULL;
  ALTER TABLE "registrations" ALTER COLUMN "email" SET NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "registrations" ALTER COLUMN "occupation" DROP NOT NULL;
  ALTER TABLE "registrations" ALTER COLUMN "address" DROP NOT NULL;
  ALTER TABLE "registrations" ALTER COLUMN "email" DROP NOT NULL;`)
}
