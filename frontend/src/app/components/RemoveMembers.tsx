import { useState } from 'react';

type MemberType = {
  user: {
    _id: string;
    username: string;
  };
  balance: number;
};

interface RemoveMembersProps {
  groupId: string;
  members: MemberType[];
  onMemberRemoved: () => void;
  onCancel: () => void;
}

export default function RemoveMembers({ groupId, members, onMemberRemoved, onCancel }: RemoveMembersProps) {
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const handleRemoveMember = async (userId: string) => {
    setRemoving(userId);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/groups/${groupId}/remove-member/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove member');
      }

      onMemberRemoved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="remove-members">
      <h3>Remove Members</h3>
      <button onClick={onCancel}>Cancel</button>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {members.map((member) => (
          <li key={member.user._id}>
            <span>{member.user.username} (Balance: {member.balance})</span>
            <button
              onClick={() => handleRemoveMember(member.user._id)}
              disabled={removing === member.user._id}
              style={{ marginLeft: '10px', color: 'red' }}
            >
              {removing === member.user._id ? 'Removing...' : 'Remove'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}