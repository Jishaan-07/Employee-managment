import { Dropdown, Form, InputGroup, Button, Modal } from 'react-bootstrap';
import './App.css';
import bg from './assets/bg.png';
import { useState, useEffect } from 'react';

function App() {
  const [show, setShow] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  
  // Form input state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    status: 'Active'
  });

  // Fetch employees from the server
  useEffect(() => {
    fetch('https://employee-server-wbrf.onrender.com/contacts')
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission (Add employee)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentEmployee) {
      // Update employee
      fetch(`https://employee-server-wbrf.onrender.com/contacts/${currentEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then(() => {
          setEmployees((prev) =>
            prev.map((emp) =>
              emp.id === currentEmployee.id ? { ...emp, ...formData } : emp
            )
          );
          handleClose();
        })
        .catch((error) => console.error('Error updating employee:', error));
    } else {
      // Add new employee
      fetch('https://employee-server-wbrf.onrender.com/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((newEmployee) => {
          setEmployees((prev) => [...prev, newEmployee]);
        })
        .catch((error) => console.error('Error adding employee:', error));
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    fetch(`https://employee-server-wbrf.onrender.com/contacts/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      })
      .catch((error) => console.error('Error deleting employee:', error));
  };

  // Handle modal show
  const handleShow = (employee = null) => {
    setCurrentEmployee(employee);
    setFormData({
      id: employee ? employee.id : '',
      name: employee ? employee.name : '',
      email: employee ? employee.email : '',
      status: employee ? employee.status : 'Active',
    });
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setCurrentEmployee(null);
  };

  // Clear form fields
  const handleClear = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      status: 'Active',
    });
    setCurrentEmployee(null); // If you want to clear the edit state as well
  };

  return (
    <>
      <div
        className="text-light"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '50px',
        }}
      >
<div className="form-container">
  <h1 className="text-center mb-4">Employee Management</h1>
  <Form onSubmit={handleSubmit} className="employee-form">
    <InputGroup className="mb-4">
      <Form.Control
        placeholder="Employee ID"
        aria-label="Employee ID"
        name="id"
        value={formData.id}
        onChange={handleInputChange}
        disabled={currentEmployee}
        className="form-input"
      />
    </InputGroup>
    <InputGroup className="mb-4">
      <Form.Control
        placeholder="Employee Name"
        aria-label="Employee Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="form-input"
      />
    </InputGroup>
    <InputGroup className="mb-4">
      <Form.Control
        placeholder="Employee Email"
        aria-label="Employee Email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="form-input"
      />
    </InputGroup>
    <div className="mb-4">
      <select
        id="statusSelect"
        className="form-select"
        name="status"
        value={formData.status}
        onChange={handleInputChange}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
    <div className="d-flex justify-content-between mt-4">
      <Button type="submit" className="btn btn-primary w-48">
        {currentEmployee ? 'Save Changes' : 'Submit'}
      </Button>
      <Button
        type="reset"
        className="btn btn-danger w-48"
        onClick={handleClear}
      >
        Clear
      </Button>
    </div>
  </Form>
</div>

        <div className="mt-5 d-flex justify-content-center">
          <table style={{ width: '800px' }} className="table table-bordered table-striped table-hover text-center">
            <thead className="thead-dark">
              <tr>
                <th>EMP_ID</th>
                <th>EMP_NAME</th>
                <th>EMP_EMAIL</th>
                <th>EMP_STATUS</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.status}</td>
                  <td>
                    <Button variant="success" onClick={() => handleShow(employee)}>
                      Edit
                    </Button>
                    <Button className="mx-2" variant="danger" onClick={() => handleDelete(employee.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentEmployee ? 'Edit Employee Details' : 'Add New Employee'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Id"
              aria-label="Employee ID"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              disabled={currentEmployee}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Name"
              aria-label="Employee Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Email"
              aria-label="Employee Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </InputGroup>
          <select
            id="inputState"
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {currentEmployee ? 'Save Changes' : 'Add Employee'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
