// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Groups from '../components/Groups';
import PlaceBet from '../components/PlaceBet';
import PersonalInfo from '../components/personal-info';

type Tab =  'personal-info' | 'groups' | 'place-bet';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('personal-info');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/');
    } else {
      setUser(JSON.parse(stored));
    }
  }, [router]);

  if (!user) return <p>Loading dashboard...</p>;

  const token = localStorage.getItem('token') || '';

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user.username}!</h1>
        <p>This is your dashboard where you can manage your bets.</p>
        
        {/* Simple Navbar */}
        <nav className="dashboard-navbar">
          <button onClick={() => setActiveTab('personal-info')} className={activeTab === 'personal-info' ? 'active' : ''}>Personal Info</button>
          <button onClick={() => setActiveTab('groups')} className={activeTab === 'groups' ? 'active' : ''}>Groups</button>
          <button onClick={() => setActiveTab('place-bet')} className={activeTab === 'place-bet' ? 'active' : ''}>Place Bet</button>
        </nav>
      </header>

      <main className="dashboard-content">
        {activeTab === 'personal-info' && <PersonalInfo userName ={user.username}  />}
        {activeTab === 'groups' && <Groups userId={user.username} token={token} />}
        {activeTab === 'place-bet' && <PlaceBet />}
      </main>
    </div>
  );
}


