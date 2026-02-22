-- ============================================================
-- Aninaw Productions — Seed Data
-- ============================================================

-- ── Authors ──

INSERT INTO authors (id, name, slug, bio, avatar_url, role_title, email, social_facebook, social_twitter, social_instagram)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'Maria Santos',
    'maria-santos',
    'Maria Santos is a veteran journalist based in Cebu City, covering social issues and community stories across the Visayas. She previously worked for a national broadsheet before co-founding Aninaw Productions.',
    NULL,
    'Senior Reporter',
    'maria@aninaw.com',
    'https://facebook.com/mariasantos',
    NULL,
    'https://instagram.com/mariasantos.cebu'
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Carlos Dela Cruz',
    'carlos-dela-cruz',
    'Carlos Dela Cruz is a freelance investigative journalist and multimedia producer. He specializes in explainer videos and long-form features on local governance and environmental issues in Central Visayas.',
    NULL,
    'Multimedia Producer',
    'carlos@aninaw.com',
    'https://facebook.com/carlosdelacruz',
    'https://twitter.com/carlosdc_cebu',
    NULL
  );

-- ── Series ──

INSERT INTO series (id, title, slug, description, cover_image_url)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'Voices of the Waterfront',
    'voices-of-the-waterfront',
    'A multi-part documentary series exploring the lives, struggles, and resilience of communities along Cebu''s coastal areas threatened by reclamation projects.',
    NULL
  );

-- ── Tags ──

INSERT INTO tags (id, name, slug)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Cebu City',      'cebu-city'),
  ('c1000000-0000-0000-0000-000000000002', 'Environment',    'environment'),
  ('c1000000-0000-0000-0000-000000000003', 'Local Politics', 'local-politics'),
  ('c1000000-0000-0000-0000-000000000004', 'Community',      'community'),
  ('c1000000-0000-0000-0000-000000000005', 'Culture',        'culture');

-- ── Stories ──

-- Story 1: News
INSERT INTO stories (
  id, title, slug, excerpt, body, category, status, author_id,
  cover_image_alt, published_at, is_featured, is_breaking,
  reading_time_minutes, language, social_origin
)
VALUES (
  'd1000000-0000-0000-0000-000000000001',
  'Cebu City Council Approves New Coastal Protection Ordinance',
  'cebu-city-council-approves-coastal-protection-ordinance',
  'The Cebu City Council has unanimously passed a landmark ordinance aimed at strengthening protections for the city''s remaining coastal ecosystems.',
  E'The Cebu City Council has unanimously passed a landmark ordinance aimed at strengthening protections for the city''s remaining coastal ecosystems and mangrove forests.\n\nThe ordinance, authored by Councilor Elena Reyes, mandates a 50-meter buffer zone along designated coastal areas and establishes a P20-million annual fund for mangrove rehabilitation.\n\n"This is a historic moment for Cebu," Reyes told Aninaw Productions after the vote. "For decades, our coastlines have been eroded by unchecked development. This ordinance gives our communities a fighting chance."\n\nEnvironmental groups have lauded the move, though some expressed concern about enforcement. The Cebu Environmental Watch Coalition noted that similar ordinances in other cities have struggled with implementation.\n\nThe ordinance takes effect 15 days after publication and will be enforced by the City Environment and Natural Resources Office (CENRO) in coordination with barangay coastal management councils.\n\nLocal fisherfolk communities in Barangays Mambaling and Pasil have expressed cautious optimism. "We have been asking for this for years," said Roberto Villamor, president of the Mambaling Fisherfolk Association. "Now we need to make sure it is actually enforced."',
  'news',
  'published',
  'a1000000-0000-0000-0000-000000000001',
  'Cebu City Council chamber during the ordinance vote',
  now() - interval '2 days',
  true,
  false,
  4,
  'english',
  'manual'
);

-- Story 2: Feature
INSERT INTO stories (
  id, title, slug, excerpt, body, category, status, author_id,
  cover_image_alt, published_at, is_featured,
  reading_time_minutes, series_id, language, social_origin
)
VALUES (
  'd1000000-0000-0000-0000-000000000002',
  'Life on the Edge: The Fisherfolk of Pasil',
  'life-on-the-edge-fisherfolk-of-pasil',
  'In the narrow alleys of Pasil, families have fished the same waters for generations. Now, reclamation threatens everything they know.',
  E'In the narrow alleys of Pasil, where the smell of dried fish mingles with saltwater air, families have fished the same waters for generations. But the concrete pilings of a massive reclamation project now loom just offshore, threatening to reshape their world forever.\n\nRosalinda Jumao-as, 62, has lived in Pasil her entire life. Every morning at 4 AM, she walks to the shore where her husband Pedro sets out in a wooden banca, the same vessel his father used decades ago.\n\n"The fish are fewer now," she says, squinting at the horizon where heavy equipment sits idle on a Sunday morning. "And soon, there will be no shore to walk to."\n\nThe SRP (South Road Properties) expansion project, valued at an estimated P15 billion, has been a source of both hope and anxiety for Cebu''s urban poor communities. Proponents argue it will create jobs and modernize the city. Critics say it will displace thousands.\n\nThis is the first installment in our series, Voices of the Waterfront, which documents the human stories behind Cebu''s rapid coastal development.\n\nCommunity organizer Jun Labrador has been documenting the impact on fisherfolk families for three years. "These are not just numbers in a development plan," he says. "Each family displaced is a story of generational knowledge being erased."\n\nThe project proponents have promised relocation assistance, but residents say the proposed sites are far from the sea — and from their livelihoods.',
  'feature',
  'published',
  'a1000000-0000-0000-0000-000000000002',
  'Fisherfolk family in Pasil preparing nets at dawn',
  now() - interval '5 days',
  false,
  7,
  'b1000000-0000-0000-0000-000000000001',
  'english',
  'manual'
);

-- Story 3: Opinion
INSERT INTO stories (
  id, title, slug, excerpt, body, category, status, author_id,
  cover_image_alt, published_at, is_featured,
  reading_time_minutes, language, social_origin
)
VALUES (
  'd1000000-0000-0000-0000-000000000003',
  'Why Cebu Needs Independent Media Now More Than Ever',
  'why-cebu-needs-independent-media',
  'As media consolidation accelerates and local newsrooms shrink, the role of independent journalists in holding power accountable has never been more critical.',
  E'As media consolidation accelerates and local newsrooms shrink, the role of independent journalists in holding power accountable has never been more critical — especially in regions like the Visayas.\n\nIn the past five years, Cebu has lost three local newspapers and two radio news programs. The remaining outlets are increasingly dependent on advertising revenue from the very institutions they are supposed to cover critically.\n\nThis is not unique to Cebu. Across the Philippines, the media landscape is being reshaped by economic pressures, political interference, and the migration of audiences to social media platforms where misinformation thrives.\n\nBut here is what gives me hope: a new generation of journalists is emerging — digital-native, community-rooted, and fiercely independent. They are building new models of storytelling that center the voices of ordinary Filipinos.\n\nAt Aninaw Productions, we believe that the stories of fisherfolk in Pasil, market vendors in Carbon, and students in Colon are just as important as the pronouncements of politicians in City Hall. More important, perhaps.\n\nIndependent media is not a luxury. It is a necessity for a functioning democracy. Support it. Subscribe. Share. Engage. Because the alternative — a public square dominated by press releases and propaganda — is not acceptable.\n\nThe challenges are real, but so is the opportunity. With the right support, independent media in Cebu can become a model for the rest of the country.',
  'opinion',
  'published',
  'a1000000-0000-0000-0000-000000000001',
  'View of Cebu City skyline at dusk',
  now() - interval '1 day',
  false,
  5,
  'english',
  'manual'
);

-- ── Story Tags ──

-- News story: Cebu City, Environment, Local Politics
INSERT INTO story_tags (story_id, tag_id) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001'),
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002'),
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003');

-- Feature story: Cebu City, Community, Environment
INSERT INTO story_tags (story_id, tag_id) VALUES
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001'),
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000004'),
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002');

-- Opinion story: Community, Culture
INSERT INTO story_tags (story_id, tag_id) VALUES
  ('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000004'),
  ('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000005');

-- ── Site Settings ──

INSERT INTO site_settings (key, value) VALUES
  ('site_name', '"Aninaw Productions"'),
  ('site_tagline', '"Cebu-based alternative media & journalism"'),
  ('contact_email', '"hello@aninaw.com"'),
  ('social_links', '{"facebook": "https://facebook.com/aninawproductions", "instagram": "https://instagram.com/aninawproductions"}');
