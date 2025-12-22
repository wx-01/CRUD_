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
    ssl: {
      rejectUnauthorized: false, // Required for Aiven MySQL
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();

async function initializeDatabase() {
  try {
    // Ensuring the students table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        grade INT NOT NULL,
        subject_count INT NOT NULL,
        password VARCHAR(100) NOT NULL
      )
    `);

    // Ensuring the subjects table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        subject_name VARCHAR(50) NOT NULL,
        monthly_fee INT NOT NULL
      )
    `);

    // Ensuring the monthly_fees table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS monthly_fees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        month VARCHAR(20) NOT NULL,
        total_amount INT NOT NULL,
        status ENUM('PAID','UNPAID') DEFAULT 'UNPAID',
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);

    // Seed subjects (INSERT IGNORE prevents 500 error if data already exists)
    await pool.query(`
      INSERT IGNORE INTO subjects (id, subject_name, monthly_fee) VALUES
      (1, 'Mathematics', 3000),
      (2, 'Physics', 3500),
      (3, 'Chemistry', 3500),
      (4, 'Biology', 3200),
      (5, 'English', 2500)
    `);

    console.log("✅ Database tables and seed data ensured");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }
}
initializeDatabase();

/* ---------- STUDENT QUERIES ---------- */

export async function getStudents() {
  const [rows] = await pool.query("SELECT * FROM students");
  return rows;
}

export async function addStudent(data) {
  const sql =
    "INSERT INTO students (name, grade, subject_count, password) VALUES (?, ?, ?, ?)";
  const values = [data.name, data.class, data.subjects, data.password];

  const [result] = await pool.query(sql, values);
  const studentId = result.insertId;

  // Calculate Fee (Average of subjects * count)
  const [feeRows] = await pool.query(
    "SELECT (SELECT AVG(monthly_fee) FROM subjects) * ? AS total",
    [Number(data.subjects)]
  );
  const totalAmount = feeRows[0].total || 0;

  // Insert initial fee record
  await pool.query(
    "INSERT INTO monthly_fees (student_id, month, total_amount) VALUES (?, ?, ?)",
    [studentId, "Current", totalAmount]
  );

  return result;
}

export async function updateStudent(id, data) {
  const sql = "UPDATE students SET name=?, grade=?, subject_count=? WHERE id=?";
  const values = [data.name, data.class, data.subjects, id];
  const [result] = await pool.query(sql, values);
  return result;
}

export async function deleteStudent(id) {
  const sql = "DELETE FROM students WHERE id = ?";
  const [result] = await pool.query(sql, [id]);
  return result;
}

/* ---------- FEE QUERIES ---------- */

export async function getStudentFees(studentId) {
  const sql = "SELECT * FROM monthly_fees WHERE student_id = ?";
  const [rows] = await pool.query(sql, [studentId]);
  return rows;
}

export async function updateFeeStatus(id, status) {
  const sql = "UPDATE monthly_fees SET status = ? WHERE id = ?";
  const [result] = await pool.query(sql, [status, id]);
  return result;
}

export default pool;
