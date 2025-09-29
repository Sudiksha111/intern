// frontend/src/components/NoteList.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient'; // <-- Import your new API client

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        // Use the apiClient to make the request. No need to type the full URL!
        const response = await apiClient.get('/notes');
        setNotes(response.data);
      } catch (err) {
        setError('Failed to fetch notes. Are you logged in?');
        console.error(err);
      }
    };

       console.log('✅ DATA RECEIVED FROM BACKEND:', response.data);
    fetchNotes();
  }, []); // The empty array [] means this runs once when the component mounts

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Your Notes</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default NoteList;