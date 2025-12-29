-- CreateTable
CREATE TABLE "app_settings" (
    "key" TEXT NOT NULL,
    "value" JSONB DEFAULT '{}',
    "description" TEXT,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "club_members" (
    "club_id" INTEGER NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "status" VARCHAR(50),
    "joined_at" TIMESTAMP(3),

    CONSTRAINT "club_members_pkey" PRIMARY KEY ("club_id","user_id")
);

-- CreateTable
CREATE TABLE "club_statistics" (
    "id" SERIAL NOT NULL,
    "club_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "total_cost" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "sessions_count" INTEGER NOT NULL DEFAULT 0,
    "no_show_count" INTEGER NOT NULL DEFAULT 0,
    "active_membership" INTEGER NOT NULL DEFAULT 0,
    "expried_membership" INTEGER NOT NULL DEFAULT 0,
    "total_outsider" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "club_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "owner_id" VARCHAR(36) NOT NULL,
    "description" TEXT,
    "province_code" TEXT NOT NULL,
    "ward_code" TEXT NOT NULL,
    "image_url" TEXT,
    "total_members" INTEGER NOT NULL DEFAULT 1,
    "is_public" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_players" (
    "match_id" INTEGER NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "team" VARCHAR(10),

    CONSTRAINT "match_players_pkey" PRIMARY KEY ("match_id","user_id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "score_team_a" INTEGER,
    "score_team_b" INTEGER,
    "is_verified_dupr" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_plans" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "session_limit" INTEGER,
    "duration_days" INTEGER NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "club_id" INTEGER NOT NULL,
    "session_hours" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "membership_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "type" VARCHAR(50),
    "title" VARCHAR(500),
    "content" TEXT,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "session_id" INTEGER,
    "membership_plan_id" INTEGER,
    "amount" DECIMAL(12,2),
    "payment_method" VARCHAR(50),
    "payment_type" VARCHAR(50),
    "status" VARCHAR(50),
    "transfer_id" VARCHAR(50),
    "third_party_name" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_players" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "is_membership" BOOLEAN,
    "registration_status" VARCHAR(50),
    "check_in_status" VARCHAR(50),
    "status" VARCHAR(50),
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "session_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "host_id" VARCHAR(36) NOT NULL,
    "club_id" INTEGER NOT NULL,
    "venue_id" INTEGER NOT NULL,
    "title" VARCHAR(200),
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "max_players" INTEGER,
    "price_member" DECIMAL(18,2),
    "price_outsider" DECIMAL(18,2),
    "image_url" TEXT,
    "status" VARCHAR(50),
    "note" TEXT,
    "surcharge_amount" DECIMAL(12,2),
    "is_public" BOOLEAN DEFAULT true,
    "options" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_memberships" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(36) NOT NULL,
    "plan_id" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" VARCHAR(50),
    "remaining_sessions" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(36) NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'user',
    "avatar_url" TEXT,
    "banking_info" JSONB,
    "dupr_id" TEXT,
    "points" DECIMAL(15,10) DEFAULT 0,
    "gender" BOOLEAN DEFAULT false,
    "province_code" TEXT,
    "ward_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venues" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "province_code" TEXT NOT NULL,
    "ward_code" TEXT NOT NULL,
    "address" JSONB,
    "link_ggmap" TEXT,
    "lat" DECIMAL(10,8),
    "lng" DECIMAL(11,8),
    "is_verify" BOOLEAN DEFAULT false,
    "description" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "club_statistics_year_month_idx" ON "club_statistics"("year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "club_statistics_club_id_year_month_key" ON "club_statistics"("club_id", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transfer_id_key" ON "payments"("transfer_id");

-- CreateIndex
CREATE INDEX "sessions_start_time_idx" ON "sessions"("start_time");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "users"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_dupr_id_key" ON "users"("dupr_id");

-- CreateIndex
CREATE INDEX "users_province_code_idx" ON "users"("province_code");

-- CreateIndex
CREATE INDEX "users_ward_code_idx" ON "users"("ward_code");

-- CreateIndex
CREATE INDEX "venues_lat_lng_idx" ON "venues"("lat", "lng");

-- CreateIndex
CREATE INDEX "venues_province_code_idx" ON "venues"("province_code");

-- CreateIndex
CREATE INDEX "venues_ward_code_idx" ON "venues"("ward_code");

-- AddForeignKey
ALTER TABLE "club_members" ADD CONSTRAINT "club_members_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_members" ADD CONSTRAINT "club_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_statistics" ADD CONSTRAINT "club_statistics_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_players" ADD CONSTRAINT "match_players_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_plans" ADD CONSTRAINT "membership_plans_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_membership_plan_id_fkey" FOREIGN KEY ("membership_plan_id") REFERENCES "membership_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_players" ADD CONSTRAINT "session_players_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_players" ADD CONSTRAINT "session_players_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_memberships" ADD CONSTRAINT "user_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_memberships" ADD CONSTRAINT "user_memberships_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "membership_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Create SystemKpiSummary view
DROP VIEW IF EXISTS "system_kpi_summary";

CREATE OR REPLACE VIEW "system_kpi_summary" AS
SELECT
    cs.year,
    cs.month,
    
    -- 1. totalSessions
    -- SỬA: sessions_count (thêm s)
    CAST(COALESCE(SUM(cs."sessions_count"), 0) AS INTEGER) AS "totalSessions",

    -- 2. noShowRate
    -- SỬA: sessions_count (thêm s)
    COALESCE(
        CAST(SUM(cs."no_show_count") AS DOUBLE PRECISION) / 
        NULLIF(SUM(cs."sessions_count"), 0), 
        0.0
    ) AS "noShowRate",

    -- 3. conversionRate
    -- SỬA: total_outsider (bỏ s ở cuối), sessions_count (thêm s)
    COALESCE(
        CAST(SUM(cs."total_outsider") AS DOUBLE PRECISION) / 
        NULLIF(SUM(cs."sessions_count"), 0), 
        0.0
    ) AS "conversionRate",

    -- 4. retentionRate
    -- GIỮ NGUYÊN: expried_membership (theo tên cột sai chính tả hiện tại của bạn)
    COALESCE(
        CAST(SUM(cs."active_membership") AS DOUBLE PRECISION) / 
        NULLIF(SUM(cs."active_membership") + SUM(cs."expried_membership"), 0), 
        0.0
    ) AS "retentionRate"

FROM "club_statistics" cs -- SỬA: Nên thêm ngoặc kép " " để chắc chắn khớp với Prisma naming convention
GROUP BY cs.year, cs.month;