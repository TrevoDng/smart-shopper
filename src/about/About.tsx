// pages/About.tsx
import React from 'react';
import './About.css';
import { useSlider } from '../slider/slidercontext/SliderContext';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
}

interface StatItem {
  id: number;
  value: string;
  label: string;
}

const About: React.FC = () => {

  const navigate = useNavigate();
  const { hideSlider }= useSlider();
    hideSlider();

  const stats: StatItem[] = [
    { id: 1, value: '10K+', label: 'Happy Customers' },
    { id: 2, value: '5K+', label: 'Products' },
    { id: 3, value: '50+', label: 'Brands' },
    { id: 4, value: '24/7', label: 'Support' },
  ];

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Founder & CEO',
      image: '/images/team/john-doe.jpg',
      bio: '10+ years in e-commerce industry',
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Head of Operations',
      image: '/images/team/jane-smith.jpg',
      bio: 'Supply chain optimization expert',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'Customer Experience Lead',
      image: '/images/team/mike-johnson.jpg',
      bio: 'Passionate about customer satisfaction',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      role: 'Product Manager',
      image: '/images/team/sarah-williams.jpg',
      bio: 'Curating the best products for you',
    },
  ];

  const toHomePage=()=> {
    navigate('/')
  }

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">Our Story</h1>
          <p className="hero-subtitle">
            We're on a mission to provide the best shopping experience
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <h2 className="section-title">How It All Started</h2>
              <p className="story-text">
                Founded in 2020, our e-commerce platform began with a simple idea: 
                make quality products accessible to everyone. What started as a small 
                online store has grown into a trusted marketplace serving thousands of 
                customers worldwide.
              </p>
              <p className="story-text">
                We believe in the power of community and strive to create meaningful 
                connections between our customers and the products they love. Every 
                purchase supports our mission to make online shopping more personal, 
                reliable, and enjoyable.
              </p>
            </div>
            <div className="story-image">
              <img 
                src="/images/about-story.jpg" 
                alt="Our story" 
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.id} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3 className="mission-title">Our Mission</h3>
              <p className="mission-text">
                To provide high-quality products at competitive prices while 
                ensuring exceptional customer service and sustainable practices.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">👁️</div>
              <h3 className="mission-title">Our Vision</h3>
              <p className="mission-text">
                To become the world's most customer-centric e-commerce platform, 
                where people can discover and buy anything online.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💪</div>
              <h3 className="mission-title">Our Values</h3>
              <p className="mission-text">
                Integrity, innovation, customer obsession, and long-term thinking 
                guide everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title text-center">Meet Our Team</h2>
          <p className="section-subtitle text-center">
            The passionate people behind your favorite products
          </p>
          
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-image">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="img-fluid"
                  />
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Start Shopping?</h2>
          <p className="cta-text">
            Join thousands of satisfied customers and experience the difference
          </p>
          <button className="cta-button" 
          onClick={toHomePage}>
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;