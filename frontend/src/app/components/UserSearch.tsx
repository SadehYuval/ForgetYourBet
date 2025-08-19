import { useState } from 'react';

type UserType = {
  _id: string;
  username: string;
  email: string;
};

interface UserSearchProps {
  groupId: string;
  onUserAdded: () => void;
  onCancel: () => void;
}

export default function UserSearch({ groupId, onUserAdded, onCancel }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleSearch = async () => {

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/users/search-users?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const users = await response.json();
      setSearchResults(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/groups/${groupId}/add-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add user');
      }

      onUserAdded();
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
    }
  };

  return (
    <div className="user-search">
      <h3>Add Member</h3>
      <div>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {searchResults.length > 0 && (
        <div>
          <h4>Search Results:</h4>
          <ul>
            {searchResults.map((user) => (
              <li key={user._id}>
                <span>{user.username} ({user.email})</span>
                <button onClick={() => handleAddUser(user._id)}>Add</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchResults.length === 0 && searchQuery && !loading && (
        <p>No users found.</p>
      )}
    </div>
  );
}