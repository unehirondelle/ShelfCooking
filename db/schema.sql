drop database if exists recipes_db;
create database recipes_db;
use recipes_db;

create table recipes
(
    id         int auto_increment primary key,
    name       varchar(50),
    method     varchar(10000),
    time       varchar(10),
    person_num int,
    type       varchar(30),
    image      longblob,
    utensils   varchar(10000),
    unique (name)
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

create table users
(
    id       int,
    username varchar(250),
    email    varchar(250),
    password varchar(250),
    unique (email)
);
