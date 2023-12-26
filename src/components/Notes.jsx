import React, { useEffect, useState } from 'react';
import CreateNote from './CreateNote';
import './notes.css';
import Note from './Note';

const Notes = () => {
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState([]);
  const [editToggle, setEditToggle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [idCounter, setIdCounter] = useState(1);

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
          id: idCounter,
          text: inputText,
        },
      ]);
      setIdCounter((prevCounter) => prevCounter + 1);
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
      // Find the highest existing ID to set the counter
      const maxId = Math.max(...data.map((note) => note.id), 0);
      setIdCounter(maxId + 1);
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
