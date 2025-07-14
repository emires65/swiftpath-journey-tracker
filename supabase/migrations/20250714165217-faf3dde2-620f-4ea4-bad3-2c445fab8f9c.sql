
-- Add new columns to the shipments table for package description and customs hold status
ALTER TABLE public.shipments 
ADD COLUMN package_description TEXT,
ADD COLUMN held_by_customs BOOLEAN DEFAULT FALSE;

-- Update the updated_at timestamp when these fields change
CREATE OR REPLACE FUNCTION update_shipment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_shipments_updated_at ON public.shipments;
CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON public.shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_shipment_updated_at();
