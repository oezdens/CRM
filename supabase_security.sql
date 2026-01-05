-- =============================================
-- SICHERHEITS-UPDATE: RLS aktivieren und sichere Policies erstellen
-- Führe dieses SQL im Supabase SQL Editor aus!
-- 
-- ⚠️ WICHTIG: UNRESTRICTED = GEFÄHRLICH!
-- Jeder mit der URL könnte deine Kundendaten lesen!
-- 
-- Nach Ausführung sollte "RLS ENABLED" bei allen Tabellen stehen.
-- =============================================

-- =============================================
-- 1. RLS FÜR ALLE TABELLEN AKTIVIEREN
-- =============================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. ALTE POLICIES LÖSCHEN (falls vorhanden)
-- =============================================
DROP POLICY IF EXISTS "Enable all for authenticated users" ON customers;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON articles;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON invoices;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON offers;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON rentals;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON todos;

DROP POLICY IF EXISTS "Users can view their own customers" ON customers;
DROP POLICY IF EXISTS "Users can insert their own customers" ON customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON customers;
DROP POLICY IF EXISTS "Users can delete their own customers" ON customers;

DROP POLICY IF EXISTS "Users can view their own articles" ON articles;
DROP POLICY IF EXISTS "Users can insert their own articles" ON articles;
DROP POLICY IF EXISTS "Users can update their own articles" ON articles;
DROP POLICY IF EXISTS "Users can delete their own articles" ON articles;

DROP POLICY IF EXISTS "Users can view their own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can insert their own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can update their own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON invoices;

DROP POLICY IF EXISTS "Users can view their own offers" ON offers;
DROP POLICY IF EXISTS "Users can insert their own offers" ON offers;
DROP POLICY IF EXISTS "Users can update their own offers" ON offers;
DROP POLICY IF EXISTS "Users can delete their own offers" ON offers;

DROP POLICY IF EXISTS "Users can view their own rentals" ON rentals;
DROP POLICY IF EXISTS "Users can insert their own rentals" ON rentals;
DROP POLICY IF EXISTS "Users can update their own rentals" ON rentals;
DROP POLICY IF EXISTS "Users can delete their own rentals" ON rentals;

DROP POLICY IF EXISTS "Users can view their own todos" ON todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON todos;

-- =============================================
-- 3. SICHERE POLICIES ERSTELLEN
-- Nur authentifizierte User können ihre EIGENEN Daten sehen/bearbeiten
-- =============================================

-- CUSTOMERS
CREATE POLICY "Users can view their own customers" ON customers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customers" ON customers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers" ON customers
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers" ON customers
  FOR DELETE USING (auth.uid() = user_id);

-- ARTICLES
CREATE POLICY "Users can view their own articles" ON articles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own articles" ON articles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own articles" ON articles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own articles" ON articles
  FOR DELETE USING (auth.uid() = user_id);

-- INVOICES
CREATE POLICY "Users can view their own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" ON invoices
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" ON invoices
  FOR DELETE USING (auth.uid() = user_id);

-- OFFERS
CREATE POLICY "Users can view their own offers" ON offers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own offers" ON offers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own offers" ON offers
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own offers" ON offers
  FOR DELETE USING (auth.uid() = user_id);

-- RENTALS
CREATE POLICY "Users can view their own rentals" ON rentals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rentals" ON rentals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rentals" ON rentals
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rentals" ON rentals
  FOR DELETE USING (auth.uid() = user_id);

-- TODOS
CREATE POLICY "Users can view their own todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own todos" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos" ON todos
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos" ON todos
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 4. PRÜFE, DASS user_id SPALTE EXISTIERT
-- =============================================
-- Falls die user_id Spalte fehlt, füge sie hinzu:
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'customers' AND column_name = 'user_id') THEN
    ALTER TABLE customers ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'user_id') THEN
    ALTER TABLE articles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'user_id') THEN
    ALTER TABLE invoices ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'offers' AND column_name = 'user_id') THEN
    ALTER TABLE offers ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rentals' AND column_name = 'user_id') THEN
    ALTER TABLE rentals ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'todos' AND column_name = 'user_id') THEN
    ALTER TABLE todos ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;
