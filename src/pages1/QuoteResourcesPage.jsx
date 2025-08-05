import React from 'react';
import { Container, Divider } from '@mantine/core';
import QuoteResources from '../components/userDashboard/quotes/QuoteResources.jsx';

const QuoteResourcesPage = () => (
  <Container size="md" py="xl">
    <Divider my="md" />
    <QuoteResources />
  </Container>
);

export default QuoteResourcesPage; 