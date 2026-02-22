-- ============================================================
-- Dummy Data for Aninaw Productions Homepage Testing
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Insert Authors
INSERT INTO authors (id, name, slug, bio, role_title) VALUES 
('11111111-1111-1111-1111-111111111111', 'Maria Clara', 'maria-clara', 'Senior reporter covering local politics and community issues in Cebu.', 'Senior Reporter'),
('22222222-2222-2222-2222-222222222222', 'Juan Dela Cruz', 'juan-dela-cruz', 'Investigative journalist with a focus on environmental stories.', 'Investigative Editor')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Stories
INSERT INTO stories (
  id, title, slug, excerpt, body, category, status, author_id, 
  cover_image_url, is_featured, is_breaking, view_count, published_at
) VALUES 
-- Breaking News
('a1111111-1111-1111-1111-111111111111', 'City Council Approves New Transport Budget for 2027', 'city-council-approves-new-transport-budget-2027', 'The Cebu City Council has greenlit a 5-billion peso budget to revamp the public transport system.', 'Lorem ipsum dolor sit amet...', 'news', 'published', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80', false, true, 1200, now() - interval '1 hour'),

-- Hero (Featured, highest views)
('a2222222-2222-2222-2222-222222222222', 'The Changing Coastline: How Development is Reshaping Cebu', 'the-changing-coastline-cebu-development', 'An in-depth look at ongoing reclamation projects and their long-term impact on local fisherfolk.', 'Lorem ipsum dolor sit amet...', 'investigative', 'published', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1582650570624-9426f041ff25?w=1200&q=80', true, false, 5000, now() - interval '1 day'),

-- Secondary Featured Row
('a3333333-3333-3333-3333-333333333333', 'Cultural Heritage: Restoring the Old Churches of the South', 'cultural-heritage-restoring-old-churches', 'Community efforts are underway to preserve centuries-old architecture across the province.', 'Lorem ipsum dolor sit amet...', 'feature', 'published', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1577969348123-bc94bf82b0f4?w=800&q=80', true, false, 4000, now() - interval '2 days'),
('a4444444-4444-4444-4444-444444444444', 'Local Farmers Advocate for Sustainable Agriculture Support', 'local-farmers-sustainable-agriculture-support', 'As climate change disrupts traditional farming, groups demand more government intervention.', 'Lorem ipsum dolor sit amet...', 'news', 'published', '22222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80', true, false, 3500, now() - interval '3 days'),

-- Standard News
('a5555555-5555-5555-5555-555555555555', 'University Tuition Fees Expected to Rise Next Semester', 'university-tuition-fees-expected-to-rise', 'Several major universities in the city have announced tuition fee increases ranging from 5-8%.', 'Lorem ipsum dolor sit amet...', 'news', 'published', '11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80', false, false, 2500, now() - interval '5 hours'),

-- Opinions
('a6666666-6666-6666-6666-666666666666', 'Why We Need Better Pedestrian Infrastructure Now', 'why-we-need-better-pedestrian-infrastructure', 'The city''s rapid growth has left pedestrians behind. It''s time to rethink our sidewalks.', 'Lorem ipsum dolor sit amet...', 'opinion', 'published', '22222222-2222-2222-2222-222222222222', null, false, false, 1800, now() - interval '12 hours'),
('a7777777-7777-7777-7777-777777777777', 'The False Promise of "Quick Fix" Traffic Solutions', 'false-promise-quick-fix-traffic-solutions', 'Adding more lanes won''t solve our traffic woes. A comprehensive mass transit approach is needed.', 'Lorem ipsum dolor sit amet...', 'opinion', 'published', '11111111-1111-1111-1111-111111111111', null, false, false, 2100, now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;
