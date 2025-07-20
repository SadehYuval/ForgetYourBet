// components/Group.tsx
'use client';

import { useState } from 'react';
import GroupBet from './group-bet';

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

export default function Group({ group, onBack }: { group: GroupType; onBack: () => void }) {
  const [placeBet, setPlaceBet] = useState(false);
  return (
    <div className="group-details">
      <button onClick={onBack} className="back-button">← Back to Groups</button>
      <h2>{group.name}</h2>
      <p>{group.description || 'No description provided.'}</p>

      <h3>
        {placeBet ? (
          <>
            <GroupBet />
            <button onClick={() => setPlaceBet(false)} className="cancel-button">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setPlaceBet(true)} className="place-bet-button">
            Place Bet
          </button>
        )}
      </h3>

      <h3>Members</h3>
      <ul>
        {group.members.map((member, idx) => (
          <li key={idx}>
            Username: {member.user.username} — Balance: {member.balance}
          </li>
        ))}
      </ul>
    </div>
  );
}
