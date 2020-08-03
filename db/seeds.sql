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
        '<li>Melt the butter in a pan on a low-high.</li> <li>Add flour, cook until it goldens.</li> <li>Add salt, nutmeg, and bay leaf, cook until thickened.</li> <li>Fry bread on a dry pan, both sides, until crispy.</li> <li>Spread half of the sauce over 1 slice of bread, put ham on top, add another slice of bread, spread the rest sauce, sprinkle with cheese, put under the grill for 7 mins.</li> <li>Fry an egg sunny side up.</li> <li>Take the sandwich from the oven, put the egg in the top, sprinkle with herbs.</li>',
        '20 min',
        '1');

insert into recipes (name, method, time, person_num)
values ('Oatmeal',
        'Mix everything together, Put in the microwave on max power for 3 mins or until it starts to boil. Watch to it doesn''t overflow. Leave in a microwave for 5 mins more.',
        '8 min',
        '1');

# "Crock Madame" recipe starts
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
# "Crock Madame" recipe ends

# "Oatmeal" recipe starts
insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (2, 4, 2, 3);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (2, 11, 1, 1);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (2, 12, 1.5, 1);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (2, 9, 1, 6);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (2, 13, 0.5, 2);

insert into recipe_ingredients (recipe_id, ingredient_id, measurement_qty, measurement_id)
values (2, 14, 0.5, 1);
# "Oatmeal" recipe ends

select ri.recipe_id,
       i.name as 'name',
       ri.measurement_qty as 'amount',
       mu.name as 'unit'
from recipe_ingredients ri
         join ingredients i on i.id = ri.ingredient_id
         left outer join measurement_units mu on mu.id = measurement_id
where recipe_id = 1;

select * from recipes where id = 1;