import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
  })
  .promise();

export async function deleteStudent(id) {
  const sql = "DELETE FROM students WHERE id = ?";
  const [result] = await pool.query(sql, [id]);
  return result;
}

export async function postStudent(data) {
  const sql =
    "INSERT INTO students (name,class,subject,month,password) VALUES (?,?,?,?,?)";

  const values = [
    data.name,
    data.stuClass,
    data.subjects,
    data.month,
    data.password,
  ];
  console.log("SQL values:", values);
  const [result] = await pool.query(sql, values);
  console.log("Insert result:", result);
  return result;
}
export async function getStudents() {
  const [rows] = await pool.query("SELECT * FROM students");
  return rows;
}

export async function getStudent(id) {
  const [rows] = await pool.query("SELECT * FROM students WHERE id =?", [id]);
  return rows;
}

// Export the pool for potential use in other modules
export default pool;
