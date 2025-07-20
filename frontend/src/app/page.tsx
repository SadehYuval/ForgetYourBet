'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/auth');
  };

  return (
    <main style={{ padding: '2rem' }}>
      <div>
        <h1>Welcome to ForgetYourBet</h1>
        <button
          onClick={handleClick}
          className="go-auth-button"
        >
          Login / Register
        </button>
      </div>
    </main>
  );
}
