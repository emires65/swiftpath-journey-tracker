
-- Create tracking_notifications table
CREATE TABLE public.tracking_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT NOT NULL,
  tracked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_ip TEXT
);

-- Enable RLS
ALTER TABLE public.tracking_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Allow admin access to tracking notifications" 
  ON public.tracking_notifications 
  FOR ALL 
  USING (true);

-- Add the missing columns to shipments table
ALTER TABLE public.shipments 
ADD COLUMN sender_name TEXT,
ADD COLUMN sender_country TEXT,
ADD COLUMN receiver_country TEXT;
