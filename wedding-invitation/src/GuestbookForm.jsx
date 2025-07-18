import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase'; // adjust path if needed

const GuestbookForm = ({ lang, guestbookText, onNewMessage }) => {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const entry = {
        name,
        msg,
        timestamp: Timestamp.now()
      };
      const docRef = await addDoc(collection(db, 'guestbook'), entry);
      onNewMessage({ ...entry, date: new Date().toISOString(), id: docRef.id });
      setName('');
      setMsg('');
    } catch (err) {
      console.error('Error writing to guestbook:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="guestbook-form">
  <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="이름"
    className="guestbook-input"
    required
  />
  <textarea
    value={msg}
    onChange={(e) => setMsg(e.target.value)}
    placeholder="축하메시지"
    className="guestbook-textarea"
    required
  />
  <button type="submit" className="guestbook-submit-btn">
  {lang === 'ko' ? '축하메시지 남기기' : 'Leave a Message'}
</button>
</form>
  );
};

export default GuestbookForm;