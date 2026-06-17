import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
const socket = io(SERVER_URL);

export default function AdminPage() {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    socket.on('gameState', (state) => {
      setGameState(state);
    });
    return () => socket.off('gameState');
  }, []);

  const handleUpdateRound = (round, status) => {
    const newState = {
      rounds: {
        ...gameState.rounds,
        [round]: status
      }
    };
    // Optimistic UI update
    setGameState({ ...gameState, ...newState });
    // Emit to server
    socket.emit('updateAdminState', newState);
  };

  if (!gameState) {
    return (
      <div style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div className="pulse" style={{ width: '20px', height: '20px', backgroundColor: 'var(--primary)', borderRadius: '50%' }}></div>
        <span style={{ marginLeft: '1rem' }}>Menghubungkan ke server...</span>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '700', letterSpacing: '1px', marginBottom: '0.5rem' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Atur Kemenangan Dadu Warna secara Real-time</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {[1, 2, 3].map((round) => {
          const currentStatus = gameState.rounds[round];
          return (
            <div key={round} className="glass" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '20px' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Ronde {round}
                </h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Status: <strong style={{ color: currentStatus === 'user_lose' ? 'var(--danger)' : 'var(--success)' }}>
                    {currentStatus === 'user_lose' ? 'Admin Menang (User Kalah)' : 'User Menang (Admin Kalah)'}
                  </strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn"
                  style={{ 
                    backgroundColor: currentStatus === 'user_lose' ? 'var(--danger)' : 'rgba(255,255,255,0.05)',
                    color: currentStatus === 'user_lose' ? 'white' : 'var(--text-muted)',
                    border: currentStatus === 'user_lose' ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent',
                    boxShadow: currentStatus === 'user_lose' ? '0 4px 12px rgba(239, 68, 68, 0.4)' : 'none'
                  }}
                  onClick={() => handleUpdateRound(round, 'user_lose')}
                >
                  Admin Menang
                </button>
                <button 
                  className="btn"
                  style={{ 
                    backgroundColor: currentStatus === 'user_win' ? 'var(--success)' : 'rgba(255,255,255,0.05)',
                    color: currentStatus === 'user_win' ? 'white' : 'var(--text-muted)',
                    border: currentStatus === 'user_win' ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent',
                    boxShadow: currentStatus === 'user_win' ? '0 4px 12px rgba(34, 197, 94, 0.4)' : 'none'
                  }}
                  onClick={() => handleUpdateRound(round, 'user_win')}
                >
                  User Menang
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h4 style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
          ℹ️ Info Penting
        </h4>
        <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>Admin Menang:</strong> Warna dadu yang keluar <em>tidak akan sama</em> dengan pilihan user (User Kalah).</li>
          <li><strong>User Menang:</strong> Warna dadu yang keluar <em>pasti sama</em> dengan pilihan user.</li>
        </ul>
      </div>
    </div>
  );
}
