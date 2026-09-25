import React, { useState, useEffect } from 'react';
import { getData, saveData, generateId } from '../utils/localStorage';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '', studentId: '', email: '', phone: '', department: '', year: '', password: ''
  });

  useEffect(() => {
    setStudents(getData('students'));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updatedStudents = students.filter(s => s.id !== id);
      setStudents(updatedStudents);
      saveData('students', updatedStudents);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isDuplicate = students.some(s => s.studentId === formData.studentId && s.id !== editingStudent?.id);
    if (isDuplicate) {
      alert('A student with this Student ID already exists.');
      return;
    }

    if (editingStudent) {
      const updatedStudents = students.map(s => s.id === editingStudent.id ? { ...s, ...formData } : s);
      setStudents(updatedStudents);
      saveData('students', updatedStudents);
    } else {
      const newStudent = {
        id: generateId(),
        ...formData,
        issuedBooksCount: 0,
        pendingFine: 0
      };
      const updatedStudents = [newStudent, ...students];
      setStudents(updatedStudents);
      saveData('students', updatedStudents);
    }
    
    closeModal();
  };

  const openModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData(student);
    } else {
      setEditingStudent(null);
      setFormData({ name: '', studentId: '', email: '', phone: '', department: '', year: '', password: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.studentId.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Student Management</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="card mb-4">
        <div className="flex items-center gap-2" style={{position: 'relative'}}>
          <Search size={18} style={{position: 'absolute', left: '10px', color: 'var(--text-secondary)'}} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by name, ID, email or department..." 
            style={{paddingLeft: '2.5rem'}}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Issued</th>
              <th>Fine</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? filteredStudents.map(student => (
              <tr key={student.id}>
                <td>{student.studentId}</td>
                <td>
                  <div>{student.name}</div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>{student.email}</div>
                </td>
                <td>{student.department} ({student.year})</td>
                <td>{student.issuedBooksCount}</td>
                <td>₹{student.pendingFine}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', color: 'var(--primary-color)'}} onClick={() => openModal(student)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', color: 'var(--danger-color)'}} onClick={() => handleDelete(student.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center" style={{padding: '2rem'}}>No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={modalStyles.overlay}>
          <div className="card" style={modalStyles.modal}>
            <h3 style={{marginBottom: '1rem'}}>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Student ID</label>
                  <input type="text" className="form-control" required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-control" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" className="form-control" pattern="[0-9]{10}" title="10 digit number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" className="form-control" required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <select className="form-control" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}>
                    <option value="">Select Year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                </div>
                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                  <label>Password</label>
                  <input type="text" className="form-control" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingStudent ? 'Update Student' : 'Save Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto'
  }
};

export default Students;
