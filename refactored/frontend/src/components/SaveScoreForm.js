import React, { useEffect, useState } from 'react';
import './SaveScoreForm.css';

function SaveScoreForm({ score, onClose, setScoreSavedStatus }) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event) {
    event.preventDefault(); // prevent page refresh
    setIsSubmitting(true);
    
    console.log(name, score);

    // Add a timeout to ensure the form closes even if the API call takes too long
    const timeoutId = setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 3000); // 3 seconds timeout

    fetch('http://127.0.0.1:5001/post/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        clearTimeout(timeoutId); // Clear the timeout if the API call succeeds
        setIsSubmitting(false);
        setScoreSavedStatus(true); // Set score saved status to true
        onClose(); // Close the popup after successful submission
      })
      .catch(error => {
        console.error('Error:', error);
        clearTimeout(timeoutId); // Clear the timeout if the API call fails
        setIsSubmitting(false);
        onClose(); // Close the popup even if there's an error
      });
  }

  return (
    <div className="save-score-overlay">
      <div className="save-score-popup">
        <form onSubmit={handleSubmit}>
          <h2>Save Your Score: {score}</h2>
          <div className="input-group">
            <label htmlFor="player-name">Your Name:</label>
            <input
              id="player-name"
              type="text"
              maxLength="3"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
              placeholder="AAA"
              autoFocus
            />
          </div>
          <div className="button-group">
            <button 
              type="button" 
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SaveScoreForm;
