-- DietManager Mock Data Seed
-- Run with: psql <connection-string> -f seed.sql
-- Or paste directly into Prisma Studio's SQL editor / any PG client

-- ============================================================
-- USERS
-- ============================================================
INSERT INTO "User" (id, "externalAuthId", email, "createdAt", "updatedAt") VALUES
  ('u1-0000-0000-0000-000000000001', 'auth0|user1', 'alex.johnson@example.com', NOW() - INTERVAL '90 days', NOW()),
  ('u2-0000-0000-0000-000000000002', 'auth0|user2', 'maria.garcia@example.com', NOW() - INTERVAL '60 days', NOW()),
  ('u3-0000-0000-0000-000000000003', 'auth0|user3', 'john.smith@example.com',   NOW() - INTERVAL '30 days', NOW());

-- ============================================================
-- USER PROFILES
-- ============================================================
INSERT INTO "UserProfile" (
  id, "userId", "tenantId",
  "dateOfBirth", gender, "heightCm", "weightKg", "targetWeightKg",
  allergies, intolerances, "medicalConditions",
  "customAllergies", "customIntolerances", "customMedicalConditions",
  "dietType", "cuisinePreferences",
  "primaryGoal", "activityLevel",
  "isComplete", "createdAt", "updatedAt"
) VALUES
  (
    'p1-0000-0000-0000-000000000001', 'u1-0000-0000-0000-000000000001', 'tenant-default',
    '1992-04-15', 'male', 182, 88.5, 80.0,
    ARRAY[]::text[], ARRAY['lactose']::text[], ARRAY[]::text[],
    ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[],
    'no_preference', ARRAY['mediterranean','american']::text[],
    'lose_weight', 'moderately_active',
    true, NOW() - INTERVAL '89 days', NOW()
  ),
  (
    'p2-0000-0000-0000-000000000002', 'u2-0000-0000-0000-000000000002', 'tenant-default',
    '1995-08-22', 'female', 165, 62.0, 58.0,
    ARRAY['peanuts']::text[], ARRAY[]::text[], ARRAY[]::text[],
    ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[],
    'vegan', ARRAY['asian','mediterranean']::text[],
    'eat_healthier', 'lightly_active',
    true, NOW() - INTERVAL '59 days', NOW()
  ),
  (
    'p3-0000-0000-0000-000000000003', 'u3-0000-0000-0000-000000000003', 'tenant-default',
    '1988-12-01', 'male', 178, 75.0, 80.0,
    ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[],
    ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[],
    'keto', ARRAY['american','mexican']::text[],
    'gain_muscle', 'very_active',
    true, NOW() - INTERVAL '29 days', NOW()
  );

-- ============================================================
-- GOALS
-- ============================================================
INSERT INTO "Goal" (
  id, "userId", name, "targetCalories",
  "targetProtein", "targetFat", "targetCarbs",
  "startDate", "endDate", "isActive",
  "goalType", "targetWeight", "activityLevel", "calculationMethod",
  "createdAt", "updatedAt"
) VALUES
  ('g1-0000-0000-0000-000000000001', 'u1-0000-0000-0000-000000000001',
   'Weight Loss Plan', 1800, 140.0, 60.0, 180.0,
   NOW() - INTERVAL '89 days', NULL, true,
   'lose_weight', 80.0, 'moderately_active', 'calculated',
   NOW() - INTERVAL '89 days', NOW()),

  ('g2-0000-0000-0000-000000000002', 'u2-0000-0000-0000-000000000002',
   'Healthy Eating', 1600, 80.0, 55.0, 200.0,
   NOW() - INTERVAL '59 days', NULL, true,
   'eat_healthier', 58.0, 'lightly_active', 'calculated',
   NOW() - INTERVAL '59 days', NOW()),

  ('g3-0000-0000-0000-000000000003', 'u3-0000-0000-0000-000000000003',
   'Muscle Gain', 2800, 200.0, 95.0, 280.0,
   NOW() - INTERVAL '29 days', NULL, true,
   'gain_muscle', 80.0, 'very_active', 'calculated',
   NOW() - INTERVAL '29 days', NOW());

-- ============================================================
-- MEALS (last 7 days for user 1, spread across meal types)
-- ============================================================
INSERT INTO "Meal" (id, "userId", name, category, ingredients, calories, protein, fat, carbs, "portionSize", "imageUrl", source, "mealType", "createdAt") VALUES
  -- Day 1
  ('m01-000-0000-0000-000000000001', 'u1-0000-0000-0000-000000000001', 'Oatmeal with Berries',    'Breakfast', ARRAY['oats','blueberries','honey','almond milk'],           320, 12.0, 6.0,  58.0, 300, NULL, 'manual',  'breakfast', NOW() - INTERVAL '6 days'),
  ('m01-000-0000-0000-000000000002', 'u1-0000-0000-0000-000000000001', 'Grilled Chicken Salad',   'Lunch',     ARRAY['chicken breast','lettuce','tomato','cucumber','olive oil'], 420, 45.0, 14.0, 18.0, 350, NULL, 'scan',    'lunch',     NOW() - INTERVAL '6 days'),
  ('m01-000-0000-0000-000000000003', 'u1-0000-0000-0000-000000000001', 'Salmon with Quinoa',      'Dinner',    ARRAY['salmon','quinoa','broccoli','lemon','olive oil'],           550, 42.0, 22.0, 38.0, 400, NULL, 'manual',  'dinner',    NOW() - INTERVAL '6 days'),
  -- Day 2
  ('m02-000-0000-0000-000000000001', 'u1-0000-0000-0000-000000000001', 'Greek Yogurt Parfait',    'Breakfast', ARRAY['greek yogurt','granola','strawberries','honey'],            280, 18.0, 5.0,  42.0, 250, NULL, 'manual',  'breakfast', NOW() - INTERVAL '5 days'),
  ('m02-000-0000-0000-000000000002', 'u1-0000-0000-0000-000000000001', 'Turkey Wrap',             'Lunch',     ARRAY['turkey','whole wheat tortilla','avocado','lettuce'],        480, 38.0, 16.0, 44.0, 300, NULL, 'scan',    'lunch',     NOW() - INTERVAL '5 days'),
  ('m02-000-0000-0000-000000000003', 'u1-0000-0000-0000-000000000001', 'Beef Stir Fry',           'Dinner',    ARRAY['beef','bell pepper','broccoli','soy sauce','rice'],         620, 40.0, 20.0, 65.0, 450, NULL, 'manual',  'dinner',    NOW() - INTERVAL '5 days'),
  -- Day 3
  ('m03-000-0000-0000-000000000001', 'u1-0000-0000-0000-000000000001', 'Avocado Toast',           'Breakfast', ARRAY['sourdough bread','avocado','eggs','cherry tomatoes'],       380, 15.0, 22.0, 32.0, 280, NULL, 'manual',  'breakfast', NOW() - INTERVAL '4 days'),
  ('m03-000-0000-0000-000000000002', 'u1-0000-0000-0000-000000000001', 'Tuna Sandwich',           'Lunch',     ARRAY['tuna','whole grain bread','mayo','celery','onion'],         410, 35.0, 12.0, 38.0, 320, NULL, 'manual',  'lunch',     NOW() - INTERVAL '4 days'),
  ('m03-000-0000-0000-000000000003', 'u1-0000-0000-0000-000000000001', 'Chicken Pasta',           'Dinner',    ARRAY['chicken','pasta','tomato sauce','parmesan','basil'],        580, 38.0, 14.0, 72.0, 420, NULL, 'scan',    'dinner',    NOW() - INTERVAL '4 days'),
  -- Day 4
  ('m04-000-0000-0000-000000000001', 'u1-0000-0000-0000-000000000001', 'Banana Protein Smoothie', 'Breakfast', ARRAY['banana','protein powder','almond milk','peanut butter'],   410, 32.0, 12.0, 48.0, 400, NULL, 'manual',  'breakfast', NOW() - INTERVAL '3 days'),
  ('m04-000-0000-0000-000000000002', 'u1-0000-0000-0000-000000000001', 'Caesar Salad',            'Lunch',     ARRAY['romaine','chicken','caesar dressing','croutons','parmesan'],390, 30.0, 18.0, 22.0, 300, NULL, 'scan',    'lunch',     NOW() - INTERVAL '3 days'),
  ('m04-000-0000-0000-000000000003', 'u1-0000-0000-0000-000000000001', 'Grilled Tilapia',         'Dinner',    ARRAY['tilapia','asparagus','garlic','lemon','olive oil'],          460, 44.0, 16.0, 14.0, 380, NULL, 'manual',  'dinner',    NOW() - INTERVAL '3 days'),
  -- Day 5
  ('m05-000-0000-0000-000000000001', 'u1-0000-0000-0000-000000000001', 'Scrambled Eggs',          'Breakfast', ARRAY['eggs','spinach','feta cheese','olive oil'],                 310, 22.0, 20.0,  6.0, 250, NULL, 'manual',  'breakfast', NOW() - INTERVAL '2 days'),
  ('m05-000-0000-0000-000000000002', 'u1-0000-0000-0000-000000000001', 'Lentil Soup',             'Lunch',     ARRAY['lentils','carrots','celery','onion','cumin'],               350, 22.0,  4.0, 58.0, 350, NULL, 'manual',  'lunch',     NOW() - INTERVAL '2 days'),
  ('m05-000-0000-0000-000000000003', 'u1-0000-0000-0000-000000000001', 'Pork Tenderloin',         'Dinner',    ARRAY['pork tenderloin','sweet potato','green beans','garlic'],    520, 46.0, 14.0, 48.0, 400, NULL, 'manual',  'dinner',    NOW() - INTERVAL '2 days'),
  -- Day 6
  ('m06-000-0000-0000-000000000001', 'u1-0000-0000-0000-000000000001', 'Pancakes',                'Breakfast', ARRAY['flour','eggs','milk','butter','maple syrup'],               440, 10.0, 14.0, 68.0, 300, NULL, 'manual',  'breakfast', NOW() - INTERVAL '1 day'),
  ('m06-000-0000-0000-000000000002', 'u1-0000-0000-0000-000000000001', 'Veggie Bowl',             'Lunch',     ARRAY['brown rice','roasted veggies','chickpeas','tahini'],        480, 18.0, 16.0, 68.0, 400, NULL, 'scan',    'lunch',     NOW() - INTERVAL '1 day'),
  ('m06-000-0000-0000-000000000003', 'u1-0000-0000-0000-000000000001', 'Shrimp Tacos',            'Dinner',    ARRAY['shrimp','corn tortillas','cabbage','lime','cilantro'],      510, 36.0, 16.0, 54.0, 380, NULL, 'scan',    'dinner',    NOW() - INTERVAL '1 day'),
  -- Day 7 (today)
  ('m07-000-0000-0000-000000000001', 'u1-0000-0000-0000-000000000001', 'Overnight Oats',          'Breakfast', ARRAY['oats','chia seeds','almond milk','banana','peanut butter'], 395, 14.0, 14.0, 56.0, 350, NULL, 'manual',  'breakfast', NOW()),
  ('m07-000-0000-0000-000000000002', 'u1-0000-0000-0000-000000000001', 'Chicken Rice Bowl',       'Lunch',     ARRAY['chicken','white rice','broccoli','teriyaki sauce'],         510, 42.0, 10.0, 60.0, 400, NULL, 'scan',    'lunch',     NOW()),
  -- User 2 meals
  ('m08-000-0000-0000-000000000001', 'u2-0000-0000-0000-000000000002', 'Tofu Scramble',           'Breakfast', ARRAY['tofu','spinach','bell pepper','turmeric','nutritional yeast'],290, 20.0, 14.0, 18.0, 300, NULL, 'manual',  'breakfast', NOW() - INTERVAL '2 days'),
  ('m08-000-0000-0000-000000000002', 'u2-0000-0000-0000-000000000002', 'Buddha Bowl',             'Lunch',     ARRAY['quinoa','roasted veggies','hummus','avocado','seeds'],       440, 16.0, 20.0, 52.0, 400, NULL, 'scan',    'lunch',     NOW() - INTERVAL '2 days'),
  ('m08-000-0000-0000-000000000003', 'u2-0000-0000-0000-000000000002', 'Vegan Curry',             'Dinner',    ARRAY['chickpeas','coconut milk','tomatoes','spinach','spices'],   480, 18.0, 20.0, 58.0, 400, NULL, 'manual',  'dinner',    NOW() - INTERVAL '2 days'),
  -- User 3 meals
  ('m09-000-0000-0000-000000000001', 'u3-0000-0000-0000-000000000003', 'Bacon and Eggs',          'Breakfast', ARRAY['bacon','eggs','butter','cheese'],                           520, 38.0, 38.0,  2.0, 280, NULL, 'manual',  'breakfast', NOW() - INTERVAL '1 day'),
  ('m09-000-0000-0000-000000000002', 'u3-0000-0000-0000-000000000003', 'Steak Salad',             'Lunch',     ARRAY['ribeye steak','arugula','avocado','olive oil','parmesan'],  680, 52.0, 48.0,  8.0, 400, NULL, 'scan',    'lunch',     NOW() - INTERVAL '1 day'),
  ('m09-000-0000-0000-000000000003', 'u3-0000-0000-0000-000000000003', 'Ground Beef Bowl',        'Dinner',    ARRAY['ground beef','cauliflower rice','cheese','sour cream'],     720, 58.0, 46.0, 12.0, 450, NULL, 'manual',  'dinner',    NOW() - INTERVAL '1 day');

-- ============================================================
-- MEAL TAGS
-- ============================================================
INSERT INTO "MealTag" (id, "mealId", tag) VALUES
  ('t01', 'm01-000-0000-0000-000000000001', 'high-fiber'),
  ('t02', 'm01-000-0000-0000-000000000002', 'high-protein'),
  ('t03', 'm01-000-0000-0000-000000000003', 'omega-3'),
  ('t04', 'm04-000-0000-0000-000000000001', 'post-workout'),
  ('t05', 'm07-000-0000-0000-000000000002', 'meal-prep'),
  ('t06', 'm08-000-0000-0000-000000000002', 'vegan'),
  ('t07', 'm08-000-0000-0000-000000000003', 'vegan'),
  ('t08', 'm09-000-0000-0000-000000000001', 'keto'),
  ('t09', 'm09-000-0000-0000-000000000003', 'keto');

-- ============================================================
-- WATER LOGS (last 7 days, user 1)
-- ============================================================
INSERT INTO "WaterLog" (id, "userId", amount, unit, "createdAt") VALUES
  ('w01', 'u1-0000-0000-0000-000000000001', 250, 'ml', NOW() - INTERVAL '6 days' + INTERVAL '8 hours'),
  ('w02', 'u1-0000-0000-0000-000000000001', 500, 'ml', NOW() - INTERVAL '6 days' + INTERVAL '12 hours'),
  ('w03', 'u1-0000-0000-0000-000000000001', 300, 'ml', NOW() - INTERVAL '6 days' + INTERVAL '18 hours'),
  ('w04', 'u1-0000-0000-0000-000000000001', 250, 'ml', NOW() - INTERVAL '5 days' + INTERVAL '8 hours'),
  ('w05', 'u1-0000-0000-0000-000000000001', 400, 'ml', NOW() - INTERVAL '5 days' + INTERVAL '13 hours'),
  ('w06', 'u1-0000-0000-0000-000000000001', 500, 'ml', NOW() - INTERVAL '5 days' + INTERVAL '19 hours'),
  ('w07', 'u1-0000-0000-0000-000000000001', 300, 'ml', NOW() - INTERVAL '4 days' + INTERVAL '9 hours'),
  ('w08', 'u1-0000-0000-0000-000000000001', 250, 'ml', NOW() - INTERVAL '4 days' + INTERVAL '14 hours'),
  ('w09', 'u1-0000-0000-0000-000000000001', 400, 'ml', NOW() - INTERVAL '3 days' + INTERVAL '8 hours'),
  ('w10', 'u1-0000-0000-0000-000000000001', 500, 'ml', NOW() - INTERVAL '3 days' + INTERVAL '12 hours'),
  ('w11', 'u1-0000-0000-0000-000000000001', 300, 'ml', NOW() - INTERVAL '3 days' + INTERVAL '17 hours'),
  ('w12', 'u1-0000-0000-0000-000000000001', 250, 'ml', NOW() - INTERVAL '2 days' + INTERVAL '9 hours'),
  ('w13', 'u1-0000-0000-0000-000000000001', 400, 'ml', NOW() - INTERVAL '2 days' + INTERVAL '15 hours'),
  ('w14', 'u1-0000-0000-0000-000000000001', 500, 'ml', NOW() - INTERVAL '1 day'  + INTERVAL '8 hours'),
  ('w15', 'u1-0000-0000-0000-000000000001', 250, 'ml', NOW() - INTERVAL '1 day'  + INTERVAL '12 hours'),
  ('w16', 'u1-0000-0000-0000-000000000001', 350, 'ml', NOW() - INTERVAL '1 day'  + INTERVAL '20 hours'),
  ('w17', 'u1-0000-0000-0000-000000000001', 250, 'ml', NOW()),
  ('w18', 'u2-0000-0000-0000-000000000002', 300, 'ml', NOW() - INTERVAL '2 days'),
  ('w19', 'u2-0000-0000-0000-000000000002', 500, 'ml', NOW() - INTERVAL '1 day'),
  ('w20', 'u3-0000-0000-0000-000000000003', 600, 'ml', NOW() - INTERVAL '1 day');

-- ============================================================
-- WEIGHT LOGS (last 30 days, user 1 — gradual loss trend)
-- ============================================================
INSERT INTO "WeightLog" (id, "userId", weight, unit, note, "createdAt") VALUES
  ('wl01', 'u1-0000-0000-0000-000000000001', 88.5, 'kg', 'Starting weight', NOW() - INTERVAL '30 days'),
  ('wl02', 'u1-0000-0000-0000-000000000001', 88.2, 'kg', NULL,              NOW() - INTERVAL '25 days'),
  ('wl03', 'u1-0000-0000-0000-000000000001', 87.8, 'kg', 'Feeling good',    NOW() - INTERVAL '20 days'),
  ('wl04', 'u1-0000-0000-0000-000000000001', 87.4, 'kg', NULL,              NOW() - INTERVAL '15 days'),
  ('wl05', 'u1-0000-0000-0000-000000000001', 87.1, 'kg', 'Post cheat day',  NOW() - INTERVAL '10 days'),
  ('wl06', 'u1-0000-0000-0000-000000000001', 86.8, 'kg', NULL,              NOW() - INTERVAL '5 days'),
  ('wl07', 'u1-0000-0000-0000-000000000001', 86.5, 'kg', 'On track!',       NOW()),
  ('wl08', 'u2-0000-0000-0000-000000000002', 62.0, 'kg', 'Starting',        NOW() - INTERVAL '30 days'),
  ('wl09', 'u2-0000-0000-0000-000000000002', 61.6, 'kg', NULL,              NOW() - INTERVAL '15 days'),
  ('wl10', 'u2-0000-0000-0000-000000000002', 61.3, 'kg', NULL,              NOW()),
  ('wl11', 'u3-0000-0000-0000-000000000003', 75.0, 'kg', 'Baseline',        NOW() - INTERVAL '29 days'),
  ('wl12', 'u3-0000-0000-0000-000000000003', 75.5, 'kg', NULL,              NOW() - INTERVAL '14 days'),
  ('wl13', 'u3-0000-0000-0000-000000000003', 76.1, 'kg', 'Gaining!',        NOW());

-- ============================================================
-- WORKOUTS
-- ============================================================
INSERT INTO "Workout" (id, "userId", name, type, duration, "caloriesBurned", note, "createdAt") VALUES
  ('wo01', 'u1-0000-0000-0000-000000000001', 'Morning Run',         'cardio',    35, 320, '5km easy pace',             NOW() - INTERVAL '6 days'),
  ('wo02', 'u1-0000-0000-0000-000000000001', 'Upper Body Strength', 'strength',  50, 280, 'Bench, rows, shoulder press',NOW() - INTERVAL '5 days'),
  ('wo03', 'u1-0000-0000-0000-000000000001', 'HIIT Session',        'hiit',      25, 350, '20s on / 10s off x 8 rounds',NOW() - INTERVAL '4 days'),
  ('wo04', 'u1-0000-0000-0000-000000000001', 'Lower Body Day',      'strength',  55, 300, 'Squats, deadlifts, lunges',   NOW() - INTERVAL '2 days'),
  ('wo05', 'u1-0000-0000-0000-000000000001', 'Evening Walk',        'cardio',    45, 180, NULL,                          NOW() - INTERVAL '1 day'),
  ('wo06', 'u2-0000-0000-0000-000000000002', 'Yoga Flow',           'flexibility',60, 150, 'Vinyasa',                   NOW() - INTERVAL '2 days'),
  ('wo07', 'u2-0000-0000-0000-000000000002', 'Pilates',             'flexibility',45, 120, NULL,                         NOW() - INTERVAL '1 day'),
  ('wo08', 'u3-0000-0000-0000-000000000003', 'Push Day',            'strength',  70, 420, 'Chest, triceps, shoulders',  NOW() - INTERVAL '2 days'),
  ('wo09', 'u3-0000-0000-0000-000000000003', 'Pull Day',            'strength',  65, 390, 'Back, biceps',               NOW() - INTERVAL '1 day');

-- ============================================================
-- RECIPES
-- ============================================================
INSERT INTO "Recipe" (
  id, "userId", name, description, instructions,
  "prepTime", "cookTime", servings,
  calories, protein, fat, carbs,
  "isPublic", "createdAt", "updatedAt"
) VALUES
  ('r01', 'u1-0000-0000-0000-000000000001',
   'High-Protein Chicken Bowl',
   'Simple meal-prep friendly bowl packed with protein',
   '1. Cook rice. 2. Season and grill chicken. 3. Steam broccoli. 4. Assemble and drizzle with teriyaki sauce.',
   10, 20, 4,
   480, 42.0, 8.0, 58.0,
   true, NOW() - INTERVAL '40 days', NOW()),

  ('r02', 'u1-0000-0000-0000-000000000001',
   'Greek Salmon Salad',
   'Light and fresh Mediterranean-inspired salad',
   '1. Grill salmon. 2. Chop veggies. 3. Mix dressing. 4. Combine and serve.',
   15, 12, 2,
   420, 38.0, 22.0, 12.0,
   true, NOW() - INTERVAL '35 days', NOW()),

  ('r03', 'u2-0000-0000-0000-000000000002',
   'Vegan Power Bowl',
   'Nutrient-dense plant-based bowl',
   '1. Cook quinoa. 2. Roast chickpeas with spices. 3. Roast veggies. 4. Make tahini dressing. 5. Assemble.',
   20, 30, 2,
   440, 18.0, 18.0, 54.0,
   true, NOW() - INTERVAL '20 days', NOW()),

  ('r04', 'u3-0000-0000-0000-000000000003',
   'Keto Beef Bowl',
   'Low-carb high-fat macro-friendly bowl',
   '1. Brown beef. 2. Rice cauliflower. 3. Season and combine. 4. Top with cheese and sour cream.',
   10, 15, 2,
   680, 52.0, 44.0, 8.0,
   false, NOW() - INTERVAL '10 days', NOW());

-- ============================================================
-- RECIPE INGREDIENTS
-- ============================================================
INSERT INTO "RecipeIngredient" (id, "recipeId", name, amount, unit) VALUES
  ('ri01', 'r01', 'Chicken breast',   200, 'g'),
  ('ri02', 'r01', 'White rice',       150, 'g'),
  ('ri03', 'r01', 'Broccoli',         100, 'g'),
  ('ri04', 'r01', 'Teriyaki sauce',    30, 'ml'),
  ('ri05', 'r02', 'Salmon fillet',    180, 'g'),
  ('ri06', 'r02', 'Romaine lettuce',   80, 'g'),
  ('ri07', 'r02', 'Cherry tomatoes',   60, 'g'),
  ('ri08', 'r02', 'Olive oil',         15, 'ml'),
  ('ri09', 'r02', 'Lemon juice',       10, 'ml'),
  ('ri10', 'r03', 'Quinoa',           120, 'g'),
  ('ri11', 'r03', 'Chickpeas',        100, 'g'),
  ('ri12', 'r03', 'Mixed vegetables', 150, 'g'),
  ('ri13', 'r03', 'Tahini',            30, 'g'),
  ('ri14', 'r04', 'Ground beef',      250, 'g'),
  ('ri15', 'r04', 'Cauliflower',      200, 'g'),
  ('ri16', 'r04', 'Cheddar cheese',    40, 'g'),
  ('ri17', 'r04', 'Sour cream',        30, 'g');

-- ============================================================
-- FAVORITE MEALS
-- ============================================================
INSERT INTO "FavoriteMeal" (id, "userId", name, category, calories, protein, fat, carbs, "portionSize", ingredients, "createdAt") VALUES
  ('f01', 'u1-0000-0000-0000-000000000001', 'Grilled Chicken Salad', 'Lunch',     420, 45.0, 14.0, 18.0, 350, ARRAY['chicken breast','lettuce','tomato','olive oil'], NOW() - INTERVAL '30 days'),
  ('f02', 'u1-0000-0000-0000-000000000001', 'Salmon with Quinoa',    'Dinner',    550, 42.0, 22.0, 38.0, 400, ARRAY['salmon','quinoa','broccoli','lemon'],            NOW() - INTERVAL '25 days'),
  ('f03', 'u2-0000-0000-0000-000000000002', 'Buddha Bowl',           'Lunch',     440, 16.0, 20.0, 52.0, 400, ARRAY['quinoa','roasted veggies','hummus','avocado'],   NOW() - INTERVAL '15 days'),
  ('f04', 'u3-0000-0000-0000-000000000003', 'Steak Salad',           'Lunch',     680, 52.0, 48.0,  8.0, 400, ARRAY['ribeye steak','arugula','avocado','parmesan'],   NOW() - INTERVAL '10 days');

-- ============================================================
-- MEAL PLANS
-- ============================================================
INSERT INTO "MealPlan" (id, "userId", name, "startDate", "endDate", "isActive", "createdAt", "updatedAt") VALUES
  ('mp01', 'u1-0000-0000-0000-000000000001', 'Week 1 Cut Plan', NOW() - INTERVAL '7 days', NOW() + INTERVAL '7 days', true,  NOW() - INTERVAL '7 days', NOW()),
  ('mp02', 'u2-0000-0000-0000-000000000002', 'Vegan Week Plan', NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days', true,  NOW() - INTERVAL '3 days', NOW());

INSERT INTO "MealPlanEntry" (id, "mealPlanId", "dayOfWeek", "mealType", "mealName", calories, protein, fat, carbs) VALUES
  ('mpe01', 'mp01', 1, 'breakfast', 'Oatmeal with Berries',      320, 12.0,  6.0, 58.0),
  ('mpe02', 'mp01', 1, 'lunch',     'Grilled Chicken Salad',     420, 45.0, 14.0, 18.0),
  ('mpe03', 'mp01', 1, 'dinner',    'Salmon with Quinoa',        550, 42.0, 22.0, 38.0),
  ('mpe04', 'mp01', 2, 'breakfast', 'Greek Yogurt Parfait',      280, 18.0,  5.0, 42.0),
  ('mpe05', 'mp01', 2, 'lunch',     'Turkey Wrap',               480, 38.0, 16.0, 44.0),
  ('mpe06', 'mp01', 2, 'dinner',    'Grilled Tilapia',           460, 44.0, 16.0, 14.0),
  ('mpe07', 'mp02', 1, 'breakfast', 'Tofu Scramble',             290, 20.0, 14.0, 18.0),
  ('mpe08', 'mp02', 1, 'lunch',     'Buddha Bowl',               440, 16.0, 20.0, 52.0),
  ('mpe09', 'mp02', 1, 'dinner',    'Vegan Curry',               480, 18.0, 20.0, 58.0);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
INSERT INTO "Achievement" (id, name, description, icon, criteria, points, "createdAt") VALUES
  ('a01', 'First Meal Logged',   'Log your first meal',                     'utensils',    'meals_count >= 1',   10,  NOW() - INTERVAL '100 days'),
  ('a02', 'Week Streak',         'Log meals for 7 consecutive days',         'flame',       'streak_days >= 7',   50,  NOW() - INTERVAL '100 days'),
  ('a03', 'Hydration Hero',      'Drink 2L of water in a single day',        'droplets',    'water_daily >= 2000', 30, NOW() - INTERVAL '100 days'),
  ('a04', 'Goal Setter',         'Set your first nutrition goal',             'target',      'goals_count >= 1',   20,  NOW() - INTERVAL '100 days'),
  ('a05', 'Workout Warrior',     'Complete 10 workouts',                      'dumbbell',    'workouts_count >= 10',75, NOW() - INTERVAL '100 days'),
  ('a06', 'Recipe Creator',      'Create and share a recipe',                 'chef-hat',    'public_recipes >= 1', 40, NOW() - INTERVAL '100 days'),
  ('a07', '5kg Lost',            'Lose 5kg from your starting weight',        'trending-down','weight_lost >= 5',  100, NOW() - INTERVAL '100 days'),
  ('a08', 'Scan Master',         'Use AI scan 20 times',                      'camera',      'scans_count >= 20',  60,  NOW() - INTERVAL '100 days');

-- ============================================================
-- USER ACHIEVEMENTS
-- ============================================================
INSERT INTO "UserAchievement" (id, "userId", "achievementId", "unlockedAt") VALUES
  ('ua01', 'u1-0000-0000-0000-000000000001', 'a01', NOW() - INTERVAL '89 days'),
  ('ua02', 'u1-0000-0000-0000-000000000001', 'a04', NOW() - INTERVAL '89 days'),
  ('ua03', 'u1-0000-0000-0000-000000000001', 'a02', NOW() - INTERVAL '82 days'),
  ('ua04', 'u1-0000-0000-0000-000000000001', 'a06', NOW() - INTERVAL '40 days'),
  ('ua05', 'u2-0000-0000-0000-000000000002', 'a01', NOW() - INTERVAL '59 days'),
  ('ua06', 'u2-0000-0000-0000-000000000002', 'a04', NOW() - INTERVAL '59 days'),
  ('ua07', 'u2-0000-0000-0000-000000000002', 'a06', NOW() - INTERVAL '20 days'),
  ('ua08', 'u3-0000-0000-0000-000000000003', 'a01', NOW() - INTERVAL '29 days'),
  ('ua09', 'u3-0000-0000-0000-000000000003', 'a04', NOW() - INTERVAL '29 days');

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
INSERT INTO "Notification" (id, "userId", title, message, type, "isRead", "createdAt") VALUES
  ('n01', 'u1-0000-0000-0000-000000000001', 'Daily Goal Reached!',       'You hit your calorie target today. Great work!',             'goal',       true,  NOW() - INTERVAL '5 days'),
  ('n02', 'u1-0000-0000-0000-000000000001', 'Streak: 7 days!',           'You''ve logged meals for 7 days in a row. Keep it up!',      'achievement', true,  NOW() - INTERVAL '82 days'),
  ('n03', 'u1-0000-0000-0000-000000000001', 'Time to Log Lunch',         'Don''t forget to log your midday meal.',                     'reminder',   false, NOW() - INTERVAL '1 day'),
  ('n04', 'u1-0000-0000-0000-000000000001', 'Weekly Summary Ready',      'Check out your nutrition summary for last week.',             'summary',    false, NOW() - INTERVAL '1 day'),
  ('n05', 'u1-0000-0000-0000-000000000001', 'New Achievement Unlocked!', 'You earned the "Recipe Creator" badge.',                     'achievement', false, NOW() - INTERVAL '40 days'),
  ('n06', 'u2-0000-0000-0000-000000000002', 'Welcome to DietManager!',   'Start your journey by logging your first meal.',             'info',       true,  NOW() - INTERVAL '59 days'),
  ('n07', 'u2-0000-0000-0000-000000000002', 'Protein Goal Met',          'Great job hitting your protein target today!',               'goal',       false, NOW() - INTERVAL '2 days'),
  ('n08', 'u3-0000-0000-0000-000000000003', 'Welcome to DietManager!',   'Start your journey by logging your first meal.',             'info',       true,  NOW() - INTERVAL '29 days'),
  ('n09', 'u3-0000-0000-0000-000000000003', 'Calorie Surplus Detected',  'You exceeded your calorie target by 200 kcal yesterday.',    'warning',    false, NOW() - INTERVAL '1 day');
