import React, { useState, useEffect } from 'react';
import { getData, saveData, generateId } from '../utils/localStorage';
import { addNotification } from '../utils/notificationHelpers';

const IssueReturn = () => {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [settings, setSettings] = useState({ borrowingPeriod: 14, maxBooksPerStudent: 3, finePerDay: 10 });
  
  const [issueData, setIssueData] = useState({ studentId: '', bookId: '' });
  const [returnTransactionId, setReturnTransactionId] = useState('');

  useEffect(() => {
    setBooks(getData('books'));
    setStudents(getData('students'));
    setTransactions(getData('transactions'));
    const savedSettings = getData('settings');
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleIssue = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === issueData.studentId);
    const book = books.find(b => b.id === issueData.bookId);

    if (!student || !book) {
      alert('Please select both student and book');
      return;
    }

    if (book.availability === 'Issued') {
      alert('Book is currently unavailable.');
      return;
    }

    if (student.issuedBooksCount >= settings.maxBooksPerStudent) {
      alert('Student has reached the borrowing limit.');
      return;
    }

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + parseInt(settings.borrowingPeriod));

    const newTransaction = {
      id: generateId(),
      studentId: student.id,
      studentName: student.name,
      bookId: book.id,
      bookTitle: book.title,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      returnDate: null,
      fine: 0,
      status: 'Active'
    };

    // Update book status
    const updatedBooks = books.map(b => b.id === book.id ? { ...b, availability: 'Issued' } : b);
    
    // Update student count
    const updatedStudents = students.map(s => s.id === student.id ? { ...s, issuedBooksCount: s.issuedBooksCount + 1 } : s);
    
    // Save all
    const updatedTransactions = [newTransaction, ...transactions];
    saveData('books', updatedBooks);
    saveData('students', updatedStudents);
    saveData('transactions', updatedTransactions);
    
    setBooks(updatedBooks);
    setStudents(updatedStudents);
    setTransactions(updatedTransactions);
    setIssueData({ studentId: '', bookId: '' });

    addNotification(student.id, `You have successfully borrowed "${book.title}". Due date is ${dueDate.toLocaleDateString()}`);
    alert('Book issued successfully!');
  };

  const handleReturn = (e) => {
    e.preventDefault();
    const transaction = transactions.find(t => t.id === returnTransactionId);
    if (!transaction) {
      alert('Transaction not found');
      return;
    }

    const returnDate = new Date();
    const dueDate = new Date(transaction.dueDate);
    let fine = 0;

    if (returnDate > dueDate) {
      const diffTime = Math.abs(returnDate - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * settings.finePerDay;
    }

    // Update transaction
    const updatedTransactions = transactions.map(t => 
      t.id === transaction.id ? { ...t, returnDate: returnDate.toISOString(), fine, status: 'Returned' } : t
    );

    // Update book status
    const updatedBooks = books.map(b => b.id === transaction.bookId ? { ...b, availability: 'Available' } : b);

    // Update student
    const updatedStudents = students.map(s => {
      if (s.id === transaction.studentId) {
        return { 
          ...s, 
          issuedBooksCount: Math.max(0, s.issuedBooksCount - 1),
          pendingFine: s.pendingFine + fine
        };
      }
      return s;
    });

    saveData('books', updatedBooks);
    saveData('students', updatedStudents);
    saveData('transactions', updatedTransactions);
    
    setBooks(updatedBooks);
    setStudents(updatedStudents);
    setTransactions(updatedTransactions);
    setReturnTransactionId('');

    addNotification(transaction.studentId, `You have returned "${transaction.bookTitle}". Fine applied: ₹${fine}`);
    alert(`Book returned successfully! Fine calculated: ₹${fine}`);
  };

  const saveSettings = (e) => {
    e.preventDefault();
    saveData('settings', settings);
    alert('Borrowing rules updated successfully');
  };

  return (
    <div>
      <h2 className="mb-4">Issue & Return Books</h2>

      <div className="grid grid-cols-2">
        {/* Issue Book Section */}
        <div className="card">
          <h3 className="mb-4">Issue Book</h3>
          <form onSubmit={handleIssue}>
            <div className="form-group">
              <label>Select Student</label>
              <select 
                className="form-control" 
                required 
                value={issueData.studentId}
                onChange={e => setIssueData({...issueData, studentId: e.target.value})}
              >
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Book</label>
              <select 
                className="form-control" 
                required 
                value={issueData.bookId}
                onChange={e => setIssueData({...issueData, bookId: e.target.value})}
              >
                <option value="">-- Choose Book --</option>
                {books.filter(b => b.availability === 'Available').map(b => (
                  <option key={b.id} value={b.id}>{b.title} (ISBN: {b.isbn})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Issue Book</button>
          </form>
        </div>

        {/* Return Book Section */}
        <div className="card">
          <h3 className="mb-4">Return Book</h3>
          <form onSubmit={handleReturn}>
            <div className="form-group">
              <label>Select Active Transaction</label>
              <select 
                className="form-control" 
                required 
                value={returnTransactionId}
                onChange={e => setReturnTransactionId(e.target.value)}
              >
                <option value="">-- Choose Transaction --</option>
                {transactions.filter(t => t.status === 'Active' || t.status === 'Overdue').map(t => (
                  <option key={t.id} value={t.id}>
                    {t.studentName} - {t.bookTitle} (Due: {new Date(t.dueDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
            {returnTransactionId && (
              <div style={{backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1rem'}}>
                {(() => {
                  const t = transactions.find(t => t.id === returnTransactionId);
                  const today = new Date();
                  const due = new Date(t.dueDate);
                  const isOverdue = today > due;
                  return (
                    <>
                      <p><strong>Status:</strong> {isOverdue ? <span className="text-danger">Overdue</span> : <span className="text-success">On Time</span>}</p>
                      {isOverdue && (
                        <p><strong>Est. Fine:</strong> ₹{Math.ceil(Math.abs(today - due) / (1000 * 60 * 60 * 24)) * settings.finePerDay}</p>
                      )}
                    </>
                  )
                })()}
              </div>
            )}
            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Return Book</button>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <h3 className="mb-4">Borrowing Rules Configuration</h3>
        <form onSubmit={saveSettings} className="grid grid-cols-3">
          <div className="form-group">
            <label>Borrowing Period (Days)</label>
            <input 
              type="number" 
              className="form-control" 
              value={settings.borrowingPeriod}
              onChange={e => setSettings({...settings, borrowingPeriod: e.target.value})}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Max Books per Student</label>
            <input 
              type="number" 
              className="form-control" 
              value={settings.maxBooksPerStudent}
              onChange={e => setSettings({...settings, maxBooksPerStudent: e.target.value})}
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label>Fine per Overdue Day (₹)</label>
            <input 
              type="number" 
              className="form-control" 
              value={settings.finePerDay}
              onChange={e => setSettings({...settings, finePerDay: e.target.value})}
              min="0"
              required
            />
          </div>
          <div style={{gridColumn: '1 / -1'}}>
            <button type="submit" className="btn btn-outline">Update Rules</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueReturn;
