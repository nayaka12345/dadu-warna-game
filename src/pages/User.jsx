import React, { useState, useEffect } from 'react';
import { Plus, Trophy, MessageCircle, Gift, Sparkles, Bell, User as UserIcon, Star, Target, Gamepad2 } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue } from "firebase/database";

const COLORS = [
  { id: 'red', value: '#ef4444', label: 'MERAH' },
  { id: 'blue', value: '#3b82f6', label: 'BIRU' },
  { id: 'green', value: '#22c55e', label: 'HIJAU' },
  { id: 'yellow', value: '#eab308', label: 'KUNING' },
  { id: 'purple', value: '#a855f7', label: 'UNGU' }
];

const LEADERBOARD = [
  { name: 'Player One', score: 1250, badge: 'Grandmaster' },
  { name: 'Kiki_Pro', score: 980, badge: 'Master' },
  { name: 'Sultan_Muda', score: 750, badge: 'Diamond' },
  { name: 'Dadu_King', score: 620, badge: 'Platinum' },
  { name: 'Noob_Slayer', score: 400, badge: 'Gold' },
];

export default function UserPage() {
  const [gameState, setGameState] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [results, setResults] = useState([null, null, null]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const gameRef = ref(db, 'gameState');
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameState(data);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSelectColor = (color) => {
    if (currentRound === 1 && !results[0]) {
      setSelectedColor(color);
    }
  };

  const handleShuffle = () => {
    if (!selectedColor) {
      alert("Pilih warna jagoanmu dulu sebelum mengocok dadu!");
      return;
    }
    if (currentRound > 3) return;

    setIsShuffling(true);

    setTimeout(() => {
      const outcome = gameState?.rounds[currentRound];
      let resultColor;

      if (outcome === 'user_win') {
        resultColor = selectedColor;
        setScore(prev => prev + 1); // Tambah skor +1 untuk tiap warna yang sama
      } else {
        const otherColors = COLORS.filter(c => c.id !== selectedColor.id);
        resultColor = otherColors[Math.floor(Math.random() * otherColors.length)];
      }

      const newResults = [...results];
      newResults[currentRound - 1] = resultColor;
      setResults(newResults);
      setCurrentRound(prev => prev + 1);
      setIsShuffling(false);
    }, 1500); 
  };

  const resetGame = () => {
    setSelectedColor(null);
    setCurrentRound(1);
    setResults([null, null, null]);
    setScore(0);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '4rem' }}>
      
      {/* Header Premium (Non-Gambling) */}
      <header className="site-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>
            <Gamepad2 color="white" size={28} />
          </div>
          <h2 style={{ color: 'white', fontWeight: '900', fontSize: '1.8rem', letterSpacing: '1px' }}>
            DADU<span style={{ color: '#3b82f6' }}>MASTER</span>
          </h2>
        </div>

        <div className="user-profile">
          <button className="btn-store">
            <Gift size={18} /> TOKO HADIAH
          </button>
          <div className="vvip-badge">
            <Star size={16} /> PRO PLAYER
          </div>
          <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(45deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white', boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)' }}>
            <UserIcon size={24} color="white" />
          </div>
        </div>
      </header>

      {/* Marquee Running Text - Fun Gaming Theme */}
      <div className="marquee-container">
        <Bell size={20} color="#fbbf24" style={{ marginRight: '15px', minWidth: '20px' }} />
        <div className="marquee-content">
          🎮 SELAMAT DATANG DI DADU MASTER! 🎮 | 🏆 KUMPULKAN POIN TERTINGGI DAN JADILAH TOP GLOBAL! 🏆 | 🌟 IKUTI EVENT MINGGUAN UNTUK MENDAPATKAN HADIAH MENARIK 🌟 | ⚡ MAIN BARENG TEMAN LEBIH SERU! ⚡
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '2rem', flex: 1, display: 'flex', gap: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* Left Sidebar - Mini Games & Missions */}
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="sidebar-panel">
            <h3 style={{ color: 'white', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              <Target color="#fbbf24" /> MISI HARIAN
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { title: 'Main 5 Kali', done: true },
                { title: 'Tebak Benar 3 Warna', done: false },
                { title: 'Share ke Teman', done: false }
              ].map((mission, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: mission.done ? 'var(--text-muted)' : 'white', textDecoration: mission.done ? 'line-through' : 'none' }}>{mission.title}</span>
                  {mission.done && <span style={{ color: '#22c55e' }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center - Game Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Promotional Event Banner */}
          <div className="banner">
            <div className="banner-content">
              <span className="badge-event" style={{ fontSize: '1rem', padding: '0.25rem 0.75rem', marginBottom: '1rem', display: 'inline-block' }}>EVENT SPESIAL</span>
              <h3 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                PESTA WARNA AKHIR PEKAN
              </h3>
              <p style={{ opacity: 0.9, fontSize: '1rem', fontWeight: '600' }}>Raih skor sempurna 3/3 untuk dapat medali eksklusif!</p>
            </div>
            <Sparkles size={80} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.4))' }} />
          </div>

          {/* GAME PANEL */}
          <div className="glass-panel" style={{ width: '100%', textAlign: 'center', position: 'relative', border: '2px solid rgba(255,255,255,0.1)' }}>
            
            <h1 style={{ marginBottom: '0.5rem', color: 'white', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '1px' }}>
              ARENA DADU WARNA
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontWeight: '600', fontSize: '1.1rem' }}>
              Uji keberuntunganmu, tebak warna yang akan keluar!
            </p>
            
            {/* Selected Color and Results Box */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5rem', marginBottom: '4rem', background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              
              {/* Selected Color Box (+) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '1rem', color: '#3b82f6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  PILIHANMU
                </div>
                <div 
                  className={`empty-box ${selectedColor ? 'filled pulse' : ''}`}
                  style={{ 
                    backgroundColor: selectedColor ? selectedColor.value : 'rgba(0,0,0,0.5)',
                    width: '100px', height: '100px', borderRadius: '24px',
                    boxShadow: selectedColor ? '0 0 30px ' + selectedColor.value + ', inset 0 0 15px rgba(0,0,0,0.5)' : 'none',
                    border: selectedColor ? '5px dashed white' : '3px dashed #475569'
                  }}
                >
                  {!selectedColor && <Plus size={40} color="#64748b" />}
                </div>
              </div>

              {/* 3 Result Boxes & Score */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                
                {/* Score Board Above The Boxes */}
                <div className="score-board">
                  <Trophy size={24} color="#fbbf24" />
                  <span>SKOR MATCH INI: <strong>{score} / 3</strong></span>
                </div>

                <div style={{ fontSize: '1rem', color: 'white', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  HASIL KOCOKAN
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '20px' }}>
                  {results.map((res, idx) => (
                    <div 
                      key={idx}
                      className={`empty-box ${res ? 'filled' : ''} ${isShuffling && currentRound === idx + 1 ? 'shuffling' : ''}`}
                      style={{ 
                        backgroundColor: res ? res.value : 'rgba(0,0,0,0.5)',
                        width: '80px', height: '80px', borderRadius: '16px',
                        opacity: (currentRound < idx + 1 && !res) ? 0.4 : 1,
                        border: res ? '3px solid white' : '2px solid #334155',
                        boxShadow: res ? '0 0 20px ' + res.value : 'none'
                      }}
                    >
                      {!res && !(isShuffling && currentRound === idx + 1) && (
                        <span style={{ color: '#475569', fontSize: '2rem', fontWeight: '900' }}>{idx + 1}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Available Colors */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1.5rem', fontWeight: '800', textTransform: 'uppercase' }}>
                PILIH WARNA KESUKAANMU
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                {COLORS.map(color => (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }} key={color.id}>
                    <div
                      className={`color-box ${selectedColor?.id === color.id ? 'selected' : ''} ${currentRound > 1 ? 'disabled' : ''}`}
                      style={{ 
                        backgroundColor: color.value, 
                        width: '80px', height: '80px', borderRadius: '16px',
                        border: '3px solid rgba(255,255,255,0.2)'
                      }}
                      onClick={() => handleSelectColor(color)}
                    />
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>{color.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: '2rem' }}>
              {currentRound <= 3 ? (
                <button 
                  className={`spin-btn ${isShuffling ? 'shuffling' : ''}`}
                  onClick={handleShuffle}
                  disabled={!selectedColor || isShuffling || !gameState}
                >
                  {isShuffling ? '🎲 MENGACAK DADU...' : (!gameState ? '⏳ MENUNGGU PENGATURAN ADMIN...' : `KOCOK RONDE ${currentRound}`)}
                </button>
              ) : (
                <div className="animate-pop" style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '2rem', borderRadius: '20px', border: '2px solid #3b82f6' }}>
                  <h2 style={{ color: '#60a5fa', marginBottom: '0.5rem', fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase' }}>PERMAINAN SELESAI!</h2>
                  <p style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1.5rem' }}>Kamu berhasil menebak <strong>{score} warna</strong> dengan benar.</p>
                  <button 
                    onClick={resetGame} 
                    style={{ background: '#3b82f6', color: 'white', width: '100%', padding: '1.5rem', borderRadius: '16px', fontSize: '1.5rem', fontWeight: '900', border: 'none', cursor: 'pointer', textTransform: 'uppercase', boxShadow: '0 5px 15px rgba(59, 130, 246, 0.4)' }}
                  >
                    Mulai Main Lagi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Leaderboard */}
        <div style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
          <div className="sidebar-panel">
            <h3 style={{ color: 'white', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
              <Trophy color="#fbbf24" /> TOP PLAYERS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {LEADERBOARD.map((player, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '30px', fontWeight: '900', color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : '#475569', fontSize: '1.2rem' }}>
                    #{i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'white' }}>{player.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{player.badge}</div>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: '800' }}>
                    {player.score} Pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Floating Chat Button */}
      <div className="floating-chat">
        <MessageCircle size={32} />
      </div>

    </div>
  );
}
