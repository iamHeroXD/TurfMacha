-- ============================================================
-- TurfBook - Complete Production Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- For geospatial queries (optional)

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
    -- Prevent double booking: same turf, same date, overlapping time
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
CREATE INDEX IF NOT EXISTS idx_turfs_owner ON public.turfs(owner_id);
CREATE INDEX IF NOT EXISTS idx_turfs_city ON public.turfs(city);
CREATE INDEX IF NOT EXISTS idx_turfs_sports ON public.turfs USING GIN(sports);
CREATE INDEX IF NOT EXISTS idx_turfs_active ON public.turfs(is_active);
CREATE INDEX IF NOT EXISTS idx_turfs_rating ON public.turfs(rating DESC);
CREATE INDEX IF NOT EXISTS idx_turfs_location ON public.turfs(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_turf ON public.bookings(turf_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(slot_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

CREATE INDEX IF NOT EXISTS idx_reviews_turf ON public.reviews(turf_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER turfs_updated_at BEFORE UPDATE ON public.turfs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-update turf rating when review added/deleted
CREATE OR REPLACE FUNCTION update_turf_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.turfs
    SET
        rating = (
            SELECT COALESCE(AVG(rating), 0)
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_update_rating
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_turf_rating();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- USERS policies
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable"
    ON public.users FOR SELECT
    USING (TRUE);

-- OWNER_PROFILES policies
CREATE POLICY "Owners can manage their profile"
    ON public.owner_profiles FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Owner profiles are public"
    ON public.owner_profiles FOR SELECT
    USING (TRUE);

-- TURFS policies
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

-- BOOKINGS policies
CREATE POLICY "Users can view their bookings"
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

CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- REVIEWS policies
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

-- FAVORITES policies
CREATE POLICY "Users can manage their favorites"
    ON public.favorites FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SEED DATA (Sample turfs for testing)
-- ============================================================

-- Note: Replace 'YOUR_OWNER_USER_ID' with an actual owner user ID after creating an account
-- INSERT INTO public.turfs (owner_id, name, description, address, city, state, latitude, longitude, sports, price_per_hour, amenities, images, operating_hours_start, operating_hours_end, is_active, rating, total_reviews)
-- VALUES (
--     'YOUR_OWNER_USER_ID',
--     'Green Arena Football Ground',
--     'Premium football ground with synthetic turf and floodlights. Perfect for evening matches.',
--     '123 Sports Complex Road, Koramangala',
--     'Bangalore',
--     'Karnataka',
--     12.9279,
--     77.6271,
--     ARRAY['football'],
--     800,
--     ARRAY['Parking', 'Floodlights', 'Changing Rooms', 'Drinking Water'],
--     ARRAY['https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800'],
--     '06:00',
--     '23:00',
--     TRUE,
--     4.5,
--     12
-- );
