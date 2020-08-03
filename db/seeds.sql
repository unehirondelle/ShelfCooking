use recipes_db;

insert into measurement_units (name)
values ('cup'),
       ('tsp'),
       ('tbsp'),
       ('gr'),
       ('ml'),
       ('pinch'),
       ('handful'),
       ('slice'),
       ('ea');

insert into ingredients (name)
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

insert into utensils (name)
values ('Knife'),
       ('Cutting Board'),
       ('Skillet'),
       ('Grill'),
       ('Microwave');

insert into recipes (name, method, time, person_num)
values ('Crock Madame',
        'Melt the butter in a pan on a low-high. Add flour, cook until it goldens. Add salt, nutmeg, and bay leaf, cook until thickened. Fry bread on a dry pan, both sides, until crispy. Spread half of the sauce over 1 slice of bread, put ham on top, add another slice of bread, spread the rest sauce, sprinkle with cheese, put under the grill for 7 mins. Fry an egg sunny side up. Take the sandwich from the oven, put the egg in the top, sprinkle with herbs.',
        '20 min',
        '1');

insert into recipes (name, method, time, person_num)
values ('Oatmeal',
        'Mix everything together, Put in the microwave on max power for 3 mins or until it starts to boil. Watch to it doesn''t overflow. Leave in a microwave for 5 mins more.',
        '8 min',
        '1');

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (1, 1, 2, 8);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (1, 2, 1, 1);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (1, 3, 1, 3);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (1, 4, 1, 3);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (1, 5, 1, 9);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (1, 6, 1, 8);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (1, 7, 2, 9);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (1, 8, 1, 2);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (1, 9, 0.5, 2);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (1, 10, 1, 6);

select r.name             as 'Recipe',
       r.time             as 'Time',
       r.person_num       as 'Persons',
       i.name             as 'Ingredient',
       ri.measurement_qty as 'Amount',
       mu.name            as 'Unit of Measure',
       r.method           as 'Method'
from recipes r
         join recipe_ingredients ri on r.id = ri.recipe_id
         join ingredients i on i.id = ri.ingredient_id
         left outer join measurement_units mu on mu.id = measurement_id;
