import "reflect-metadata";
import { DataSource } from "typeorm";
import Profissional from "../entities/Profissional.js";
import Projeto from "../entities/Projeto.js";
import Equipe from "../entities/Equipe.js";
import Convite from "../entities/Convite.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "cinebridge",
  password: "cinebridge",
  database: "cinebridge",
  synchronize: true,
  logging: false,
  entities: [Profissional, Projeto, Equipe, Convite],
});
