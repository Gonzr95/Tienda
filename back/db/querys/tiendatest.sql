create database tiendatest;
use tiendatest;

show tables;
select * from tickets;
truncate tickets;
drop table tickets;
truncate product_ticket;
drop table product_ticket;
select * from brands;
select * from products;
select * from users;
select * from product_ticket;
delete from products where id = 19;
insert into brands (name)
values("Higienol");

update products
set brandId = 36
where id > 13 and id < 19;

update products
set brandId = 36
where id = 13;

