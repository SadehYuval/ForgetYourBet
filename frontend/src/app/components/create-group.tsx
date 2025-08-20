import { useState } from 'react';

export default function CreateGroup({ onGroupAddition }: { onGroupAddition: () => void }) {
  const token = localStorage.getItem('token');
  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
    };

    const res = await fetch('http://localhost:5000/groups/create-group', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('Group created successfully!');
      setForm({ name: '', description: '' });
    } else {
      const data = await res.json();
      alert('Error: ' + data.error);
    }
    onGroupAddition();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Group</h2>
      <label>
        Group Name:
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Description:
        <textarea name="description" value={form.description} onChange={handleChange} />
      </label>
      <br />
      <button type="submit">Create Group</button>
    </form>
  );
}