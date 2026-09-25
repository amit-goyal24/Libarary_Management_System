import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';
import { getData, saveData } from '../utils/localStorage';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    password: user.password || '',
    profileImage: user.profileImage || ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) {
        alert('Image too large. Max 500KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    updateProfile(formData);
    
    // Also update in collections
    if (user.role === 'admin') {
      const users = getData('users');
      const updated = users.map(u => u.id === user.id ? { ...u, ...formData } : u);
      saveData('users', updated);
    } else {
      const students = getData('students');
      const updated = students.map(s => s.id === user.id ? { ...s, ...formData } : s);
      saveData('students', updated);
    }

    alert('Profile updated successfully!');
  };

  return (
    <div>
      <h2 className="mb-4">My Profile</h2>

      <div className="card" style={{maxWidth: '600px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem'}}>
          <div style={{width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--border-color)'}}>
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            ) : (
              <User size={48} color="var(--text-secondary)" />
            )}
          </div>
          <div>
            <h3 style={{marginBottom: '0.25rem'}}>{user.name}</h3>
            <p style={{color: 'var(--text-secondary)'}}>{user.role === 'admin' ? 'Administrator' : `Student - ${user.studentId}`}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="form-control" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" className="form-control" pattern="[0-9]{10}" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>
          
          <div className="form-group">
            <label>Profile Image</label>
            <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} />
          </div>

          <button type="submit" className="btn btn-primary mt-4">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
