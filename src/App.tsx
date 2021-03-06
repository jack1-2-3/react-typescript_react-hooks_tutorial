import React, { useState, useEffect } from "react";
import "./App.css";
import { BookToRead } from "./BookToRead";
import BookRow from "./BookRow";
import Modal from "react-modal";
import BookSearchDialog from "./BookSearchDialog";
import { BookDescription } from './BookDescription';

Modal.setAppElement('#root');

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: 0,
    transform: 'translate(-50%, -50%)'
  }
};

const App_key = 'react-hooks-tutorial';

const App = () => {
  const [books, setBooks] = useState([] as BookToRead[]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const storedBooks = localStorage.getItem(App_key);
    if(storedBooks) {
      setBooks(JSON.parse(storedBooks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(App_key, JSON.stringify(books));
  }, [books]);

  const handleAddClick = () => {
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleBookAdd = (book: BookDescription) => {
    const newBook: BookToRead = { ...book, id: Date.now(), memo: '' };
    const newBooks = [...books, newBook];
    setBooks(newBooks);
    setModalIsOpen(false);
  }

  const handleBookDelete = (id: number) => {
    const newBooks = books.filter(book => book.id !== id);
    setBooks(newBooks);
  };

  const handleBookMemoChange = (id: number, memo: string) => {
    const newBooks = books.map(book => {
      return book.id === id
      ? { ...book, memo }
      : book;
    });
    setBooks(newBooks);
  }

  const bookRows = books.map(book => {
      return (
        <BookRow
          book={ book }
          key={ book.id }
          onMemoChange={ (id, memo) => handleBookMemoChange(id, memo) }
          onDelete={ id => handleBookDelete(id) }
        />
      );
  });

  return (
    <div className="App">
      <section className="nav">
        <h1>読みたい本リスト</h1>
        <div className="button-like" onClick={ handleAddClick }>本を追加</div>
      </section>
      <section className="main">
        { bookRows }
      </section>
      <Modal
        isOpen={ modalIsOpen }
        onRequestClose={ handleModalClose }
        style={ customStyles }
      >
        <BookSearchDialog maxResults={ 20 } onBookAdd={ book => handleBookAdd(book) } />
      </Modal>
    </div>
  );
};

export default App;
