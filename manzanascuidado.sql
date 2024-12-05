
-- SQLBook: Code
-- Active: 1729920329732@@127.0.0.1@3306
CREATE DATABASE manzanascuidado 
    DEFAULT CHARACTER SET = 'utf8mb4';
    -- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-11-2024 a las 21:24:02
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

USE manzanascuidado;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;



CREATE TABLE manzana (
  Id_manzana int(10) PRIMARY KEY AUTO_INCREMENT,
  Nombre varchar(25) DEFAULT NULL,
  Direccion varchar(255) DEFAULT NULL,
  localidad varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO manzana (Id_manzana, Nombre, Direccion, localidad) VALUES
(1, 'BOSA', 'direccion 1', 'localidad 8'),
(2, 'USME', 'direccion 2', 'localidad 5'),
(3, 'ANTONIO NARIÑO', 'direccion 3', 'localidad 16'),
(4, 'PUENTE ARANDA', 'direccion 4', 'localidad 17'),
(5, 'BARRIOS UNIDOS', 'direccion 5', 'localidad 12')


CREATE TABLE servicio (
  Id_servicio int(10) PRIMARY KEY AUTO_INCREMENT,
  Nombre varchar(25) DEFAULT NULL,
  Descripcion varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO servicio (Id_servicio, Nombre, Descripcion) VALUES
(1, 'Cocinar', 'Cocinar'),
(2, 'Aseo', 'Limpiar'),
(3, 'Costura', 'cocer'),
(4, 'Educacion', 'Educar'),
(5, 'GYM', 'Gimnasio')


CREATE TABLE manzana_servicio (
  MANZANAId_manzana int(10),
  ServicioId_servicio int(10),
  FOREIGN KEY (MANZANAId_manzana) REFERENCES manzana (Id_manzana),
  FOREIGN KEY (ServicioId_servicio) REFERENCES servicio (Id_servicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO manzana_servicio (MANZANAId_manzana, ServicioId_servicio) VALUES
(1, 2),
(1, 4),
(2, 2),
(2, 3),
(3, 2),
(3, 4),
(4, 1),
(4, 2),
(4, 3),
(4, 4),
(5, 1),
(5, 3),
(5, 4)



CREATE TABLE usuario (
  Id_usuario int(10) PRIMARY KEY AUTO_INCREMENT,
  Nombre varchar(25) DEFAULT NULL,
  Apellido varchar(25) DEFAULT NULL,
  NumeroDocumento int(10) DEFAULT NULL,
  Telefono bigint(19) DEFAULT NULL,
  TipoDocumento varchar(25) DEFAULT NULL,
  Correo varchar(25) DEFAULT NULL,
  MANZANAId_manzana int(10) DEFAULT NULL,
  manzana varchar(25) DEFAULT NULL,
  FOREIGN KEY (MANZANAId_manzana) REFERENCES manzana (Id_manzana)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO usuario (Id_usuario, Nombre, Apellido, NumeroDocumento, Telefono, TipoDocumento, Correo, MANZANAId_manzana, manzana) VALUES
(1, 'juan david', 'gil', 1141314946, 3222584820, 'Cedula de ciudadania', 'holaquehace@gmail.com', 1, NULL),
(2, 'cristian', 'trujillo', 1030554324, 3057505192, 'Cedula de ciudadania', 'cristian123@gmail.com', 4, NULL);


CREATE TABLE solicitud (
  Id_solicitud int(10) PRIMARY KEY AUTO_INCREMENT,
  FechaHora date DEFAULT NULL,
  Estado varchar(25) DEFAULT NULL,
  USUARIOId_usuario int(10) NOT NULL,
  ServicioId_servicio int(10) NOT NULL,
  Nombre varchar(20) DEFAULT NULL,
  FOREIGN KEY (USUARIOId_usuario) REFERENCES usuario (Id_usuario),
  FOREIGN KEY (ServicioId_servicio) REFERENCES servicio (Id_servicio)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



INSERT INTO solicitud (Id_solicitud, FechaHora, Estado, USUARIOId_usuario, ServicioId_servicio, Nombre) VALUES
(1, '2024-10-10', 'Activo', 1, 1, 'Masaje');





COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

SELECT * FROM manzana


SELECT * FROM servicio

SELECT * FROM usuario

/* DROP DATABASE manzanascuidado */