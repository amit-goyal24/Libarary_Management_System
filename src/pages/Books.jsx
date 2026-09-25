import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getData, saveData, generateId } from '../utils/localStorage';
import { Search, Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const { user } = useAuth();
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', category: '', isbn: '', coverImage: ''
  });

  useEffect(() => {
    setBooks(getData('books'));
    setCategories(getData('categories'));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const updatedBooks = books.filter(b => b.id !== id);
      setBooks(updatedBooks);
      saveData('books', updatedBooks);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) { // Limit to 500kb
        alert('Image too large. Please select an image under 500KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for duplicate ISBN
    const isDuplicate = books.some(b => b.isbn === formData.isbn && b.id !== editingBook?.id);
    if (isDuplicate) {
      alert('A book with this ISBN already exists.');
      return;
    }

    if (editingBook) {
      const updatedBooks = books.map(b => b.id === editingBook.id ? { ...b, ...formData } : b);
      setBooks(updatedBooks);
      saveData('books', updatedBooks);
    } else {
      const newBook = {
        id: generateId(),
        ...formData,
        availability: 'Available'
      };
      const updatedBooks = [newBook, ...books];
      setBooks(updatedBooks);
      saveData('books', updatedBooks);
    }
    
    closeModal();
  };

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData(book);
    } else {
      setEditingBook(null);
      setFormData({ title: '', author: '', category: categories[0]?.name || '', isbn: '', coverImage: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
  };

  const filteredBooks = books.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                        b.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter ? b.category === categoryFilter : true;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>{user?.role === 'admin' ? 'Book Management' : 'Library Catalogue'}</h2>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> Add Book
          </button>
        )}
      </div>

      <div className="card mb-4 flex gap-4 items-center" style={{padding: '1rem'}}>
        <div className="flex-1 flex items-center gap-2" style={{position: 'relative'}}>
          <Search size={18} style={{position: 'absolute', left: '10px', color: 'var(--text-secondary)'}} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by title or author..." 
            style={{paddingLeft: '2.5rem'}}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="form-control" 
          style={{width: '200px'}}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-4">
        {filteredBooks.length > 0 ? filteredBooks.map(book => (
          <div key={book.id} className="card" style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{height: '200px', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius)', marginBottom: '1rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              ) : (
                <span style={{color: 'var(--text-secondary)'}}>No Cover</span>
              )}
            </div>
            <h4 style={{marginBottom: '0.5rem'}}>{book.title}</h4>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem'}}>{book.author}</p>
            <div className="flex justify-between items-center mt-auto pt-4">
              <span className={`badge ${book.availability === 'Available' ? 'badge-success' : 'badge-warning'}`}>
                {book.availability}
              </span>
              <div className="flex gap-2">
                <Link to={`/${user?.role}/books/${book.id}`} className="btn btn-outline" style={{padding: '0.25rem 0.5rem'}}>
                  View
                </Link>
                {user?.role === 'admin' && (
                  <>
                    <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', color: 'var(--primary-color)'}} onClick={() => openModal(book)}>
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-outline" style={{padding: '0.25rem 0.5rem', color: 'var(--danger-color)'}} onClick={() => handleDelete(book.id)}>
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>
            No books found matching your criteria.
          </div>
        )}
      </div>

      {showModal && (
        <div style={modalStyles.overlay}>
          <div className="card" style={modalStyles.modal}>
            <h3 style={{marginBottom: '1rem'}}>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-control" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input type="text" className="form-control" required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
              </div>
              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label>ISBN</label>
                  <input type="text" className="form-control" required value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Cover Image (Max 500KB)</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} />
                {formData.coverImage && <img src={formData.coverImage} alt="Preview" style={{width: '100px', marginTop: '0.5rem', borderRadius: '4px'}} />}
              </div>
              
              <div className="flex justify-between mt-4">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingBook ? 'Update Book' : 'Save Book'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto'
  }
};

export default Books;
