import { useState } from 'react';

interface PersonalBetProps {
  onBetAdded?: () => void; // Optional depending where you render it from (PlaceBet or personal-info)
}

export default function PersonalBet({ onBetAdded }: PersonalBetProps) {
  const [form, setForm] = useState({
    placedBy: '',
    description: '',
    amount: '',
    deadline: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      type: 'personal',
      description: form.description,
      amount: Number(form.amount),
      deadline: new Date(form.deadline),
    };

    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/bets/place-bet', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setForm({ placedBy: '', description: '', amount: '', deadline: '' });
      onBetAdded?.(); // Safe optional call
    } else {
      const data = await res.json();
      alert('Error: ' + data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Personal Bet</h2>
      <label>
        Description:
        <textarea name="description" value={form.description} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Amount:
        <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Deadline:
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">Create Personal Bet</button>
    </form>
  );
}
