import { getData, saveData, generateId } from './localStorage';

export const addNotification = (userId, message) => {
  const notifications = getData('notifications');
  const newNotif = {
    id: generateId(),
    userId,
    message,
    date: new Date().toISOString(),
    read: false
  };
  saveData('notifications', [newNotif, ...notifications]);
};

export const checkOverdueBooks = () => {
  const transactions = getData('transactions');
  const settings = getData('settings')[0] || { finePerDay: 10 };
  let transactionsUpdated = false;

  const updatedTransactions = transactions.map(t => {
    if (t.status === 'Active') {
      const today = new Date();
      const dueDate = new Date(t.dueDate);
      if (today > dueDate) {
        // Book is overdue
        const diffTime = Math.abs(today - dueDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const newFine = diffDays * (settings.finePerDay || 10);

        if (t.fine !== newFine || t.status !== 'Overdue') {
          t.status = 'Overdue';
          t.fine = newFine;
          transactionsUpdated = true;
          addNotification(t.studentId, `Your book "${t.bookId}" is overdue by ${diffDays} days. Fine: ₹${newFine}`);
        }
      }
    }
    return t;
  });

  if (transactionsUpdated) {
    saveData('transactions', updatedTransactions);
  }
};
