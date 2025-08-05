import { Title, Text, Button } from '@mantine/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!localUser) {
      navigate('/login');
    }
  }, [localUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', paddingTop: 100 }}>
      <Title order={1} mb="xl">Dashboard</Title>
      
      {localUser ? (
        <>
          <Text mb="md">Welcome back, {localUser.name}</Text>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : null}
    </div>
  );
}

export default DashboardPage;