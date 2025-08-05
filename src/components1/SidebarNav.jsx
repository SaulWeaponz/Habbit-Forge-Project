import { NavLink, Stack, Box } from '@mantine/core';
import {
  IconGauge, IconUserCircle, IconCategory, IconQuote,
  IconBulb, IconChartBar
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';

function SidebarNav() {
  const location = useLocation();

  const links = [
    { icon: IconGauge, label: 'Dashboard', path: '/admin' },
    { icon: IconUserCircle, label: 'Admin Profile', path: '/admin/profile' },
    { icon: IconCategory, label: 'Habit Categories', path: '/admin/categories' },
    { icon: IconQuote, label: 'Motivational Quotes', path: '/admin/quotes' },
    { icon: IconBulb, label: 'Habit Tips', path: '/admin/tips' },
    { icon: IconChartBar, label: 'Analytics Section', path: '/admin/analytics' },
  ];

  const blue = '#228be6';
  const cyan = '#15aabf';
  const lightBlue = '#e7f5ff';
  const borderColor = '#e9ecef';
  const orange = '#ff922b';
  const orangeLight = '#ffa94d';
  const orangeBg = 'rgba(255, 146, 43, 0.10)';

  const items = links.map((item) => {
    const isActive = location.pathname === item.path;
    return (
      <NavLink
        key={item.label}
        component={Link}
        to={item.path}
        label={
          <span
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              marginLeft: 14,
              color: isActive ? orange : '#222',
              transition: 'color 0.2s',
            }}
            className="sidebar-nav-label"
          >
            {item.label}
          </span>
        }
        leftSection={<item.icon size="1.5rem" stroke={2} color={isActive ? orange : '#222'} className="sidebar-nav-icon" />}
        active={isActive}
        variant="filled"
        style={{
          paddingTop: 12,
          paddingBottom: 12,
          borderLeft: isActive ? `4px solid ${orange}` : '4px solid transparent',
          background: isActive ? 'rgba(255,255,255,0.85)' : 'transparent',
          borderRadius: 10,
          marginBottom: 6,
          fontWeight: 600,
          fontSize: '1.1rem',
          transition: 'background 0.2s, border-color 0.2s',
          boxShadow: isActive ? '0 2px 8px rgba(255,146,43,0.08)' : undefined,
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.background = orangeBg;
            const label = e.currentTarget.querySelector('.sidebar-nav-label');
            if (label) label.style.color = orangeLight;
            const icon = e.currentTarget.querySelector('.sidebar-nav-icon');
            if (icon) icon.style.color = orangeLight;
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.background = '';
            const label = e.currentTarget.querySelector('.sidebar-nav-label');
            if (label) label.style.color = '#222';
            const icon = e.currentTarget.querySelector('.sidebar-nav-icon');
            if (icon) icon.style.color = '#222';
          }
        }}
      />
    );
  });

  return (
    <Box style={{
      background: 'linear-gradient(120deg, #fff3e0 0%, #ffe0b2 50%, #ffd8a8 100%)', // warm orange gradient
      minHeight: '100vh',
      borderRight: `1.5px solid #e3e8f0`,
      padding: '18px 10px 0 10px',
      boxShadow: '0 4px 32px 0 rgba(255,146,43,0.08)',
      width: 240,
      backdropFilter: 'blur(6px)',
    }}>
      <Stack>
        {items}
      </Stack>
    </Box>
  );
}

export default SidebarNav;