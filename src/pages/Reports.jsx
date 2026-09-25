import React, { useState, useEffect } from 'react';
import { getData } from '../utils/localStorage';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    setTransactions(getData('transactions'));
  }, []);

  const activeTransactions = transactions.filter(t => t.status === 'Active');
  const overdueTransactions = transactions.filter(t => t.status === 'Overdue');

  return (
    <div>
      <h2 className="mb-4">Library Reports</h2>

      <div className="card mb-4">
        <h3 className="mb-4">Overdue Books Report</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Book</th>
                <th>Due Date</th>
                <th>Overdue Days</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {overdueTransactions.length > 0 ? overdueTransactions.map(t => {
                const due = new Date(t.dueDate);
                const today = new Date();
                const diffDays = Math.ceil(Math.abs(today - due) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={t.id}>
                    <td>{t.studentName}</td>
                    <td>{t.bookTitle}</td>
                    <td>{due.toLocaleDateString()}</td>
                    <td className="text-danger">{diffDays} days</td>
                    <td>₹{t.fine}</td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan="5" className="text-center" style={{padding: '1rem'}}>No overdue books.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4">Currently Issued Books</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Book</th>
                <th>Issue Date</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {activeTransactions.length > 0 ? activeTransactions.map(t => (
                <tr key={t.id}>
                  <td>{t.studentName}</td>
                  <td>{t.bookTitle}</td>
                  <td>{new Date(t.issueDate).toLocaleDateString()}</td>
                  <td>{new Date(t.dueDate).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center" style={{padding: '1rem'}}>No books currently issued.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
