import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page components
import Home from './components/pages/Home';
import Cycles from './components/pages/Cycles';
import CycleDetails from './components/pages/CycleDetails';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';
import Bookings from './components/pages/Bookings';
import BookingDetails from './components/pages/BookingDetails';
import Profile from './components/pages/Profile';
import About from './components/pages/About';
import NotFound from './components/pages/NotFound';

// Auth components
import PrivateRoute from './components/routing/PrivateRoute';

// Context
import AuthState from './context/auth/AuthState';
import CycleState from './context/cycle/CycleState';
import BookingState from './context/booking/BookingState';
import AlertState from './context/alert/AlertState';

// CSS
import './App.css';

const App = () => {
  return (
    <AuthState>
      <CycleState>
        <BookingState>
          <AlertState>
            <Router>
              <div className="app-container">
                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cycles" element={<Cycles />} />
                    <Route path="/cycles/:id" element={<CycleDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
                    <Route path="/bookings" element={<PrivateRoute component={Bookings} />} />
                    <Route path="/bookings/:id" element={<PrivateRoute component={BookingDetails} />} />
                    <Route path="/profile" element={<PrivateRoute component={Profile} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <ToastContainer position="bottom-right" autoClose={3000} />
              </div>
            </Router>
          </AlertState>
        </BookingState>
      </CycleState>
    </AuthState>
  );
};

export default App; 