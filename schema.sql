create table if not exists recipes (
    id serial primary key,
    name text not null,
    description text not null
);

create table if not exists tags (
    id serial primary key,
    tag text not null
);

create table if not exists steps (
    id serial primary key,
    recipe_id integer references recipes not null,
    step_number text not null,
    step text not null
);

create table if not exists recipes_tags (
    recipe_id integer references recipes not null,
    tag_id integer references tags not null,
    primary key (recipe_id, tag_id)
);