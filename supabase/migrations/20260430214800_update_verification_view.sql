-- Recreate the view to include the items JSON array
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
  p.gateway AS payment_gateway,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'description', oi.description,
        'qty', oi.qty,
        'unit_price', oi.unit_price
      )
    )
    FROM order_items oi
    WHERE oi.order_id = o.id
  ) AS items
FROM receipts r
JOIN orders o ON r.order_id = o.id
LEFT JOIN payments p ON r.payment_id = p.id
WHERE r.verification_code IS NOT NULL;
