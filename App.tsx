import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import DummyDashboard from './pages/DummyDashboard';
import Layout from './components/Layout';

// Protected route component that checks authentication and user role
const ProtectedRoute = ({
  children,
  requiredRole
}: {
  children: JSX.Element,
  requiredRole?: string
}) => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userData?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { currentUser, userData } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        currentUser ? (
          userData?.role === 'admin' ?
            <Navigate to="/admin" replace /> :
            <Navigate to="/dashboard" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      <Route path="/login" element={
        currentUser ? (
          userData?.role === 'admin' ?
            <Navigate to="/admin" replace /> :
            <Navigate to="/dashboard" replace />
        ) : (
          <Login />
        )
      } />

      <Route path="/signup" element={
        currentUser ? (
          userData?.role === 'admin' ?
            <Navigate to="/admin" replace /> :
            <Navigate to="/dashboard" replace />
        ) : (
          <Signup />
        )
      } />

      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/patient" element={
        <ProtectedRoute requiredRole="patient">
          <Layout>
            <PatientDashboard />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <DummyDashboard />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App; 