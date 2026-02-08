-- Create categories table
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subcategories table
CREATE TABLE public.subcategories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create evaluations table
CREATE TABLE public.evaluations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    subcategory_id UUID NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    download_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for categories, subcategories, and evaluations
CREATE POLICY "Anyone can view categories" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view subcategories" 
ON public.subcategories FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view evaluations" 
ON public.evaluations FOR SELECT 
USING (true);

-- Admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  )
$$;

-- Admin policies for categories
CREATE POLICY "Admins can insert categories" 
ON public.categories FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update categories" 
ON public.categories FOR UPDATE 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete categories" 
ON public.categories FOR DELETE 
TO authenticated
USING (public.is_admin());

-- Admin policies for subcategories
CREATE POLICY "Admins can insert subcategories" 
ON public.subcategories FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update subcategories" 
ON public.subcategories FOR UPDATE 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete subcategories" 
ON public.subcategories FOR DELETE 
TO authenticated
USING (public.is_admin());

-- Admin policies for evaluations
CREATE POLICY "Admins can insert evaluations" 
ON public.evaluations FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update evaluations" 
ON public.evaluations FOR UPDATE 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can delete evaluations" 
ON public.evaluations FOR DELETE 
TO authenticated
USING (public.is_admin());

-- Admin users policies
CREATE POLICY "Admins can view admin_users" 
ON public.admin_users FOR SELECT 
TO authenticated
USING (public.is_admin() OR user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX idx_evaluations_subcategory_id ON public.evaluations(subcategory_id);
CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at
BEFORE UPDATE ON public.subcategories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at
BEFORE UPDATE ON public.evaluations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();