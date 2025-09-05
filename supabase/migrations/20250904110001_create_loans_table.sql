CREATE TABLE public.loans (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    purpose TEXT,
    term_months INT,
    status TEXT DEFAULT 'pending', -- e.g., 'pending', 'approved', 'rejected', 'completed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own loans." ON public.loans
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own loans." ON public.loans
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all loans." ON public.loans
FOR SELECT TO authenticated USING (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'));

CREATE POLICY "Admins can update any loan." ON public.loans
FOR UPDATE TO authenticated USING (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'));

CREATE POLICY "Admins can delete any loan." ON public.loans
FOR DELETE TO authenticated USING (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'));