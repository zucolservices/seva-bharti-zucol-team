import * as migration_20261015_115858_initial from './20261015_115858_initial';
import * as migration_20261017_071359_featured_story from './20261017_071359_featured_story';
import * as migration_20261021_065312_portal_users from './20261021_065312_portal_users';
import * as migration_20261021_093909_page_content from './20261021_093909_page_content';
import * as migration_20261021_100220_sewa_geet_image from './20261021_100220_sewa_geet_image';
import * as migration_20261021_100639_video_thumbnail from './20261021_100639_video_thumbnail';
import * as migration_20261022_152920_registrations from './20261022_152920_registrations';
import * as migration_20261022_160133_registrations_required from './20261022_160133_registrations_required';

export const migrations = [
  {
    up: migration_20261015_115858_initial.up,
    down: migration_20261015_115858_initial.down,
    name: '20261015_115858_initial',
  },
  {
    up: migration_20261017_071359_featured_story.up,
    down: migration_20261017_071359_featured_story.down,
    name: '20261017_071359_featured_story',
  },
  {
    up: migration_20261021_065312_portal_users.up,
    down: migration_20261021_065312_portal_users.down,
    name: '20261021_065312_portal_users',
  },
  {
    up: migration_20261021_093909_page_content.up,
    down: migration_20261021_093909_page_content.down,
    name: '20261021_093909_page_content',
  },
  {
    up: migration_20261021_100220_sewa_geet_image.up,
    down: migration_20261021_100220_sewa_geet_image.down,
    name: '20261021_100220_sewa_geet_image',
  },
  {
    up: migration_20261021_100639_video_thumbnail.up,
    down: migration_20261021_100639_video_thumbnail.down,
    name: '20261021_100639_video_thumbnail',
  },
  {
    up: migration_20261022_152920_registrations.up,
    down: migration_20261022_152920_registrations.down,
    name: '20261022_152920_registrations',
  },
  {
    up: migration_20261022_160133_registrations_required.up,
    down: migration_20261022_160133_registrations_required.down,
    name: '20261022_160133_registrations_required'
  },
];
