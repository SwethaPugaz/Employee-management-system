const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors()); 
app.use(express.json()); 


const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "Ba@01092004", 
  database: "employeeDB", 
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected successfully");
});


app.post("/api/employees", (req, res) => {
  const { name, employeeId, email, phone, department, dateOfJoining, role } = req.body;

  const query =
    "INSERT INTO employees (name, employeeId, email, phone, department, dateOfJoining, role) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [name, employeeId, email, phone, department, dateOfJoining, role];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Employee added successfully" });
  });
});


app.get("/api/employees", (req, res) => {
  const query = "SELECT * FROM employees";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(results); 
  });
});


app.get("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM employees WHERE employeeId = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(result[0]);
  });
});


app.put("/api/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone, department, dateOfJoining, role } = req.body;

  const query =
    "UPDATE employees SET name = ?, email = ?, phone = ?, department = ?, dateOfJoining = ?, role = ? WHERE employeeId = ?";
  const values = [name, email, phone, department, dateOfJoining, role, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee updated successfully" });
  });
});


app.delete("/api/employees/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM employees WHERE employeeId = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  });
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

