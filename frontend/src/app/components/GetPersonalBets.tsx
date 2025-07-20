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

interface GetPersonalBetsProps {
  bets: BetType[];
  error: string;
}

export default function GetPersonalBets({ bets, error }: GetPersonalBetsProps) {
  return (
    <div>
      <h2>Personal Bets</h2>
      {error && <p>{error}</p>}
      <ul>
        {bets.map((bet) => (
          <li key={bet._id}>
            <p>Description: {bet.description}</p>
            <p>Amount: ${bet.amount}</p>
            <p>Deadline: {new Date(bet.deadline).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}