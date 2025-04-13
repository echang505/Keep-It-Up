import React, { useState } from 'react';
import './SaveScoreForm.css';

function SaveScoreForm({ score }) {
  const [name, setName] = useState("AAA");

  function handleSubmit(event) {
    event.preventDefault(); // prevent page refresh
    console.log(name, score);

    fetch('http://127.0.0.1:5001/post/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score }),
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
  }

  return (
    <div>
      <h1>Save Score</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            maxLength="3"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default SaveScoreForm;