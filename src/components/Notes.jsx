import React, { useEffect, useState } from 'react';
import CreateNote from './CreateNote';
import './notes.css';
import { v4 as uuid } from 'uuid';
import Note from './Note';

const Notes = () => {
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState([]);
  const [editToggle, setEditToggle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const editHandler = (id, text) => {
    setEditToggle(id);
    setInputText(text);
  };

  const saveHandler = () => {
    if (editToggle) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editToggle ? { ...note, text: inputText } : note
        )
      );
    } else {
      setNotes((prevNotes) => [
        ...prevNotes,
        {
          id: uuid(),
          text: inputText,
        },
      ]);
    }

    setInputText('');
    setEditToggle(null);
  };

  const deleteHandler = (id) => {
    const newNotes = notes.filter((n) => n.id !== id);
    setNotes(newNotes);
  };

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('Notes'));
    if (data) {
      setNotes(data);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('Notes', JSON.stringify(notes));
  }, [notes]);

  return (
    <div className='notes'>
      <input
      className='search-input'
        type='text'
        placeholder='Search notes...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredNotes.map((note) =>
        editToggle === note.id ? (
          <CreateNote
            key={note.id}
            inputText={inputText}
            setInputText={setInputText}
            saveHandler={saveHandler}
          />
        ) : (
          <Note
            key={note.id}
            id={note.id}
            text={note.text}
            editHandler={editHandler}
            deleteHandler={deleteHandler}
          />
        )
      )}

      {editToggle === null ? (
        <CreateNote
          inputText={inputText}
          setInputText={setInputText}
          saveHandler={saveHandler}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Notes;
