import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Assuming you have your CSS in this file

function App() {
  const [employee, setEmployee] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    department: "",
    dateOfJoining: "",
    role: "",
  });

  const [employees, setEmployees] = useState([]); // Store the list of employees
  const [isEditing, setIsEditing] = useState(false); // Track whether we're editing an employee
  const [editEmployeeId, setEditEmployeeId] = useState(null); // Track the ID of the employee being edited

  // Fetch existing employees when the component loads
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data); // Assuming your backend sends a list of employees
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // If editing, send an update request
        const response = await axios.put(
          `http://localhost:5000/api/employees/${editEmployeeId}`,
          employee
        );

        if (response.status === 200) {
          alert("Employee updated successfully!");
          fetchEmployees(); // Refresh the employee list
          resetForm(); // Reset the form
        }
      } else {
        // If not editing, add a new employee
        const response = await axios.post(
          "http://localhost:5000/api/employees",
          employee
        );

        if (response.status === 200) {
          alert("Employee added successfully!");
          fetchEmployees(); // Refresh the employee list
          resetForm(); // Reset the form
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  const resetForm = () => {
    setEmployee({
      name: "",
      employeeId: "",
      email: "",
      phone: "",
      department: "",
      dateOfJoining: "",
      role: "",
    });
    setIsEditing(false);
    setEditEmployeeId(null);
  };

  const handleEdit = (employee) => {
    setEmployee(employee);
    setIsEditing(true);
    setEditEmployeeId(employee.employeeId); // Use the unique ID of the employee
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Employee Management System</h1>
      </header>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="employee-form">
          <h2>{isEditing ? "Edit Employee Details" : "Add Employee Details"}</h2>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={employee.name}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              placeholder="Enter employee ID"
              value={employee.employeeId}
              onChange={(e) =>
                setEmployee({ ...employee, employeeId: e.target.value })
              }
              required
              disabled={isEditing} // Prevent changing the ID while editing
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={employee.email}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={employee.phone}
              onChange={(e) =>
                setEmployee({ ...employee, phone: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              placeholder="Enter department"
              value={employee.department}
              onChange={(e) =>
                setEmployee({ ...employee, department: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Joining</label>
            <input
              type="date"
              value={employee.dateOfJoining}
              onChange={(e) =>
                setEmployee({ ...employee, dateOfJoining: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input
              type="text"
              placeholder="Enter role"
              value={employee.role}
              onChange={(e) =>
                setEmployee({ ...employee, role: e.target.value })
              }
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="submit-button">
              {isEditing ? "Update Employee" : "Add Employee"}
            </button>
            <button type="button" className="reset-button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="employee-list">
        <h2>Employee List</h2>
        <ul>
          {employees.map((emp) => (
            <li key={emp.employeeId}>
              {emp.name} ({emp.role}){" "}
              <button onClick={() => handleEdit(emp)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
