// src/components/common/DashboardCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardCard.css';

interface DashboardCardProps {
  title: string;
  icon: string;
  value?: string | number;
  description?: string;
  linkTo: string;
  badge?: number;
  color?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  value,
  description,
  linkTo,
  badge,
  color = '#4f46e5'
}) => {
  return (
    <Link to={linkTo} className="dashboard-card" style={{ borderTopColor: color }}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        {badge !== undefined && badge > 0 && (
          <span className="card-badge">{badge}</span>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        {value !== undefined && (
          <p className="card-value">{value}</p>
        )}
        {description && (
          <p className="card-description">{description}</p>
        )}
      </div>
      <div className="card-footer">
        <span className="card-link">View Details →</span>
      </div>
    </Link>
  );
};

export default DashboardCard;