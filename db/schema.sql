drop database if exists recipes_db;
create database recipes_db;
use recipes_db;

create table recipes
(
    id         int auto_increment primary key,
    name       varchar(50)    not null,
    method     varchar(10000) not null,
    time       varchar(10),
    person_num int
);

create table measurement_units
(
    id   int auto_increment primary key,
    name varchar(10)
);

create table ingredients
(
    id   int auto_increment primary key,
    name varchar(30)
);

create table utensils
(
    id   int auto_increment primary key,
    name varchar(30)
);

create table recipe_ingredients
(
    recipe_id       int,
    ingredient_id   int,
    measurement_qty float,
    measurement_id  int,
    constraint fk_recipe foreign key (recipe_id) references recipes (id),
    constraint fk_ingredient foreign key (ingredient_id) references ingredients (id),
    constraint fk_measurement foreign key (measurement_id) references measurement_units (id)
);
