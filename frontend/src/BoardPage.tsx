import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import api from './api/axios';

// --- TYPES ---
interface Task {
  id: string;
  content: string;
  order: number;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

// --- SUB-COMPONENT: TASK CARD (NEW: Handles Task Edit) ---
const TaskCard = ({ task, index, onDelete, onUpdate }: { task: Task, index: number, onDelete: (id: string) => void, onUpdate: () => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  const handleSave = async () => {
    if (!editContent.trim() || editContent === task.content) {
      setIsEditing(false);
      return;
    }
    try {
      await api.patch(`/tasks/${task.id}`, { content: editContent });
      setIsEditing(false);
      onUpdate(); // Update data
    } catch (error) {
      alert('Failed to update task');
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ 
            backgroundColor: snapshot.isDragging ? '#e6f7ff' : 'white',
            padding: '10px', borderRadius: '4px',
            boxShadow: snapshot.isDragging ? '0 5px 10px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.15)',
            marginBottom: '8px', fontSize: '14px', color: '#172b4d',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px',
            ...provided.draggableProps.style
          }}
        >
          {isEditing ? (
            <input 
              autoFocus
              type="text" 
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onBlur={handleSave} // Save when you click outside
              onKeyDown={(e) => e.key === 'Enter' && handleSave()} // Save with Enter
              style={{ flex: 1, padding: '4px', borderRadius: '3px', border: '2px solid #0079bf', outline: 'none' }}
            />
          ) : (
            <span 
              onClick={() => setIsEditing(true)} 
              style={{ flex: 1, cursor: 'text', wordBreak: 'break-word' }}
              title="Click to edit">
              {task.content}
            </span>
          )}
          
          {!isEditing && (
            <button 
              onClick={() => onDelete(task.id)} 
              style={{ border: 'none', background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>
              ×
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};

// --- SUB-COMPONENT: COLUMN (Updated with Edit Title) ---
const ColumnComponent = ({ column, onUpdate }: { column: Column, onUpdate: () => void }) => {
  const [newTaskContent, setNewTaskContent] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  // Rename Column Logic
  const handleSaveTitle = async () => {
    if (!editTitle.trim() || editTitle === column.title) {
      setIsEditingTitle(false);
      return;
    }
    try {
      await api.patch(`/columns/${column.id}`, { title: editTitle });
      setIsEditingTitle(false);
      onUpdate();
    } catch (error) {
      alert('Failed to update column title');
    }
  };

  const handleDeleteColumn = async () => {
    if(!window.confirm("Delete this list?")) return;
    try { await api.delete(`/columns/${column.id}`); onUpdate(); } 
    catch (error) { alert('Failed to delete column'); }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskContent.trim()) return;
    try {
      await api.post('/tasks', { content: newTaskContent, columnId: column.id });
      setNewTaskContent('');
      onUpdate();
    } catch (error) { alert('Failed to add task'); }
  };

  const handleDeleteTask = async (taskId: string) => {
    if(!window.confirm("Delete task?")) return;
    try { await api.delete(`/tasks/${taskId}`); onUpdate(); } 
    catch (error) { alert('Failed to delete task'); }
  };

  return (
    <div style={{ 
      minWidth: '280px', width: '280px',
      backgroundColor: '#ebecf0', borderRadius: '8px', padding: '10px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flexShrink: 0,
      display: 'flex', flexDirection: 'column', maxHeight: '100%'
    }}>
      {/* Header with Edit Mode */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
        {isEditingTitle ? (
          <input 
            autoFocus
            type="text" 
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
            style={{ flex: 1, padding: '4px', fontWeight: 600, borderRadius: '3px', border: '2px solid #0079bf' }}
          />
        ) : (
          <h4 
            onClick={() => setIsEditingTitle(true)}
            style={{ margin: 0, padding: '4px', fontSize:'15px', fontWeight: 600, color: '#172b4d', cursor: 'pointer', flex: 1 }}>
            {column.title}
          </h4>
        )}
        <button onClick={handleDeleteColumn} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b778c', fontSize: '18px' }}>×</button>
      </div>
      
      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ 
              flex: 1, overflowY: 'auto', marginBottom: '10px', display: 'flex', flexDirection: 'column',
              minHeight: '10px', backgroundColor: snapshot.isDraggingOver ? '#e2e4e9' : 'transparent', 
              transition: 'background-color 0.2s ease'
            }}
          >
            {column.tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index} 
                onDelete={handleDeleteTask} 
                onUpdate={onUpdate} 
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <form onSubmit={handleAddTask}>
        <input 
          type="text" placeholder="+ Add a card" 
          value={newTaskContent} onChange={(e) => setNewTaskContent(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: 'none', outline: 'none' }}
          onFocus={(e) => e.target.style.boxShadow = 'inset 0 0 0 2px #0079bf'}
          onBlur={(e) => { e.target.style.boxShadow = 'none'; if(!newTaskContent) e.target.value = ''; }}
        />
      </form>
    </div>
  );
};

// --- MAIN PAGE ---
export default function BoardPage() {
  const { boardId } = useParams();
  const [columns, setColumns] = useState<Column[]>([]);
  const navigate = useNavigate();

  const fetchColumns = () => {
    if (!boardId) return;
    api.get(`/columns/${boardId}`).then((res) => setColumns(res.data)).catch(console.error);
  };

  useEffect(() => { fetchColumns(); }, [boardId]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic UI Update
    const newColumns = [...columns];
    const sourceCol = newColumns.find(c => c.id === source.droppableId);
    const destCol = newColumns.find(c => c.id === destination.droppableId);
    if (!sourceCol || !destCol) return;

    const [movedTask] = sourceCol.tasks.splice(source.index, 1);
    // Temporary update order for the UI
    movedTask.order = destination.index; 
    destCol.tasks.splice(destination.index, 0, movedTask);
    setColumns(newColumns);

    try {
      await api.patch(`/tasks/${draggableId}/move`, {
        newColumnId: destination.droppableId,
        newOrder: destination.index
      });
    } catch (error) {
      alert("Failed to move task"); fetchColumns();
    }
  };

  // Add Column Logic (Simplified UI)
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const createCol = async () => {
    if(!newColumnTitle) return;
    await api.post('/columns', { title: newColumnTitle, boardId });
    setNewColumnTitle(''); setIsCreatingColumn(false); fetchColumns();
  }

  return (
    <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #0079bf 0%, #5067c5 100%)' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', color: 'white' }}>
        <button onClick={() => navigate('/')} style={{ cursor: 'pointer', padding: '6px 12px', border:'none', background:'rgba(255,255,255,0.3)', color: 'white', borderRadius:'4px' }}>← Back</button>
        <h2 style={{ margin:0 }}>Board Details</h2>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', height: '100%', alignItems: 'flex-start', paddingBottom: '20px' }}>
          
          {columns.map((col) => (
            <ColumnComponent key={col.id} column={col} onUpdate={fetchColumns} />
          ))}

          {/* Add Column Button */}
          <div style={{ minWidth: '280px', flexShrink: 0 }}>
             {!isCreatingColumn ? (
                <button onClick={() => setIsCreatingColumn(true)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.25)', border:'none', borderRadius:'8px', color:'white', textAlign:'left' }}>+ Add another list</button>
             ) : (
                <div style={{ background: '#ebecf0', padding:'8px', borderRadius:'8px'}}>
                  <input autoFocus value={newColumnTitle} onChange={e=>setNewColumnTitle(e.target.value)} style={{width:'100%', padding:'8px', marginBottom:'8px'}} />
                  <button onClick={createCol} style={{background:'#0079bf', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px'}}>Add list</button>
                  <button onClick={()=>setIsCreatingColumn(false)} style={{background:'transparent', border:'none'}}>×</button>
                </div>
             )}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}