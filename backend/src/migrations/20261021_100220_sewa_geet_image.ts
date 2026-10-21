import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_content" ADD COLUMN "objective_image_id" integer;
  ALTER TABLE "home_content" ADD CONSTRAINT "home_content_objective_image_id_media_id_fk" FOREIGN KEY ("objective_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_content_objective_objective_image_idx" ON "home_content" USING btree ("objective_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_content" DROP CONSTRAINT "home_content_objective_image_id_media_id_fk";
  
  DROP INDEX "home_content_objective_objective_image_idx";
  ALTER TABLE "home_content" DROP COLUMN "objective_image_id";`)
}
