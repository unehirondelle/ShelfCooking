drop database if exists recipes_db;
create database recipes_db;
use recipes_db;

create table recipes
(
    recipe_id         int auto_increment primary key,
    recipe_name       varchar(50)    not null,
    recipe_method     varchar(10000) not null,
    recipe_time       varchar(10),
    recipe_person_num int
);

create table measurement_units
(
    measurement_id          int auto_increment primary key,
    measurement_description varchar(10)
);

create table ingredients
(
    ingredient_id   int auto_increment primary key,
    ingredient_name varchar(30)
);

create table utencils
(
    utencil_id   int auto_increment primary key,
    utencil_name varchar(30)
)

create table recipe_ingredients
(
    recipe_id       int,
    ingredient_id   int,
    measurement_qty int,
    measurement_id  int,
    constraint fk_recipe foreign key (recipe_id) references recipes (recipe_id),
    constraint fk_utencil foreign key (utencil_id) references utencils (utencil_id),
    constraint fk_ingredient foreign key (ingredient_id) references ingredients (ingredient_id),
    constraint fk_measurement foreign key (measurement_id) references measurement_units (measurement_id)
);
