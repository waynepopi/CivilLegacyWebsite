-- Enable pgcrypto for secure code generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- 1. Add verification fields to receipts
ALTER TABLE receipts 
  ADD COLUMN IF NOT EXISTS verification_code TEXT,
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_by UUID,
  ADD COLUMN IF NOT EXISTS job_status TEXT DEFAULT 'PENDING';


-- 2. Ensure defaults
ALTER TABLE receipts 
  ALTER COLUMN created_at SET DEFAULT now();


-- 3. Add status constraints
ALTER TABLE receipts 
  DROP CONSTRAINT IF EXISTS check_verification_status,
  ADD CONSTRAINT check_verification_status 
    CHECK (verification_status IN ('ACTIVE', 'COMPLETED', 'CANCELLED'));

ALTER TABLE receipts 
  DROP CONSTRAINT IF EXISTS check_job_status,
  ADD CONSTRAINT check_job_status 
    CHECK (job_status IN ('PENDING', 'COMPLETED', 'CANCELLED'));


-- 4. Generate verification code function
CREATE OR REPLACE FUNCTION generate_receipt_verification_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_code IS NULL THEN
    NEW.verification_code := upper(substr(md5(random()::text), 1, 12));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 5. Trigger
DROP TRIGGER IF EXISTS tr_generate_verification_code ON receipts;

CREATE TRIGGER tr_generate_verification_code
BEFORE INSERT ON receipts
FOR EACH ROW
EXECUTE FUNCTION generate_receipt_verification_code();


-- 6. Backfill existing rows
UPDATE receipts
SET verification_code = upper(substr(md5(random()::text), 1, 12))
WHERE verification_code IS NULL;


-- 7. Enforce NOT NULL after backfill
ALTER TABLE receipts 
  ALTER COLUMN verification_code SET NOT NULL;


-- 8. Unique constraints (idempotency + QR uniqueness)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'receipts' AND column_name = 'payment_id'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'receipts_payment_id_key'
    ) THEN
      ALTER TABLE receipts 
      ADD CONSTRAINT receipts_payment_id_key UNIQUE (payment_id);
    END IF;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'receipts' AND column_name = 'order_id'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'receipts_order_id_key'
    ) THEN
      ALTER TABLE receipts 
      ADD CONSTRAINT receipts_order_id_key UNIQUE (order_id);
    END IF;
  END IF;
END $$;


-- 9. Index for fast QR lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_receipts_verification_code
ON receipts(verification_code);


-- 10. Public-safe verification view (Security Definer)
-- This runs as owner to access data without public table permissions.
CREATE OR REPLACE VIEW public_receipt_verification AS
SELECT 
  r.verification_code,
  r.receipt_number,
  r.created_at,
  r.verification_status,
  r.job_status,
  o.id AS order_id,
  o.total_amount AS amount,
  p.status AS payment_status,
  p.gateway AS payment_gateway
FROM receipts r
JOIN orders o ON r.order_id = o.id
LEFT JOIN payments p ON r.payment_id = p.id
WHERE r.verification_code IS NOT NULL;


-- 11. Strict Access Control for Receipts
-- Revoke all direct access to receipts for public roles
REVOKE ALL ON receipts FROM anon;
REVOKE ALL ON receipts FROM authenticated;

-- Allow public read only via safe view
GRANT SELECT ON public_receipt_verification TO anon, authenticated;


-- 12. Enable RLS on receipts
-- This acts as the final gatekeeper for direct table access.
-- Since no public policies are added, public access is denied by default.
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
