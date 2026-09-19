insert into public.categories (slug, name) values
  ('collections', 'Collections'),
  ('men', 'Men'),
  ('women', 'Women')
on conflict (slug) do update set name = excluded.name;

insert into public.products
  (slug, category_id, brand, name, description, price_cents, compare_at_cents, stock, featured, image_set)
values
  ('fall-limited-edition-sneakers', (select id from public.categories where slug = 'men'), 'Sneaker Company', 'Fall Limited Edition Sneakers', 'These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they''ll withstand everything the weather can offer.', 12500, 25000, 12, true, 1),
  ('desert-classic-low', (select id from public.categories where slug = 'men'), 'Sneaker Company', 'Desert Classic Low', 'A warm neutral everyday sneaker with a soft lining and a grippy sole for all-day city walks.', 9800, 14000, 7, true, 2),
  ('trail-sunset-runner', (select id from public.categories where slug = 'women'), 'Sneaker Company', 'Trail Sunset Runner', 'Lightweight cushioning and a stable heel make this bright runner ready for everyday adventures.', 11800, null, 4, true, 3),
  ('weekend-court-white', (select id from public.categories where slug = 'women'), 'Sneaker Company', 'Weekend Court White', 'A clean court-inspired silhouette finished with subtle orange detailing and a padded collar.', 8900, 11000, 0, false, 4),
  ('urban-canvas-high', (select id from public.categories where slug = 'men'), 'Northstar', 'Urban Canvas High', 'A durable high-top made for easy layering, with a flexible vulcanized sole and classic profile.', 10500, null, 15, false, 2),
  ('everyday-slip-on', (select id from public.categories where slug = 'women'), 'Northstar', 'Everyday Slip-On', 'Minimal, comfortable, and easy to wear with a memory-foam footbed and breathable upper.', 7600, 9500, 9, false, 4),
  ('heritage-suede-runner', (select id from public.categories where slug = 'collections'), 'Archive Co.', 'Heritage Suede Runner', 'A retro runner combining rich suede panels, lightweight foam, and a timeless gum outsole.', 14500, null, 3, false, 3),
  ('studio-knit-trainer', (select id from public.categories where slug = 'collections'), 'Form', 'Studio Knit Trainer', 'A flexible knit trainer designed for light workouts, errands, and travel days.', 11200, 13000, 18, false, 1)
on conflict (slug) do update set
  category_id = excluded.category_id,
  brand = excluded.brand,
  name = excluded.name,
  description = excluded.description,
  price_cents = excluded.price_cents,
  compare_at_cents = excluded.compare_at_cents,
  stock = excluded.stock,
  featured = excluded.featured,
  image_set = excluded.image_set,
  updated_at = now();
