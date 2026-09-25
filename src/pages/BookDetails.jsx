import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getData } from '../utils/localStorage';
import { ArrowLeft, Book } from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const books = getData('books');
    const found = books.find(b => b.id === id);
    setBook(found);
  }, [id]);

  if (!book) return <div>Book not found</div>;

  return (
    <div>
      <Link to={-1} className="flex items-center gap-2 mb-4 text-secondary">
        <ArrowLeft size={16} /> Back to catalogue
      </Link>

      <div className="card grid grid-cols-1 md:grid-cols-3 gap-4" style={{gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)'}}>
        <div style={{width: '100%', height: '400px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          ) : (
            <Book size={64} color="var(--text-secondary)" />
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 style={{marginBottom: '0.5rem'}}>{book.title}</h2>
              <p style={{fontSize: '1.1rem', color: 'var(--text-secondary)'}}>{book.author}</p>
            </div>
            <span className={`badge ${book.availability === 'Available' ? 'badge-success' : 'badge-warning'}`}>
              {book.availability}
            </span>
          </div>

          <div style={{marginTop: '2rem'}}>
            <h4 style={{marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem'}}>Book Information</h4>
            <div className="grid grid-cols-2 gap-4" style={{marginTop: '1rem'}}>
              <div>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Category</p>
                <p style={{fontWeight: 500}}>{book.category}</p>
              </div>
              <div>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>ISBN</p>
                <p style={{fontWeight: 500}}>{book.isbn}</p>
              </div>
              <div>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>Book ID</p>
                <p style={{fontWeight: 500}}>{book.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
