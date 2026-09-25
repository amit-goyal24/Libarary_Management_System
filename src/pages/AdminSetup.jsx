import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveData, generateId, initLocalStorage, setAsInitialized } from '../utils/localStorage';
import { UserPlus } from 'lucide-react';

const AdminSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create admin user
    const adminUser = {
      id: generateId(),
      ...formData,
      role: 'admin',
      profileImage: ''
    };

    // Init sample data first
    initLocalStorage();

    // Save admin
    saveData('users', [adminUser]);
    setAsInitialized();

    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div style={styles.container}>
      <div className="card" style={styles.card}>
        <div style={styles.header}>
          <UserPlus size={48} color="var(--primary-color)" />
          <h2 className="mt-4">Library System Setup</h2>
          <p style={{color: 'var(--text-secondary)'}}>Create the master admin account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              className="form-control" 
              required 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              className="form-control" 
              required 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input 
              type="tel" 
              name="phone" 
              className="form-control" 
              required 
              pattern="[0-9]{10}"
              title="10 digit phone number"
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-control" 
              required 
              onChange={handleChange} 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}}>
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '1rem'
  },
  card: {
    width: '100%',
    maxWidth: '400px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  }
};

export default AdminSetup;
