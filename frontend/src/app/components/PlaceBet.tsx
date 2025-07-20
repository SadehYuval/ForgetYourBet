import { useState } from 'react';
import PersonalBet from './personal-bet';
import GroupBet from './group-bet';

export default function PlaceBet() {
    const [betType, setBetType] = useState<'personal' | 'group'>('personal');
    return (
        <div>
            <button onClick={() => setBetType('personal')}>Place Personal Bet</button>
            <button onClick={() => setBetType('group')}>Place Group Bet</button>
            {betType === 'personal' ? (
                <PersonalBet />
            ) : (
                <GroupBet />
            )}
        </div>
    )
};