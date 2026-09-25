import React, { useState, useEffect } from 'react';
import { getData, saveData } from '../utils/localStorage';
import { useAuth } from '../context/AuthContext';
import { Trash2, Check, Bell } from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const all = getData('notifications');
    setNotifications(all.filter(n => n.userId === user.id));
  };

  const markAsRead = (id) => {
    const all = getData('notifications');
    const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
    saveData('notifications', updated);
    loadNotifications();
  };

  const markAllAsRead = () => {
    const all = getData('notifications');
    const updated = all.map(n => n.userId === user.id ? { ...n, read: true } : n);
    saveData('notifications', updated);
    loadNotifications();
  };

  const deleteNotification = (id) => {
    const all = getData('notifications');
    const updated = all.filter(n => n.id !== id);
    saveData('notifications', updated);
    loadNotifications();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Notifications</h2>
        {notifications.some(n => !n.read) && (
          <button className="btn btn-outline" onClick={markAllAsRead}>Mark All as Read</button>
        )}
      </div>

      <div className="grid grid-cols-1">
        {notifications.length > 0 ? notifications.map(notif => (
          <div key={notif.id} className="card flex items-center justify-between" style={{
            borderLeft: notif.read ? 'none' : '4px solid var(--primary-color)',
            opacity: notif.read ? 0.7 : 1
          }}>
            <div className="flex items-center gap-4">
              <div style={{color: 'var(--primary-color)'}}><Bell size={24} /></div>
              <div>
                <p>{notif.message}</p>
                <small style={{color: 'var(--text-secondary)'}}>{new Date(notif.date).toLocaleString()}</small>
              </div>
            </div>
            <div className="flex gap-2">
              {!notif.read && (
                <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', color: 'var(--success-color)'}} onClick={() => markAsRead(notif.id)}>
                  <Check size={16} />
                </button>
              )}
              <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', color: 'var(--danger-color)'}} onClick={() => deleteNotification(notif.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )) : (
          <div className="card text-center" style={{padding: '3rem', color: 'var(--text-secondary)'}}>
            You have no notifications.
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
