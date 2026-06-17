import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

import DashboadPage from "./pages/Dashboard/DashboardPage";
import DocumentDetailPage from "./pages/Documents/DocumentDetailPage";
import DocumentListPage from "./pages/Documents/DocumentListPage";
import FlashcardPage from "./pages/Flashcards/FlashcardPage"; 
import FlashcardsListPage from './pages/Flashcards/FlashcardsListPage';
import QuizResultPage from "./pages/Quizzes/QuizResultPage";
import QuizTakePage from "./pages/Quizzes/QuizzestakePage";
import ProfilePage from "./pages/Profile/ProfilePage"; 
import { useAuth } from './context/AuthContext';

// IMPORTANT: AppLayout ko yahan import karein
import AppLayout from './components/layout/AppLayout'; 

// ProtectedRoute Component - Isme humne Layout add kar diya hai
const ProtectedRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jab user authenticated hoga, tab Layout render hoga aur uske andar Outlet (Pages)
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading.....</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Public Routes - Inme Sidebar/Header nahi dikhega */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />

        {/* Protected Routes Wrapper - In sabhi pages par Sidebar/Header dikhega */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/dashboard" element={<DashboadPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardsListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;