// components/Groups.tsx
'use client';

import { useState, useEffect } from 'react';
import Group from './Group';
import CreateGroup from './create-group';

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
  onGroupUpdate: (groupId: string) => void;
  onGroupAddition: () => void;
};

export default function Groups({ groups, loading, error, onGroupUpdate, onGroupAddition }: GroupsProps) {
  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);

  useEffect(() => {
    if (selectedGroup) {
      const updated = groups.find(g => g._id === selectedGroup._id);
      if (updated) {
        setSelectedGroup(updated);
      }
    }
  }, [groups, selectedGroup]);


  return (
    <>
      <h2>My Groups</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {groups.length === 0 && !loading && <p>You are not part of any group.</p>}

      {selectedGroup ? (
        <Group group={selectedGroup} onBack={() => setSelectedGroup(null)} onGroupUpdate = {onGroupUpdate} />
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
      <h2>Create Group:</h2>
      <CreateGroup onGroupAddition = {onGroupAddition} />
    </>
  );
}
