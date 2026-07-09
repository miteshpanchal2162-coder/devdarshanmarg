-- CreateEnum
CREATE TYPE "Language" AS ENUM ('gu', 'hi', 'en');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserEntityType" AS ENUM ('TEMPLE', 'FESTIVAL', 'DEITY', 'CONTENT');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video', 'document');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "continents" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "official_name" VARCHAR(200),
    "slug" VARCHAR(255) NOT NULL,
    "code" VARCHAR(10),
    "description" TEXT,
    "icon" VARCHAR(255),
    "image" VARCHAR(500),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "continents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "official_name" VARCHAR(200),
    "display_name" VARCHAR(200),
    "slug" VARCHAR(255) NOT NULL,
    "iso2" CHAR(2) NOT NULL,
    "iso3" CHAR(3) NOT NULL,
    "phone_code" VARCHAR(10),
    "currency_code" VARCHAR(10),
    "currency_name" VARCHAR(50),
    "currency_symbol" VARCHAR(10),
    "capital" VARCHAR(120),
    "continent_id" UUID,
    "timezone" VARCHAR(120),
    "flag_image" TEXT,
    "emoji_flag" VARCHAR(20),
    "tld" VARCHAR(20),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "population" BIGINT,
    "area_sq_km" DECIMAL(12,2),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "states" (
    "id" UUID NOT NULL,
    "country_id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "official_name" VARCHAR(200),
    "slug" VARCHAR(255) NOT NULL,
    "code" VARCHAR(20),
    "capital" VARCHAR(120),
    "gst_code" VARCHAR(10),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "population" BIGINT,
    "area_sq_km" DECIMAL(12,2),
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "country_id" UUID NOT NULL,
    "state_id" UUID NOT NULL,
    "name" VARCHAR(150),
    "official_name" VARCHAR(200),
    "slug" VARCHAR(255) NOT NULL,
    "city_type" VARCHAR(50),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "elevation" DECIMAL(8,2),
    "timezone" VARCHAR(120),
    "population" BIGINT,
    "is_capital" BOOLEAN NOT NULL DEFAULT false,
    "is_metro" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" UUID NOT NULL,
    "country_id" UUID NOT NULL,
    "state_id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "name" VARCHAR(150),
    "slug" VARCHAR(255) NOT NULL,
    "area_type" VARCHAR(50),
    "address_line1" VARCHAR(255),
    "address_line2" VARCHAR(255),
    "postal_code" VARCHAR(20),
    "landmark" VARCHAR(255),
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100),
    "native_name" VARCHAR(100),
    "iso_code" VARCHAR(10),
    "locale" VARCHAR(20),
    "direction" VARCHAR(10),
    "font_family" VARCHAR(100),
    "flag_image" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_rtl" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_types" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "display_name" VARCHAR(200),
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "image" VARCHAR(500),
    "color" VARCHAR(20),
    "alternate_names" TEXT,
    "search_keywords" TEXT,
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deities" (
    "id" UUID NOT NULL,
    "deity_type_id" UUID NOT NULL,
    "name" VARCHAR(150),
    "display_name" VARCHAR(200),
    "slug" VARCHAR(255) NOT NULL,
    "short_name" VARCHAR(100),
    "description" TEXT,
    "icon" VARCHAR(255),
    "image" VARCHAR(500),
    "primary_mantra" TEXT,
    "symbol" VARCHAR(255),
    "vehicle" VARCHAR(150),
    "weapon" VARCHAR(150),
    "consort" VARCHAR(150),
    "alternate_names" TEXT,
    "search_keywords" TEXT,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_translations" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "language" "Language" NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "meta_title" VARCHAR(200),
    "meta_description" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deity_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150),
    "display_name" VARCHAR(200),
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "image" VARCHAR(500),
    "alternate_names" TEXT,
    "search_keywords" TEXT,
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_category_map" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deity_category_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150),
    "display_name" VARCHAR(200),
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "image" VARCHAR(500),
    "alternate_names" TEXT,
    "search_keywords" TEXT,
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_types" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100),
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "mime_type" VARCHAR(150),
    "allowed_extensions" TEXT,
    "max_file_size" BIGINT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "media_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_statuses" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100),
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "color" VARCHAR(20),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "content_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temples" (
    "id" UUID NOT NULL,
    "country_id" UUID NOT NULL,
    "state_id" UUID NOT NULL,
    "city_id" UUID NOT NULL,
    "area_id" UUID NOT NULL,
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "canonical_name" VARCHAR(255),
    "slug" VARCHAR(255) NOT NULL,
    "short_name" VARCHAR(120),
    "short_description" TEXT,
    "description" TEXT,
    "history" TEXT,
    "significance" TEXT,
    "architecture" TEXT,
    "alternate_names" TEXT,
    "famous_for" TEXT,
    "temple_code" VARCHAR(50),
    "founded_year" INTEGER,
    "established_date" DATE,
    "last_renovated_date" DATE,
    "opening_year" INTEGER,
    "closing_remarks" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "google_map_url" TEXT,
    "virtual_tour_url" TEXT,
    "youtube_video_url" TEXT,
    "official_website" TEXT,
    "instagram_url" VARCHAR(255),
    "facebook_url" VARCHAR(255),
    "twitter_url" VARCHAR(255),
    "phone" VARCHAR(30),
    "email" VARCHAR(150),
    "address_line1" VARCHAR(255),
    "address_line2" VARCHAR(255),
    "postal_code" VARCHAR(20),
    "landmark" VARCHAR(255),
    "dress_code" TEXT,
    "best_time_to_visit" TEXT,
    "estimated_visit_time" INTEGER,
    "entry_fee" DECIMAL(10,2),
    "parking_available" BOOLEAN NOT NULL DEFAULT false,
    "wheelchair_accessible" BOOLEAN NOT NULL DEFAULT false,
    "photography_allowed" BOOLEAN NOT NULL DEFAULT false,
    "mobile_allowed" BOOLEAN NOT NULL DEFAULT true,
    "prasadam_available" BOOLEAN NOT NULL DEFAULT false,
    "accommodation_available" BOOLEAN NOT NULL DEFAULT false,
    "locker_available" BOOLEAN NOT NULL DEFAULT false,
    "shoe_stand_available" BOOLEAN NOT NULL DEFAULT false,
    "drinking_water_available" BOOLEAN NOT NULL DEFAULT false,
    "toilet_available" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "popular" BOOLEAN NOT NULL DEFAULT false,
    "view_count" BIGINT NOT NULL DEFAULT 0,
    "favorite_count" BIGINT NOT NULL DEFAULT 0,
    "share_count" BIGINT NOT NULL DEFAULT 0,
    "rating_average" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "rating_count" BIGINT NOT NULL DEFAULT 0,
    "search_keywords" TEXT,
    "search_priority" INTEGER NOT NULL DEFAULT 0,
    "is_searchable" BOOLEAN NOT NULL DEFAULT true,
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "meta_keywords" TEXT,
    "og_image" VARCHAR(500),
    "schema_generated" BOOLEAN NOT NULL DEFAULT false,
    "canonical_url" TEXT,
    "published_at" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_deity_map" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temple_deity_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_category_map" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temple_category_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_timings" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "day_of_week" SMALLINT NOT NULL,
    "opening_time" TIME(0),
    "closing_time" TIME(0),
    "break_start_time" TIME(0),
    "break_end_time" TIME(0),
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "is_festival_timing" BOOLEAN NOT NULL DEFAULT false,
    "effective_from" DATE,
    "effective_to" DATE,
    "special_note" TEXT,
    "remarks" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_timings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_aartis" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "language_id" UUID,
    "name" VARCHAR(150),
    "display_name" VARCHAR(200),
    "description" TEXT,
    "aarti_time" TIME(0),
    "aarti_order" INTEGER NOT NULL DEFAULT 0,
    "duration_minutes" INTEGER,
    "is_daily" BOOLEAN NOT NULL DEFAULT true,
    "requires_ticket" BOOLEAN NOT NULL DEFAULT false,
    "ticket_price" DECIMAL(10,2),
    "max_persons" INTEGER,
    "booking_required" BOOLEAN NOT NULL DEFAULT false,
    "prasad_included" BOOLEAN NOT NULL DEFAULT false,
    "live_streaming_available" BOOLEAN NOT NULL DEFAULT false,
    "search_keywords" TEXT,
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_aartis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_poojas" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "language_id" UUID,
    "name" VARCHAR(150),
    "display_name" VARCHAR(200),
    "pooja_code" VARCHAR(50),
    "description" TEXT,
    "duration_minutes" INTEGER,
    "price" DECIMAL(10,2),
    "advance_booking" BOOLEAN NOT NULL DEFAULT false,
    "online_booking" BOOLEAN NOT NULL DEFAULT false,
    "available_daily" BOOLEAN NOT NULL DEFAULT true,
    "prasad_included" BOOLEAN NOT NULL DEFAULT false,
    "refund_allowed" BOOLEAN NOT NULL DEFAULT false,
    "max_bookings_per_day" INTEGER,
    "search_keywords" TEXT,
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_poojas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_darshan_types" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "name" VARCHAR(150),
    "darshan_code" VARCHAR(50),
    "description" TEXT,
    "recommended_for" VARCHAR(255),
    "is_free" BOOLEAN NOT NULL DEFAULT true,
    "ticket_price" DECIMAL(10,2),
    "estimated_waiting_minutes" INTEGER,
    "vip" BOOLEAN NOT NULL DEFAULT false,
    "online_booking" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_darshan_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_special_events" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "title" VARCHAR(200),
    "event_code" VARCHAR(50),
    "description" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "start_time" TIME(0),
    "end_time" TIME(0),
    "is_annual" BOOLEAN NOT NULL DEFAULT true,
    "festival_id" UUID,
    "banner_image" VARCHAR(500),
    "registration_required" BOOLEAN NOT NULL DEFAULT false,
    "registration_url" TEXT,
    "search_keywords" TEXT,
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_special_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_facilities" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "facility_code" VARCHAR(50),
    "name" VARCHAR(150),
    "display_name" VARCHAR(200),
    "category" VARCHAR(100),
    "description" TEXT,
    "icon" VARCHAR(255),
    "image" VARCHAR(500),
    "available" BOOLEAN NOT NULL DEFAULT true,
    "available_24_hours" BOOLEAN NOT NULL DEFAULT false,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(10,2),
    "opening_time" TIME(0),
    "closing_time" TIME(0),
    "remarks" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_rules" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "rule_code" VARCHAR(50),
    "title" VARCHAR(200),
    "description" TEXT,
    "rule_type" VARCHAR(100),
    "icon" VARCHAR(255),
    "applicable_for" VARCHAR(100),
    "importance" SMALLINT NOT NULL DEFAULT 1,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_contacts" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "contact_code" VARCHAR(50),
    "contact_type" VARCHAR(100),
    "person_name" VARCHAR(150),
    "designation" VARCHAR(150),
    "phone" VARCHAR(30),
    "alternate_phone" VARCHAR(30),
    "whatsapp" VARCHAR(30),
    "email" VARCHAR(150),
    "website" TEXT,
    "department" VARCHAR(150),
    "available_from" TIME(0),
    "available_to" TIME(0),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_faqs" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "language_id" UUID,
    "faq_code" VARCHAR(50),
    "category" VARCHAR(100),
    "question" TEXT,
    "answer" TEXT,
    "search_keywords" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_accessibility" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "accessibility_code" VARCHAR(50),
    "feature" VARCHAR(150),
    "icon" VARCHAR(255),
    "available" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_accessibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_dress_codes" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "dress_code" VARCHAR(50),
    "gender" VARCHAR(20),
    "title" VARCHAR(150),
    "description" TEXT,
    "image" VARCHAR(500),
    "applicable_age_group" VARCHAR(100),
    "mandatory" BOOLEAN NOT NULL DEFAULT false,
    "festival_only" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_dress_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_routes" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "route_code" VARCHAR(50),
    "route_name" VARCHAR(200),
    "route_type" VARCHAR(100),
    "starting_point" VARCHAR(255),
    "destination" VARCHAR(255),
    "distance_km" DECIMAL(8,2),
    "estimated_time_minutes" INTEGER,
    "transport_mode" VARCHAR(100),
    "difficulty_level" VARCHAR(50),
    "best_season" VARCHAR(100),
    "road_condition" VARCHAR(100),
    "google_map_url" TEXT,
    "description" TEXT,
    "is_recommended" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_nearby_places" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "place_code" VARCHAR(50),
    "name" VARCHAR(200),
    "place_type" VARCHAR(100),
    "distance_km" DECIMAL(8,2),
    "travel_time_minutes" INTEGER,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "google_map_url" TEXT,
    "description" TEXT,
    "image" VARCHAR(500),
    "website" TEXT,
    "phone" VARCHAR(30),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_nearby_places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_parking" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "parking_code" VARCHAR(50),
    "parking_type" VARCHAR(100),
    "capacity" INTEGER,
    "free_parking" BOOLEAN NOT NULL DEFAULT true,
    "price" DECIMAL(10,2),
    "covered_parking" BOOLEAN NOT NULL DEFAULT false,
    "ev_charging" BOOLEAN NOT NULL DEFAULT false,
    "security_available" BOOLEAN NOT NULL DEFAULT false,
    "cctv_available" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "distance_from_temple" DECIMAL(8,2),
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_parking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_accommodations" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "accommodation_code" VARCHAR(50),
    "name" VARCHAR(200),
    "accommodation_type" VARCHAR(100),
    "managed_by_temple" BOOLEAN NOT NULL DEFAULT false,
    "phone" VARCHAR(30),
    "email" VARCHAR(150),
    "website" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "price_from" DECIMAL(10,2),
    "price_to" DECIMAL(10,2),
    "rating" DECIMAL(3,2),
    "check_in_time" TIME(0),
    "check_out_time" TIME(0),
    "booking_required" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_prasadam" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "prasadam_code" VARCHAR(50),
    "name" VARCHAR(200),
    "description" TEXT,
    "available_daily" BOOLEAN NOT NULL DEFAULT true,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "price" DECIMAL(10,2),
    "booking_required" BOOLEAN NOT NULL DEFAULT false,
    "distribution_time" TIME(0),
    "ingredients" TEXT,
    "shelf_life" VARCHAR(100),
    "image" VARCHAR(500),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_prasadam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_media" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "media_type_id" UUID NOT NULL,
    "language_id" UUID,
    "title" VARCHAR(255),
    "caption" TEXT,
    "alt_text" VARCHAR(255),
    "file_url" TEXT,
    "thumbnail_url" TEXT,
    "youtube_url" TEXT,
    "photographer" VARCHAR(150),
    "copyright" TEXT,
    "is_hero" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "taken_at" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_documents" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "language_id" UUID,
    "document_code" VARCHAR(50),
    "title" VARCHAR(255),
    "document_type" VARCHAR(100),
    "file_url" TEXT,
    "file_size" BIGINT,
    "description" TEXT,
    "version" VARCHAR(20),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_sources" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "language_id" UUID,
    "source_code" VARCHAR(50),
    "title" VARCHAR(255),
    "source_type" VARCHAR(100),
    "author" VARCHAR(200),
    "publisher" VARCHAR(200),
    "publication_year" INTEGER,
    "url" TEXT,
    "isbn" VARCHAR(50),
    "citation" TEXT,
    "description" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_live_darshan" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "title" VARCHAR(200),
    "provider" VARCHAR(100),
    "stream_url" TEXT,
    "embed_url" TEXT,
    "thumbnail_url" TEXT,
    "is_live" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_live_darshan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_donations" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "donation_type" VARCHAR(100),
    "title" VARCHAR(200),
    "description" TEXT,
    "minimum_amount" DECIMAL(10,2),
    "maximum_amount" DECIMAL(10,2),
    "currency" VARCHAR(10),
    "payment_url" TEXT,
    "upi_id" VARCHAR(150),
    "qr_image" VARCHAR(500),
    "receipt_available" BOOLEAN NOT NULL DEFAULT true,
    "tax_benefit" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_external_links" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "title" VARCHAR(200),
    "link_type" VARCHAR(100),
    "url" TEXT,
    "icon" VARCHAR(255),
    "is_official" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_external_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_qr_codes" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "title" VARCHAR(200),
    "qr_type" VARCHAR(100),
    "qr_image" VARCHAR(500),
    "target_url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "temple_qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_statistics" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "total_views" BIGINT NOT NULL DEFAULT 0,
    "total_favorites" BIGINT NOT NULL DEFAULT 0,
    "total_shares" BIGINT NOT NULL DEFAULT 0,
    "average_rating" DECIMAL(3,2),
    "rating_count" BIGINT NOT NULL DEFAULT 0,
    "last_calculated_at" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temple_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_change_history" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(100),
    "field_name" VARCHAR(150),
    "old_value" TEXT,
    "new_value" TEXT,
    "ip_address" VARCHAR(100),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temple_change_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_translations" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "language" "Language" NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "short_description" TEXT,
    "description" TEXT,
    "history" TEXT,
    "significance" TEXT,
    "address" TEXT,
    "meta_title" VARCHAR(200),
    "meta_description" VARCHAR(500),
    "meta_keywords" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temple_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temple_pilgrim_tips" (
    "id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "tip" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'hi',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temple_pilgrim_tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_library" (
    "id" UUID NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "media_type" "MediaType" NOT NULL,
    "storage_path" VARCHAR(500) NOT NULL,
    "storage_type" VARCHAR(20) NOT NULL DEFAULT 'local',
    "file_size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "alt_text" VARCHAR(300),
    "uploaded_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festivals" (
    "id" UUID NOT NULL,
    "festival_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "slug" VARCHAR(255) NOT NULL,
    "short_description" TEXT,
    "description" TEXT,
    "alternate_names" TEXT,
    "search_keywords" TEXT,
    "festival_type" VARCHAR(100),
    "importance_level" SMALLINT NOT NULL DEFAULT 1,
    "is_national" BOOLEAN NOT NULL DEFAULT false,
    "is_regional" BOOLEAN NOT NULL DEFAULT false,
    "is_international" BOOLEAN NOT NULL DEFAULT false,
    "is_public_holiday" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "hero_image" VARCHAR(500),
    "banner_image" VARCHAR(500),
    "icon" VARCHAR(255),
    "color" VARCHAR(20),
    "meta_title" VARCHAR(255),
    "meta_description" TEXT,
    "canonical_url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festivals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_statistics" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "total_views" BIGINT NOT NULL DEFAULT 0,
    "total_favorites" BIGINT NOT NULL DEFAULT 0,
    "total_shares" BIGINT NOT NULL DEFAULT 0,
    "average_rating" DECIMAL(3,2),
    "rating_count" BIGINT NOT NULL DEFAULT 0,
    "last_calculated_at" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "festival_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150),
    "display_name" VARCHAR(200),
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "image" VARCHAR(500),
    "alternate_names" TEXT,
    "search_keywords" TEXT,
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_category_map" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "festival_category_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_dates" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "tithi" VARCHAR(150),
    "paksha" VARCHAR(100),
    "masa" VARCHAR(100),
    "calendar_type" VARCHAR(100),
    "calculation_method" VARCHAR(100),
    "is_estimated" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_regions" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "country_id" UUID,
    "state_id" UUID,
    "city_id" UUID,
    "importance" VARCHAR(100),
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_deity_map" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "primary_deity" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "festival_deity_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_temple_map" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "temple_id" UUID NOT NULL,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "festival_temple_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_rituals" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "ritual_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "ritual_type" VARCHAR(100),
    "description" TEXT,
    "instructions" TEXT,
    "duration_minutes" INTEGER,
    "icon" VARCHAR(255),
    "image" VARCHAR(500),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_rituals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_puja_vidhis" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "vidhi_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "description" TEXT,
    "instructions" TEXT,
    "step_order" INTEGER NOT NULL DEFAULT 0,
    "duration_minutes" INTEGER,
    "icon" VARCHAR(255),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_puja_vidhis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_samagri" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "samagri_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "description" TEXT,
    "quantity" VARCHAR(100),
    "unit" VARCHAR(50),
    "is_essential" BOOLEAN NOT NULL DEFAULT false,
    "icon" VARCHAR(255),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_samagri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_fasting_rules" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "rule_code" VARCHAR(50),
    "title" VARCHAR(200),
    "description" TEXT,
    "fast_type" VARCHAR(100),
    "applicable_for" VARCHAR(100),
    "start_time" TIME(0),
    "end_time" TIME(0),
    "strictness" VARCHAR(100),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_fasting_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_foods" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "food_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "description" TEXT,
    "food_type" VARCHAR(100),
    "is_vegetarian" BOOLEAN NOT NULL DEFAULT true,
    "recipe" TEXT,
    "image" VARCHAR(500),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_kathas" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "language_id" UUID,
    "katha_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "description" TEXT,
    "content" TEXT,
    "narrator" VARCHAR(150),
    "duration_minutes" INTEGER,
    "audio_url" TEXT,
    "video_url" TEXT,
    "image" VARCHAR(500),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_kathas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_mantras" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "language_id" UUID,
    "mantra_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "mantra" TEXT,
    "meaning" TEXT,
    "recitation_count" INTEGER,
    "audio_url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_mantras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_aartis" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "language_id" UUID,
    "aarti_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "lyrics" TEXT,
    "aarti_time" TIME(0),
    "duration_minutes" INTEGER,
    "audio_url" TEXT,
    "video_url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_aartis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_bhajans" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "language_id" UUID,
    "bhajan_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "lyrics" TEXT,
    "composer" VARCHAR(150),
    "raga" VARCHAR(100),
    "audio_url" TEXT,
    "video_url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_bhajans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_galleries" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "media_type_id" UUID NOT NULL,
    "language_id" UUID,
    "gallery_code" VARCHAR(50),
    "title" VARCHAR(255),
    "caption" TEXT,
    "alt_text" VARCHAR(255),
    "file_url" TEXT,
    "thumbnail_url" TEXT,
    "photographer" VARCHAR(150),
    "is_hero" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "taken_at" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_videos" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "media_type_id" UUID NOT NULL,
    "language_id" UUID,
    "video_code" VARCHAR(50),
    "title" VARCHAR(255),
    "description" TEXT,
    "video_url" TEXT,
    "youtube_url" TEXT,
    "thumbnail_url" TEXT,
    "duration_seconds" INTEGER,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "festival_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "festival_translations" (
    "id" UUID NOT NULL,
    "festival_id" UUID NOT NULL,
    "language" "Language" NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "meta_title" VARCHAR(200),
    "meta_description" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "festival_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_redirects" (
    "id" UUID NOT NULL,
    "from_path" VARCHAR(500) NOT NULL,
    "to_path" VARCHAR(500) NOT NULL,
    "status_code" INTEGER NOT NULL DEFAULT 301,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_redirects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_landing_pages" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'en',
    "title" VARCHAR(300) NOT NULL,
    "meta_title" VARCHAR(200),
    "meta_description" VARCHAR(500),
    "content" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_landing_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "mobile" VARCHAR(20) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "mobile_verified" BOOLEAN NOT NULL DEFAULT false,
    "profile_image" VARCHAR(500),
    "last_login_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "device_name" VARCHAR(150),
    "device_type" VARCHAR(50),
    "browser" VARCHAR(100),
    "os" VARCHAR(100),
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "login_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logout_time" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" UUID NOT NULL,
    "mobile" VARCHAR(20),
    "email" VARCHAR(255),
    "otp" VARCHAR(255) NOT NULL,
    "purpose" VARCHAR(50) NOT NULL,
    "expire_time" TIMESTAMP(3) NOT NULL,
    "verified_time" TIMESTAMP(3),
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token" VARCHAR(500) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "device_info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100) NOT NULL,
    "entity_id" UUID,
    "details" JSONB,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_types" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contents" (
    "id" UUID NOT NULL,
    "content_type_id" UUID NOT NULL,
    "slug" VARCHAR(200) NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_translations" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "language" "Language" NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "body" TEXT NOT NULL,
    "meta_title" VARCHAR(200),
    "meta_description" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "gender" VARCHAR(20),
    "date_of_birth" DATE,
    "country_id" UUID,
    "state_id" UUID,
    "city_id" UUID,
    "area_id" UUID,
    "address" TEXT,
    "postal_code" VARCHAR(20),
    "avatar" VARCHAR(500),
    "bio" TEXT,
    "language_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "entity_type" "UserEntityType" NOT NULL,
    "entity_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_reviews" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "entity_type" "UserEntityType" NOT NULL,
    "entity_id" UUID NOT NULL,
    "title" VARCHAR(255),
    "review" TEXT NOT NULL,
    "rating" SMALLINT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_ratings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "entity_type" "UserEntityType" NOT NULL,
    "entity_id" UUID NOT NULL,
    "rating" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_comments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "entity_type" "UserEntityType" NOT NULL,
    "entity_id" UUID NOT NULL,
    "parent_comment_id" UUID,
    "comment" TEXT NOT NULL,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notification_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "email_enabled" BOOLEAN NOT NULL DEFAULT true,
    "sms_enabled" BOOLEAN NOT NULL DEFAULT false,
    "push_enabled" BOOLEAN NOT NULL DEFAULT true,
    "whatsapp_enabled" BOOLEAN NOT NULL DEFAULT false,
    "festival_reminder" BOOLEAN NOT NULL DEFAULT true,
    "fasting_reminder" BOOLEAN NOT NULL DEFAULT true,
    "temple_update" BOOLEAN NOT NULL DEFAULT true,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_item_types" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "content_item_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_items" (
    "id" UUID NOT NULL,
    "content_type_id" UUID NOT NULL,
    "category_id" UUID,
    "content_code" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "short_description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_item_translations" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "language_id" UUID NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "subtitle" VARCHAR(300),
    "body" TEXT,
    "transliteration" TEXT,
    "meaning" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_item_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_categories" (
    "id" UUID NOT NULL,
    "parent_id" UUID,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "content_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_tags" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_tag_map" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_tag_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_media" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "media_type_id" UUID NOT NULL,
    "language_id" UUID,
    "media_code" VARCHAR(50) NOT NULL,
    "title" VARCHAR(300),
    "alt_text" VARCHAR(300),
    "caption" TEXT,
    "credit" VARCHAR(255),
    "source_url" TEXT,
    "file_url" VARCHAR(500) NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "mime_type" VARCHAR(150),
    "file_size" BIGINT,
    "duration" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "taken_at" TIMESTAMP(3),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "content_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_seo" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "meta_title" VARCHAR(255),
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "canonical_url" TEXT,
    "og_title" VARCHAR(255),
    "og_description" TEXT,
    "og_image" VARCHAR(500),
    "twitter_title" VARCHAR(255),
    "twitter_description" TEXT,
    "twitter_image" VARCHAR(500),
    "schema_markup" JSONB,
    "robots" VARCHAR(100),
    "focus_keyword" VARCHAR(255),
    "seo_score" SMALLINT NOT NULL DEFAULT 0,
    "is_indexed" BOOLEAN NOT NULL DEFAULT true,
    "last_indexed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_seo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_attachments" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "language_id" UUID,
    "attachment_code" VARCHAR(50) NOT NULL,
    "title" VARCHAR(300),
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "file_type" VARCHAR(100),
    "file_size" BIGINT,
    "version" VARCHAR(30),
    "checksum" VARCHAR(255),
    "is_downloadable" BOOLEAN NOT NULL DEFAULT true,
    "download_limit" INTEGER,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "content_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_galleries" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "gallery_code" VARCHAR(50) NOT NULL,
    "title" VARCHAR(300),
    "description" TEXT,
    "cover_media_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "content_galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_gallery_items" (
    "id" UUID NOT NULL,
    "gallery_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_entity_types" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "content_entity_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_entity_map" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "entity_type_id" UUID NOT NULL,
    "entity_id" UUID NOT NULL,
    "display_title" VARCHAR(300),
    "display_description" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "content_entity_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_related_items" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "related_content_id" UUID NOT NULL,
    "relation_type" VARCHAR(100) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_related_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_versions" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "body" TEXT,
    "change_summary" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_publish_logs" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "remarks" TEXT,
    "user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_publish_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_statistics" (
    "id" UUID NOT NULL,
    "content_id" UUID NOT NULL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "share_count" INTEGER NOT NULL DEFAULT 0,
    "download_count" INTEGER NOT NULL DEFAULT 0,
    "favorite_count" INTEGER NOT NULL DEFAULT 0,
    "rating_average" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_profiles" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "profile_code" VARCHAR(50) NOT NULL,
    "title" VARCHAR(300),
    "introduction" TEXT,
    "appearance" TEXT,
    "significance" TEXT,
    "history" TEXT,
    "powers" TEXT,
    "blessings" TEXT,
    "iconography" TEXT,
    "favorite_offerings" TEXT,
    "favorite_color" VARCHAR(100),
    "favorite_day" VARCHAR(100),
    "favorite_mantra" TEXT,
    "vehicle" VARCHAR(150),
    "weapon" VARCHAR(150),
    "alternate_names" TEXT,
    "search_keywords" TEXT,
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_popular" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_avatars" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "avatar_code" VARCHAR(50) NOT NULL,
    "avatar_name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "alternate_name" VARCHAR(255),
    "avatar_order" INTEGER NOT NULL DEFAULT 0,
    "image" VARCHAR(500),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_avatars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_relations" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "related_deity_id" UUID NOT NULL,
    "relation_code" VARCHAR(50) NOT NULL,
    "relation_type" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deity_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_symbols" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "symbol_code" VARCHAR(50) NOT NULL,
    "symbol_name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(500),
    "icon" VARCHAR(255),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_symbols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_attributes" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "attribute_code" VARCHAR(50) NOT NULL,
    "attribute_name" VARCHAR(200) NOT NULL,
    "attribute_value" TEXT,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_blessings" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "blessing_code" VARCHAR(50) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_blessings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_mantras" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "language_id" UUID,
    "mantra_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "mantra" TEXT,
    "meaning" TEXT,
    "recitation_count" INTEGER,
    "audio_url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_mantras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_aartis" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "language_id" UUID,
    "aarti_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "lyrics" TEXT,
    "aarti_time" TIME(0),
    "duration_minutes" INTEGER,
    "audio_url" TEXT,
    "video_url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_aartis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_stotras" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "language_id" UUID,
    "stotra_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "content" TEXT,
    "composer" VARCHAR(150),
    "audio_url" TEXT,
    "video_url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_stotras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_stories" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "language_id" UUID,
    "story_code" VARCHAR(50),
    "name" VARCHAR(200),
    "display_name" VARCHAR(255),
    "description" TEXT,
    "content" TEXT,
    "narrator" VARCHAR(150),
    "duration_minutes" INTEGER,
    "audio_url" TEXT,
    "video_url" TEXT,
    "image" VARCHAR(500),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_associations" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "association_type" VARCHAR(50) NOT NULL,
    "association_name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(500),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_statistics" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "view_count" BIGINT NOT NULL DEFAULT 0,
    "favorite_count" BIGINT NOT NULL DEFAULT 0,
    "share_count" BIGINT NOT NULL DEFAULT 0,
    "rating_average" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "rating_count" BIGINT NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deity_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_external_links" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "link_code" VARCHAR(50) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "url" TEXT NOT NULL,
    "link_type" VARCHAR(50) NOT NULL,
    "is_official" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "deity_external_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deity_change_history" (
    "id" UUID NOT NULL,
    "deity_id" UUID NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "changed_fields" JSONB,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deity_change_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchangs" (
    "id" UUID NOT NULL,
    "panchang_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "calendar_type" VARCHAR(100),
    "timezone" VARCHAR(120),
    "country_id" UUID,
    "state_id" UUID,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "panchangs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchang_translations" (
    "id" UUID NOT NULL,
    "panchang_id" UUID NOT NULL,
    "language" "Language" NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "meta_title" VARCHAR(200),
    "meta_description" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panchang_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchang_categories" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150),
    "display_name" VARCHAR(200),
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(255),
    "image" VARCHAR(500),
    "alternate_names" TEXT,
    "search_keywords" TEXT,
    "seo_title" VARCHAR(255),
    "seo_description" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "panchang_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchang_category_map" (
    "id" UUID NOT NULL,
    "panchang_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panchang_category_map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchang_regions" (
    "id" UUID NOT NULL,
    "panchang_id" UUID NOT NULL,
    "country_id" UUID,
    "state_id" UUID,
    "city_id" UUID,
    "region_name" VARCHAR(200),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panchang_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchang_dates" (
    "id" UUID NOT NULL,
    "panchang_id" UUID NOT NULL,
    "calendar_date" DATE NOT NULL,
    "hindu_year" VARCHAR(50),
    "vikram_samvat" VARCHAR(50),
    "shak_samvat" VARCHAR(50),
    "ayana" VARCHAR(50),
    "ritu" VARCHAR(50),
    "masa" VARCHAR(50),
    "paksha" VARCHAR(50),
    "weekday" VARCHAR(50),
    "sunrise" TIME(0),
    "sunset" TIME(0),
    "moonrise" TIME(0),
    "moonset" TIME(0),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panchang_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tithis" (
    "id" UUID NOT NULL,
    "tithi_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "paksha" VARCHAR(50),
    "tithi_number" SMALLINT,
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tithis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nakshatras" (
    "id" UUID NOT NULL,
    "nakshatra_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "deity" VARCHAR(150),
    "symbol" VARCHAR(150),
    "ruling_planet" VARCHAR(100),
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "nakshatras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yogas" (
    "id" UUID NOT NULL,
    "yoga_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "auspicious" BOOLEAN,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "yogas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "karanas" (
    "id" UUID NOT NULL,
    "karana_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "auspicious" BOOLEAN,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "karanas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchang_day_elements" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "tithi_id" UUID NOT NULL,
    "nakshatra_id" UUID NOT NULL,
    "yoga_id" UUID NOT NULL,
    "karana_id" UUID NOT NULL,
    "tithi_start" TIMESTAMP(3),
    "tithi_end" TIMESTAMP(3),
    "nakshatra_start" TIMESTAMP(3),
    "nakshatra_end" TIMESTAMP(3),
    "yoga_start" TIMESTAMP(3),
    "yoga_end" TIMESTAMP(3),
    "karana_start" TIMESTAMP(3),
    "karana_end" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panchang_day_elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muhurats" (
    "id" UUID NOT NULL,
    "muhurat_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "category" VARCHAR(100),
    "description" TEXT,
    "auspicious" BOOLEAN NOT NULL DEFAULT true,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "muhurats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "choghadiyas" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "period_type" VARCHAR(50) NOT NULL,
    "choghadiya_type" VARCHAR(50) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_auspicious" BOOLEAN,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "choghadiyas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rahu_kaal" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rahu_kaal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gulika_kaal" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gulika_kaal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yamaganda_kaal" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "yamaganda_kaal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "abhijit_muhurat" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "abhijit_muhurat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vrats" (
    "id" UUID NOT NULL,
    "vrat_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "vrat_type" VARCHAR(100),
    "difficulty_level" VARCHAR(50),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "vrats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vrat_dates" (
    "id" UUID NOT NULL,
    "vrat_id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "is_major" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vrat_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vrat_rules" (
    "id" UUID NOT NULL,
    "vrat_id" UUID NOT NULL,
    "rule_title" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "vrat_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vrat_benefits" (
    "id" UUID NOT NULL,
    "vrat_id" UUID NOT NULL,
    "benefit_title" VARCHAR(300) NOT NULL,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "vrat_benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vrat_food_rules" (
    "id" UUID NOT NULL,
    "vrat_id" UUID NOT NULL,
    "food_type" VARCHAR(100),
    "food_name" VARCHAR(200) NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "vrat_food_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ekadashi" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "is_major" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ekadashi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purnima" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "is_major" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purnima_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amavasya" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "is_major" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "amavasya_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pradosh" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "is_major" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pradosh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sankashti" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "is_major" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sankashti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planets" (
    "id" UUID NOT NULL,
    "planet_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "planet_type" VARCHAR(100),
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "planets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rashis" (
    "id" UUID NOT NULL,
    "rashi_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "symbol" VARCHAR(50),
    "element" VARCHAR(50),
    "ruling_planet" VARCHAR(100),
    "description" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "rashis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchang_planet_positions" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "planet_id" UUID NOT NULL,
    "rashi_id" UUID NOT NULL,
    "degree" DECIMAL(6,2),
    "longitude" DECIMAL(8,4),
    "is_retrograde" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panchang_planet_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchang_rashi_transits" (
    "id" UUID NOT NULL,
    "panchang_date_id" UUID NOT NULL,
    "planet_id" UUID NOT NULL,
    "from_rashi_id" UUID NOT NULL,
    "to_rashi_id" UUID NOT NULL,
    "transit_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panchang_rashi_transits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchang_statistics" (
    "id" UUID NOT NULL,
    "panchang_id" UUID NOT NULL,
    "total_dates" BIGINT NOT NULL DEFAULT 0,
    "total_muhurats" BIGINT NOT NULL DEFAULT 0,
    "total_vrats" BIGINT NOT NULL DEFAULT 0,
    "total_festivals" BIGINT NOT NULL DEFAULT 0,
    "total_views" BIGINT NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panchang_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchang_external_links" (
    "id" UUID NOT NULL,
    "panchang_id" UUID NOT NULL,
    "link_code" VARCHAR(50) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "url" TEXT NOT NULL,
    "link_type" VARCHAR(50) NOT NULL,
    "is_official" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "panchang_external_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchang_sources" (
    "id" UUID NOT NULL,
    "panchang_id" UUID NOT NULL,
    "source_code" VARCHAR(50) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "author" VARCHAR(200),
    "publisher" VARCHAR(200),
    "url" TEXT,
    "citation" TEXT,
    "language_id" UUID,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "panchang_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panchang_change_history" (
    "id" UUID NOT NULL,
    "panchang_id" UUID NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "changed_fields" JSONB,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "panchang_change_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "continents_slug_key" ON "continents"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "continents_code_key" ON "continents"("code");

-- CreateIndex
CREATE INDEX "continents_name_idx" ON "continents"("name");

-- CreateIndex
CREATE UNIQUE INDEX "countries_slug_key" ON "countries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso2_key" ON "countries"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso3_key" ON "countries"("iso3");

-- CreateIndex
CREATE INDEX "countries_name_idx" ON "countries"("name");

-- CreateIndex
CREATE INDEX "countries_continent_id_idx" ON "countries"("continent_id");

-- CreateIndex
CREATE INDEX "states_country_id_idx" ON "states"("country_id");

-- CreateIndex
CREATE INDEX "states_name_idx" ON "states"("name");

-- CreateIndex
CREATE UNIQUE INDEX "states_country_id_slug_key" ON "states"("country_id", "slug");

-- CreateIndex
CREATE INDEX "cities_country_id_idx" ON "cities"("country_id");

-- CreateIndex
CREATE INDEX "cities_state_id_idx" ON "cities"("state_id");

-- CreateIndex
CREATE UNIQUE INDEX "cities_state_id_slug_key" ON "cities"("state_id", "slug");

-- CreateIndex
CREATE INDEX "areas_country_id_idx" ON "areas"("country_id");

-- CreateIndex
CREATE INDEX "areas_state_id_idx" ON "areas"("state_id");

-- CreateIndex
CREATE INDEX "areas_city_id_idx" ON "areas"("city_id");

-- CreateIndex
CREATE UNIQUE INDEX "areas_city_id_slug_key" ON "areas"("city_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "languages_iso_code_key" ON "languages"("iso_code");

-- CreateIndex
CREATE UNIQUE INDEX "languages_locale_key" ON "languages"("locale");

-- CreateIndex
CREATE INDEX "languages_name_idx" ON "languages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "deity_types_slug_key" ON "deity_types"("slug");

-- CreateIndex
CREATE INDEX "deity_types_name_idx" ON "deity_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "deities_slug_key" ON "deities"("slug");

-- CreateIndex
CREATE INDEX "deities_deity_type_id_idx" ON "deities"("deity_type_id");

-- CreateIndex
CREATE INDEX "deities_name_idx" ON "deities"("name");

-- CreateIndex
CREATE INDEX "deity_translations_language_idx" ON "deity_translations"("language");

-- CreateIndex
CREATE UNIQUE INDEX "deity_translations_deity_id_language_key" ON "deity_translations"("deity_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "deity_categories_slug_key" ON "deity_categories"("slug");

-- CreateIndex
CREATE INDEX "deity_categories_name_idx" ON "deity_categories"("name");

-- CreateIndex
CREATE INDEX "deity_category_map_deity_id_idx" ON "deity_category_map"("deity_id");

-- CreateIndex
CREATE INDEX "deity_category_map_category_id_idx" ON "deity_category_map"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "deity_category_map_deity_id_category_id_key" ON "deity_category_map"("deity_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_categories_slug_key" ON "temple_categories"("slug");

-- CreateIndex
CREATE INDEX "temple_categories_name_idx" ON "temple_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "media_types_slug_key" ON "media_types"("slug");

-- CreateIndex
CREATE INDEX "media_types_name_idx" ON "media_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "content_statuses_slug_key" ON "content_statuses"("slug");

-- CreateIndex
CREATE INDEX "content_statuses_name_idx" ON "content_statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "temples_slug_key" ON "temples"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "temples_temple_code_key" ON "temples"("temple_code");

-- CreateIndex
CREATE INDEX "temples_country_id_idx" ON "temples"("country_id");

-- CreateIndex
CREATE INDEX "temples_state_id_idx" ON "temples"("state_id");

-- CreateIndex
CREATE INDEX "temples_city_id_idx" ON "temples"("city_id");

-- CreateIndex
CREATE INDEX "temples_area_id_idx" ON "temples"("area_id");

-- CreateIndex
CREATE INDEX "temples_featured_idx" ON "temples"("featured");

-- CreateIndex
CREATE INDEX "temples_popular_idx" ON "temples"("popular");

-- CreateIndex
CREATE INDEX "temples_verified_idx" ON "temples"("verified");

-- CreateIndex
CREATE INDEX "temple_deity_map_temple_id_idx" ON "temple_deity_map"("temple_id");

-- CreateIndex
CREATE INDEX "temple_deity_map_deity_id_idx" ON "temple_deity_map"("deity_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_deity_map_temple_id_deity_id_key" ON "temple_deity_map"("temple_id", "deity_id");

-- CreateIndex
CREATE INDEX "temple_category_map_temple_id_idx" ON "temple_category_map"("temple_id");

-- CreateIndex
CREATE INDEX "temple_category_map_category_id_idx" ON "temple_category_map"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_category_map_temple_id_category_id_key" ON "temple_category_map"("temple_id", "category_id");

-- CreateIndex
CREATE INDEX "temple_timings_temple_id_idx" ON "temple_timings"("temple_id");

-- CreateIndex
CREATE INDEX "temple_timings_day_of_week_idx" ON "temple_timings"("day_of_week");

-- CreateIndex
CREATE INDEX "temple_aartis_temple_id_idx" ON "temple_aartis"("temple_id");

-- CreateIndex
CREATE INDEX "temple_aartis_name_idx" ON "temple_aartis"("name");

-- CreateIndex
CREATE INDEX "temple_aartis_language_id_idx" ON "temple_aartis"("language_id");

-- CreateIndex
CREATE INDEX "temple_poojas_temple_id_idx" ON "temple_poojas"("temple_id");

-- CreateIndex
CREATE INDEX "temple_poojas_name_idx" ON "temple_poojas"("name");

-- CreateIndex
CREATE INDEX "temple_poojas_language_id_idx" ON "temple_poojas"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_poojas_temple_id_pooja_code_key" ON "temple_poojas"("temple_id", "pooja_code");

-- CreateIndex
CREATE INDEX "temple_darshan_types_temple_id_idx" ON "temple_darshan_types"("temple_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_darshan_types_temple_id_darshan_code_key" ON "temple_darshan_types"("temple_id", "darshan_code");

-- CreateIndex
CREATE INDEX "temple_special_events_temple_id_idx" ON "temple_special_events"("temple_id");

-- CreateIndex
CREATE INDEX "temple_special_events_festival_id_idx" ON "temple_special_events"("festival_id");

-- CreateIndex
CREATE INDEX "temple_special_events_start_date_idx" ON "temple_special_events"("start_date");

-- CreateIndex
CREATE UNIQUE INDEX "temple_special_events_temple_id_event_code_key" ON "temple_special_events"("temple_id", "event_code");

-- CreateIndex
CREATE INDEX "temple_facilities_temple_id_idx" ON "temple_facilities"("temple_id");

-- CreateIndex
CREATE INDEX "temple_facilities_name_idx" ON "temple_facilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "temple_facilities_temple_id_facility_code_key" ON "temple_facilities"("temple_id", "facility_code");

-- CreateIndex
CREATE INDEX "temple_rules_temple_id_idx" ON "temple_rules"("temple_id");

-- CreateIndex
CREATE INDEX "temple_rules_rule_type_idx" ON "temple_rules"("rule_type");

-- CreateIndex
CREATE UNIQUE INDEX "temple_rules_temple_id_rule_code_key" ON "temple_rules"("temple_id", "rule_code");

-- CreateIndex
CREATE INDEX "temple_contacts_temple_id_idx" ON "temple_contacts"("temple_id");

-- CreateIndex
CREATE INDEX "temple_contacts_contact_type_idx" ON "temple_contacts"("contact_type");

-- CreateIndex
CREATE UNIQUE INDEX "temple_contacts_temple_id_contact_code_key" ON "temple_contacts"("temple_id", "contact_code");

-- CreateIndex
CREATE INDEX "temple_faqs_temple_id_idx" ON "temple_faqs"("temple_id");

-- CreateIndex
CREATE INDEX "temple_faqs_language_id_idx" ON "temple_faqs"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_faqs_temple_id_faq_code_key" ON "temple_faqs"("temple_id", "faq_code");

-- CreateIndex
CREATE INDEX "temple_accessibility_temple_id_idx" ON "temple_accessibility"("temple_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_accessibility_temple_id_accessibility_code_key" ON "temple_accessibility"("temple_id", "accessibility_code");

-- CreateIndex
CREATE INDEX "temple_dress_codes_temple_id_idx" ON "temple_dress_codes"("temple_id");

-- CreateIndex
CREATE INDEX "temple_dress_codes_gender_idx" ON "temple_dress_codes"("gender");

-- CreateIndex
CREATE UNIQUE INDEX "temple_dress_codes_temple_id_dress_code_key" ON "temple_dress_codes"("temple_id", "dress_code");

-- CreateIndex
CREATE INDEX "temple_routes_temple_id_idx" ON "temple_routes"("temple_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_routes_temple_id_route_code_key" ON "temple_routes"("temple_id", "route_code");

-- CreateIndex
CREATE INDEX "temple_nearby_places_temple_id_idx" ON "temple_nearby_places"("temple_id");

-- CreateIndex
CREATE INDEX "temple_nearby_places_name_idx" ON "temple_nearby_places"("name");

-- CreateIndex
CREATE UNIQUE INDEX "temple_nearby_places_temple_id_place_code_key" ON "temple_nearby_places"("temple_id", "place_code");

-- CreateIndex
CREATE INDEX "temple_parking_temple_id_idx" ON "temple_parking"("temple_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_parking_temple_id_parking_code_key" ON "temple_parking"("temple_id", "parking_code");

-- CreateIndex
CREATE INDEX "temple_accommodations_temple_id_idx" ON "temple_accommodations"("temple_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_accommodations_temple_id_accommodation_code_key" ON "temple_accommodations"("temple_id", "accommodation_code");

-- CreateIndex
CREATE INDEX "temple_prasadam_temple_id_idx" ON "temple_prasadam"("temple_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_prasadam_temple_id_prasadam_code_key" ON "temple_prasadam"("temple_id", "prasadam_code");

-- CreateIndex
CREATE INDEX "temple_media_temple_id_idx" ON "temple_media"("temple_id");

-- CreateIndex
CREATE INDEX "temple_media_media_type_id_idx" ON "temple_media"("media_type_id");

-- CreateIndex
CREATE INDEX "temple_media_language_id_idx" ON "temple_media"("language_id");

-- CreateIndex
CREATE INDEX "temple_documents_temple_id_idx" ON "temple_documents"("temple_id");

-- CreateIndex
CREATE INDEX "temple_documents_language_id_idx" ON "temple_documents"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_documents_temple_id_document_code_key" ON "temple_documents"("temple_id", "document_code");

-- CreateIndex
CREATE INDEX "temple_sources_temple_id_idx" ON "temple_sources"("temple_id");

-- CreateIndex
CREATE INDEX "temple_sources_language_id_idx" ON "temple_sources"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_sources_temple_id_source_code_key" ON "temple_sources"("temple_id", "source_code");

-- CreateIndex
CREATE INDEX "temple_live_darshan_temple_id_idx" ON "temple_live_darshan"("temple_id");

-- CreateIndex
CREATE INDEX "temple_donations_temple_id_idx" ON "temple_donations"("temple_id");

-- CreateIndex
CREATE INDEX "temple_external_links_temple_id_idx" ON "temple_external_links"("temple_id");

-- CreateIndex
CREATE INDEX "temple_qr_codes_temple_id_idx" ON "temple_qr_codes"("temple_id");

-- CreateIndex
CREATE UNIQUE INDEX "temple_statistics_temple_id_key" ON "temple_statistics"("temple_id");

-- CreateIndex
CREATE INDEX "temple_statistics_temple_id_idx" ON "temple_statistics"("temple_id");

-- CreateIndex
CREATE INDEX "temple_change_history_temple_id_idx" ON "temple_change_history"("temple_id");

-- CreateIndex
CREATE INDEX "temple_change_history_user_id_idx" ON "temple_change_history"("user_id");

-- CreateIndex
CREATE INDEX "temple_change_history_action_idx" ON "temple_change_history"("action");

-- CreateIndex
CREATE INDEX "temple_translations_language_idx" ON "temple_translations"("language");

-- CreateIndex
CREATE INDEX "temple_translations_name_idx" ON "temple_translations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "temple_translations_temple_id_language_key" ON "temple_translations"("temple_id", "language");

-- CreateIndex
CREATE INDEX "temple_pilgrim_tips_temple_id_idx" ON "temple_pilgrim_tips"("temple_id");

-- CreateIndex
CREATE INDEX "media_library_media_type_idx" ON "media_library"("media_type");

-- CreateIndex
CREATE INDEX "media_library_created_at_idx" ON "media_library"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "festivals_festival_code_key" ON "festivals"("festival_code");

-- CreateIndex
CREATE UNIQUE INDEX "festivals_slug_key" ON "festivals"("slug");

-- CreateIndex
CREATE INDEX "festivals_slug_idx" ON "festivals"("slug");

-- CreateIndex
CREATE INDEX "festivals_festival_type_idx" ON "festivals"("festival_type");

-- CreateIndex
CREATE INDEX "festivals_is_featured_idx" ON "festivals"("is_featured");

-- CreateIndex
CREATE INDEX "festivals_is_popular_idx" ON "festivals"("is_popular");

-- CreateIndex
CREATE UNIQUE INDEX "festival_statistics_festival_id_key" ON "festival_statistics"("festival_id");

-- CreateIndex
CREATE INDEX "festival_statistics_festival_id_idx" ON "festival_statistics"("festival_id");

-- CreateIndex
CREATE UNIQUE INDEX "festival_categories_slug_key" ON "festival_categories"("slug");

-- CreateIndex
CREATE INDEX "festival_categories_name_idx" ON "festival_categories"("name");

-- CreateIndex
CREATE INDEX "festival_category_map_festival_id_idx" ON "festival_category_map"("festival_id");

-- CreateIndex
CREATE INDEX "festival_category_map_category_id_idx" ON "festival_category_map"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "festival_category_map_festival_id_category_id_key" ON "festival_category_map"("festival_id", "category_id");

-- CreateIndex
CREATE INDEX "festival_dates_festival_id_idx" ON "festival_dates"("festival_id");

-- CreateIndex
CREATE INDEX "festival_dates_year_idx" ON "festival_dates"("year");

-- CreateIndex
CREATE UNIQUE INDEX "festival_dates_festival_id_year_key" ON "festival_dates"("festival_id", "year");

-- CreateIndex
CREATE INDEX "festival_regions_festival_id_idx" ON "festival_regions"("festival_id");

-- CreateIndex
CREATE INDEX "festival_regions_country_id_idx" ON "festival_regions"("country_id");

-- CreateIndex
CREATE INDEX "festival_regions_state_id_idx" ON "festival_regions"("state_id");

-- CreateIndex
CREATE INDEX "festival_regions_city_id_idx" ON "festival_regions"("city_id");

-- CreateIndex
CREATE INDEX "festival_deity_map_festival_id_idx" ON "festival_deity_map"("festival_id");

-- CreateIndex
CREATE INDEX "festival_deity_map_deity_id_idx" ON "festival_deity_map"("deity_id");

-- CreateIndex
CREATE UNIQUE INDEX "festival_deity_map_festival_id_deity_id_key" ON "festival_deity_map"("festival_id", "deity_id");

-- CreateIndex
CREATE INDEX "festival_temple_map_festival_id_idx" ON "festival_temple_map"("festival_id");

-- CreateIndex
CREATE INDEX "festival_temple_map_temple_id_idx" ON "festival_temple_map"("temple_id");

-- CreateIndex
CREATE UNIQUE INDEX "festival_temple_map_festival_id_temple_id_key" ON "festival_temple_map"("festival_id", "temple_id");

-- CreateIndex
CREATE INDEX "festival_rituals_festival_id_idx" ON "festival_rituals"("festival_id");

-- CreateIndex
CREATE INDEX "festival_rituals_name_idx" ON "festival_rituals"("name");

-- CreateIndex
CREATE UNIQUE INDEX "festival_rituals_festival_id_ritual_code_key" ON "festival_rituals"("festival_id", "ritual_code");

-- CreateIndex
CREATE INDEX "festival_puja_vidhis_festival_id_idx" ON "festival_puja_vidhis"("festival_id");

-- CreateIndex
CREATE INDEX "festival_puja_vidhis_name_idx" ON "festival_puja_vidhis"("name");

-- CreateIndex
CREATE UNIQUE INDEX "festival_puja_vidhis_festival_id_vidhi_code_key" ON "festival_puja_vidhis"("festival_id", "vidhi_code");

-- CreateIndex
CREATE INDEX "festival_samagri_festival_id_idx" ON "festival_samagri"("festival_id");

-- CreateIndex
CREATE INDEX "festival_samagri_name_idx" ON "festival_samagri"("name");

-- CreateIndex
CREATE UNIQUE INDEX "festival_samagri_festival_id_samagri_code_key" ON "festival_samagri"("festival_id", "samagri_code");

-- CreateIndex
CREATE INDEX "festival_fasting_rules_festival_id_idx" ON "festival_fasting_rules"("festival_id");

-- CreateIndex
CREATE INDEX "festival_fasting_rules_fast_type_idx" ON "festival_fasting_rules"("fast_type");

-- CreateIndex
CREATE UNIQUE INDEX "festival_fasting_rules_festival_id_rule_code_key" ON "festival_fasting_rules"("festival_id", "rule_code");

-- CreateIndex
CREATE INDEX "festival_foods_festival_id_idx" ON "festival_foods"("festival_id");

-- CreateIndex
CREATE INDEX "festival_foods_name_idx" ON "festival_foods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "festival_foods_festival_id_food_code_key" ON "festival_foods"("festival_id", "food_code");

-- CreateIndex
CREATE INDEX "festival_kathas_festival_id_idx" ON "festival_kathas"("festival_id");

-- CreateIndex
CREATE INDEX "festival_kathas_language_id_idx" ON "festival_kathas"("language_id");

-- CreateIndex
CREATE INDEX "festival_kathas_name_idx" ON "festival_kathas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "festival_kathas_festival_id_katha_code_key" ON "festival_kathas"("festival_id", "katha_code");

-- CreateIndex
CREATE INDEX "festival_mantras_festival_id_idx" ON "festival_mantras"("festival_id");

-- CreateIndex
CREATE INDEX "festival_mantras_language_id_idx" ON "festival_mantras"("language_id");

-- CreateIndex
CREATE INDEX "festival_mantras_name_idx" ON "festival_mantras"("name");

-- CreateIndex
CREATE UNIQUE INDEX "festival_mantras_festival_id_mantra_code_key" ON "festival_mantras"("festival_id", "mantra_code");

-- CreateIndex
CREATE INDEX "festival_aartis_festival_id_idx" ON "festival_aartis"("festival_id");

-- CreateIndex
CREATE INDEX "festival_aartis_language_id_idx" ON "festival_aartis"("language_id");

-- CreateIndex
CREATE INDEX "festival_aartis_name_idx" ON "festival_aartis"("name");

-- CreateIndex
CREATE UNIQUE INDEX "festival_aartis_festival_id_aarti_code_key" ON "festival_aartis"("festival_id", "aarti_code");

-- CreateIndex
CREATE INDEX "festival_bhajans_festival_id_idx" ON "festival_bhajans"("festival_id");

-- CreateIndex
CREATE INDEX "festival_bhajans_language_id_idx" ON "festival_bhajans"("language_id");

-- CreateIndex
CREATE INDEX "festival_bhajans_name_idx" ON "festival_bhajans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "festival_bhajans_festival_id_bhajan_code_key" ON "festival_bhajans"("festival_id", "bhajan_code");

-- CreateIndex
CREATE INDEX "festival_galleries_festival_id_idx" ON "festival_galleries"("festival_id");

-- CreateIndex
CREATE INDEX "festival_galleries_media_type_id_idx" ON "festival_galleries"("media_type_id");

-- CreateIndex
CREATE INDEX "festival_galleries_language_id_idx" ON "festival_galleries"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "festival_galleries_festival_id_gallery_code_key" ON "festival_galleries"("festival_id", "gallery_code");

-- CreateIndex
CREATE INDEX "festival_videos_festival_id_idx" ON "festival_videos"("festival_id");

-- CreateIndex
CREATE INDEX "festival_videos_media_type_id_idx" ON "festival_videos"("media_type_id");

-- CreateIndex
CREATE INDEX "festival_videos_language_id_idx" ON "festival_videos"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "festival_videos_festival_id_video_code_key" ON "festival_videos"("festival_id", "video_code");

-- CreateIndex
CREATE INDEX "festival_translations_language_idx" ON "festival_translations"("language");

-- CreateIndex
CREATE UNIQUE INDEX "festival_translations_festival_id_language_key" ON "festival_translations"("festival_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "seo_redirects_from_path_key" ON "seo_redirects"("from_path");

-- CreateIndex
CREATE INDEX "seo_redirects_from_path_idx" ON "seo_redirects"("from_path");

-- CreateIndex
CREATE INDEX "seo_redirects_is_active_idx" ON "seo_redirects"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "seo_landing_pages_slug_key" ON "seo_landing_pages"("slug");

-- CreateIndex
CREATE INDEX "seo_landing_pages_slug_idx" ON "seo_landing_pages"("slug");

-- CreateIndex
CREATE INDEX "seo_landing_pages_language_is_active_idx" ON "seo_landing_pages"("language", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_mobile_idx" ON "users"("mobile");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_idx" ON "user_sessions"("user_id");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_is_active_idx" ON "user_sessions"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "user_sessions_login_time_idx" ON "user_sessions"("login_time");

-- CreateIndex
CREATE INDEX "user_sessions_last_activity_idx" ON "user_sessions"("last_activity");

-- CreateIndex
CREATE INDEX "otp_verifications_mobile_idx" ON "otp_verifications"("mobile");

-- CreateIndex
CREATE INDEX "otp_verifications_email_idx" ON "otp_verifications"("email");

-- CreateIndex
CREATE INDEX "otp_verifications_purpose_idx" ON "otp_verifications"("purpose");

-- CreateIndex
CREATE INDEX "otp_verifications_expire_time_idx" ON "otp_verifications"("expire_time");

-- CreateIndex
CREATE INDEX "otp_verifications_mobile_purpose_expire_time_idx" ON "otp_verifications"("mobile", "purpose", "expire_time");

-- CreateIndex
CREATE INDEX "otp_verifications_email_purpose_expire_time_idx" ON "otp_verifications"("email", "purpose", "expire_time");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_refresh_token_key" ON "refresh_tokens"("refresh_token");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_expires_at_idx" ON "refresh_tokens"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "activity_logs_user_id_idx" ON "activity_logs"("user_id");

-- CreateIndex
CREATE INDEX "activity_logs_entity_type_entity_id_idx" ON "activity_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "activity_logs_created_at_idx" ON "activity_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_types_slug_key" ON "content_types"("slug");

-- CreateIndex
CREATE INDEX "content_types_slug_idx" ON "content_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "contents_slug_key" ON "contents"("slug");

-- CreateIndex
CREATE INDEX "contents_slug_idx" ON "contents"("slug");

-- CreateIndex
CREATE INDEX "contents_content_type_id_idx" ON "contents"("content_type_id");

-- CreateIndex
CREATE INDEX "contents_status_idx" ON "contents"("status");

-- CreateIndex
CREATE INDEX "content_translations_language_idx" ON "content_translations"("language");

-- CreateIndex
CREATE UNIQUE INDEX "content_translations_content_id_language_key" ON "content_translations"("content_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_profiles_country_id_idx" ON "user_profiles"("country_id");

-- CreateIndex
CREATE INDEX "user_profiles_state_id_idx" ON "user_profiles"("state_id");

-- CreateIndex
CREATE INDEX "user_profiles_city_id_idx" ON "user_profiles"("city_id");

-- CreateIndex
CREATE INDEX "user_profiles_area_id_idx" ON "user_profiles"("area_id");

-- CreateIndex
CREATE INDEX "user_profiles_language_id_idx" ON "user_profiles"("language_id");

-- CreateIndex
CREATE INDEX "user_favorites_user_id_idx" ON "user_favorites"("user_id");

-- CreateIndex
CREATE INDEX "user_favorites_entity_type_entity_id_idx" ON "user_favorites"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_user_id_entity_type_entity_id_key" ON "user_favorites"("user_id", "entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "user_reviews_user_id_idx" ON "user_reviews"("user_id");

-- CreateIndex
CREATE INDEX "user_reviews_entity_type_entity_id_idx" ON "user_reviews"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "user_reviews_status_idx" ON "user_reviews"("status");

-- CreateIndex
CREATE INDEX "user_reviews_deleted_at_idx" ON "user_reviews"("deleted_at");

-- CreateIndex
CREATE INDEX "user_ratings_user_id_idx" ON "user_ratings"("user_id");

-- CreateIndex
CREATE INDEX "user_ratings_entity_type_entity_id_idx" ON "user_ratings"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_ratings_user_id_entity_type_entity_id_key" ON "user_ratings"("user_id", "entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "user_comments_user_id_idx" ON "user_comments"("user_id");

-- CreateIndex
CREATE INDEX "user_comments_entity_type_entity_id_idx" ON "user_comments"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "user_comments_parent_comment_id_idx" ON "user_comments"("parent_comment_id");

-- CreateIndex
CREATE INDEX "user_comments_status_idx" ON "user_comments"("status");

-- CreateIndex
CREATE INDEX "user_comments_deleted_at_idx" ON "user_comments"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_notification_preferences_user_id_key" ON "user_notification_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_item_types_slug_key" ON "content_item_types"("slug");

-- CreateIndex
CREATE INDEX "content_item_types_name_idx" ON "content_item_types"("name");

-- CreateIndex
CREATE INDEX "content_item_types_status_idx" ON "content_item_types"("status");

-- CreateIndex
CREATE INDEX "content_item_types_sort_order_idx" ON "content_item_types"("sort_order");

-- CreateIndex
CREATE INDEX "content_item_types_deleted_at_idx" ON "content_item_types"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_items_content_code_key" ON "content_items"("content_code");

-- CreateIndex
CREATE UNIQUE INDEX "content_items_slug_key" ON "content_items"("slug");

-- CreateIndex
CREATE INDEX "content_items_content_type_id_idx" ON "content_items"("content_type_id");

-- CreateIndex
CREATE INDEX "content_items_category_id_idx" ON "content_items"("category_id");

-- CreateIndex
CREATE INDEX "content_items_status_idx" ON "content_items"("status");

-- CreateIndex
CREATE INDEX "content_items_is_featured_idx" ON "content_items"("is_featured");

-- CreateIndex
CREATE INDEX "content_items_is_popular_idx" ON "content_items"("is_popular");

-- CreateIndex
CREATE INDEX "content_items_published_at_idx" ON "content_items"("published_at");

-- CreateIndex
CREATE INDEX "content_items_sort_order_idx" ON "content_items"("sort_order");

-- CreateIndex
CREATE INDEX "content_items_deleted_at_idx" ON "content_items"("deleted_at");

-- CreateIndex
CREATE INDEX "content_item_translations_language_id_idx" ON "content_item_translations"("language_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_item_translations_content_id_language_id_key" ON "content_item_translations"("content_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_categories_slug_key" ON "content_categories"("slug");

-- CreateIndex
CREATE INDEX "content_categories_parent_id_idx" ON "content_categories"("parent_id");

-- CreateIndex
CREATE INDEX "content_categories_name_idx" ON "content_categories"("name");

-- CreateIndex
CREATE INDEX "content_categories_status_idx" ON "content_categories"("status");

-- CreateIndex
CREATE INDEX "content_categories_sort_order_idx" ON "content_categories"("sort_order");

-- CreateIndex
CREATE INDEX "content_categories_deleted_at_idx" ON "content_categories"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_tags_slug_key" ON "content_tags"("slug");

-- CreateIndex
CREATE INDEX "content_tags_name_idx" ON "content_tags"("name");

-- CreateIndex
CREATE INDEX "content_tag_map_content_id_idx" ON "content_tag_map"("content_id");

-- CreateIndex
CREATE INDEX "content_tag_map_tag_id_idx" ON "content_tag_map"("tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_tag_map_content_id_tag_id_key" ON "content_tag_map"("content_id", "tag_id");

-- CreateIndex
CREATE INDEX "content_media_content_id_idx" ON "content_media"("content_id");

-- CreateIndex
CREATE INDEX "content_media_media_type_id_idx" ON "content_media"("media_type_id");

-- CreateIndex
CREATE INDEX "content_media_language_id_idx" ON "content_media"("language_id");

-- CreateIndex
CREATE INDEX "content_media_status_idx" ON "content_media"("status");

-- CreateIndex
CREATE INDEX "content_media_sort_order_idx" ON "content_media"("sort_order");

-- CreateIndex
CREATE INDEX "content_media_status_sort_order_idx" ON "content_media"("status", "sort_order");

-- CreateIndex
CREATE INDEX "content_media_is_primary_idx" ON "content_media"("is_primary");

-- CreateIndex
CREATE INDEX "content_media_deleted_at_idx" ON "content_media"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_media_content_id_media_code_key" ON "content_media"("content_id", "media_code");

-- CreateIndex
CREATE UNIQUE INDEX "content_seo_content_id_key" ON "content_seo"("content_id");

-- CreateIndex
CREATE INDEX "content_attachments_content_id_idx" ON "content_attachments"("content_id");

-- CreateIndex
CREATE INDEX "content_attachments_language_id_idx" ON "content_attachments"("language_id");

-- CreateIndex
CREATE INDEX "content_attachments_status_idx" ON "content_attachments"("status");

-- CreateIndex
CREATE INDEX "content_attachments_sort_order_idx" ON "content_attachments"("sort_order");

-- CreateIndex
CREATE INDEX "content_attachments_status_sort_order_idx" ON "content_attachments"("status", "sort_order");

-- CreateIndex
CREATE INDEX "content_attachments_deleted_at_idx" ON "content_attachments"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_attachments_content_id_attachment_code_key" ON "content_attachments"("content_id", "attachment_code");

-- CreateIndex
CREATE INDEX "content_galleries_content_id_idx" ON "content_galleries"("content_id");

-- CreateIndex
CREATE INDEX "content_galleries_cover_media_id_idx" ON "content_galleries"("cover_media_id");

-- CreateIndex
CREATE INDEX "content_galleries_status_idx" ON "content_galleries"("status");

-- CreateIndex
CREATE INDEX "content_galleries_sort_order_idx" ON "content_galleries"("sort_order");

-- CreateIndex
CREATE INDEX "content_galleries_status_sort_order_idx" ON "content_galleries"("status", "sort_order");

-- CreateIndex
CREATE INDEX "content_galleries_deleted_at_idx" ON "content_galleries"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_galleries_content_id_gallery_code_key" ON "content_galleries"("content_id", "gallery_code");

-- CreateIndex
CREATE INDEX "content_gallery_items_gallery_id_idx" ON "content_gallery_items"("gallery_id");

-- CreateIndex
CREATE INDEX "content_gallery_items_media_id_idx" ON "content_gallery_items"("media_id");

-- CreateIndex
CREATE INDEX "content_gallery_items_sort_order_idx" ON "content_gallery_items"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "content_gallery_items_gallery_id_media_id_key" ON "content_gallery_items"("gallery_id", "media_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_entity_types_slug_key" ON "content_entity_types"("slug");

-- CreateIndex
CREATE INDEX "content_entity_types_name_idx" ON "content_entity_types"("name");

-- CreateIndex
CREATE INDEX "content_entity_types_status_idx" ON "content_entity_types"("status");

-- CreateIndex
CREATE INDEX "content_entity_types_sort_order_idx" ON "content_entity_types"("sort_order");

-- CreateIndex
CREATE INDEX "content_entity_types_deleted_at_idx" ON "content_entity_types"("deleted_at");

-- CreateIndex
CREATE INDEX "content_entity_map_content_id_idx" ON "content_entity_map"("content_id");

-- CreateIndex
CREATE INDEX "content_entity_map_entity_type_id_entity_id_idx" ON "content_entity_map"("entity_type_id", "entity_id");

-- CreateIndex
CREATE INDEX "content_entity_map_status_sort_order_idx" ON "content_entity_map"("status", "sort_order");

-- CreateIndex
CREATE INDEX "content_entity_map_deleted_at_idx" ON "content_entity_map"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_entity_map_content_id_entity_type_id_entity_id_key" ON "content_entity_map"("content_id", "entity_type_id", "entity_id");

-- CreateIndex
CREATE INDEX "content_related_items_content_id_idx" ON "content_related_items"("content_id");

-- CreateIndex
CREATE INDEX "content_related_items_related_content_id_idx" ON "content_related_items"("related_content_id");

-- CreateIndex
CREATE INDEX "content_related_items_relation_type_idx" ON "content_related_items"("relation_type");

-- CreateIndex
CREATE INDEX "content_related_items_sort_order_idx" ON "content_related_items"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "content_related_items_content_id_related_content_id_key" ON "content_related_items"("content_id", "related_content_id");

-- CreateIndex
CREATE INDEX "content_versions_content_id_idx" ON "content_versions"("content_id");

-- CreateIndex
CREATE INDEX "content_versions_created_at_idx" ON "content_versions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_versions_content_id_version_number_key" ON "content_versions"("content_id", "version_number");

-- CreateIndex
CREATE INDEX "content_publish_logs_content_id_idx" ON "content_publish_logs"("content_id");

-- CreateIndex
CREATE INDEX "content_publish_logs_user_id_idx" ON "content_publish_logs"("user_id");

-- CreateIndex
CREATE INDEX "content_publish_logs_action_idx" ON "content_publish_logs"("action");

-- CreateIndex
CREATE INDEX "content_publish_logs_created_at_idx" ON "content_publish_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_statistics_content_id_key" ON "content_statistics"("content_id");

-- CreateIndex
CREATE UNIQUE INDEX "deity_profiles_deity_id_key" ON "deity_profiles"("deity_id");

-- CreateIndex
CREATE INDEX "deity_profiles_status_idx" ON "deity_profiles"("status");

-- CreateIndex
CREATE INDEX "deity_profiles_sort_order_idx" ON "deity_profiles"("sort_order");

-- CreateIndex
CREATE INDEX "deity_profiles_status_sort_order_idx" ON "deity_profiles"("status", "sort_order");

-- CreateIndex
CREATE INDEX "deity_profiles_deleted_at_idx" ON "deity_profiles"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "deity_profiles_deity_id_profile_code_key" ON "deity_profiles"("deity_id", "profile_code");

-- CreateIndex
CREATE INDEX "deity_avatars_deity_id_idx" ON "deity_avatars"("deity_id");

-- CreateIndex
CREATE INDEX "deity_avatars_status_idx" ON "deity_avatars"("status");

-- CreateIndex
CREATE INDEX "deity_avatars_sort_order_idx" ON "deity_avatars"("sort_order");

-- CreateIndex
CREATE INDEX "deity_avatars_status_sort_order_idx" ON "deity_avatars"("status", "sort_order");

-- CreateIndex
CREATE INDEX "deity_avatars_avatar_order_idx" ON "deity_avatars"("avatar_order");

-- CreateIndex
CREATE INDEX "deity_avatars_deleted_at_idx" ON "deity_avatars"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "deity_avatars_deity_id_avatar_code_key" ON "deity_avatars"("deity_id", "avatar_code");

-- CreateIndex
CREATE INDEX "deity_relations_deity_id_idx" ON "deity_relations"("deity_id");

-- CreateIndex
CREATE INDEX "deity_relations_related_deity_id_idx" ON "deity_relations"("related_deity_id");

-- CreateIndex
CREATE INDEX "deity_relations_relation_type_idx" ON "deity_relations"("relation_type");

-- CreateIndex
CREATE INDEX "deity_relations_sort_order_idx" ON "deity_relations"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "deity_relations_deity_id_related_deity_id_relation_type_key" ON "deity_relations"("deity_id", "related_deity_id", "relation_type");

-- CreateIndex
CREATE INDEX "deity_symbols_deity_id_idx" ON "deity_symbols"("deity_id");

-- CreateIndex
CREATE INDEX "deity_symbols_status_idx" ON "deity_symbols"("status");

-- CreateIndex
CREATE INDEX "deity_symbols_sort_order_idx" ON "deity_symbols"("sort_order");

-- CreateIndex
CREATE INDEX "deity_symbols_status_sort_order_idx" ON "deity_symbols"("status", "sort_order");

-- CreateIndex
CREATE INDEX "deity_symbols_deleted_at_idx" ON "deity_symbols"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "deity_symbols_deity_id_symbol_code_key" ON "deity_symbols"("deity_id", "symbol_code");

-- CreateIndex
CREATE INDEX "deity_attributes_deity_id_idx" ON "deity_attributes"("deity_id");

-- CreateIndex
CREATE INDEX "deity_attributes_status_idx" ON "deity_attributes"("status");

-- CreateIndex
CREATE INDEX "deity_attributes_sort_order_idx" ON "deity_attributes"("sort_order");

-- CreateIndex
CREATE INDEX "deity_attributes_deleted_at_idx" ON "deity_attributes"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "deity_attributes_deity_id_attribute_code_key" ON "deity_attributes"("deity_id", "attribute_code");

-- CreateIndex
CREATE INDEX "deity_blessings_deity_id_idx" ON "deity_blessings"("deity_id");

-- CreateIndex
CREATE INDEX "deity_blessings_status_idx" ON "deity_blessings"("status");

-- CreateIndex
CREATE INDEX "deity_blessings_sort_order_idx" ON "deity_blessings"("sort_order");

-- CreateIndex
CREATE INDEX "deity_blessings_deleted_at_idx" ON "deity_blessings"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "deity_blessings_deity_id_blessing_code_key" ON "deity_blessings"("deity_id", "blessing_code");

-- CreateIndex
CREATE INDEX "deity_mantras_deity_id_idx" ON "deity_mantras"("deity_id");

-- CreateIndex
CREATE INDEX "deity_mantras_language_id_idx" ON "deity_mantras"("language_id");

-- CreateIndex
CREATE INDEX "deity_mantras_name_idx" ON "deity_mantras"("name");

-- CreateIndex
CREATE UNIQUE INDEX "deity_mantras_deity_id_mantra_code_key" ON "deity_mantras"("deity_id", "mantra_code");

-- CreateIndex
CREATE INDEX "deity_aartis_deity_id_idx" ON "deity_aartis"("deity_id");

-- CreateIndex
CREATE INDEX "deity_aartis_language_id_idx" ON "deity_aartis"("language_id");

-- CreateIndex
CREATE INDEX "deity_aartis_name_idx" ON "deity_aartis"("name");

-- CreateIndex
CREATE UNIQUE INDEX "deity_aartis_deity_id_aarti_code_key" ON "deity_aartis"("deity_id", "aarti_code");

-- CreateIndex
CREATE INDEX "deity_stotras_deity_id_idx" ON "deity_stotras"("deity_id");

-- CreateIndex
CREATE INDEX "deity_stotras_language_id_idx" ON "deity_stotras"("language_id");

-- CreateIndex
CREATE INDEX "deity_stotras_name_idx" ON "deity_stotras"("name");

-- CreateIndex
CREATE UNIQUE INDEX "deity_stotras_deity_id_stotra_code_key" ON "deity_stotras"("deity_id", "stotra_code");

-- CreateIndex
CREATE INDEX "deity_stories_deity_id_idx" ON "deity_stories"("deity_id");

-- CreateIndex
CREATE INDEX "deity_stories_language_id_idx" ON "deity_stories"("language_id");

-- CreateIndex
CREATE INDEX "deity_stories_name_idx" ON "deity_stories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "deity_stories_deity_id_story_code_key" ON "deity_stories"("deity_id", "story_code");

-- CreateIndex
CREATE INDEX "deity_associations_deity_id_idx" ON "deity_associations"("deity_id");

-- CreateIndex
CREATE INDEX "deity_associations_association_type_idx" ON "deity_associations"("association_type");

-- CreateIndex
CREATE INDEX "deity_associations_status_idx" ON "deity_associations"("status");

-- CreateIndex
CREATE INDEX "deity_associations_sort_order_idx" ON "deity_associations"("sort_order");

-- CreateIndex
CREATE INDEX "deity_associations_deleted_at_idx" ON "deity_associations"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "deity_statistics_deity_id_key" ON "deity_statistics"("deity_id");

-- CreateIndex
CREATE INDEX "deity_statistics_status_idx" ON "deity_statistics"("status");

-- CreateIndex
CREATE INDEX "deity_external_links_deity_id_idx" ON "deity_external_links"("deity_id");

-- CreateIndex
CREATE INDEX "deity_external_links_link_type_idx" ON "deity_external_links"("link_type");

-- CreateIndex
CREATE INDEX "deity_external_links_status_idx" ON "deity_external_links"("status");

-- CreateIndex
CREATE INDEX "deity_external_links_sort_order_idx" ON "deity_external_links"("sort_order");

-- CreateIndex
CREATE INDEX "deity_external_links_deleted_at_idx" ON "deity_external_links"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "deity_external_links_deity_id_link_code_key" ON "deity_external_links"("deity_id", "link_code");

-- CreateIndex
CREATE INDEX "deity_change_history_deity_id_idx" ON "deity_change_history"("deity_id");

-- CreateIndex
CREATE INDEX "deity_change_history_user_id_idx" ON "deity_change_history"("user_id");

-- CreateIndex
CREATE INDEX "deity_change_history_action_idx" ON "deity_change_history"("action");

-- CreateIndex
CREATE INDEX "deity_change_history_created_at_idx" ON "deity_change_history"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "panchangs_panchang_code_key" ON "panchangs"("panchang_code");

-- CreateIndex
CREATE UNIQUE INDEX "panchangs_slug_key" ON "panchangs"("slug");

-- CreateIndex
CREATE INDEX "panchangs_country_id_idx" ON "panchangs"("country_id");

-- CreateIndex
CREATE INDEX "panchangs_state_id_idx" ON "panchangs"("state_id");

-- CreateIndex
CREATE INDEX "panchangs_status_idx" ON "panchangs"("status");

-- CreateIndex
CREATE INDEX "panchangs_is_default_idx" ON "panchangs"("is_default");

-- CreateIndex
CREATE INDEX "panchangs_sort_order_idx" ON "panchangs"("sort_order");

-- CreateIndex
CREATE INDEX "panchangs_deleted_at_idx" ON "panchangs"("deleted_at");

-- CreateIndex
CREATE INDEX "panchang_translations_language_idx" ON "panchang_translations"("language");

-- CreateIndex
CREATE UNIQUE INDEX "panchang_translations_panchang_id_language_key" ON "panchang_translations"("panchang_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "panchang_categories_slug_key" ON "panchang_categories"("slug");

-- CreateIndex
CREATE INDEX "panchang_categories_name_idx" ON "panchang_categories"("name");

-- CreateIndex
CREATE INDEX "panchang_category_map_panchang_id_idx" ON "panchang_category_map"("panchang_id");

-- CreateIndex
CREATE INDEX "panchang_category_map_category_id_idx" ON "panchang_category_map"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "panchang_category_map_panchang_id_category_id_key" ON "panchang_category_map"("panchang_id", "category_id");

-- CreateIndex
CREATE INDEX "panchang_regions_panchang_id_idx" ON "panchang_regions"("panchang_id");

-- CreateIndex
CREATE INDEX "panchang_regions_country_id_idx" ON "panchang_regions"("country_id");

-- CreateIndex
CREATE INDEX "panchang_regions_state_id_idx" ON "panchang_regions"("state_id");

-- CreateIndex
CREATE INDEX "panchang_regions_city_id_idx" ON "panchang_regions"("city_id");

-- CreateIndex
CREATE INDEX "panchang_regions_status_idx" ON "panchang_regions"("status");

-- CreateIndex
CREATE INDEX "panchang_dates_panchang_id_idx" ON "panchang_dates"("panchang_id");

-- CreateIndex
CREATE INDEX "panchang_dates_calendar_date_idx" ON "panchang_dates"("calendar_date");

-- CreateIndex
CREATE INDEX "panchang_dates_status_idx" ON "panchang_dates"("status");

-- CreateIndex
CREATE UNIQUE INDEX "panchang_dates_panchang_id_calendar_date_key" ON "panchang_dates"("panchang_id", "calendar_date");

-- CreateIndex
CREATE UNIQUE INDEX "tithis_tithi_code_key" ON "tithis"("tithi_code");

-- CreateIndex
CREATE INDEX "tithis_name_idx" ON "tithis"("name");

-- CreateIndex
CREATE INDEX "tithis_paksha_idx" ON "tithis"("paksha");

-- CreateIndex
CREATE INDEX "tithis_status_idx" ON "tithis"("status");

-- CreateIndex
CREATE INDEX "tithis_sort_order_idx" ON "tithis"("sort_order");

-- CreateIndex
CREATE INDEX "tithis_deleted_at_idx" ON "tithis"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "nakshatras_nakshatra_code_key" ON "nakshatras"("nakshatra_code");

-- CreateIndex
CREATE INDEX "nakshatras_name_idx" ON "nakshatras"("name");

-- CreateIndex
CREATE INDEX "nakshatras_status_idx" ON "nakshatras"("status");

-- CreateIndex
CREATE INDEX "nakshatras_sort_order_idx" ON "nakshatras"("sort_order");

-- CreateIndex
CREATE INDEX "nakshatras_deleted_at_idx" ON "nakshatras"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "yogas_yoga_code_key" ON "yogas"("yoga_code");

-- CreateIndex
CREATE INDEX "yogas_name_idx" ON "yogas"("name");

-- CreateIndex
CREATE INDEX "yogas_status_idx" ON "yogas"("status");

-- CreateIndex
CREATE INDEX "yogas_sort_order_idx" ON "yogas"("sort_order");

-- CreateIndex
CREATE INDEX "yogas_deleted_at_idx" ON "yogas"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "karanas_karana_code_key" ON "karanas"("karana_code");

-- CreateIndex
CREATE INDEX "karanas_name_idx" ON "karanas"("name");

-- CreateIndex
CREATE INDEX "karanas_status_idx" ON "karanas"("status");

-- CreateIndex
CREATE INDEX "karanas_sort_order_idx" ON "karanas"("sort_order");

-- CreateIndex
CREATE INDEX "karanas_deleted_at_idx" ON "karanas"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "panchang_day_elements_panchang_date_id_key" ON "panchang_day_elements"("panchang_date_id");

-- CreateIndex
CREATE INDEX "panchang_day_elements_tithi_id_idx" ON "panchang_day_elements"("tithi_id");

-- CreateIndex
CREATE INDEX "panchang_day_elements_nakshatra_id_idx" ON "panchang_day_elements"("nakshatra_id");

-- CreateIndex
CREATE INDEX "panchang_day_elements_yoga_id_idx" ON "panchang_day_elements"("yoga_id");

-- CreateIndex
CREATE INDEX "panchang_day_elements_karana_id_idx" ON "panchang_day_elements"("karana_id");

-- CreateIndex
CREATE UNIQUE INDEX "muhurats_muhurat_code_key" ON "muhurats"("muhurat_code");

-- CreateIndex
CREATE INDEX "muhurats_name_idx" ON "muhurats"("name");

-- CreateIndex
CREATE INDEX "muhurats_category_idx" ON "muhurats"("category");

-- CreateIndex
CREATE INDEX "muhurats_status_idx" ON "muhurats"("status");

-- CreateIndex
CREATE INDEX "muhurats_sort_order_idx" ON "muhurats"("sort_order");

-- CreateIndex
CREATE INDEX "muhurats_deleted_at_idx" ON "muhurats"("deleted_at");

-- CreateIndex
CREATE INDEX "choghadiyas_panchang_date_id_idx" ON "choghadiyas"("panchang_date_id");

-- CreateIndex
CREATE INDEX "choghadiyas_period_type_idx" ON "choghadiyas"("period_type");

-- CreateIndex
CREATE INDEX "choghadiyas_choghadiya_type_idx" ON "choghadiyas"("choghadiya_type");

-- CreateIndex
CREATE INDEX "choghadiyas_sort_order_idx" ON "choghadiyas"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "rahu_kaal_panchang_date_id_key" ON "rahu_kaal"("panchang_date_id");

-- CreateIndex
CREATE UNIQUE INDEX "gulika_kaal_panchang_date_id_key" ON "gulika_kaal"("panchang_date_id");

-- CreateIndex
CREATE UNIQUE INDEX "yamaganda_kaal_panchang_date_id_key" ON "yamaganda_kaal"("panchang_date_id");

-- CreateIndex
CREATE UNIQUE INDEX "abhijit_muhurat_panchang_date_id_key" ON "abhijit_muhurat"("panchang_date_id");

-- CreateIndex
CREATE UNIQUE INDEX "vrats_vrat_code_key" ON "vrats"("vrat_code");

-- CreateIndex
CREATE UNIQUE INDEX "vrats_slug_key" ON "vrats"("slug");

-- CreateIndex
CREATE INDEX "vrats_name_idx" ON "vrats"("name");

-- CreateIndex
CREATE INDEX "vrats_vrat_type_idx" ON "vrats"("vrat_type");

-- CreateIndex
CREATE INDEX "vrats_status_idx" ON "vrats"("status");

-- CreateIndex
CREATE INDEX "vrats_sort_order_idx" ON "vrats"("sort_order");

-- CreateIndex
CREATE INDEX "vrats_deleted_at_idx" ON "vrats"("deleted_at");

-- CreateIndex
CREATE INDEX "vrat_dates_vrat_id_idx" ON "vrat_dates"("vrat_id");

-- CreateIndex
CREATE INDEX "vrat_dates_panchang_date_id_idx" ON "vrat_dates"("panchang_date_id");

-- CreateIndex
CREATE INDEX "vrat_dates_is_major_idx" ON "vrat_dates"("is_major");

-- CreateIndex
CREATE UNIQUE INDEX "vrat_dates_vrat_id_panchang_date_id_key" ON "vrat_dates"("vrat_id", "panchang_date_id");

-- CreateIndex
CREATE INDEX "vrat_rules_vrat_id_idx" ON "vrat_rules"("vrat_id");

-- CreateIndex
CREATE INDEX "vrat_rules_status_idx" ON "vrat_rules"("status");

-- CreateIndex
CREATE INDEX "vrat_rules_sort_order_idx" ON "vrat_rules"("sort_order");

-- CreateIndex
CREATE INDEX "vrat_rules_deleted_at_idx" ON "vrat_rules"("deleted_at");

-- CreateIndex
CREATE INDEX "vrat_benefits_vrat_id_idx" ON "vrat_benefits"("vrat_id");

-- CreateIndex
CREATE INDEX "vrat_benefits_status_idx" ON "vrat_benefits"("status");

-- CreateIndex
CREATE INDEX "vrat_benefits_sort_order_idx" ON "vrat_benefits"("sort_order");

-- CreateIndex
CREATE INDEX "vrat_benefits_deleted_at_idx" ON "vrat_benefits"("deleted_at");

-- CreateIndex
CREATE INDEX "vrat_food_rules_vrat_id_idx" ON "vrat_food_rules"("vrat_id");

-- CreateIndex
CREATE INDEX "vrat_food_rules_food_type_idx" ON "vrat_food_rules"("food_type");

-- CreateIndex
CREATE INDEX "vrat_food_rules_allowed_idx" ON "vrat_food_rules"("allowed");

-- CreateIndex
CREATE INDEX "vrat_food_rules_status_idx" ON "vrat_food_rules"("status");

-- CreateIndex
CREATE INDEX "vrat_food_rules_sort_order_idx" ON "vrat_food_rules"("sort_order");

-- CreateIndex
CREATE INDEX "vrat_food_rules_deleted_at_idx" ON "vrat_food_rules"("deleted_at");

-- CreateIndex
CREATE INDEX "ekadashi_panchang_date_id_idx" ON "ekadashi"("panchang_date_id");

-- CreateIndex
CREATE INDEX "ekadashi_status_idx" ON "ekadashi"("status");

-- CreateIndex
CREATE INDEX "ekadashi_is_major_idx" ON "ekadashi"("is_major");

-- CreateIndex
CREATE INDEX "purnima_panchang_date_id_idx" ON "purnima"("panchang_date_id");

-- CreateIndex
CREATE INDEX "purnima_status_idx" ON "purnima"("status");

-- CreateIndex
CREATE INDEX "purnima_is_major_idx" ON "purnima"("is_major");

-- CreateIndex
CREATE INDEX "amavasya_panchang_date_id_idx" ON "amavasya"("panchang_date_id");

-- CreateIndex
CREATE INDEX "amavasya_status_idx" ON "amavasya"("status");

-- CreateIndex
CREATE INDEX "amavasya_is_major_idx" ON "amavasya"("is_major");

-- CreateIndex
CREATE INDEX "pradosh_panchang_date_id_idx" ON "pradosh"("panchang_date_id");

-- CreateIndex
CREATE INDEX "pradosh_status_idx" ON "pradosh"("status");

-- CreateIndex
CREATE INDEX "pradosh_is_major_idx" ON "pradosh"("is_major");

-- CreateIndex
CREATE INDEX "sankashti_panchang_date_id_idx" ON "sankashti"("panchang_date_id");

-- CreateIndex
CREATE INDEX "sankashti_status_idx" ON "sankashti"("status");

-- CreateIndex
CREATE INDEX "sankashti_is_major_idx" ON "sankashti"("is_major");

-- CreateIndex
CREATE UNIQUE INDEX "planets_planet_code_key" ON "planets"("planet_code");

-- CreateIndex
CREATE UNIQUE INDEX "planets_slug_key" ON "planets"("slug");

-- CreateIndex
CREATE INDEX "planets_name_idx" ON "planets"("name");

-- CreateIndex
CREATE INDEX "planets_planet_type_idx" ON "planets"("planet_type");

-- CreateIndex
CREATE INDEX "planets_status_idx" ON "planets"("status");

-- CreateIndex
CREATE INDEX "planets_sort_order_idx" ON "planets"("sort_order");

-- CreateIndex
CREATE INDEX "planets_deleted_at_idx" ON "planets"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "rashis_rashi_code_key" ON "rashis"("rashi_code");

-- CreateIndex
CREATE UNIQUE INDEX "rashis_slug_key" ON "rashis"("slug");

-- CreateIndex
CREATE INDEX "rashis_name_idx" ON "rashis"("name");

-- CreateIndex
CREATE INDEX "rashis_element_idx" ON "rashis"("element");

-- CreateIndex
CREATE INDEX "rashis_status_idx" ON "rashis"("status");

-- CreateIndex
CREATE INDEX "rashis_sort_order_idx" ON "rashis"("sort_order");

-- CreateIndex
CREATE INDEX "rashis_deleted_at_idx" ON "rashis"("deleted_at");

-- CreateIndex
CREATE INDEX "panchang_planet_positions_panchang_date_id_idx" ON "panchang_planet_positions"("panchang_date_id");

-- CreateIndex
CREATE INDEX "panchang_planet_positions_planet_id_idx" ON "panchang_planet_positions"("planet_id");

-- CreateIndex
CREATE INDEX "panchang_planet_positions_rashi_id_idx" ON "panchang_planet_positions"("rashi_id");

-- CreateIndex
CREATE INDEX "panchang_planet_positions_is_retrograde_idx" ON "panchang_planet_positions"("is_retrograde");

-- CreateIndex
CREATE UNIQUE INDEX "panchang_planet_positions_panchang_date_id_planet_id_key" ON "panchang_planet_positions"("panchang_date_id", "planet_id");

-- CreateIndex
CREATE INDEX "panchang_rashi_transits_panchang_date_id_idx" ON "panchang_rashi_transits"("panchang_date_id");

-- CreateIndex
CREATE INDEX "panchang_rashi_transits_planet_id_idx" ON "panchang_rashi_transits"("planet_id");

-- CreateIndex
CREATE INDEX "panchang_rashi_transits_from_rashi_id_idx" ON "panchang_rashi_transits"("from_rashi_id");

-- CreateIndex
CREATE INDEX "panchang_rashi_transits_to_rashi_id_idx" ON "panchang_rashi_transits"("to_rashi_id");

-- CreateIndex
CREATE INDEX "panchang_rashi_transits_transit_time_idx" ON "panchang_rashi_transits"("transit_time");

-- CreateIndex
CREATE UNIQUE INDEX "panchang_statistics_panchang_id_key" ON "panchang_statistics"("panchang_id");

-- CreateIndex
CREATE INDEX "panchang_statistics_status_idx" ON "panchang_statistics"("status");

-- CreateIndex
CREATE INDEX "panchang_external_links_panchang_id_idx" ON "panchang_external_links"("panchang_id");

-- CreateIndex
CREATE INDEX "panchang_external_links_link_type_idx" ON "panchang_external_links"("link_type");

-- CreateIndex
CREATE INDEX "panchang_external_links_status_idx" ON "panchang_external_links"("status");

-- CreateIndex
CREATE INDEX "panchang_external_links_sort_order_idx" ON "panchang_external_links"("sort_order");

-- CreateIndex
CREATE INDEX "panchang_external_links_deleted_at_idx" ON "panchang_external_links"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "panchang_external_links_panchang_id_link_code_key" ON "panchang_external_links"("panchang_id", "link_code");

-- CreateIndex
CREATE INDEX "panchang_sources_panchang_id_idx" ON "panchang_sources"("panchang_id");

-- CreateIndex
CREATE INDEX "panchang_sources_language_id_idx" ON "panchang_sources"("language_id");

-- CreateIndex
CREATE INDEX "panchang_sources_status_idx" ON "panchang_sources"("status");

-- CreateIndex
CREATE INDEX "panchang_sources_sort_order_idx" ON "panchang_sources"("sort_order");

-- CreateIndex
CREATE INDEX "panchang_sources_deleted_at_idx" ON "panchang_sources"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "panchang_sources_panchang_id_source_code_key" ON "panchang_sources"("panchang_id", "source_code");

-- CreateIndex
CREATE INDEX "panchang_change_history_panchang_id_idx" ON "panchang_change_history"("panchang_id");

-- CreateIndex
CREATE INDEX "panchang_change_history_user_id_idx" ON "panchang_change_history"("user_id");

-- CreateIndex
CREATE INDEX "panchang_change_history_action_idx" ON "panchang_change_history"("action");

-- CreateIndex
CREATE INDEX "panchang_change_history_created_at_idx" ON "panchang_change_history"("created_at");

-- AddForeignKey
ALTER TABLE "countries" ADD CONSTRAINT "countries_continent_id_fkey" FOREIGN KEY ("continent_id") REFERENCES "continents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "states_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deities" ADD CONSTRAINT "deities_deity_type_id_fkey" FOREIGN KEY ("deity_type_id") REFERENCES "deity_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_translations" ADD CONSTRAINT "deity_translations_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_category_map" ADD CONSTRAINT "deity_category_map_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_category_map" ADD CONSTRAINT "deity_category_map_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "deity_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temples" ADD CONSTRAINT "temples_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temples" ADD CONSTRAINT "temples_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temples" ADD CONSTRAINT "temples_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temples" ADD CONSTRAINT "temples_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_deity_map" ADD CONSTRAINT "temple_deity_map_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_deity_map" ADD CONSTRAINT "temple_deity_map_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_category_map" ADD CONSTRAINT "temple_category_map_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_category_map" ADD CONSTRAINT "temple_category_map_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "temple_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_timings" ADD CONSTRAINT "temple_timings_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_aartis" ADD CONSTRAINT "temple_aartis_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_aartis" ADD CONSTRAINT "temple_aartis_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_poojas" ADD CONSTRAINT "temple_poojas_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_poojas" ADD CONSTRAINT "temple_poojas_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_darshan_types" ADD CONSTRAINT "temple_darshan_types_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_special_events" ADD CONSTRAINT "temple_special_events_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_special_events" ADD CONSTRAINT "temple_special_events_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_facilities" ADD CONSTRAINT "temple_facilities_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_rules" ADD CONSTRAINT "temple_rules_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_contacts" ADD CONSTRAINT "temple_contacts_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_faqs" ADD CONSTRAINT "temple_faqs_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_faqs" ADD CONSTRAINT "temple_faqs_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_accessibility" ADD CONSTRAINT "temple_accessibility_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_dress_codes" ADD CONSTRAINT "temple_dress_codes_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_routes" ADD CONSTRAINT "temple_routes_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_nearby_places" ADD CONSTRAINT "temple_nearby_places_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_parking" ADD CONSTRAINT "temple_parking_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_accommodations" ADD CONSTRAINT "temple_accommodations_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_prasadam" ADD CONSTRAINT "temple_prasadam_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_media" ADD CONSTRAINT "temple_media_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_media" ADD CONSTRAINT "temple_media_media_type_id_fkey" FOREIGN KEY ("media_type_id") REFERENCES "media_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_media" ADD CONSTRAINT "temple_media_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_documents" ADD CONSTRAINT "temple_documents_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_documents" ADD CONSTRAINT "temple_documents_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_sources" ADD CONSTRAINT "temple_sources_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_sources" ADD CONSTRAINT "temple_sources_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_live_darshan" ADD CONSTRAINT "temple_live_darshan_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_donations" ADD CONSTRAINT "temple_donations_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_external_links" ADD CONSTRAINT "temple_external_links_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_qr_codes" ADD CONSTRAINT "temple_qr_codes_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_statistics" ADD CONSTRAINT "temple_statistics_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_change_history" ADD CONSTRAINT "temple_change_history_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_change_history" ADD CONSTRAINT "temple_change_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_translations" ADD CONSTRAINT "temple_translations_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temple_pilgrim_tips" ADD CONSTRAINT "temple_pilgrim_tips_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_library" ADD CONSTRAINT "media_library_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_statistics" ADD CONSTRAINT "festival_statistics_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_category_map" ADD CONSTRAINT "festival_category_map_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_category_map" ADD CONSTRAINT "festival_category_map_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "festival_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_dates" ADD CONSTRAINT "festival_dates_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_regions" ADD CONSTRAINT "festival_regions_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_regions" ADD CONSTRAINT "festival_regions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_regions" ADD CONSTRAINT "festival_regions_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_regions" ADD CONSTRAINT "festival_regions_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_deity_map" ADD CONSTRAINT "festival_deity_map_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_deity_map" ADD CONSTRAINT "festival_deity_map_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_temple_map" ADD CONSTRAINT "festival_temple_map_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_temple_map" ADD CONSTRAINT "festival_temple_map_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "temples"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_rituals" ADD CONSTRAINT "festival_rituals_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_puja_vidhis" ADD CONSTRAINT "festival_puja_vidhis_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_samagri" ADD CONSTRAINT "festival_samagri_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_fasting_rules" ADD CONSTRAINT "festival_fasting_rules_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_foods" ADD CONSTRAINT "festival_foods_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_kathas" ADD CONSTRAINT "festival_kathas_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_kathas" ADD CONSTRAINT "festival_kathas_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_mantras" ADD CONSTRAINT "festival_mantras_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_mantras" ADD CONSTRAINT "festival_mantras_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_aartis" ADD CONSTRAINT "festival_aartis_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_aartis" ADD CONSTRAINT "festival_aartis_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_bhajans" ADD CONSTRAINT "festival_bhajans_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_bhajans" ADD CONSTRAINT "festival_bhajans_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_galleries" ADD CONSTRAINT "festival_galleries_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_galleries" ADD CONSTRAINT "festival_galleries_media_type_id_fkey" FOREIGN KEY ("media_type_id") REFERENCES "media_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_galleries" ADD CONSTRAINT "festival_galleries_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_videos" ADD CONSTRAINT "festival_videos_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_videos" ADD CONSTRAINT "festival_videos_media_type_id_fkey" FOREIGN KEY ("media_type_id") REFERENCES "media_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_videos" ADD CONSTRAINT "festival_videos_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_translations" ADD CONSTRAINT "festival_translations_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "festivals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "content_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_translations" ADD CONSTRAINT "content_translations_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "contents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reviews" ADD CONSTRAINT "user_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_ratings" ADD CONSTRAINT "user_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_comments" ADD CONSTRAINT "user_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_comments" ADD CONSTRAINT "user_comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "user_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_content_type_id_fkey" FOREIGN KEY ("content_type_id") REFERENCES "content_item_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "content_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_item_translations" ADD CONSTRAINT "content_item_translations_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_item_translations" ADD CONSTRAINT "content_item_translations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_categories" ADD CONSTRAINT "content_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "content_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_tag_map" ADD CONSTRAINT "content_tag_map_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_tag_map" ADD CONSTRAINT "content_tag_map_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "content_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_media" ADD CONSTRAINT "content_media_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_media" ADD CONSTRAINT "content_media_media_type_id_fkey" FOREIGN KEY ("media_type_id") REFERENCES "media_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_media" ADD CONSTRAINT "content_media_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_seo" ADD CONSTRAINT "content_seo_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_attachments" ADD CONSTRAINT "content_attachments_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_attachments" ADD CONSTRAINT "content_attachments_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_galleries" ADD CONSTRAINT "content_galleries_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_galleries" ADD CONSTRAINT "content_galleries_cover_media_id_fkey" FOREIGN KEY ("cover_media_id") REFERENCES "content_media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_gallery_items" ADD CONSTRAINT "content_gallery_items_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "content_galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_gallery_items" ADD CONSTRAINT "content_gallery_items_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "content_media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_entity_map" ADD CONSTRAINT "content_entity_map_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_entity_map" ADD CONSTRAINT "content_entity_map_entity_type_id_fkey" FOREIGN KEY ("entity_type_id") REFERENCES "content_entity_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_related_items" ADD CONSTRAINT "content_related_items_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_related_items" ADD CONSTRAINT "content_related_items_related_content_id_fkey" FOREIGN KEY ("related_content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_publish_logs" ADD CONSTRAINT "content_publish_logs_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_publish_logs" ADD CONSTRAINT "content_publish_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_statistics" ADD CONSTRAINT "content_statistics_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_profiles" ADD CONSTRAINT "deity_profiles_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_avatars" ADD CONSTRAINT "deity_avatars_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_relations" ADD CONSTRAINT "deity_relations_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_relations" ADD CONSTRAINT "deity_relations_related_deity_id_fkey" FOREIGN KEY ("related_deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_symbols" ADD CONSTRAINT "deity_symbols_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_attributes" ADD CONSTRAINT "deity_attributes_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_blessings" ADD CONSTRAINT "deity_blessings_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_mantras" ADD CONSTRAINT "deity_mantras_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_mantras" ADD CONSTRAINT "deity_mantras_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_aartis" ADD CONSTRAINT "deity_aartis_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_aartis" ADD CONSTRAINT "deity_aartis_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_stotras" ADD CONSTRAINT "deity_stotras_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_stotras" ADD CONSTRAINT "deity_stotras_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_stories" ADD CONSTRAINT "deity_stories_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_stories" ADD CONSTRAINT "deity_stories_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_associations" ADD CONSTRAINT "deity_associations_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_statistics" ADD CONSTRAINT "deity_statistics_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_external_links" ADD CONSTRAINT "deity_external_links_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_change_history" ADD CONSTRAINT "deity_change_history_deity_id_fkey" FOREIGN KEY ("deity_id") REFERENCES "deities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deity_change_history" ADD CONSTRAINT "deity_change_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchangs" ADD CONSTRAINT "panchangs_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchangs" ADD CONSTRAINT "panchangs_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_translations" ADD CONSTRAINT "panchang_translations_panchang_id_fkey" FOREIGN KEY ("panchang_id") REFERENCES "panchangs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_category_map" ADD CONSTRAINT "panchang_category_map_panchang_id_fkey" FOREIGN KEY ("panchang_id") REFERENCES "panchangs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_category_map" ADD CONSTRAINT "panchang_category_map_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "panchang_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_regions" ADD CONSTRAINT "panchang_regions_panchang_id_fkey" FOREIGN KEY ("panchang_id") REFERENCES "panchangs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_regions" ADD CONSTRAINT "panchang_regions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_regions" ADD CONSTRAINT "panchang_regions_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_regions" ADD CONSTRAINT "panchang_regions_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_dates" ADD CONSTRAINT "panchang_dates_panchang_id_fkey" FOREIGN KEY ("panchang_id") REFERENCES "panchangs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_day_elements" ADD CONSTRAINT "panchang_day_elements_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_day_elements" ADD CONSTRAINT "panchang_day_elements_tithi_id_fkey" FOREIGN KEY ("tithi_id") REFERENCES "tithis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_day_elements" ADD CONSTRAINT "panchang_day_elements_nakshatra_id_fkey" FOREIGN KEY ("nakshatra_id") REFERENCES "nakshatras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_day_elements" ADD CONSTRAINT "panchang_day_elements_yoga_id_fkey" FOREIGN KEY ("yoga_id") REFERENCES "yogas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_day_elements" ADD CONSTRAINT "panchang_day_elements_karana_id_fkey" FOREIGN KEY ("karana_id") REFERENCES "karanas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "choghadiyas" ADD CONSTRAINT "choghadiyas_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rahu_kaal" ADD CONSTRAINT "rahu_kaal_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gulika_kaal" ADD CONSTRAINT "gulika_kaal_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yamaganda_kaal" ADD CONSTRAINT "yamaganda_kaal_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abhijit_muhurat" ADD CONSTRAINT "abhijit_muhurat_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vrat_dates" ADD CONSTRAINT "vrat_dates_vrat_id_fkey" FOREIGN KEY ("vrat_id") REFERENCES "vrats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vrat_dates" ADD CONSTRAINT "vrat_dates_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vrat_rules" ADD CONSTRAINT "vrat_rules_vrat_id_fkey" FOREIGN KEY ("vrat_id") REFERENCES "vrats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vrat_benefits" ADD CONSTRAINT "vrat_benefits_vrat_id_fkey" FOREIGN KEY ("vrat_id") REFERENCES "vrats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vrat_food_rules" ADD CONSTRAINT "vrat_food_rules_vrat_id_fkey" FOREIGN KEY ("vrat_id") REFERENCES "vrats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ekadashi" ADD CONSTRAINT "ekadashi_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purnima" ADD CONSTRAINT "purnima_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amavasya" ADD CONSTRAINT "amavasya_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pradosh" ADD CONSTRAINT "pradosh_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sankashti" ADD CONSTRAINT "sankashti_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_planet_positions" ADD CONSTRAINT "panchang_planet_positions_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_planet_positions" ADD CONSTRAINT "panchang_planet_positions_planet_id_fkey" FOREIGN KEY ("planet_id") REFERENCES "planets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_planet_positions" ADD CONSTRAINT "panchang_planet_positions_rashi_id_fkey" FOREIGN KEY ("rashi_id") REFERENCES "rashis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_rashi_transits" ADD CONSTRAINT "panchang_rashi_transits_panchang_date_id_fkey" FOREIGN KEY ("panchang_date_id") REFERENCES "panchang_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_rashi_transits" ADD CONSTRAINT "panchang_rashi_transits_planet_id_fkey" FOREIGN KEY ("planet_id") REFERENCES "planets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_rashi_transits" ADD CONSTRAINT "panchang_rashi_transits_from_rashi_id_fkey" FOREIGN KEY ("from_rashi_id") REFERENCES "rashis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_rashi_transits" ADD CONSTRAINT "panchang_rashi_transits_to_rashi_id_fkey" FOREIGN KEY ("to_rashi_id") REFERENCES "rashis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_statistics" ADD CONSTRAINT "panchang_statistics_panchang_id_fkey" FOREIGN KEY ("panchang_id") REFERENCES "panchangs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_external_links" ADD CONSTRAINT "panchang_external_links_panchang_id_fkey" FOREIGN KEY ("panchang_id") REFERENCES "panchangs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_sources" ADD CONSTRAINT "panchang_sources_panchang_id_fkey" FOREIGN KEY ("panchang_id") REFERENCES "panchangs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_sources" ADD CONSTRAINT "panchang_sources_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_change_history" ADD CONSTRAINT "panchang_change_history_panchang_id_fkey" FOREIGN KEY ("panchang_id") REFERENCES "panchangs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panchang_change_history" ADD CONSTRAINT "panchang_change_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
