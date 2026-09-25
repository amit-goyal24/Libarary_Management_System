import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { initLocalStorage, getData } from './utils/localStorage';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import AdminSetup from './pages/AdminSetup';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Students from './pages/Students';
import IssueReturn from './pages/IssueReturn';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;

  const isInitialized = localStorage.getItem('isInitialized');
  
  if (!isInitialized) {
    return (
      <Routes>
        <Route path="/setup-admin" element={<AdminSetup />} />
        <Route path="*" element={<Navigate to="/setup-admin" replace />} />
      </Routes>
    );
  }

  return (
    <>
      {user && <Navbar />}
      <div className={user ? 'app-container' : ''}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} replace />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="books" element={<Books />} />
            <Route path="books/:id" element={<BookDetails />} />
            <Route path="students" element={<Students />} />
            <Route path="issue-return" element={<IssueReturn />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="books" element={<Books />} />
            <Route path="books/:id" element={<BookDetails />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          <Route path="/" element={<Navigate to={user ? `/${user.role}/dashboard` : '/login'} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

import { INITIAL_DATA } from './utils/dummyData';

function App() {
  useEffect(() => {
    // Only init data, admin setup handles isInitialized flag
    // initLocalStorage is called inside AdminSetup after saving admin
    const users = getData('users');
    if (users.length > 0 && !localStorage.getItem('isInitialized')) {
      localStorage.setItem('isInitialized', 'true');
    }
    
    // One-time patch for cover images (for existing users)
    let books = getData('books');
    let patched = false;
    books = books.map(b => {
      if (!b.coverImage) {
        const dummyBook = INITIAL_DATA.books.find(db => db.id === b.id);
        if (dummyBook && dummyBook.coverImage) {
          patched = true;
          return { ...b, coverImage: dummyBook.coverImage };
        }
      }
      return b;
    });
    
    if (patched) {
      localStorage.setItem('books', JSON.stringify(books));
    }

  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
