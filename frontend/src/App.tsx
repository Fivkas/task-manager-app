import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import BoardPage from './BoardPage';

// Change the type from JSX.Element to React.ReactNode
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  // <>{children}</> is a React Fragment, it helps TypeScript understand what we are returning
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/board/:boardId" 
          element={
            <PrivateRoute>
              <BoardPage />
            </PrivateRoute>
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;