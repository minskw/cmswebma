-- ====================================================================
-- DATABASE SCHEMA FOR MIN SINGKAWANG (OFFICIAL PRODUCTION)
-- Target Platform: Supabase PostgreSQL (Postgres 15+)
-- Features: Foreign Keys, Indexes, Slugs, Soft Delete, Updated At Triggers,
--           Role-Based Access Control (RBAC), Audit Logging.
-- ====================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. UTILITY TRIGGERS & FUNCTIONS
-- --------------------------------------------------------------------

-- Function to update the updated_at column automatically on row updates
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------------------------
-- 2. CORE IDENTITY & RBAC ACCESS CONTROL
-- --------------------------------------------------------------------

-- Roles Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL, -- 'Super Admin', 'Kepala Madrasah', 'Operator', 'Editor'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissions Table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL, -- 'manage_posts', 'manage_users', 'manage_ppdb', 'view_audit_logs'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role Permissions Liaison Table
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Profiles Table (Linked with Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL, -- points to auth.users in Supabase auth system
    full_name VARCHAR(255) NOT NULL,
    nip VARCHAR(50),
    bio TEXT,
    phone VARCHAR(20),
    role_id UUID REFERENCES roles(id) ON DELETE RESTRICT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE -- for soft delete support
);

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- --------------------------------------------------------------------
-- 3. CONTENT MANAGEMENT SYSTEM (CMS) TABLES
-- --------------------------------------------------------------------

-- Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags Table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(70) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts / News Table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    thumbnail_url TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'publish', 'schedule')),
    views INTEGER DEFAULT 0,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    seo_title VARCHAR(150),
    seo_description TEXT
);

CREATE TRIGGER update_posts_modtime
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Post Tags liaison
CREATE TABLE post_tags (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Static Pages Table (e.g., SEJARAH, VISI_MISI, SAMBUTAN)
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_pages_modtime
    BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Announcements (Pengumuman)
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TRIGGER update_announcements_modtime
    BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Events / Agenda Kegiatan Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time VARCHAR(50),
    location VARCHAR(255),
    organizer VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TRIGGER update_events_modtime
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- --------------------------------------------------------------------
-- 4. MEDIA & GALLERIES TABLES
-- --------------------------------------------------------------------

-- Media Table for global uploaded files in Supabase Storage
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL, -- points to Storage URL or ID
    bucket_name VARCHAR(100) DEFAULT 'general',
    mime_type VARCHAR(100),
    file_size INT,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Albums Table for Photo Galleries
CREATE TABLE albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Items Table (Photos or Video links like YouTube Embeds)
CREATE TABLE gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(10) CHECK (type IN ('foto', 'video')) NOT NULL,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. SCHOOL OPERATIONS & DATA MANIFEST
-- --------------------------------------------------------------------

-- Programs (Program Unggulan)
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    icon_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teachers (Data Guru dan Tenaga Kependidikan - GTK)
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    nip VARCHAR(50),
    role VARCHAR(150) NOT NULL, -- e.g., 'Guru Kelas IV-A', 'Kepala Tata Usaha'
    photo_url TEXT,
    status VARCHAR(50) DEFAULT 'PNS', -- PNS | PPPK | GTT | PTT
    subjects TEXT[], -- e.g., '{"Matematika", "PAI"}'
    sort_order INTEGER DEFAULT 99,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Facilities (Sarana dan Prasarana)
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    condition VARCHAR(50) DEFAULT 'Baik' CHECK (condition IN ('Sangat Baik', 'Baik', 'Perbaikan')),
    capacity VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements Table (Prestasi)
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'Akademik' CHECK (category IN ('Akademik', 'Non-Akademik')),
    level VARCHAR(50) DEFAULT 'Nasional' CHECK (level IN ('Kota', 'Provinsi', 'Nasional', 'Internasional')),
    year VARCHAR(10) NOT NULL,
    winner VARCHAR(255) NOT NULL,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Downloads Table (Pusat Unduhan)
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('dokumen', 'formulir', 'panduan')),
    file_url TEXT NOT NULL,
    file_size VARCHAR(50),
    downloads_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials (Testimoni Orang Tua / Wali)
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL, -- e.g., 'Wali Kelas 1', 'Orang Tua Alumnus'
    content TEXT NOT NULL,
    avatar_url TEXT,
    rating INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. DYNAMIC MENUS, SETTINGS, & PORTAL REGISTRY
-- --------------------------------------------------------------------

-- Dynamic Navigation Menu Configurator
CREATE TABLE menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES menus(id) ON DELETE CASCADE,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- School Settings
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Global Metadata
CREATE TABLE seo_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_name VARCHAR(120) UNIQUE NOT NULL, -- 'home', 'profil', 'news', 'gallery', 'ppdb'
    meta_title VARCHAR(150) NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT,
    og_image TEXT,
    canonical_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(100),
    entity_id TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on audit_logs columns of interest
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity, entity_id);

-- PPDB Applicants Table
CREATE TABLE ppdb_applicants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_name VARCHAR(255) NOT NULL,
    nik VARCHAR(16) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Laki-laki', 'Perempuan')),
    pob VARCHAR(100) NOT NULL, -- Place of birth
    dob DATE NOT NULL,         -- Date of birth
    father_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    address TEXT NOT NULL,
    previous_school VARCHAR(255),
    status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'verified', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_ppdb_modtime
    BEFORE UPDATE ON ppdb_applicants
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- --------------------------------------------------------------------
-- 7. PERFORMANCE INDEXES
-- --------------------------------------------------------------------

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published ON posts(published_at DESC);
CREATE INDEX idx_announcements_slug ON announcements(slug);
CREATE INDEX idx_announcements_pinned ON announcements(is_pinned DESC);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_teachers_sort ON teachers(sort_order);
CREATE INDEX idx_achievements_year ON achievements(year DESC);
CREATE INDEX idx_downloads_category ON downloads(category);
CREATE INDEX idx_ppdb_nik ON ppdb_applicants(nik);
CREATE INDEX idx_ppdb_status ON ppdb_applicants(status);
CREATE INDEX idx_gallery_items_type ON gallery_items(type);

-- --------------------------------------------------------------------
-- 8. INITIAL CODES SEEDING DATA
-- --------------------------------------------------------------------

INSERT INTO roles (name, description) VALUES
('Super Admin', 'Full administrative authorization across everything'),
('Kepala Madrasah', 'Strategic monitoring and dashboard view rights'),
('Operator', 'Day-to-day data and user operations processor'),
('Editor', 'Publish news, edit posts and gallery events only');
