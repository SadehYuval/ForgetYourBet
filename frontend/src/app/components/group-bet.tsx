import { useState } from 'react';

type GroupType = {
  _id: string;
  name: string;
  description: string;
  members: {
    user: {
      _id: string;
      username: string;
    };
    balance: number;
  }[];
};

interface GroupBetProps {
  group: GroupType;
  onBetAdded?: () => void;
}

export default function GroupBet({ group, onBetAdded }: GroupBetProps) {
  const members = group.members.map(m => m.user);

  const [form, setForm] = useState({
    placedBy: '',
    participants: [] as string[],
    authorized: [] as string[],
    description: '',
    amount: '',
    deadline: '',
  });

  const toggleAll = (field: 'participants' | 'authorized') => {
    const allIds = members.map(m => m._id);
    const allSelected = form[field].length === allIds.length;
    setForm(prev => ({
      ...prev,
      [field]: allSelected ? [] : allIds,
    }));
  };

  const toggleCheckbox = (field: 'participants' | 'authorized', id: string) => {
    setForm(prev => {
      const list = prev[field];
      return {
        ...prev,
        [field]: list.includes(id)
          ? list.filter(x => x !== id)
          : [...list, id],
      };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to place a bet.');
      return;
    }

    // Build payload with ObjectIds for backend
    const payload = {
      type: 'group',
      placedBy: form.placedBy, // should be ObjectId of selected member
      group: group._id,
      participants: form.participants,
      authorized: form.authorized,
      description: form.description,
      amount: Number(form.amount),
      deadline: new Date(form.deadline),
    };

    try {
      const res = await fetch('http://localhost:5000/bets/place-bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setForm({
          placedBy: '',
          participants: [],
          authorized: [],
          description: '',
          amount: '',
          deadline: '',
        });
        onBetAdded?.(); // Safe optional call
      }
      else{
        console.error('Failed to place bet:', data);
        alert('Failed to place bet: ' + (data.error || 'Unknown error'));
        return;
      }
    } catch (err) {
      console.error('Error placing bet:', err);
      alert('Failed to place bet due to network or server error.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Group Bet in {group.name}</h2>

      <label>
        Placed By:
        <select name="placedBy" value={form.placedBy} onChange={handleChange} required>
          <option value="">Select member</option>
          {members.map(member => (
            <option key={member._id} value={member._id}>
              {member.username}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend>Participants:</legend>
        <label>
          <input
            type="checkbox"
            checked={form.participants.length === members.length}
            onChange={() => toggleAll('participants')}
          />
          All
        </label>
        {members.map(member => (
          <label key={`participant-${member._id}`}>
            <input
              type="checkbox"
              checked={form.participants.includes(member._id)}
              onChange={() => toggleCheckbox('participants', member._id)}
            />
            {member.username}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Authorized:</legend>
        <label>
          <input
            type="checkbox"
            checked={form.authorized.length === members.length}
            onChange={() => toggleAll('authorized')}
          />
          All
        </label>
        {members.map(member => (
          <label key={`authorized-${member._id}`}>
            <input
              type="checkbox"
              checked={form.authorized.includes(member._id)}
              onChange={() => toggleCheckbox('authorized', member._id)}
            />
            {member.username}
          </label>
        ))}
      </fieldset>

      <label>
        Description:
        <textarea name="description" value={form.description} onChange={handleChange} required />
      </label>

      <label>
        Amount:
        <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
      </label>

      <label>
        Deadline:
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} required />
      </label>

      <button type="submit">Create Group Bet</button>
    </form>
  );
}
