import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axios';

interface Board {
  id: string;
  title: string;
}

// --- SUB-COMPONENT: BOARD CARD (To have its own Edit State) ---
const BoardCard = ({ board, onDelete, onUpdate }: { board: Board, onDelete: (e: any, id: string) => void, onUpdate: () => void }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(board.title);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editTitle.trim() || editTitle === board.title) {
      setIsEditing(false);
      return;
    }

    try {
      await api.patch(`/boards/${board.id}`, { title: editTitle });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      alert('Failed to update board title');
    }
  };

  const handleCardClick = () => {
    if (!isEditing) {
      navigate(`/board/${board.id}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      style={{ 
        backgroundColor: '#fff', 
        borderRadius: '10px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '150px',
        border: '1px solid #edf2f7',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        
        {/* EDIT MODE LOGIC */}
        {isEditing ? (
          <input 
            autoFocus
            type="text" 
            value={editTitle}
            onClick={(e) => e.stopPropagation()} // To prevent the board from opening if we click on the input
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={() => handleSave()}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              width: '80%', 
              padding: '4px', 
              border: '2px solid #3182ce',
              borderRadius: '4px'
            }}
          />
        ) : (
          <h4 
            onClick={(e) => {
              e.stopPropagation(); // We stop the click so that the board does not open
              setIsEditing(true);
            }}
            title="Click to rename"
            style={{ 
              margin: 0, 
              fontSize: '18px', 
              color: '#2d3748', 
              maxWidth: '80%', 
              cursor: 'text',
              border: '1px solid transparent',
              padding: '2px' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.border = '1px dashed #cbd5e0'} // Visual effect that its editable
            onMouseLeave={(e) => e.currentTarget.style.border = '1px solid transparent'}
          >
            {board.title}
          </h4>
        )}
        
        {/* DELETE BUTTON */}
        {!isEditing && (
          <button 
            onClick={(e) => onDelete(e, board.id)}
            style={{ background: 'transparent', border: 'none', color: '#cbd5e0', fontSize: '20px', cursor: 'pointer', padding: '0 5px', lineHeight: 1 }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#e53e3e'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e0'}
            title="Delete Board"
          >
            ×
          </button>
        )}
      </div>
      
      {!isEditing && (
        <span style={{ marginTop: 'auto', color: '#3182ce', fontWeight: 600, fontSize: '14px' }}>
          Open Board →
        </span>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/users/me').then((res) => setUser(res.data)).catch(() => handleLogout());
    fetchBoards();
  }, []);

  const fetchBoards = () => {
    api.get('/boards').then((res) => setBoards(res.data)).catch((err) => console.error(err));
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle) return;
    try {
      await api.post('/boards', { title: newBoardTitle });
      setNewBoardTitle('');
      fetchBoards();
    } catch (error) { alert('Error creating board'); }
  };

  const handleDeleteBoard = async (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure?")) return;
    try { await api.delete(`/boards/${boardId}`); fetchBoards(); } 
    catch (error) { alert('Failed to delete board'); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  if (!user) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      <header style={{ backgroundColor: '#fff', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: 0, color: '#1a202c', fontSize: '24px' }}>Task Manager</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#3182ce', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{user.username.charAt(0).toUpperCase()}</div>
            <span style={{ fontWeight: 500 }}>{user.username}</span>
          </div>
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Logout</button>
        </div>
      </header>

      <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <section style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '40px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2d3748' }}>Create New Board</h3>
          <form onSubmit={handleCreateBoard} style={{ maxWidth: '500px', margin: '0 auto' }}>
            <input type="text" placeholder="e.g. Website Launch..." value={newBoardTitle} onChange={(e) => setNewBoardTitle(e.target.value)} style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', marginBottom: '15px', outline: 'none' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>Create Board</button>
          </form>
        </section>

        <section>
          <h3 style={{ color: '#4a5568', marginBottom: '20px', fontSize: '20px' }}>My Boards</h3>
          {boards.length === 0 ? <p style={{ color: '#718096' }}>No boards created yet.</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
              {boards.map((board) => (
                <BoardCard 
                  key={board.id} 
                  board={board} 
                  onDelete={handleDeleteBoard} 
                  onUpdate={fetchBoards} 
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}