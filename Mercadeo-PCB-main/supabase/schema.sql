-- =====================================================
-- SUPABASE DATABASE SCHEMA - Mercadeo PCB
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: users (must be created first due to foreign keys)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre TEXT,
  provider TEXT DEFAULT 'email',
  google_id TEXT,
  avatar_url TEXT,
  total_spent DECIMAL(10,2) DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  role TEXT DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: products
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  emoji TEXT DEFAULT '🍬',
  category TEXT NOT NULL DEFAULT 'dulces',
  popular BOOLEAN DEFAULT false,
  nutrition JSONB DEFAULT '{"calories": 0, "sugar": 0, "fat": 0, "protein": 0}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: orders
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre_completo TEXT NOT NULL,
  grado TEXT NOT NULL,
  grupo TEXT DEFAULT '',
  salon TEXT NOT NULL,
  telefono TEXT NOT NULL,
  dulces TEXT NOT NULL,
  dulces_detalle JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  metodo_pago TEXT DEFAULT 'efectivo',
  split_count INTEGER DEFAULT 1,
  per_person DECIMAL(10,2) DEFAULT 0,
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: config
-- =====================================================
CREATE TABLE IF NOT EXISTS config (
  id TEXT PRIMARY KEY DEFAULT 'store_config',
  store_name TEXT DEFAULT 'Mercadeo',
  tagline TEXT DEFAULT 'Selecciona tus dulces favoritos y nosotros te los llevamos al salón',
  delivery_cost DECIMAL(10,2) DEFAULT 2,
  delivery_hours TEXT DEFAULT '9:00 AM - 2:00 PM',
  primary_color TEXT DEFAULT '#1e40af',
  secondary_color TEXT DEFAULT '#3b82f6',
  accent_color TEXT DEFAULT '#f59e0b',
  background_color TEXT DEFAULT '#0f172a',
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: favorites
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  product_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- =====================================================
-- TABLE: notifications
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  icon TEXT DEFAULT '🔔',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_popular ON products(popular);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_estado ON orders(estado);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read, only authenticated can modify
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Products can be updated by authenticated users" ON products;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Products can be updated by authenticated users" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Orders: All access for simplicity
DROP POLICY IF EXISTS "Anyone can view orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON orders;
DROP POLICY IF EXISTS "Anyone can delete orders" ON orders;
CREATE POLICY "Anyone can view orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete orders" ON orders FOR DELETE USING (true);

-- Users: All access for simplicity
DROP POLICY IF EXISTS "Anyone can view users" ON users;
DROP POLICY IF EXISTS "Anyone can insert users" ON users;
DROP POLICY IF EXISTS "Anyone can update users" ON users;
DROP POLICY IF EXISTS "Anyone can delete users" ON users;
CREATE POLICY "Anyone can view users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON users FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete users" ON users FOR DELETE USING (true);

-- Config: Everyone can read, only authenticated can modify
DROP POLICY IF EXISTS "Config is viewable by everyone" ON config;
DROP POLICY IF EXISTS "Config can be updated by authenticated users" ON config;
CREATE POLICY "Config is viewable by everyone" ON config FOR SELECT USING (true);
CREATE POLICY "Config can be updated by authenticated users" ON config FOR ALL USING (auth.role() = 'authenticated');

-- Favorites: All access
DROP POLICY IF EXISTS "Anyone can manage favorites" ON favorites;
CREATE POLICY "Anyone can manage favorites" ON favorites FOR ALL USING (true);

-- Notifications: All access
DROP POLICY IF EXISTS "Anyone can manage notifications" ON notifications;
CREATE POLICY "Anyone can manage notifications" ON notifications FOR ALL USING (true);

-- =====================================================
-- DEFAULT DATA
-- =====================================================

-- Insert default store config
INSERT INTO config (id, store_name, tagline, delivery_cost, delivery_hours, primary_color, secondary_color, accent_color, background_color)
VALUES ('store_config', 'Mercadeo', 'Selecciona tus dulces favoritos y nosotros te los llevamos al salón', 2, '9:00 AM - 2:00 PM', '#1e40af', '#3b82f6', '#f59e0b', '#0f172a')
ON CONFLICT (id) DO NOTHING;

-- Insert default products
INSERT INTO products (id, name, price, image_url, category, popular, nutrition) VALUES
  -- Chicles y Mentas
  (uuid_generate_v4(), 'Dentyne Ice Verdes', 1.50, 'https://picsum.photos/seed/dentyne1/200/200', 'dulces', true, '{"calories": 5, "sugar": 0, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Dentyne Ice Negro', 1.50, 'https://picsum.photos/seed/dentyne2/200/200', 'dulces', false, '{"calories": 5, "sugar": 0, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Dentyne Ice Azul', 1.50, 'https://picsum.photos/seed/dentyne3/200/200', 'dulces', false, '{"calories": 5, "sugar": 0, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Chicles Grosso', 0.10, 'https://picsum.photos/seed/grosso/200/200', 'dulces', false, '{"calories": 5, "sugar": 0, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Chicle Bubbaloo', 0.15, 'https://picsum.photos/seed/bubbaloo/200/200', 'dulces', false, '{"calories": 5, "sugar": 0, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Mentos', 0.50, 'https://picsum.photos/seed/mentos/200/200', 'dulces', false, '{"calories": 5, "sugar": 0, "fat": 0, "protein": 0}'),
  -- Gomitas Trolli
  (uuid_generate_v4(), 'Trolli Estrellitas', 0.20, 'https://picsum.photos/seed/trolli1/200/200', 'dulces', true, '{"calories": 140, "sugar": 21, "fat": 0, "protein": 2}'),
  (uuid_generate_v4(), 'Trolli Culebras', 0.20, 'https://picsum.photos/seed/trolli2/200/200', 'dulces', false, '{"calories": 140, "sugar": 21, "fat": 0, "protein": 2}'),
  (uuid_generate_v4(), 'Trolli Pulpos', 0.20, 'https://picsum.photos/seed/trolli3/200/200', 'dulces', false, '{"calories": 140, "sugar": 21, "fat": 0, "protein": 2}'),
  (uuid_generate_v4(), 'Trolli Tiburones', 0.10, 'https://picsum.photos/seed/trolli4/200/200', 'dulces', false, '{"calories": 140, "sugar": 21, "fat": 0, "protein": 2}'),
  (uuid_generate_v4(), 'Trolli Fresas Rosas', 0.10, 'https://picsum.photos/seed/trolli5/200/200', 'dulces', false, '{"calories": 140, "sugar": 21, "fat": 0, "protein": 2}'),
  (uuid_generate_v4(), 'Trolli Fresas Azules', 0.10, 'https://picsum.photos/seed/trolli6/200/200', 'dulces', false, '{"calories": 140, "sugar": 21, "fat": 0, "protein": 2}'),
  -- Dulces Variados
  (uuid_generate_v4(), 'Caramelo Chuletas', 0.25, 'https://picsum.photos/seed/chuletas/200/200', 'dulces', false, '{"calories": 25, "sugar": 6, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Pata de Gallina', 0.50, 'https://picsum.photos/seed/pata/200/200', 'dulces', false, '{"calories": 25, "sugar": 6, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Air Heads', 0.25, 'https://picsum.photos/seed/airheads/200/200', 'dulces', false, '{"calories": 25, "sugar": 6, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Lenguitas Jolly', 0.25, 'https://picsum.photos/seed/lenguitas/200/200', 'dulces', false, '{"calories": 25, "sugar": 6, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Xtremes Strawberry', 0.50, 'https://picsum.photos/seed/xtremes/200/200', 'dulces', false, '{"calories": 25, "sugar": 6, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Haribo', 1.50, 'https://picsum.photos/seed/haribo/200/200', 'dulces', true, '{"calories": 140, "sugar": 21, "fat": 0, "protein": 2}'),
  (uuid_generate_v4(), 'Caña Roja', 0.75, 'https://picsum.photos/seed/cana/200/200', 'dulces', false, '{"calories": 25, "sugar": 6, "fat": 0, "protein": 0}'),
  -- Dulces en Caja
  (uuid_generate_v4(), 'Sour Patch', 1.50, 'https://picsum.photos/seed/sourpatch/200/200', 'dulces', true, '{"calories": 140, "sugar": 21, "fat": 0, "protein": 2}'),
  (uuid_generate_v4(), 'Mike and Ike', 2.00, 'https://picsum.photos/seed/mikeike/200/200', 'dulces', false, '{"calories": 140, "sugar": 21, "fat": 0, "protein": 2}'),
  (uuid_generate_v4(), 'Jolly Rancher Cajita', 1.25, 'https://picsum.photos/seed/jollyr/200/200', 'dulces', false, '{"calories": 25, "sugar": 6, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Skittles Verdes', 1.50, 'https://picsum.photos/seed/skittles1/200/200', 'dulces', false, '{"calories": 250, "sugar": 47, "fat": 2.5, "protein": 0}'),
  (uuid_generate_v4(), 'Skittles Rojo', 1.50, 'https://picsum.photos/seed/skittles2/200/200', 'dulces', false, '{"calories": 250, "sugar": 47, "fat": 2.5, "protein": 0}'),
  -- Paletas
  (uuid_generate_v4(), 'Paletas Brochas Azules', 0.15, 'https://picsum.photos/seed/paleta1/200/200', 'dulces', false, '{"calories": 25, "sugar": 6, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Paletas Brochas Rojas', 0.15, 'https://picsum.photos/seed/paleta2/200/200', 'dulces', false, '{"calories": 25, "sugar": 6, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Paletas Menta', 0.15, 'https://picsum.photos/seed/paleta3/200/200', 'dulces', false, '{"calories": 25, "sugar": 6, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Paletas Cherry', 0.15, 'https://picsum.photos/seed/paleta4/200/200', 'dulces', false, '{"calories": 25, "sugar": 6, "fat": 0, "protein": 0}'),
  (uuid_generate_v4(), 'Paletas Jolly Rancher', 0.25, 'https://picsum.photos/seed/paleta5/200/200', 'dulces', false, '{"calories": 25, "sugar": 6, "fat": 0, "protein": 0}'),
  -- Chocolates
  (uuid_generate_v4(), 'Snickers', 1.50, 'https://picsum.photos/seed/snickers/200/200', 'chocolates', true, '{"calories": 250, "sugar": 30, "fat": 12, "protein": 4}'),
  (uuid_generate_v4(), 'Hersheys Almond', 1.50, 'https://picsum.photos/seed/hershey1/200/200', 'chocolates', false, '{"calories": 220, "sugar": 24, "fat": 13, "protein": 5}'),
  (uuid_generate_v4(), 'Hersheys', 1.50, 'https://picsum.photos/seed/hershey2/200/200', 'chocolates', false, '{"calories": 220, "sugar": 24, "fat": 13, "protein": 5}'),
  (uuid_generate_v4(), 'M&M Amarillo', 1.50, 'https://picsum.photos/seed/mm1/200/200', 'chocolates', true, '{"calories": 240, "sugar": 31, "fat": 10, "protein": 2}'),
  (uuid_generate_v4(), 'Twix', 1.50, 'https://picsum.photos/seed/twix/200/200', 'chocolates', true, '{"calories": 250, "sugar": 30, "fat": 12, "protein": 4}'),
  (uuid_generate_v4(), 'Kit Kat', 1.50, 'https://picsum.photos/seed/kitkat/200/200', 'chocolates', true, '{"calories": 210, "sugar": 22, "fat": 11, "protein": 3}'),
  (uuid_generate_v4(), 'Reeses', 1.50, 'https://picsum.photos/seed/reeses/200/200', 'chocolates', false, '{"calories": 210, "sugar": 22, "fat": 13, "protein": 5}'),
  (uuid_generate_v4(), 'Nutella Mini Cups', 0.50, 'https://picsum.photos/seed/nutella/200/200', 'chocolates', false, '{"calories": 80, "sugar": 8, "fat": 5, "protein": 1}'),
  (uuid_generate_v4(), 'Serenatas', 0.50, 'https://picsum.photos/seed/serenatas/200/200', 'chocolates', false, '{"calories": 80, "sugar": 8, "fat": 5, "protein": 1}'),
  (uuid_generate_v4(), 'Tronky', 0.75, 'https://picsum.photos/seed/tronky/200/200', 'chocolates', false, '{"calories": 150, "sugar": 15, "fat": 7, "protein": 2}'),
  (uuid_generate_v4(), 'Hanuta', 1.50, 'https://picsum.photos/seed/hanuta/200/200', 'chocolates', false, '{"calories": 200, "sugar": 20, "fat": 11, "protein": 3}'),
  (uuid_generate_v4(), 'Kinder Bueno Oscuro', 1.50, 'https://picsum.photos/seed/kinder1/200/200', 'chocolates', false, '{"calories": 220, "sugar": 22, "fat": 13, "protein": 4}'),
  (uuid_generate_v4(), 'Kinder Bueno Blanco', 1.50, 'https://picsum.photos/seed/kinder2/200/200', 'chocolates', false, '{"calories": 220, "sugar": 22, "fat": 13, "protein": 4}'),
  -- Galletas
  (uuid_generate_v4(), 'Oreo', 1.25, 'https://picsum.photos/seed/oreo/200/200', 'snacks', true, '{"calories": 160, "sugar": 14, "fat": 7, "protein": 2}'),
  (uuid_generate_v4(), 'Mini Ritz Queso', 1.25, 'https://picsum.photos/seed/ritz/200/200', 'snacks', false, '{"calories": 150, "sugar": 2, "fat": 9, "protein": 2}'),
  (uuid_generate_v4(), 'Chips Ahoy', 1.25, 'https://picsum.photos/seed/chipsahoy/200/200', 'snacks', false, '{"calories": 160, "sugar": 14, "fat": 7, "protein": 2}'),
  (uuid_generate_v4(), 'Honey Buns', 1.25, 'https://picsum.photos/seed/honeybuns/200/200', 'snacks', false, '{"calories": 300, "sugar": 20, "fat": 15, "protein": 4}'),
  -- Corn Nuts
  (uuid_generate_v4(), 'Cornnuts Verdes', 1.75, 'https://picsum.photos/seed/cornnuts1/200/200', 'snacks', false, '{"calories": 120, "sugar": 0, "fat": 4, "protein": 3}'),
  (uuid_generate_v4(), 'Cornnuts Rojos', 1.75, 'https://picsum.photos/seed/cornnuts2/200/200', 'snacks', false, '{"calories": 120, "sugar": 0, "fat": 4, "protein": 3}')
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_config_updated_at BEFORE UPDATE ON config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get order statistics
CREATE OR REPLACE FUNCTION get_order_stats()
RETURNS TABLE (
  total_orders BIGINT,
  total_revenue DECIMAL(10,2),
  pending_orders BIGINT,
  completed_orders BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT AS total_orders,
    COALESCE(SUM(total), 0)::DECIMAL(10,2) AS total_revenue,
    COUNT(*) FILTER (WHERE estado = 'pendiente')::BIGINT AS pending_orders,
    COUNT(*) FILTER (WHERE estado = 'completado')::BIGINT AS completed_orders
  FROM orders;
END;
$$ LANGUAGE plpgsql;

-- Function to get popular products
CREATE OR REPLACE FUNCTION get_popular_products(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  product_id TEXT,
  product_name TEXT,
  order_count BIGINT,
  total_sold DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id::TEXT AS product_id,
    p.name AS product_name,
    COUNT(o.id)::BIGINT AS order_count,
    COALESCE(SUM(o.total), 0)::DECIMAL(10,2) AS total_sold
  FROM products p
  LEFT JOIN orders o ON o.dulces LIKE '%' || p.name || '%'
  WHERE p.popular = true
  GROUP BY p.id, p.name
  ORDER BY order_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
