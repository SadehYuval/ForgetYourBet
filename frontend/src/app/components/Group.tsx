'use client';

import { useState, useEffect } from 'react';
import GroupBet from './group-bet';
import UserSearch from './UserSearch';
import RemoveMembers from './RemoveMembers';

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

type BetType = {
  _id: string;
  description: string;
  amount: number;
  deadline: string;
  placedBy: { _id: string; username: string };
  authorized: { _id: string; username: string }[];
};

export default function Group({ group, onBack, onGroupUpdate }: { group: GroupType; onBack: () => void; onGroupUpdate: (groupId: string) => void }) {
  const [placeBet, setPlaceBet] = useState(false);
  const [bets, setBets] = useState<BetType[]>([]);
  const [loadingBets, setLoadingBets] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showRemoveMembers, setShowRemoveMembers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;


  const fetchBets = async () => {
    setLoadingBets(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/bets/group-bets?group=${group._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch bets');
      }

      setBets(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while fetching bets.');
      }
    } finally {
      setLoadingBets(false);
    }
  };

  useEffect(() => {
      fetchBets();
  }, []);

  const handleBetAdded = () => {
    fetchBets(); // Re-fetch bets after adding a new one
  };

  const handleMembershipChange = () => {
    setShowAddUser(false);
    setShowRemoveMembers(false);
    onGroupUpdate(group._id); // Notify parent component to update group data
    fetchBets(); // Re-fetch bets to update members
  };

  return (
    <div className="group-details">
      <button onClick={onBack} className="back-button">← Back to Groups</button>
      <h2>{group.name}</h2>
      <p>{group.description || 'No description provided.'}</p>

      <div>
        {placeBet ? (
          <>
            <GroupBet group={group} onBetAdded={handleBetAdded}/>
            <button onClick={() => setPlaceBet(false)} className="cancel-button">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setPlaceBet(true)} className="place-bet-button">
            Place Bet
          </button>
        )}
      </div>

            <h3>Members</h3>
      <div>
        {!showAddUser && !showRemoveMembers && (
          <>
            <button onClick={() => setShowAddUser(true)}>Add Member</button>
            <button onClick={() => setShowRemoveMembers(true)}>Remove Members</button>
          </>
        )}
        
        {showAddUser && (
          <UserSearch
            groupId={group._id}
            onUserAdded={handleMembershipChange}
            onCancel={() => setShowAddUser(false)}
          />
        )}
        
        {showRemoveMembers && (
          <RemoveMembers
            groupId={group._id}
            members={group.members}
            onMemberRemoved={handleMembershipChange}
            onCancel={() => setShowRemoveMembers(false)}
          />
        )}
      </div>

      {!showAddUser && !showRemoveMembers && (
        <ul>
          {group.members.map((member) => (
            <li key={member.user._id}>
              {member.user.username} - Balance: {member.balance}
            </li>
          ))}
        </ul>
      )}

      <h3>Active Bets</h3>
      {loadingBets ? (
        <p>Loading bets...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : bets.length === 0 ? (
        <p>No active bets available.</p>
      ) : (
        <ul>
          {bets.map(bet => (
            <li key={bet._id}>
              <strong>{bet.description}</strong> — Amount: {bet.amount} — Placed by: {bet.placedBy.username} — Deadline: {new Date(bet.deadline).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
