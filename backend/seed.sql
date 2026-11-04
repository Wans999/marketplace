-- Deterministic seed data. Run after schema.sql through `npm run db:reset`.
-- All IDs are explicit so tests can refer to them.

-- Every account's password is: Password123
INSERT INTO users (id, name, email, password_hash, role) VALUES
  (1, 'Budi Santoso',  'budi@example.com',  '$2b$10$KLJ8PgskVb00O8qI5udsvuJEsRSgl36GpjXEHEP7xRmUPaba3BZqi', 'buyer'),
  (2, 'Siti Rahma',    'siti@example.com',  '$2b$10$KLJ8PgskVb00O8qI5udsvuJEsRSgl36GpjXEHEP7xRmUPaba3BZqi', 'buyer'),
  (3, 'Darto Wibowo',  'toko1@example.com', '$2b$10$KLJ8PgskVb00O8qI5udsvuJEsRSgl36GpjXEHEP7xRmUPaba3BZqi', 'seller'),
  (4, 'Lina Hartati',  'toko2@example.com', '$2b$10$KLJ8PgskVb00O8qI5udsvuJEsRSgl36GpjXEHEP7xRmUPaba3BZqi', 'seller'),
  (5, 'Rudi Halim',    'toko3@example.com', '$2b$10$KLJ8PgskVb00O8qI5udsvuJEsRSgl36GpjXEHEP7xRmUPaba3BZqi', 'seller');

INSERT INTO stores (id, user_id, name) VALUES
  (1, 3, 'Kebun Segar'),
  (2, 4, 'Lumbung Sembako'),
  (3, 5, 'Gudang Beku');

INSERT INTO categories (id, name, slug) VALUES
  (1, 'Sayur & Buah', 'sayur-buah'),
  (2, 'Sembako',      'sembako'),
  (3, 'Minuman',      'minuman'),
  (4, 'Frozen Food',  'frozen-food'),
  (5, 'Bumbu Dapur',  'bumbu-dapur');

-- Categories rotate by id (1 sayur, 2 sembako, 3 minuman, 4 frozen, 5 bumbu, 6 sayur, ...)
-- so the newest page mixes all categories.
-- Boundary products:
--   stock 0: 4 Nugget Ayam, 7 Minyak Goreng, 46 Alpukat Mentega (46 is on page 1)
--   stock 1: 12 Beras Pandan Wangi, 18 Kopi Bubuk Robusta, 41 Durian Montong (41 is on page 1)
--   cheapest: 5 Garam Halus (Rp3.000), most expensive: 34 Daging Sapi Slice (Rp145.000)
INSERT INTO products (id, store_id, category_id, name, description, price, stock, image_url) VALUES
  (1,  1, 1, 'Bayam Hijau 250 g',            'Bayam hijau segar, dipetik pagi hari.',                       6000,   40,  '/images/products/sayur-buah.svg'),
  (2,  2, 2, 'Beras Putih 5 kg',             'Beras putih pulen untuk kebutuhan sehari-hari.',              72000,  30,  '/images/products/sembako.svg'),
  (3,  2, 3, 'Air Mineral 600 ml isi 12',    'Air mineral kemasan botol, satu dus isi 12.',                 42000,  30,  '/images/products/minuman.svg'),
  (4,  3, 4, 'Nugget Ayam 500 g',            'Nugget ayam beku, tinggal goreng.',                           48000,  0,   '/images/products/frozen-food.svg'),
  (5,  1, 5, 'Garam Halus 250 g',            'Garam halus beryodium untuk masakan.',                        3000,   100, '/images/products/bumbu-dapur.svg'),
  (6,  1, 1, 'Wortel 500 g',                 'Wortel lokal segar, cocok untuk sop.',                        9000,   35,  '/images/products/sayur-buah.svg'),
  (7,  2, 2, 'Minyak Goreng 2 L',            'Minyak goreng sawit kemasan pouch.',                          38000,  0,   '/images/products/sembako.svg'),
  (8,  2, 3, 'Teh Celup isi 25',             'Teh hitam celup, satu kotak isi 25 kantong.',                 9500,   50,  '/images/products/minuman.svg'),
  (9,  3, 4, 'Sosis Sapi 500 g',             'Sosis sapi beku untuk bekal dan sarapan.',                    52000,  20,  '/images/products/frozen-food.svg'),
  (10, 1, 5, 'Merica Bubuk 50 g',            'Merica putih bubuk, aroma tajam.',                            8500,   40,  '/images/products/bumbu-dapur.svg'),
  (11, 1, 1, 'Kentang 1 kg',                 'Kentang dieng ukuran sedang.',                                18000,  50,  '/images/products/sayur-buah.svg'),
  (12, 2, 2, 'Beras Pandan Wangi 5 kg',      'Beras pandan wangi, pulen dan harum.',                        85000,  1,   '/images/products/sembako.svg'),
  (13, 2, 3, 'Teh Hijau Botol 350 ml',       'Minuman teh hijau siap minum tanpa gula.',                    6500,   80,  '/images/products/minuman.svg'),
  (14, 3, 4, 'Bakso Sapi 500 g',             'Bakso daging sapi beku, isi sekitar 25 butir.',               55000,  18,  '/images/products/frozen-food.svg'),
  (15, 1, 5, 'Kecap Manis 520 ml',           'Kecap manis kental kemasan refill.',                          23000,  35,  '/images/products/bumbu-dapur.svg'),
  (16, 1, 1, 'Tomat Merah 500 g',            'Tomat merah segar untuk sambal dan salad.',                   12000,  30,  '/images/products/sayur-buah.svg'),
  (17, 2, 2, 'Beras Merah 1 kg',             'Beras merah organik, tinggi serat.',                          24000,  20,  '/images/products/sembako.svg'),
  (18, 2, 3, 'Kopi Bubuk Robusta 250 g',     'Kopi robusta giling halus dari Lampung.',                     35000,  1,   '/images/products/minuman.svg'),
  (19, 3, 4, 'Kentang Goreng Beku 1 kg',     'Kentang potong beku, siap digoreng.',                         42000,  22,  '/images/products/frozen-food.svg'),
  (20, 1, 5, 'Saus Sambal 340 ml',           'Saus sambal pedas botol kaca.',                               15500,  30,  '/images/products/bumbu-dapur.svg'),
  (21, 1, 1, 'Brokoli 500 g',                'Brokoli hijau segar dari dataran tinggi.',                    22000,  15,  '/images/products/sayur-buah.svg'),
  (22, 2, 2, 'Gula Pasir 1 kg',              'Gula pasir putih kristal.',                                   18500,  60,  '/images/products/sembako.svg'),
  (23, 2, 3, 'Susu UHT Cokelat 1 L',         'Susu UHT rasa cokelat kemasan karton.',                       21000,  24,  '/images/products/minuman.svg'),
  (24, 3, 4, 'Dimsum Udang isi 10',          'Dimsum udang beku, kukus 10 menit.',                          39000,  16,  '/images/products/frozen-food.svg'),
  (25, 1, 5, 'Kaldu Ayam Bubuk 100 g',       'Kaldu ayam bubuk penyedap masakan.',                          11000,  45,  '/images/products/bumbu-dapur.svg'),
  (26, 1, 1, 'Pisang Cavendish 1 kg',        'Pisang cavendish matang, manis.',                             25000,  20,  '/images/products/sayur-buah.svg'),
  (27, 2, 2, 'Tepung Terigu 1 kg',           'Tepung terigu protein sedang serbaguna.',                     14000,  45,  '/images/products/sembako.svg'),
  (28, 2, 3, 'Jus Jeruk 1 L',                'Jus jeruk tanpa pengawet kemasan karton.',                    27000,  15,  '/images/products/minuman.svg'),
  (29, 3, 4, 'Fillet Ikan Dori 500 g',       'Fillet ikan dori beku tanpa tulang.',                         46000,  14,  '/images/products/frozen-food.svg'),
  (30, 1, 5, 'Bawang Putih 250 g',           'Bawang putih kupas, siap pakai.',                             10000,  50,  '/images/products/bumbu-dapur.svg'),
  (31, 1, 1, 'Apel Fuji 1 kg',               'Apel fuji impor, renyah dan manis.',                          45000,  12,  '/images/products/sayur-buah.svg'),
  (32, 2, 2, 'Telur Ayam 1 kg',              'Telur ayam negeri, sekitar 16 butir.',                        29000,  25,  '/images/products/sembako.svg'),
  (33, 2, 3, 'Sirup Melon 460 ml',           'Sirup rasa melon untuk es buah.',                             19500,  20,  '/images/products/minuman.svg'),
  (34, 3, 4, 'Daging Sapi Slice 500 g',      'Irisan tipis daging sapi beku untuk shabu dan yakiniku.',     145000, 8,   '/images/products/frozen-food.svg'),
  (35, 1, 5, 'Bawang Merah 250 g',           'Bawang merah brebes ukuran sedang.',                          14500,  50,  '/images/products/bumbu-dapur.svg'),
  (36, 1, 1, 'Jeruk Medan 1 kg',             'Jeruk medan segar, banyak air.',                              32000,  25,  '/images/products/sayur-buah.svg'),
  (37, 2, 2, 'Mi Instan Goreng isi 5',       'Mi instan goreng, satu pack isi 5.',                          16000,  100, '/images/products/sembako.svg'),
  (38, 2, 3, 'Air Kelapa 1 L',               'Air kelapa murni kemasan botol.',                             24000,  10,  '/images/products/minuman.svg'),
  (39, 3, 4, 'Udang Kupas 250 g',            'Udang kupas beku tanpa kepala.',                              68000,  10,  '/images/products/frozen-food.svg'),
  (40, 1, 5, 'Kunyit Bubuk 50 g',            'Kunyit bubuk untuk kari dan nasi kuning.',                    6000,   30,  '/images/products/bumbu-dapur.svg'),
  (41, 1, 1, 'Durian Montong 1 buah',        'Durian montong utuh, berat sekitar 2 kg.',                    120000, 1,   '/images/products/sayur-buah.svg'),
  (42, 2, 2, 'Kacang Hijau 500 g',           'Kacang hijau kering untuk bubur.',                            15000,  18,  '/images/products/sembako.svg'),
  (43, 2, 3, 'Minuman Isotonik 500 ml',      'Minuman isotonik pengganti ion tubuh.',                       7500,   60,  '/images/products/minuman.svg'),
  (44, 3, 4, 'Es Krim Vanila 1 L',           'Es krim rasa vanila kemasan keluarga.',                       58000,  12,  '/images/products/frozen-food.svg'),
  (45, 1, 5, 'Ketumbar Bubuk 50 g',          'Ketumbar bubuk untuk bumbu ungkep.',                          5500,   30,  '/images/products/bumbu-dapur.svg'),
  (46, 1, 1, 'Alpukat Mentega 1 kg',         'Alpukat mentega, daging tebal dan lembut.',                   38000,  0,   '/images/products/sayur-buah.svg'),
  (47, 2, 2, 'Susu Kental Manis 370 g',      'Susu kental manis kaleng.',                                   13500,  40,  '/images/products/sembako.svg'),
  (48, 2, 3, 'Kopi Susu Botol 250 ml',       'Kopi susu gula aren siap minum.',                             12000,  35,  '/images/products/minuman.svg'),
  (49, 3, 4, 'Siomay Ikan isi 10',           'Siomay ikan tenggiri beku dengan bumbu kacang.',              35000,  20,  '/images/products/frozen-food.svg'),
  (50, 1, 5, 'Santan Kental 200 ml',         'Santan kelapa kental kemasan karton.',                        7000,   60,  '/images/products/bumbu-dapur.svg');

-- Fixed, unique timestamps so "newest" sorting is identical after every reset (id 50 is newest).
UPDATE products
SET created_at = TIMESTAMP('2026-10-01 00:00:00') + INTERVAL id HOUR,
    updated_at = TIMESTAMP('2026-10-01 00:00:00') + INTERVAL id HOUR;
