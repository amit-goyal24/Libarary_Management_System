import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Bell, User, BookOpen } from 'lucide-react';
import { getData } from '../utils/localStorage';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUnreadCount = () => {
    const notifications = getData('notifications');
    return notifications.filter(n => n.userId === user.id && !n.read).length;
  };

  const unreadCount = getUnreadCount();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/books', label: 'Books' },
    { to: '/admin/students', label: 'Students' },
    { to: '/admin/issue-return', label: 'Issue/Return' },
    { to: '/admin/transactions', label: 'Transactions' },
    { to: '/admin/reports', label: 'Reports' },
    { to: '/admin/settings', label: 'Settings' }
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/books', label: 'Catalogue' }
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <nav style={styles.navbar}>
      <div style={styles.navBrand}>
        <BookOpen size={24} color="var(--primary-color)" />
        <Link to={`/${user?.role}/dashboard`} style={styles.brandText}>
          College Library
        </Link>
      </div>
      
      <div style={styles.navLinks}>
        {links.map(link => (
          <Link key={link.to} to={link.to} style={styles.link}>
            {link.label}
          </Link>
        ))}
      </div>

      <div style={styles.navActions}>
        <button onClick={toggleTheme} style={styles.iconBtn} aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <Link to={`/${user?.role}/notifications`} style={styles.iconBtn}>
          <Bell size={20} />
          {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
        </Link>

        <Link to={`/${user?.role}/profile`} style={styles.iconBtn}>
          <User size={20} />
        </Link>

        <button onClick={handleLogout} style={{...styles.iconBtn, color: 'var(--danger-color)'}}>
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexWrap: 'wrap',
    gap: '1rem'
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  brandText: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  link: {
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: 'var(--danger-color)',
    color: 'white',
    fontSize: '0.65rem',
    padding: '2px 5px',
    borderRadius: '10px',
    fontWeight: 'bold'
  }
};

export default Navbar;
