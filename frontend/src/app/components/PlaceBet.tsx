import { useState } from 'react';
import PersonalBet from './personal-bet';
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

export default function PlaceBet({ groups }: { groups: GroupType[] }) {
  const [betType, setBetType] = useState<'personal' | 'group'>('personal');
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  const selectedGroup = groups.find(g => g._id === selectedGroupId) || null;

  return (
    <div className="place-bet">
      <div className="bet-type-buttons">
        <button
          className={`bet-button ${betType === 'personal' ? 'active' : ''}`}
          onClick={() => setBetType('personal')}
        >
          Place Personal Bet
        </button>
        <button
          className={`bet-button ${betType === 'group' ? 'active' : ''}`}
          onClick={() => setBetType('group')}
        >
          Place Group Bet
        </button>
      </div>

      {betType === 'personal' ? (
        <PersonalBet />
      ) : (
        <div className="group-bet-section">
          <label htmlFor="groupSelect">Choose Group:</label>
          <select
            id="groupSelect"
            className="group-select"
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
          >
            <option value="">-- Select a Group --</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>

          {selectedGroup && (
            <GroupBet group={selectedGroup} />
          )}
        </div>
      )}
    </div>
  );
}
