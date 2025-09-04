CREATE TABLE public.scheduled_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    message TEXT NOT NULL,
    schedule_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
