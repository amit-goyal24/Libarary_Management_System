import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getData } from '../utils/localStorage';
import { checkOverdueBooks } from '../utils/notificationHelpers';
import { Book, Users, BookOpen, Clock, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    totalStudents: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);

  useEffect(() => {
    // Run overdue check on dashboard load
    checkOverdueBooks();

    const books = getData('books');
    const students = getData('students');

    setStats({
      totalBooks: books.length,
      availableBooks: books.filter(b => b.availability === 'Available').length,
      issuedBooks: books.filter(b => b.availability === 'Issued').length,
      totalStudents: students.length
    });

    setRecentBooks(books.slice(-5).reverse()); // Last 5 added
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Dashboard Overview</h2>
        <div className="flex gap-2">
          <Link to="/admin/issue-return" className="btn btn-primary">Quick Issue</Link>
          <Link to="/admin/issue-return" className="btn btn-outline">Quick Return</Link>
        </div>
      </div>

      <div className="grid grid-cols-4 mb-4">
        <StatCard icon={<Book />} title="Total Books" value={stats.totalBooks} color="var(--primary-color)" />
        <StatCard icon={<BookOpen />} title="Available" value={stats.availableBooks} color="var(--success-color)" />
        <StatCard icon={<Clock />} title="Issued" value={stats.issuedBooks} color="var(--warning-color)" />
        <StatCard icon={<Users />} title="Total Students" value={stats.totalStudents} color="#8b5cf6" />
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3>Recently Added Books</h3>
          <Link to="/admin/books" className="text-primary flex items-center gap-2" style={{fontSize: '0.875rem'}}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBooks.length > 0 ? recentBooks.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>
                    <span className={`badge ${book.availability === 'Available' ? 'badge-success' : 'badge-warning'}`}>
                      {book.availability}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center" style={{padding: '2rem'}}>No books added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="card flex items-center gap-4">
    <div style={{
      backgroundColor: `${color}20`,
      color: color,
      padding: '1rem',
      borderRadius: 'var(--radius)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500}}>{title}</p>
      <h3 style={{fontSize: '1.5rem', marginTop: '0.25rem'}}>{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;
