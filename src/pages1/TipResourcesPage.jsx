import React from 'react';
import { Container, Divider } from '@mantine/core';
import TipsResources from '../components/userDashboard/tips/TipsResources.jsx';

const TipResourcesPage = () => (
  <Container size="md" py="xl">
    <Divider my="md" />
    <TipsResources />
  </Container>
);

export default TipResourcesPage; 