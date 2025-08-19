// components/Groups.tsx
'use client';

import { useState } from 'react';
import Group from './Group';

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

type GroupsProps = {
  groups: GroupType[];
  loading: boolean;
  error: string | null;
};

export default function Groups({ groups, loading, error }: GroupsProps) {
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);


  return (
    <>
      <h2>My Groups</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {groups.length === 0 && !loading && <p>You are not part of any group.</p>}

      {selectedGroup ? (
        <Group group={selectedGroup} onBack={() => setSelectedGroup(null)} />
      ) : (
        <div className="groups-list">
          <ul>
            {groups.map((group) => (
              <li key={group._id}>
                <button onClick={() => setSelectedGroup(group)}>{group.name}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
