import { Typography } from '@mui/material';
import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './link.css';

const AwesomeLink: FC<{
  path: string;
  text: string;
}> = ({ path, text }) => {
  const location = useLocation();
  return (
    <NavLink to={path} className="awesomeLink">
      <Typography>{text}</Typography>
      <svg viewBox="0 0 70 36" className="svgLink">
        <path
          stroke={path === location.pathname ? '#bbc1e1' : ''}
          d="M6.9739 30.8153H63.0244C65.5269 30.8152 75.5358 -3.68471 35.4998 2.81531C-16.1598 11.2025 0.894099 33.9766 26.9922 34.3153C104.062 35.3153 54.5169 -6.68469 23.489 9.31527"
        />
      </svg>
    </NavLink>
  );
};
export default AwesomeLink;
