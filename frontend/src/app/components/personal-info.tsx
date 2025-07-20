import { useState, useEffect } from 'react';
import GetPersonalBets from './GetPersonalBets';
import PersonalBet from './personal-bet';

type BetType = {
  _id: string;
  description: string;
  amount: number;
  deadline: Date;
  placedBy: {
    email: string;
    username: string;
  };
}

export default function PersonalInfo({userName}: {userName: string}) {
  const [bets, setBets] = useState<BetType[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [addBet, setAddBet] = useState(false);
  

  const fetchBets = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized. Please log in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/bets/personal-bets', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch personal bets');
      }

      const data = await response.json();
      setBets(data);
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
  }, []);

  const handleBetAdded = () => {
    fetchBets(); // Re-fetch the bets list
  };
  return (
    <>
      <div>
        <p>This is where {userName} can view and edit personal information.</p>
        {error ? (
          <p>Error: {error}</p>
        ) : loading ? (
          <p>Loading personal bets...</p>
        ) : bets.length === 0 ? (
          <p>No personal bets found.</p>
        ) : (
          <GetPersonalBets bets={bets} error={error} />
        )}
      </div>
      <div>
        {addBet && <PersonalBet onBetAdded={handleBetAdded} />}
        <button onClick={() => setAddBet(!addBet)}>
          {addBet ? 'Cancel' : 'Create Personal Bet'}
        </button>
      </div>
    </>
  );
}