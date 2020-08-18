drop database if exists recipes_db;
create database recipes_db;
use recipes_db;

create table recipes
(
    id         int auto_increment
        primary key,
    name       varchar(50)    null,
    method     varchar(10000) null,
    time       varchar(10)    null,
    person_num int            null,
    type       varchar(30)    null,
    image      longblob       null,
    utensils   varchar(250)   null,
    user_id    int            null,
    constraint recipes_name_uindex
        unique (name),
    constraint fk_userId
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
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
    id       int auto_increment
        primary key,
    username varchar(250) null,
    email    varchar(250) null,
    password varchar(250) null
);

create unique index users_email_uindex
    on users (email);
