GO
/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<< BEGIN: CREATE DATABASE <<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
	IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'Umade')
		CREATE DATABASE [Umade];
/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<< END: CREATE DATABASE <<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
GO
USE [Umade];
GO
/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<< BEGIN: RESET DATABASE <<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
	DECLARE @Sql NVARCHAR(500) DECLARE @Cursor CURSOR

	SET @Cursor = CURSOR FAST_FORWARD FOR
	SELECT DISTINCT sql = 'ALTER TABLE [' + tc2.TABLE_SCHEMA + '].[' +  tc2.TABLE_NAME + '] DROP [' + rc1.CONSTRAINT_NAME + '];'
	FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc1
	LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc2 ON tc2.CONSTRAINT_NAME =rc1.CONSTRAINT_NAME

	OPEN @Cursor FETCH NEXT FROM @Cursor INTO @Sql

	WHILE (@@FETCH_STATUS = 0)
	BEGIN
	Exec sp_executesql @Sql
	FETCH NEXT FROM @Cursor INTO @Sql
	END

	CLOSE @Cursor DEALLOCATE @Cursor
	GO
	/* */
	DECLARE @tableName NVARCHAR(MAX)
	DECLARE tableCursor CURSOR FOR
	SELECT name
	FROM sys.tables

	OPEN tableCursor
	FETCH NEXT FROM tableCursor INTO @tableName

	WHILE @@FETCH_STATUS = 0
	BEGIN
		DECLARE @sql NVARCHAR(MAX)
		SET @sql = N'DROP TABLE ' + QUOTENAME(@tableName)
		EXEC sp_executesql @sql
		FETCH NEXT FROM tableCursor INTO @tableName
	END

	CLOSE tableCursor
	DEALLOCATE tableCursor
/*
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>> END: RESET DATABASE >>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/
GO
/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<< BEGIN: TẠO BẢNG <<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
	CREATE TABLE users (
		[id]          INT NOT NULL IDENTITY(1,1),
		[name]        NVARCHAR(MAX) NOT NULL,
		[email]       VARCHAR(MAX) NOT NULL,
		[phone]       VARCHAR(10),
		[password]    NVARCHAR(MAX) NOT NULL,
		[role]        NVARCHAR(MAX) NOT NULL,
		[gender]      NVARCHAR(10) NOT NULL,
		[address]     NVARCHAR(MAX),
		[defectType]  NVARCHAR(MAX) NOT NULL,
		[status]      INT DEFAULT(0),
		[createdDate] DATETIME DEFAULT(GETDATE()),
		[updatedDate] DATETIME DEFAULT(GETDATE())
		
		CONSTRAINT PK_Users PRIMARY KEY ([id])
	);

	CREATE TABLE socialPlatform (
		[id] INT NOT NULL,
		[name] NVARCHAR(MAX) NOT NULL,
	);

	CREATE TABLE socialAccounts (
		[userId]     INT NOT NULL,
		[platformId] INT NOT NULL,
		[link]       VARCHAR(MAX) NOT NULL,
		[username]   VARCHAR(MAX) NOT NULL,

		CONSTRAINT PK_SocialAccounts PRIMARY KEY ([userId], [platformId]),
		FOREIGN KEY ([userId]) REFERENCES users([id])
	);

	CREATE TABLE tags (
		[id]  INT NOT NULL,
		[tag] NVARCHAR(20) NOT NULL,

		CONSTRAINT PK_Tags PRIMARY KEY ([id])
	);

	CREATE TABLE products (
		[id]          INT NOT NULL IDENTITY(1, 1),
		[name]        NVARCHAR(MAX) NOT NULL,
		[description] NTEXT,
		[tags]        NVARCHAR(MAX),
		[image]       NVARCHAR(MAX),
		[price]       INT NOT NULL,
		[amount]      INT NOT NULL,
		[sellBy]      INT NOT NULL,
		[createdDate] DATETIME DEFAULT(GETDATE()),
		[updatedDate] DATETIME DEFAULT(GETDATE()),
		[isDeleted]   BIT DEFAULT(0),

		CONSTRAINT PK_Products PRIMARY KEY ([id]),
		FOREIGN KEY ([sellBy]) REFERENCES users([id])
	);

	CREATE TABLE additionImages (
		[id]           INT NOT NULL IDENTITY(1, 1),
		[productId]    INT NOT NULL,
		[imageUrl]     VARCHAR(MAX) NOT NULL,
		[uploadedDate] DATETIME DEFAULT(GETDATE()),

		CONSTRAINT PK_AdditionImages PRIMARY KEY ([id]),
		FOREIGN KEY ([productId]) REFERENCES products([id])
	);

	CREATE TABLE vouchers (
		[id]          INT NOT NULL IDENTITY(1, 1),
		[name]        NVARCHAR(MAX) NOT NULL,
		[sales]       INT NOT NULL,
		[createdDate] DATETIME DEFAULT(GETDATE()),
		[deletedDate] DATETIME DEFAULT(NULL),

		CONSTRAINT PK_Vouchers PRIMARY KEY ([id])
	);

	CREATE TABLE payments (
		[id] INT NOT NULL IDENTITY(1, 1),
		[paymentMethod] NVARCHAR(MAX) NOT NULL,
		[amount] INT NOT NULL,
		[isPaid] BIT DEFAULT(0),
		[createdDate] DATETIME DEFAULT(GETDATE()),
		[updatedDate] DATETIME DEFAULT(GETDATE()),

		CONSTRAINT PK_Payments PRIMARY KEY ([id])
	);

	CREATE TABLE carts (
		[id] INT NOT NULL IDENTITY(1, 1),
		[orderedBy] INT NOT NULL,
		[paymentId] INT NOT NULL,
		[deliveryAddress] NVARCHAR(MAX) NOT NULL,
		[review] NTEXT,
		[point] INT,
		[voucherId] INT,
		[createdDate] DATETIME DEFAULT(GETDATE()),
		[updatedDate] DATETIME DEFAULT(GETDATE()),

		CONSTRAINT PK_Carts PRIMARY KEY([id]),
		FOREIGN KEY ([orderedBy]) REFERENCES users([id]),
		FOREIGN KEY ([paymentId]) REFERENCES payments([id]),
		FOREIGN KEY ([voucherId]) REFERENCES vouchers([id]),
	);

	CREATE TABLE cartItems (
		[cartId] INT NOT NULL,
		[productId] INT NOT NULL,
		[quantity] INT NOT NULL,
		[cost] INT NOT NULL,

		CONSTRAINT PK_CartItems PRIMARY KEY([cartId], [productId]),
		FOREIGN KEY ([cartId]) REFERENCES carts([id]),
		FOREIGN KEY ([productId]) REFERENCES products([id]),
	)
/*
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>> END: TẠO BẢNG >>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/
GO
/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<< BEGIN: TẠO TRIGGER <<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
	IF OBJECT_ID('TR_UpdateUser', 'TR') IS NOT NULL /* for users */
		DROP TRIGGER TR_UpdateUser
	GO
	CREATE TRIGGER TR_UpdateUser
	ON users
	AFTER UPDATE
	AS
	BEGIN
		UPDATE users
		SET [updatedDate] = GETDATE()
		FROM users
		INNER JOIN inserted ON users.[id] = inserted.[id];
	END;
	GO
	IF OBJECT_ID('TR_UpdateProducts', 'TR') IS NOT NULL /* for products */
		DROP TRIGGER TR_UpdateProducts
	GO
	CREATE TRIGGER TR_UpdateProducts
	ON products
	AFTER UPDATE
	AS
	BEGIN
		UPDATE products
		SET [updatedDate] = GETDATE()
		FROM products
		INNER JOIN inserted ON products.[id] = inserted.[id];
	END;
	GO
	IF OBJECT_ID('TR_ChangeImage', 'TR') IS NOT NULL /* for products */
		DROP TRIGGER TR_ChangeImage
	GO
	CREATE TRIGGER TR_ChangeImage
	ON additionImages
	AFTER INSERT, UPDATE, DELETE
	AS
	BEGIN
		UPDATE products
		SET [updatedDate] = GETDATE()
		FROM products
		INNER JOIN inserted ON products.[id] = inserted.[id];

		UPDATE products
		SET [updatedDate] = GETDATE()
		FROM products
		INNER JOIN deleted ON products.[id] = deleted.[id];
	END;
	GO
	IF OBJECT_ID('TR_DeleteVouchers', 'TR') IS NOT NULL /* for vouchers */
		DROP TRIGGER TR_DeleteVouchers
	GO
	CREATE TRIGGER TR_DeleteVouchers
	ON vouchers
	INSTEAD OF DELETE
	AS
	BEGIN
		UPDATE vouchers
		SET [deletedDate] = GETDATE()
		FROM vouchers
		INNER JOIN deleted ON vouchers.[id] = deleted.[id];
	END;
	GO
	IF OBJECT_ID('TR_UpdatePayments', 'TR') IS NOT NULL /* for payments */
		DROP TRIGGER TR_UpdatePayments
	GO
	CREATE TRIGGER TR_UpdatePayments
	ON payments
	AFTER UPDATE
	AS
	BEGIN
		UPDATE payments
		SET [updatedDate] = GETDATE()
		FROM payments
		INNER JOIN inserted ON payments.[id] = inserted.[id];
	END;
/*
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>> END: TẠO TRIGGER >>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/
GO
/*
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
<<<<<<<<<< BEGIN: DỮ LIỆU MẪU <<<<<<<<<<
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/
/*
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
>>>>>>>>>> END: DỮ LIỆU MẪU >>>>>>>>>>
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/