insert into measurment_units (measurement_description)
values ('cup'),
       ('tsp'),
       ('tbsp'),
       ('gr'),
       ('ml'),
       ('pinch'),
       ('handful'),
       ('slice');

insert into ingredients (ingredient_name)
values ('Bread'),
       ('Milk'),
       ('All-Purpose flour'),
       ('Butter'),
       ('Eggs'),
       ('Ham'),
       ('Bay Leaf'),
       ('Nutmeg'),
       ('Salt'),
       ('Herbs'),
       ('Classic Rolled Oatmeal'),
       ('Water'),
       ('Ground Cinnamon'),
       ('Fruits');

insert into utencils (utencil_name)
values ('Knife'),
       ('Cutting Board'),
       ('Skillet'),
       ('Grill'),
       ('Microwave');

insert into recipes (recipe_name, recipe_method, recipe_time, recipe_person_num)
values ('Crock Madame',
        'Melt the butter in a pan on a low-high. Add flour, cook until it goldens. Add salt, nutmeg, and bay leaf, cook until thickened. Fry bread on a dry pan, both sides, until crispy. Spread half of the sauce over 1 slice of bread, put ham on top, add another slice of bread, spread the rest sauce, sprinkle with cheese, put under the grill for 7 mins. Fry an egg sunny side up. Take the sandwich from the oven, put the egg in the top, sprinkle with herbs.',
        '20 min',
        '1');

insert into recipes (recipe_name, recipe_method, recipe_time, recipe_person_num)
values ('Oatmeal',
        'Mix everything together, Put in the microwave on max power for 3 mins or until it starts to boil. Watch to it doesn''t overflow. Leave in a microwave for 5 mins more.',
        '8 min',
        '1');

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (1, 1, 2, 8);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (1, 1, 2, 8)