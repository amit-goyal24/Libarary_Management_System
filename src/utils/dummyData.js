export const INITIAL_DATA = {
  books: [
    {
      id: 'b1',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      category: 'Computer Science',
      isbn: '9780262033848',
      availability: 'Available',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg'
    },
    {
      id: 'b2',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Software Engineering',
      isbn: '9780132350884',
      availability: 'Issued',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg'
    },
    {
      id: 'b3',
      title: 'Design Patterns',
      author: 'Erich Gamma',
      category: 'Software Engineering',
      isbn: '9780201633610',
      availability: 'Available',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg'
    },
    {
      id: 'b4',
      title: 'Operating System Concepts',
      author: 'Abraham Silberschatz',
      category: 'Computer Science',
      isbn: '9781118063330',
      availability: 'Available',
      coverImage: 'https://covers.openlibrary.org/b/isbn/9781118063330-L.jpg'
    }
  ],
  categories: [
    { id: 'c1', name: 'Computer Science' },
    { id: 'c2', name: 'Software Engineering' },
    { id: 'c3', name: 'Mathematics' },
    { id: 'c4', name: 'Physics' }
  ],
  students: [
    {
      id: 's1',
      studentId: 'CS2023001',
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '9876543210',
      department: 'Computer Science',
      year: '3rd',
      password: 'password123',
      issuedBooksCount: 1,
      pendingFine: 0
    },
    {
      id: 's2',
      studentId: 'CS2023002',
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '9876543211',
      department: 'Computer Science',
      year: '3rd',
      password: 'password123',
      issuedBooksCount: 0,
      pendingFine: 50
    }
  ],
  transactions: [
    {
      id: 't1',
      studentId: 's1',
      bookId: 'b2',
      issueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      returnDate: null,
      fine: 0,
      status: 'Active'
    }
  ],
  settings: {
    libraryName: 'College Central Library',
    borrowingPeriod: 14,
    maxBooksPerStudent: 3,
    finePerDay: 10
  }
};
