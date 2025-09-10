INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, recovery_token, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, phone, phone_confirmed_at, confirmation_token, confirmation_sent_at, email_change, email_change_sent_at, reauthentication_token, reauthentication_sent_at)
VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'authenticated', 'authenticated', 'anesu.nyamajiwa@example.com', '$2a$10$5Jj.g.eX5.X5.X5.X5.X5.X5.X5.X5.X5.X5.X5.X5.X5.X5.X5.X5.X5.X5.X5.', now(), '', NULL, now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Anesu Nyamajiwa"}', now(), now(), NULL, NULL, '', NULL, '', NULL, '', NULL);

INSERT INTO user_profiles (id, full_name, email, phone_number, country, mobile_money_provider, role)
VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Anesu Nyamajiwa', 'anesu.nyamajiwa@example.com', '+263771234567', 'ZW', 'Ecocash', 'member');

INSERT INTO groups (id, name, description, is_public, creator_id)
VALUES
  ('g1b2c3d4-e5f6-7890-1234-567890abcdef', 'Harare Tech Innovators', 'A group for tech enthusiasts in Harare.', true, 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
  ('g2b2c3d4-e5f6-7890-1234-567890abcdef', 'Bulawayo Entrepreneurs', 'A group for entrepreneurs in Bulawayo.', false, 'a1b2c3d4-e5f6-7890-1234-567890abcdef');

INSERT INTO group_members (group_id, user_id, role)
VALUES
  ('g1b2c3d4-e5f6-7890-1234-567890abcdef', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'admin'),
  ('g2b2c3d4-e5f6-7890-1234-567890abcdef', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'member');

INSERT INTO contributions (id, user_id, group_id, amount)
VALUES
  (gen_random_uuid(), 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'g1b2c3d4-e5f6-7890-1234-567890abcdef', 100),
  (gen_random_uuid(), 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'g1b2c3d4-e5f6-7890-1234-567890abcdef', 150);

INSERT INTO loans (id, user_id, group_id, amount, status)
VALUES
  (gen_random_uuid(), 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'g1b2c3d4-e5f6-7890-1234-567890abcdef', 500, 'approved'),
  (gen_random_uuid(), 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'g2b2c3d4-e5f6-7890-1234-567890abcdef', 1000, 'pending');

INSERT INTO loan_repayments (id, user_id, loan_id, amount)
VALUES
  (gen_random_uuid(), 'a1b2c3d4-e5f6-7890-1234-567890abcdef', (SELECT id FROM loans WHERE amount = 500), 50);

INSERT INTO notifications (id, user_id, message)
VALUES
  (gen_random_uuid(), 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Your loan request for $1000 has been submitted.'),
  (gen_random_uuid(), 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Welcome to Harare Tech Innovators!');

INSERT INTO payment_reminders (id, user_id, title, amount, due_date)
VALUES
  (gen_random_uuid(), 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Loan Repayment', 50, now() + interval '7 days');
