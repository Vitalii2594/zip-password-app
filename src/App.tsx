import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TrainingProvider } from './context/TrainingContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTraining from './pages/CreateTraining';
import TrainingDetails from './pages/TrainingDetails';
import ParticipantRegister from './pages/ParticipantRegister';

function App() {
  return (
    <AuthProvider>
      <TrainingProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/create-training" 
                  element={
                    <ProtectedRoute>
                      <CreateTraining />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/training/:id" 
                  element={
                    <ProtectedRoute>
                      <TrainingDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/register/:id" element={<ParticipantRegister />} />
              </Routes>
            </main>
          </div>
        </Router>
      </TrainingProvider>
    </AuthProvider>
  );
}

export default App;