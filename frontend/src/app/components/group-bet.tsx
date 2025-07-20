import { useState } from 'react';

export default function GroupBet() {
  const [form, setForm] = useState({
    placedBy: '',
    group: '',
    participants: '',
    description: '',
    amount: '',
    deadline: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const participantsArray = form.participants.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      type: 'group',
      placedBy: form.placedBy,
      group: form.group,
      participants: participantsArray,
      description: form.description,
      amount: Number(form.amount),
      deadline: new Date(form.deadline),
    };

    const res = await fetch('http://localhost:5000/bets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('Group bet created!');
      setForm({ placedBy: '', group: '', participants: '', description: '', amount: '', deadline: '' });
    } else {
      const data = await res.json();
      alert('Error: ' + data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Group Bet</h2>
      <label>
        User ID (placedBy):
        <input name="placedBy" value={form.placedBy} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Group ID:
        <input name="group" value={form.group} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Participants (comma-separated User IDs):
        <input name="participants" value={form.participants} onChange={handleChange} required />
      </label>
      <br />
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
      <button type="submit">Create Group Bet</button>
    </form>
  );
}
