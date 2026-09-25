import React, { useState, useEffect } from 'react';
import { getData } from '../utils/localStorage';
import { Search } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setTransactions(getData('transactions'));
  }, []);

  const filteredTransactions = transactions.filter(t => {
    const matchSearch = t.studentName.toLowerCase().includes(search.toLowerCase()) || 
                        t.bookTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? t.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <h2 className="mb-4">Transaction History</h2>

      <div className="card mb-4 flex gap-4 items-center">
        <div className="flex-1 flex items-center gap-2" style={{position: 'relative'}}>
          <Search size={18} style={{position: 'absolute', left: '10px', color: 'var(--text-secondary)'}} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by student or book title..." 
            style={{paddingLeft: '2.5rem'}}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="form-control" 
          style={{width: '200px'}}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Returned">Returned</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Book</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Fine</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
              <tr key={t.id}>
                <td>{t.studentName}</td>
                <td>{t.bookTitle}</td>
                <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                <td>{t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '-'}</td>
                <td>₹{t.fine}</td>
                <td>
                  <span className={`badge ${
                    t.status === 'Active' ? 'badge-primary' : 
                    t.status === 'Returned' ? 'badge-success' : 'badge-danger'
                  }`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="text-center" style={{padding: '2rem'}}>No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
