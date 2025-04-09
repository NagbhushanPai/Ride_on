import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import CycleContext from '../../context/cycle/cycleContext';
import CycleItem from '../cycles/CycleItem';
import SearchForm from '../cycles/SearchForm';

const Home = () => {
  const authContext = useContext(AuthContext);
  const cycleContext = useContext(CycleContext);
  const { loadUser } = authContext;
  const { cycles, getCycles, loading, filtered } = cycleContext;
  const [displayCount, setDisplayCount] = useState(4);

  useEffect(() => {
    loadUser();
    getCycles();
    // eslint-disable-next-line
  }, []);

  const displayedCycles = filtered || cycles;
  const featuredCycles = displayedCycles.slice(0, displayCount);

  return (
    <>
      {/* Hero Section */}
      <section className="rb-hero">
        <div className="rb-container">
          <div className="rb-hero-content">
            <h1 className="rb-hero-title">Explore the City on Two Wheels</h1>
            <p className="rb-hero-subtitle">Choose from our premium selection of cycles for your next adventure</p>
          </div>
        </div>
      </section>

      {/* Search Box */}
      <section className="rb-search-container">
        <div className="rb-container">
          <SearchForm />
        </div>
      </section>

      {/* Featured Bikes Section */}
      <section className="rb-product-section">
        <div className="rb-container">
          <h2 className="rb-section-title">Featured Bicycles</h2>
          
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              <div className="rb-bikes-grid">
                {featuredCycles.map(cycle => (
                  <CycleItem key={cycle._id} cycle={cycle} />
                ))}
              </div>
              <div className="rb-view-all">
                <Link to="/cycles" className="rb-btn rb-btn-primary">View All Cycles</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="rb-benefits">
        <div className="rb-container">
          <h2 className="rb-section-title">Why Choose CyclePath?</h2>
          <div className="rb-benefits-grid">
            <div className="rb-benefit-card">
              <div className="rb-benefit-icon">
                <i className="fas fa-medal"></i>
              </div>
              <h3 className="rb-benefit-title">Premium Cycles</h3>
              <p className="rb-benefit-text">Quality bikes maintained to the highest standards for a smooth ride experience.</p>
            </div>
            <div className="rb-benefit-card">
              <div className="rb-benefit-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3 className="rb-benefit-title">Easy Booking</h3>
              <p className="rb-benefit-text">Simple and flexible reservation system to get you riding with minimal hassle.</p>
            </div>
            <div className="rb-benefit-card">
              <div className="rb-benefit-icon">
                <i className="fas fa-map-marked-alt"></i>
              </div>
              <h3 className="rb-benefit-title">Multiple Locations</h3>
              <p className="rb-benefit-text">Convenient pickup and drop-off points throughout the city for your convenience.</p>
            </div>
            <div className="rb-benefit-card">
              <div className="rb-benefit-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="rb-benefit-title">Safety First</h3>
              <p className="rb-benefit-text">Helmets and safety gear included with every rental for your protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="rb-locations">
        <div className="rb-container">
          <h2 className="rb-section-title">Our Pickup Locations</h2>
          <div className="rb-locations-grid">
            <div className="rb-location-card">
              <h3 className="rb-location-name">Downtown Center</h3>
              <p className="rb-location-address">123 Main St, City Center</p>
              <Link to="/cycles" className="rb-location-link">View Bikes</Link>
            </div>
            <div className="rb-location-card">
              <h3 className="rb-location-name">Uptown Shop</h3>
              <p className="rb-location-address">456 North Ave, Uptown Area</p>
              <Link to="/cycles" className="rb-location-link">View Bikes</Link>
            </div>
            <div className="rb-location-card">
              <h3 className="rb-location-name">Riverside Hub</h3>
              <p className="rb-location-address">789 River Rd, Riverside</p>
              <Link to="/cycles" className="rb-location-link">View Bikes</Link>
            </div>
            <div className="rb-location-card">
              <h3 className="rb-location-name">Parkside Station</h3>
              <p className="rb-location-address">101 Park Blvd, Near City Park</p>
              <Link to="/cycles" className="rb-location-link">View Bikes</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home; 