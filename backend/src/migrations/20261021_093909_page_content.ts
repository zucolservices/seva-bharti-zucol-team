import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_content_objective_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "home_content_objective_structure_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "home_content_donate_ways" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "home_content_donate_contact_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "home_content_donate_bank" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "home_content_quotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"tagline" varchar,
  	"name" varchar,
  	"role" varchar,
  	"photo_id" integer
  );
  
  CREATE TABLE "home_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar,
  	"hero_intro" varchar,
  	"impact_lead" varchar,
  	"impact_text" varchar,
  	"pillars_heading_title" varchar,
  	"pillar_lines_shiksha" varchar,
  	"pillar_lines_swasthya" varchar,
  	"pillar_lines_swavalamban" varchar,
  	"pillar_lines_samajik" varchar,
  	"objective_heading" varchar,
  	"objective_structure_heading" varchar,
  	"objective_image_alt" varchar,
  	"vision_heading" varchar,
  	"vision_paragraph" varchar,
  	"vision_appeal" varchar,
  	"vision_image_alt" varchar,
  	"donate_heading" varchar,
  	"donate_ways_heading" varchar,
  	"donate_tax_note" varchar,
  	"donate_contact_heading" varchar,
  	"donate_bank_heading" varchar,
  	"donate_image_alt" varchar,
  	"donate_online_donation" varchar,
  	"quotes_labels_carousel" varchar,
  	"quotes_labels_dot" varchar,
  	"quotes_labels_pause" varchar,
  	"quotes_labels_play" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_content_vision_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "about_content_message_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "about_content_mission_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "about_content_structure_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "about_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_meta_title" varchar,
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"vision_heading" varchar,
  	"message_heading" varchar,
  	"message_byline" varchar,
  	"mission_heading" varchar,
  	"structure_heading" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "work_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"pillars_shiksha_tagline" varchar,
  	"pillars_shiksha_text" varchar,
  	"pillars_swasthya_tagline" varchar,
  	"pillars_swasthya_text" varchar,
  	"pillars_swavalamban_tagline" varchar,
  	"pillars_swavalamban_text" varchar,
  	"pillars_samajik_tagline" varchar,
  	"pillars_samajik_text" varchar,
  	"cta_label" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "csr_content_initiatives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "csr_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_subtitle" varchar,
  	"initiatives_heading" varchar,
  	"path_lab_title" varchar,
  	"path_lab_intro" varchar,
  	"path_lab_address_label" varchar,
  	"path_lab_address" varchar,
  	"path_lab_email_label" varchar,
  	"path_lab_email" varchar,
  	"path_lab_timing_label" varchar,
  	"path_lab_timing" varchar,
  	"cta_primary_label" varchar,
  	"cta_primary_href" varchar,
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "volunteer_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_subtitle" varchar,
  	"capacity_heading" varchar,
  	"capacity_text" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "gallery_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_subtitle" varchar,
  	"recent_heading" varchar,
  	"all_events_label" varchar,
  	"all_events_href" varchar,
  	"photo_alt" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"header_subtitle" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "partners_content_note_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "partners_content_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"emblem" boolean DEFAULT false
  );
  
  CREATE TABLE "partners_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"header_eyebrow" varchar,
  	"header_title" varchar,
  	"note_heading" varchar,
  	"grid_label" varchar,
  	"cta_heading" varchar,
  	"cta_text" varchar,
  	"cta_button" varchar,
  	"cta_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_content_compliance" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "footer_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"motto" varchar,
  	"copyright" varchar,
  	"headings_quick_links" varchar,
  	"headings_contact" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "home_content_objective_paragraphs" ADD CONSTRAINT "home_content_objective_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content_objective_structure_paragraphs" ADD CONSTRAINT "home_content_objective_structure_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content_donate_ways" ADD CONSTRAINT "home_content_donate_ways_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content_donate_contact_lines" ADD CONSTRAINT "home_content_donate_contact_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content_donate_bank" ADD CONSTRAINT "home_content_donate_bank_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_content_quotes" ADD CONSTRAINT "home_content_quotes_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_content_quotes" ADD CONSTRAINT "home_content_quotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_content_vision_paragraphs" ADD CONSTRAINT "about_content_vision_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_content_message_quote" ADD CONSTRAINT "about_content_message_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_content_mission_paragraphs" ADD CONSTRAINT "about_content_mission_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_content_structure_paragraphs" ADD CONSTRAINT "about_content_structure_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "csr_content_initiatives" ADD CONSTRAINT "csr_content_initiatives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."csr_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_content_note_paragraphs" ADD CONSTRAINT "partners_content_note_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_content_partners" ADD CONSTRAINT "partners_content_partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_content_partners" ADD CONSTRAINT "partners_content_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_content_compliance" ADD CONSTRAINT "footer_content_compliance_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_content"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_content_objective_paragraphs_order_idx" ON "home_content_objective_paragraphs" USING btree ("_order");
  CREATE INDEX "home_content_objective_paragraphs_parent_id_idx" ON "home_content_objective_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "home_content_objective_structure_paragraphs_order_idx" ON "home_content_objective_structure_paragraphs" USING btree ("_order");
  CREATE INDEX "home_content_objective_structure_paragraphs_parent_id_idx" ON "home_content_objective_structure_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "home_content_donate_ways_order_idx" ON "home_content_donate_ways" USING btree ("_order");
  CREATE INDEX "home_content_donate_ways_parent_id_idx" ON "home_content_donate_ways" USING btree ("_parent_id");
  CREATE INDEX "home_content_donate_contact_lines_order_idx" ON "home_content_donate_contact_lines" USING btree ("_order");
  CREATE INDEX "home_content_donate_contact_lines_parent_id_idx" ON "home_content_donate_contact_lines" USING btree ("_parent_id");
  CREATE INDEX "home_content_donate_bank_order_idx" ON "home_content_donate_bank" USING btree ("_order");
  CREATE INDEX "home_content_donate_bank_parent_id_idx" ON "home_content_donate_bank" USING btree ("_parent_id");
  CREATE INDEX "home_content_quotes_order_idx" ON "home_content_quotes" USING btree ("_order");
  CREATE INDEX "home_content_quotes_parent_id_idx" ON "home_content_quotes" USING btree ("_parent_id");
  CREATE INDEX "home_content_quotes_photo_idx" ON "home_content_quotes" USING btree ("photo_id");
  CREATE INDEX "about_content_vision_paragraphs_order_idx" ON "about_content_vision_paragraphs" USING btree ("_order");
  CREATE INDEX "about_content_vision_paragraphs_parent_id_idx" ON "about_content_vision_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_content_message_quote_order_idx" ON "about_content_message_quote" USING btree ("_order");
  CREATE INDEX "about_content_message_quote_parent_id_idx" ON "about_content_message_quote" USING btree ("_parent_id");
  CREATE INDEX "about_content_mission_paragraphs_order_idx" ON "about_content_mission_paragraphs" USING btree ("_order");
  CREATE INDEX "about_content_mission_paragraphs_parent_id_idx" ON "about_content_mission_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_content_structure_paragraphs_order_idx" ON "about_content_structure_paragraphs" USING btree ("_order");
  CREATE INDEX "about_content_structure_paragraphs_parent_id_idx" ON "about_content_structure_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "csr_content_initiatives_order_idx" ON "csr_content_initiatives" USING btree ("_order");
  CREATE INDEX "csr_content_initiatives_parent_id_idx" ON "csr_content_initiatives" USING btree ("_parent_id");
  CREATE INDEX "partners_content_note_paragraphs_order_idx" ON "partners_content_note_paragraphs" USING btree ("_order");
  CREATE INDEX "partners_content_note_paragraphs_parent_id_idx" ON "partners_content_note_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "partners_content_partners_order_idx" ON "partners_content_partners" USING btree ("_order");
  CREATE INDEX "partners_content_partners_parent_id_idx" ON "partners_content_partners" USING btree ("_parent_id");
  CREATE INDEX "partners_content_partners_logo_idx" ON "partners_content_partners" USING btree ("logo_id");
  CREATE INDEX "footer_content_compliance_order_idx" ON "footer_content_compliance" USING btree ("_order");
  CREATE INDEX "footer_content_compliance_parent_id_idx" ON "footer_content_compliance" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_content_objective_paragraphs" CASCADE;
  DROP TABLE "home_content_objective_structure_paragraphs" CASCADE;
  DROP TABLE "home_content_donate_ways" CASCADE;
  DROP TABLE "home_content_donate_contact_lines" CASCADE;
  DROP TABLE "home_content_donate_bank" CASCADE;
  DROP TABLE "home_content_quotes" CASCADE;
  DROP TABLE "home_content" CASCADE;
  DROP TABLE "about_content_vision_paragraphs" CASCADE;
  DROP TABLE "about_content_message_quote" CASCADE;
  DROP TABLE "about_content_mission_paragraphs" CASCADE;
  DROP TABLE "about_content_structure_paragraphs" CASCADE;
  DROP TABLE "about_content" CASCADE;
  DROP TABLE "work_content" CASCADE;
  DROP TABLE "csr_content_initiatives" CASCADE;
  DROP TABLE "csr_content" CASCADE;
  DROP TABLE "volunteer_content" CASCADE;
  DROP TABLE "gallery_content" CASCADE;
  DROP TABLE "contact_content" CASCADE;
  DROP TABLE "partners_content_note_paragraphs" CASCADE;
  DROP TABLE "partners_content_partners" CASCADE;
  DROP TABLE "partners_content" CASCADE;
  DROP TABLE "footer_content_compliance" CASCADE;
  DROP TABLE "footer_content" CASCADE;`)
}
