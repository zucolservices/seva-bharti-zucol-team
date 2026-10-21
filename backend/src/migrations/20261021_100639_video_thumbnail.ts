import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" ADD COLUMN "featured_story_video_thumbnail_id" integer;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_featured_story_video_thumbnail_id_media_id_fk" FOREIGN KEY ("featured_story_video_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_featured_story_featured_story_video_thumbnail_idx" ON "home_page" USING btree ("featured_story_video_thumbnail_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" DROP CONSTRAINT "home_page_featured_story_video_thumbnail_id_media_id_fk";
  
  DROP INDEX "home_page_featured_story_featured_story_video_thumbnail_idx";
  ALTER TABLE "home_page" DROP COLUMN "featured_story_video_thumbnail_id";`)
}
