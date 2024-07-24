import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginCard from './components/LoginCard';
import RegisterCard from './components/RegisterCard';
import Home from './components/Home';
import GenerateQRCodePage from './components/GenerateQRCodePage';
import UpdateInventory from './components/UpdateInventory'; // Import the new component
import AuthContext, { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/register" element={<RegisterRoute />} />
            <Route path="/generate-qrcode" element={<GenerateQRCodeRoute />} />
            <Route path="/" element={<HomeRoute />} />
            <Route path="/update-inventory/:id" element={<UpdateInventory />} /> 
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const LoginRoute = () => {
  const { user } = React.useContext(AuthContext);
  return user ? <Navigate to="/" /> : <LoginCard />;
};

const RegisterRoute = () => {
  const { user } = React.useContext(AuthContext);
  return user ? <Navigate to="/" /> : <RegisterCard />;
};

const HomeRoute = () => {
  return <Home />;
};

const GenerateQRCodeRoute = () => {
  const { user } = React.useContext(AuthContext);
  return user ? <GenerateQRCodePage /> : <Navigate to="/login" />;
};

export default App;
