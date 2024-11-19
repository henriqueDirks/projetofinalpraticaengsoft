-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema projetofinalturmas
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema projetofinalturmas
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `projetofinalturmas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `projetofinalturmas` ;

-- -----------------------------------------------------
-- Table `projetofinalturmas`.`alunos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `projetofinalturmas`.`alunos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `CPF` CHAR(11) NOT NULL,
  `regularidade` ENUM('regular', 'irregular') NULL DEFAULT 'regular',
  `status` ENUM('ativo', 'inativo') NULL DEFAULT 'ativo',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `CPF` (`CPF` ASC) VISIBLE)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `projetofinalturmas`.`disciplinas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `projetofinalturmas`.`disciplinas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `codigo` VARCHAR(10) NOT NULL,
  `periodo` INT NOT NULL,
  `status` ENUM('ativo', 'inativo') NULL DEFAULT 'ativo',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `codigo` (`codigo` ASC) VISIBLE)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `projetofinalturmas`.`professores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `projetofinalturmas`.`professores` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `CPF` CHAR(11) NOT NULL,
  `titulacao` VARCHAR(50) NULL DEFAULT NULL,
  `status` ENUM('ativo', 'inativo') NULL DEFAULT 'ativo',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `CPF` (`CPF` ASC) VISIBLE)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `projetofinalturmas`.`salas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `projetofinalturmas`.`salas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  `local` VARCHAR(100) NULL DEFAULT NULL,
  `capacidade` INT NOT NULL,
  `status` ENUM('ativo', 'inativo') NULL DEFAULT 'ativo',
  PRIMARY KEY (`id`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `projetofinalturmas`.`turmas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `projetofinalturmas`.`turmas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `dia_semana` ENUM('Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado') NOT NULL,
  `horario_inicio` TIME NOT NULL,
  `horario_termino` TIME NOT NULL,
  `status` ENUM('ativo', 'inativo') NULL DEFAULT 'ativo',
  `professores_id` INT NOT NULL,
  `salas_id` INT NOT NULL,
  `disciplinas_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_turmas_professores1_idx` (`professores_id` ASC) VISIBLE,
  INDEX `fk_turmas_salas1_idx` (`salas_id` ASC) VISIBLE,
  INDEX `fk_turmas_disciplinas1_idx` (`disciplinas_id` ASC) VISIBLE)
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `projetofinalturmas`.`turmaaluno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `projetofinalturmas`.`turmaaluno` (
  `alunos_id` INT NOT NULL,
  `turmas_id` INT NOT NULL,
  INDEX `fk_TURMAALUNO_alunos_idx` (`alunos_id` ASC) VISIBLE,
  INDEX `fk_TURMAALUNO_turmas1_idx` (`turmas_id` ASC) VISIBLE,
  CONSTRAINT `fk_TURMAALUNO_alunos`
    FOREIGN KEY (`alunos_id`)
    REFERENCES `projetofinalturmas`.`alunos` (`id`),
  CONSTRAINT `fk_TURMAALUNO_turmas1`
    FOREIGN KEY (`turmas_id`)
    REFERENCES `projetofinalturmas`.`turmas` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
