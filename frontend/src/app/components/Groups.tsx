'use client';

import { useEffect, useState } from 'react';
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
    userId: string;
    token: string;
};

export default function Groups({ userId, token }: GroupsProps) {
    const [groups, setGroups] = useState<GroupType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);

    useEffect(() => {
        async function fetchGroups() {
            setLoading(true);
            setError(null);
            try{
                const res = await fetch('http://localhost:5000/groups/my-groups', {
                    headers: token ? {Authorization: `Bearer ${token}`} : {},   
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch groups');
                }

                const data: GroupType[] = await res.json();
                setGroups(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            } finally{
                setLoading(false);
            }
        }
        fetchGroups();

    }, [userId, token]);

    return (
        <>
            <h2>My Groups</h2>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {groups.length === 0 && !loading && <p>Your are not a part of any group</p>}
            {selectedGroup ? (
                <Group group={selectedGroup} onBack={() => setSelectedGroup(null)} />
            ) : (
                <div className = "groups-list:">
                    <h2>Your Groups</h2>
                    <ul>
                        {groups.map((group) =>(
                            <li key = {group._id}>
                                <button onClick = {() => setSelectedGroup(group)}>
                                    {group.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
        </>
    )
}