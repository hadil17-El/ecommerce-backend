import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";

const sql = fs.readFileSync("./ecommerce_solo.sql", "utf8");

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
  multipleStatements: true
});

try {
  await connection.query(sql);
  console.log("Import completato con successo!");
} catch (e) {
  console.error("Errore import:", e);
} finally {
  await connection.end();
}