import React, { useState, useEffect } from 'react';
import { getData, saveData } from '../utils/localStorage';

const Settings = () => {
  const [libraryName, setLibraryName] = useState('');

  useEffect(() => {
    const settings = getData('settings');
    if (settings && settings.libraryName) {
      setLibraryName(settings.libraryName);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const settings = getData('settings') || {};
    settings.libraryName = libraryName;
    saveData('settings', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div>
      <h2 className="mb-4">System Settings</h2>

      <div className="card" style={{maxWidth: '600px'}}>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Library Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={libraryName}
              onChange={e => setLibraryName(e.target.value)}
              required
            />
            <small style={{color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem'}}>
              This name will be used across the application.
            </small>
          </div>
          
          <button type="submit" className="btn btn-primary">Save Settings</button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
