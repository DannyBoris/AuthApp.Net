USE [MachonNoamDB]
GO

/****** Object: Table [dbo].[Users] Script Date: 20/03/2021 13:23:09 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Users] (
    [Id]       INT           IDENTITY (1, 1) NOT NULL,
    [Email]    VARCHAR (255) NOT NULL,
    [Password] VARCHAR (255) NOT NULL
);


