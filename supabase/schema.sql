-- ============================================================
-- TurfMacha - Complete Production Database Schema
-- Run this in Supabase SQL Editor
-- Fully idempotent: safe to re-run on an existing database.
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- PostGIS is optional (geospatial queries). Remove if not on your Supabase plan.
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'owner', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- OWNER PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.owner_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    business_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TURFS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.turfs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL DEFAULT 12.9716,
    longitude DOUBLE PRECISION NOT NULL DEFAULT 77.5946,
    sports TEXT[] NOT NULL DEFAULT '{}',
    price_per_hour INTEGER NOT NULL DEFAULT 500,
    amenities TEXT[] NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    operating_hours_start TIME NOT NULL DEFAULT '06:00',
    operating_hours_end TIME NOT NULL DEFAULT '22:00',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rating NUMERIC(3,2) NOT NULL DEFAULT 0,
    total_reviews INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    turf_id UUID NOT NULL REFERENCES public.turfs(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours INTEGER NOT NULL DEFAULT 1 CHECK (duration_hours > 0),
    total_price INTEGER NOT NULL CHECK (total_price > 0),
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    sport TEXT NOT NULL CHECK (sport IN ('football', 'cricket', 'badminton', 'basketball', 'volleyball', 'tennis')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Prevent double booking: same turf, same date, same start slot
    CONSTRAINT no_double_booking UNIQUE (turf_id, slot_date, start_time)
);

-- ============================================================
-- REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    turf_id UUID NOT NULL REFERENCES public.turfs(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, turf_id)
);

-- ============================================================
-- FAVORITES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    turf_id UUID NOT NULL REFERENCES public.turfs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, turf_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_turfs_owner    ON public.turfs(owner_id);
CREATE INDEX IF NOT EXISTS idx_turfs_city     ON public.turfs(city);
CREATE INDEX IF NOT EXISTS idx_turfs_sports   ON public.turfs USING GIN(sports);
CREATE INDEX IF NOT EXISTS idx_turfs_active   ON public.turfs(is_active);
CREATE INDEX IF NOT EXISTS idx_turfs_rating   ON public.turfs(rating DESC);
CREATE INDEX IF NOT EXISTS idx_turfs_location ON public.turfs(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_bookings_user     ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_turf     ON public.bookings(turf_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date     ON public.bookings(slot_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status   ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_turf_date ON public.bookings(turf_id, slot_date);

CREATE INDEX IF NOT EXISTS idx_reviews_turf    ON public.reviews(turf_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user  ON public.favorites(user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- SET search_path on all functions prevents search_path injection.
-- REVOKE EXECUTE on SECURITY DEFINER functions prevents direct invocation
-- by anon/authenticated roles — they must only fire via trigger.
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Auto-update turf rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION public.update_turf_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
BEGIN
    UPDATE public.turfs
    SET
        rating = (
            SELECT COALESCE(ROUND(AVG(rating)::NUMERIC, 2), 0)
            FROM public.reviews
            WHERE turf_id = COALESCE(NEW.turf_id, OLD.turf_id)
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE turf_id = COALESCE(NEW.turf_id, OLD.turf_id)
        )
    WHERE id = COALESCE(NEW.turf_id, OLD.turf_id);
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Auto-create user profile on signup.
-- SECURITY DEFINER: runs as the function owner (superuser) so it can bypass
-- RLS and insert into public.users even when called from the auth.users trigger.
-- search_path is pinned to prevent schema-injection attacks.
-- REVOKE below prevents this function from being called directly by users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, phone, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    )
    ON CONFLICT (id) DO UPDATE
        SET
            full_name  = EXCLUDED.full_name,
            phone      = COALESCE(EXCLUDED.phone, public.users.phone),
            role       = EXCLUDED.role,
            updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Restrict direct invocation of SECURITY DEFINER functions.
-- They must only fire via trigger — never called directly by clients.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

-- Idempotent triggers (DROP IF EXISTS + CREATE)
DROP TRIGGER IF EXISTS users_updated_at    ON public.users;
DROP TRIGGER IF EXISTS turfs_updated_at    ON public.turfs;
DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
DROP TRIGGER IF EXISTS reviews_update_rating ON public.reviews;

CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER turfs_updated_at
    BEFORE UPDATE ON public.turfs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER reviews_update_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_turf_rating();

-- on_auth_user_created uses CREATE OR REPLACE TRIGGER (Postgres 14+)
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turfs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites      ENABLE ROW LEVEL SECURITY;

-- ── USERS policies ──────────────────────────────────────────
DROP POLICY IF EXISTS "Public profiles are viewable"      ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- All authenticated users can read all profiles (needed for owner dashboards)
CREATE POLICY "Public profiles are viewable"
    ON public.users FOR SELECT
    USING (TRUE);

-- Users can insert their own profile row (client-side upsert after signup)
CREATE POLICY "Users can insert their own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ── OWNER_PROFILES policies ─────────────────────────────────
DROP POLICY IF EXISTS "Owners can manage their profile" ON public.owner_profiles;
DROP POLICY IF EXISTS "Owner profiles are public"       ON public.owner_profiles;

CREATE POLICY "Owners can manage their profile"
    ON public.owner_profiles FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner profiles are public"
    ON public.owner_profiles FOR SELECT
    USING (TRUE);

-- ── TURFS policies ───────────────────────────────────────────
DROP POLICY IF EXISTS "Active turfs are publicly viewable" ON public.turfs;
DROP POLICY IF EXISTS "Owners can insert turfs"            ON public.turfs;
DROP POLICY IF EXISTS "Owners can update their turfs"      ON public.turfs;
DROP POLICY IF EXISTS "Owners can delete their turfs"      ON public.turfs;

CREATE POLICY "Active turfs are publicly viewable"
    ON public.turfs FOR SELECT
    USING (is_active = TRUE OR auth.uid() = owner_id);

CREATE POLICY "Owners can insert turfs"
    ON public.turfs FOR INSERT
    WITH CHECK (
        auth.uid() = owner_id
        AND EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "Owners can update their turfs"
    ON public.turfs FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their turfs"
    ON public.turfs FOR DELETE
    USING (auth.uid() = owner_id);

-- ── BOOKINGS policies ────────────────────────────────────────
DROP POLICY IF EXISTS "Users and owners can view relevant bookings" ON public.bookings;
DROP POLICY IF EXISTS "Authenticated users can create bookings"     ON public.bookings;
DROP POLICY IF EXISTS "Users can cancel their own bookings"         ON public.bookings;

-- Players see their own bookings; owners see bookings for their turfs
CREATE POLICY "Users and owners can view relevant bookings"
    ON public.bookings FOR SELECT
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.turfs
            WHERE id = bookings.turf_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can cancel their own bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ── REVIEWS policies ─────────────────────────────────────────
DROP POLICY IF EXISTS "Reviews are publicly viewable"       ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews"  ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews"  ON public.reviews;

CREATE POLICY "Reviews are publicly viewable"
    ON public.reviews FOR SELECT
    USING (TRUE);

CREATE POLICY "Authenticated users can create reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON public.reviews FOR DELETE
    USING (auth.uid() = user_id);

-- ── FAVORITES policies ───────────────────────────────────────
DROP POLICY IF EXISTS "Users can manage their favorites" ON public.favorites;

CREATE POLICY "Users can manage their favorites"
    ON public.favorites FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SEED DATA
-- Replace 'YOUR_OWNER_USER_ID' with a real owner UUID after signup.
-- ============================================================

-- INSERT INTO public.turfs (owner_id, name, description, address, city, state,
--   latitude, longitude, sports, price_per_hour, amenities, images,
--   operating_hours_start, operating_hours_end, is_active, rating, total_reviews)
-- VALUES (
--   'YOUR_OWNER_USER_ID',
--   'Green Arena Football Ground',
--   'Premium football ground with synthetic turf and floodlights.',
--   '123 Sports Complex Road, Koramangala', 'Bangalore', 'Karnataka',
--   12.9279, 77.6271,
--   ARRAY['football'], 800,
--   ARRAY['Parking', 'Floodlights', 'Changing Rooms', 'Drinking Water'],
--   ARRAY['https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800'],
--   '06:00', '23:00', TRUE, 4.5, 12
-- );

-- ============================================================
-- PHASE 2 ADDITIONS: TurfCoins, Rewards, Admin
-- ============================================================

-- ── New columns on existing tables ──────────────────────────
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS rewards_enabled BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS coins_per_booking INTEGER NOT NULL DEFAULT 10;
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS redemption_cost INTEGER NOT NULL DEFAULT 100;
ALTER TABLE public.turfs ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT FALSE;

-- ── TurfCoins balance per user ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.turf_coins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
    total_earned INTEGER NOT NULL DEFAULT 0,
    total_redeemed INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Coin transaction audit log ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.coin_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earn', 'redeem', 'admin_adjust', 'expire')),
    description TEXT,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Reward redemption records ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    turf_id UUID NOT NULL REFERENCES public.turfs(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    coins_used INTEGER NOT NULL CHECK (coins_used > 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user ON public.coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_turf_coins_user ON public.turf_coins(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_user ON public.reward_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_turfs_featured ON public.turfs(is_featured) WHERE is_featured = TRUE;

-- ── Coin-earning trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.award_booking_coins()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
    v_coins INTEGER;
    v_enabled BOOLEAN;
BEGIN
    SELECT coins_per_booking, rewards_enabled
    INTO v_coins, v_enabled
    FROM public.turfs WHERE id = NEW.turf_id;

    IF v_enabled AND v_coins > 0 THEN
        INSERT INTO public.turf_coins (user_id, balance, total_earned)
        VALUES (NEW.user_id, v_coins, v_coins)
        ON CONFLICT (user_id) DO UPDATE SET
            balance       = public.turf_coins.balance + v_coins,
            total_earned  = public.turf_coins.total_earned + v_coins,
            updated_at    = NOW();

        INSERT INTO public.coin_transactions (user_id, amount, type, description, booking_id)
        VALUES (NEW.user_id, v_coins, 'earn', 'Coins earned from booking', NEW.id);
    END IF;
    RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.award_booking_coins() FROM PUBLIC;

DROP TRIGGER IF EXISTS bookings_award_coins ON public.bookings;
CREATE TRIGGER bookings_award_coins
    AFTER INSERT ON public.bookings
    FOR EACH ROW
    WHEN (NEW.status = 'confirmed')
    EXECUTE FUNCTION public.award_booking_coins();

-- ── RLS for new tables ───────────────────────────────────────
ALTER TABLE public.turf_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own coins" ON public.turf_coins;
CREATE POLICY "Users view own coins"
    ON public.turf_coins FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users view own transactions" ON public.coin_transactions;
CREATE POLICY "Users view own transactions"
    ON public.coin_transactions FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own redemptions" ON public.reward_redemptions;
CREATE POLICY "Users manage own redemptions"
    ON public.reward_redemptions FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ── Admin-extended policies ──────────────────────────────────

-- Bookings: extend for admin visibility
DROP POLICY IF EXISTS "Users and owners can view relevant bookings" ON public.bookings;
CREATE POLICY "Users and owners can view relevant bookings"
    ON public.bookings FOR SELECT
    USING (
        auth.uid() = user_id
        OR EXISTS (SELECT 1 FROM public.turfs WHERE id = bookings.turf_id AND owner_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
CREATE POLICY "Admins can manage all bookings"
    ON public.bookings FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can manage all turfs" ON public.turfs;
CREATE POLICY "Admins can manage all turfs"
    ON public.turfs FOR ALL
    USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins can update any profile" ON public.users;
CREATE POLICY "Admins can update any profile"
    ON public.users FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete any user" ON public.users;
CREATE POLICY "Admins can delete any user"
    ON public.users FOR DELETE
    USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'));
