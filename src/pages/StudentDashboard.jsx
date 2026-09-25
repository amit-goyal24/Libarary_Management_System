import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getData } from '../utils/localStorage';
import { useAuth } from '../context/AuthContext';
import { Book, Clock, AlertCircle } from 'lucide-react';
import { checkOverdueBooks } from '../utils/notificationHelpers';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    overdue: 0,
    totalFine: 0
  });

  useEffect(() => {
    // Check and update overdue status
    checkOverdueBooks();
    
    const transactions = getData('transactions');
    const myTransactions = transactions.filter(t => t.studentId === user.id && (t.status === 'Active' || t.status === 'Overdue'));
    
    setIssuedBooks(myTransactions);

    const overdueCount = myTransactions.filter(t => t.status === 'Overdue').length;
    const fine = myTransactions.reduce((acc, t) => acc + (t.fine || 0), 0) + (user.pendingFine || 0);

    setStats({
      active: myTransactions.length,
      overdue: overdueCount,
      totalFine: fine
    });
  }, [user]);

  return (
    <div>
      <h2 className="mb-4">Welcome, {user.name}</h2>

      <div className="grid grid-cols-3 mb-4">
        <StatCard icon={<Book />} title="Currently Issued" value={stats.active} color="var(--primary-color)" />
        <StatCard icon={<Clock />} title="Overdue Books" value={stats.overdue} color={stats.overdue > 0 ? "var(--danger-color)" : "var(--success-color)"} />
        <StatCard icon={<AlertCircle />} title="Pending Fine" value={`₹${stats.totalFine}`} color={stats.totalFine > 0 ? "var(--warning-color)" : "var(--text-secondary)"} />
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3>Your Issued Books</h3>
          <Link to="/student/books" className="btn btn-outline" style={{padding: '0.25rem 0.75rem', fontSize: '0.875rem'}}>
            Browse Catalogue
          </Link>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {issuedBooks.length > 0 ? issuedBooks.map(t => (
                <tr key={t.id}>
                  <td>{t.bookTitle}</td>
                  <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                  <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${t.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>₹{t.fine}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="text-center" style={{padding: '2rem'}}>
                    You have no currently issued books.
                  </td>
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

export default StudentDashboard;
