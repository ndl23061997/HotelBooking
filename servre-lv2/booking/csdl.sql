drop database if exists hotel;

 create database hotel CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';
-- create database hotel ;
use hotel;

create table Account (
	id int not null AUTO_INCREMENT, 
    type int not null,  -- 0 : admin , 1: nhan vien , 2 : nguoi dung
    username varchar(100) not null, 
    password varchar(100) not null,
    phone_number varchar(25) not null,
    image text  ,
    primary key(id)
);

create table Hotel (
	id int  not null AUTO_INCREMENT,
    maso varchar(20) not null,
    name text not null,
    location text,
    image text,
    des text,
    primary key(id)
);

create table Customer(
	id int not null AUTO_INCREMENT, 
    name text not null,
    account_id int,
    birthday date,
    address text, 
    phone_number varchar(25) not null,
    image text ,
    primary key(id)
);

create table Room (
	id int not null AUTO_INCREMENT, 
    maso varchar(20) not null,
    hotel_id int not null,
    price bigint not null, 
    des text,
    type_id int,
    image text,
    primary key(id)
);


create table RoomType (
	id int not null AUTO_INCREMENT, 
    name text not null,
    des text,
    primary key(id)
);



create table Service (
	id int primary key not null AUTO_INCREMENT,
    maso varchar(20) not null,
    name text not null,
    price bigint not null,
    type_id int not null,
    image text ,
    des text,
    status int default 1
);

create table ServiceType (
	id int not null AUTO_INCREMENT, 
    name text not null,
    des text ,
    primary key(id)
);

create table Discount(
	id int not null AUTO_INCREMENT, 
    maso varchar(20) not null,
    name text,
    des text,
    start_date date not null,
    finish_date date not null,
    type int not null,
    type_id int not null default -1,
    hotel_id int not null,     
    value float not null,
    primary key(id)
);


create table Bill(
	id int not null AUTO_INCREMENT, 
    maso varchar(20) not null,
    booking_id int not null,
    type int not null,
    discount float default 0,
    money bigint not null default 0,
    primary key(id)
) ;

create table BServiceInfo (
	id int not null AUTO_INCREMENT, 
    service_id int not null,
    bill_id int not null,
    count int not null default 1,
    discount float default 0,
    created datetime not null default now(),
    primary key(id)
);


create table Booking (
	id int not null AUTO_INCREMENT, 
    maso varchar(20) not null,
    room_id int not null,
    customer_id int not null,
    check_in datetime not null,
    check_out datetime not null,
    money bigint not null default 0,
    created datetime default now(),
    primary key(id)
);


-- Relation

alter table Room 
	add constraint room_vs_hotel foreign key (hotel_id) references Hotel(id),
    add constraint room_vs_roomtype foreign key (type_id) references RoomType(id);
    
alter table Booking
	add constraint booking_vs_room foreign key (room_id) references Room(id),
    add constraint booking_vs_customer foreign key (customer_id) references Customer(id);

alter table Discount 
	add constraint discount_of_hotel foreign key (hotel_id) references Hotel(id);
     
alter table Service 
	add constraint service_of_type foreign key (type_id) references ServiceType(id);

alter table BServiceInfo
	add constraint service_of_bill foreign key (bill_id) references Bill(id),
    add constraint service_id foreign key (service_id) references Service(id);
    
alter table Bill
	add constraint bill_off_booking foreign key (booking_id) references Booking(id);
                  
alter table Customer 
	add constraint customer_of_account foreign key (account_id) references Account(id); 
 
-- Procedure-- 
DELIMITER $$
CREATE PROCEDURE `get_account` (
	IN _username nvarchar(100), 
    IN _password nvarchar(100)
) 
BEGIN	
	select * from Account where (username = _username) and (password = _password);
END 
$$

--

DELIMITER $$
CREATE PROCEDURE `get_all_account` () 
BEGIN	
	select * from Account ;
END 
$$

-- 
DELIMITER $$
CREATE PROCEDURE `get_account_by_username` (
	IN _username nvarchar(100)
) 
BEGIN	
	select * from Account where username = _username ;
END 
$$
----------------------------------------------------------------
--------------------------- Phong ------------------------------
-- Lay danh sach phong

DELIMITER $$
CREATE PROCEDURE `get_all_room` ()
BEGIN 
	SELECT Room.id, Room.maso, price, Hotel.name as hotel, RoomType.name as room_type
	FROM Room inner join Hotel on hotel_id = Hotel.id  inner join RoomType on type_id = RoomType.id;
END
$$


-- Xoa phong
DELIMITER $$
CREATE PROCEDURE `delete_room` (
	IN _id int
)
BEGIN 
	delete from Room where Room.id = _id;
END 

$$

-- Lay phong theo id
DELIMITER $$
CREATE PROCEDURE `get_room` ( IN _id int )
BEGIN 
	select * from `hotel`.`Room` where id = _id;
END 
$$

-- Them phong
DELIMITER $$
CREATE PROCEDURE `add_room` (
	IN _hotel_id int,
    IN _price bigint,
    IN _type_id int,
    IN _des text,
    IN _image text,
    in _maso text
)
BEGIN 
	INSERT INTO `hotel`.`Room` (`hotel_id`,`price`,`type_id`,`des`, `image`, `maso`)
	VALUES (_hotel_id,_price,_type_id,_des,	_image, _maso);

END 

$$

-- Sua phong
DELIMITER $$
CREATE PROCEDURE `update_room` (
	IN _id int,
	IN _hotel_id int,
    IN _price bigint,
    IN _type_id int,
    IN _des text,
    IN _image text,
    in _maso text
)
BEGIN 

UPDATE `hotel`.`Room`
SET
`hotel_id` = _hotel_id,
`price` = _price,
`type_id` = _type_id,
`des` = _des ,
`image` = _image,
`maso` = _maso
WHERE `id` = _id;
END 
$$

-- ----------Procedure cho bang Hotel----------

DELIMITER $$
create procedure `add_hotel` (
	in _name text,
    in _location text,
    in _image text,
    in _des text,
    in _maso text
)
Begin 
INSERT INTO `hotel`.`Hotel`
(
`name`,
`location`,
`image`,
`des`,
`maso`)
VALUES
(
_name,
_location,
_image,
_des,
_maso );
end 
$$

DELIMITER $$
CREATE PROCEDURE `delete_hotel` (
	IN _id int
)
BEGIN 
	delete from Hotel where id = _id;
END 

$$




DELIMITER $$
CREATE PROCEDURE `update_hotel` (
	IN _id int,
    IN _name text,
    in _location text,
    in _image text,
    IN _des text,
    in _maso text
)
BEGIN 

UPDATE `hotel`.`Hotel`
SET
`name` = _name,
`location` = _location,
`image` = _image,
`des` = _des,
`maso` = _maso
WHERE `id` = _id;
END 
$$


DELIMITER $$
CREATE PROCEDURE `get_hotel` (
	IN _id int
)
BEGIN 
	select * from `hotel`.`Hotel` where id = _id;
END 
$$

DELIMITER $$
CREATE PROCEDURE `get_all_hotel` (
)
BEGIN 
	select * from `hotel`.`Hotel`;
END 
$$

-- --------------------- RoomType -----------------------
DELIMITER $$
CREATE PROCEDURE `get_all_roomtype` (
)
BEGIN 
	select * from `hotel`.`RoomType`;
END
$$

DELIMITER $$
CREATE PROCEDURE `get_roomtype` (
	IN _id int
)
BEGIN 
	select * from `hotel`.`RoomType` where id = _id;
END 
$$


DELIMITER $$
create procedure `add_roomtype` (
	in _name text,
    in _des text
)
Begin 
INSERT INTO `hotel`.`RoomType`
(
`name`,
`des`)
VALUES
(
_name,
_des );
end
$$

DELIMITER $$
CREATE PROCEDURE `delete_roomtype` (
	IN _id int
)
BEGIN 
	delete from RoomType where id = _id;
END 
$$

DELIMITER $$
CREATE PROCEDURE `update_roomtype` (
	IN _id int,
    IN _name text,
    IN _des text
)
BEGIN 

UPDATE `hotel`.`RoomType`
SET
`name` = _name,
`des` = _des
WHERE `id` = _id;
END 
$$


-- -----------------------------------------
-- ************ DICH VU ********************

DELIMITER $$
CREATE PROCEDURE `get_all_service` ()
BEGIN 

	select Service.*, ServiceType.name as type_name
    from Service inner join ServiceType on Service.type_id = ServiceType.id;
END
$$

DELIMITER $$
CREATE PROCEDURE `get_service_by_id` ( IN _id int)
BEGIN 

	select *
    from Service 
    where id = _id;
END
$$

DELIMITER $$
CREATE PROCEDURE `edit_service` ( 
	IN _id int,
    IN _maso varchar(20),
    IN _name text,
    in _price text,
    in _type_id int,
    in _image text,
    in _des text,
    in _status text
)
BEGIN 
	UPDATE `hotel`.`Service`
	SET
	`id` = _id,
	`maso` = _maso,
	`name` = _name,
	`price` = _price,
	`type_id` = _type_id,
	`image` = _image,
	`des` = _des,
	`status` = _status
	WHERE `id` = _id;
END $$

DELIMITER $$
CREATE PROCEDURE `add_service` ( 
    IN _maso varchar(20),
    IN _name text,
    in _price text,
    in _type_id int,
    in _image text,
    in _des text,
    in _status text
)
BEGIN 
	INSERT INTO `hotel`.`Service`
(
`maso`,
`name`,
`price`,
`type_id`,
`image`,
`des`,
`status`)
VALUES
(
_maso,
_name,
_price,
_type_id,
_image,
_des,
_status);

END $$
