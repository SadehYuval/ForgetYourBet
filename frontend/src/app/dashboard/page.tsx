// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Groups from '../components/Groups';
import PlaceBet from '../components/PlaceBet';
import PersonalInfo from '../components/personal-info';

type Tab = 'personal-info' | 'groups' | 'place-bet';

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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('personal-info');

  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [groupError, setGroupError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/');
    } else {
      setUser(JSON.parse(stored));
    }
  }, [router]);

  useEffect(() => {
    async function fetchGroups() {
      setLoadingGroups(true);
      setGroupError(null);
      try {
        const res = await fetch('http://localhost:5000/groups/my-groups', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error('Failed to fetch groups');

        const data: GroupType[] = await res.json();
        setGroups(data);
      } catch (err) {
        setGroupError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoadingGroups(false);
      }
    }

    if (token) fetchGroups();
  }, [token]);

  if (!user) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user.username}!</h1>
        <p>This is your dashboard where you can manage your bets.</p>

        <nav className="dashboard-navbar">
          <button onClick={() => setActiveTab('personal-info')} className={activeTab === 'personal-info' ? 'active' : ''}>
            Personal Info
          </button>
          <button onClick={() => setActiveTab('groups')} className={activeTab === 'groups' ? 'active' : ''}>
            Groups
          </button>
          <button onClick={() => setActiveTab('place-bet')} className={activeTab === 'place-bet' ? 'active' : ''}>
            Place Bet
          </button>
        </nav>
      </header>

      <main className="dashboard-content">
        {activeTab === 'personal-info' && <PersonalInfo userName={user.username} />}
        {activeTab === 'groups' && (
          <Groups
            groups={groups}
            loading={loadingGroups}
            error={groupError}
          />
        )}
        {activeTab === 'place-bet' && <PlaceBet groups={groups}/>}
      </main>
    </div>
  );
}
