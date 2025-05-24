import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: process.env.MYSQL_PORT,
  ssl: {
    rejectUnauthorized: false, // Enforce secure SSL connection
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
  .promise();

  async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      class INT NOT NULL,
      subject INT NOT NULL,
      month VARCHAR(20) NOT NULL,
      password VARCHAR(100) NOT NULL
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("✅ 'students' table ensured");
  } catch (err) {
    console.error("❌ Error ensuring 'students' table:", err);
  }
}
initializeDatabase();


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
