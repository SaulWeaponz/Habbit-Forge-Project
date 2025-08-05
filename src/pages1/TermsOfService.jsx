import React, { useState } from 'react';
import { Container, Title, Text, List, ListItem, Anchor, Paper, Group, Box, Badge, ThemeIcon, Divider, Stack } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';

const sections = [
  { id: 'acceptance', label: 'Acceptance of Terms' },
  { id: 'account', label: 'Your Account' },
  { id: 'conduct', label: 'User Conduct' },
  { id: 'ip', label: 'Intellectual Property' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'changes', label: 'Changes to Terms' },
  { id: 'contact', label: 'Contact Us' },
];

function TermsOfService() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  // Section content as a function
  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'acceptance':
        return (
          <>
            <Title order={2} mb="md">Acceptance of Terms</Title>
            <Text mb="lg">
              By creating an account or using our services, you signify your agreement to these Terms, as well as our Privacy Policy. If you do not agree, please do not use our services.
            </Text>
          </>
        );
      case 'account':
        return (
          <>
            <Title order={2} mb="md">Your Account</Title>
            <Text mb="sm">
              You are responsible for maintaining the confidentiality of your account login information and are fully responsible for all activities that occur under your account. You agree to:
            </Text>
            <List mb="lg">
              <ListItem>Provide accurate, current, and complete information during the registration process.</ListItem>
              <ListItem>Maintain and promptly update your account information.</ListItem>
              <ListItem>Notify us immediately of any unauthorized use of your account.</ListItem>
            </List>
          </>
        );
      case 'conduct':
        return (
          <>
            <Title order={2} mb="md">User Conduct</Title>
            <Paper p="sm" mb="md" radius="md" withBorder bg="#fff3e0">
              <Group align="flex-start" gap={8}>
                <ThemeIcon color="orange" variant="light" size="lg"><IconAlertCircle size={18} /></ThemeIcon>
                <Text size="sm" fw={500} style={{ color: '#b26a00' }}>
                  Important: Unlawful or prohibited activities, including harassment or security breaches, are strictly forbidden.
                </Text>
              </Group>
            </Paper>
            <Text mb="lg">
              You agree not to use Habits Forge for any unlawful or prohibited activities. This includes, but is not limited to, posting offensive content, harassing other users, or attempting to breach our security.
            </Text>
          </>
        );
      case 'ip':
        return (
          <>
            <Title order={2} mb="md">Intellectual Property</Title>
            <Paper p="sm" mb="md" radius="md" withBorder bg="#e3f2fd">
              <Group align="flex-start" gap={8}>
                <ThemeIcon color="blue" variant="light" size="lg"><IconInfoCircle size={18} /></ThemeIcon>
                <Text size="sm" fw={500} style={{ color: '#1565c0' }}>
                  All content and materials are protected by copyright and trademark law.
                </Text>
              </Group>
            </Paper>
            <Text mb="lg">
              All content and materials available on Habits Forge, including but not limited to text, graphics, website name, code, images, and logos are the intellectual property of Habits Forge and are protected by applicable copyright and trademark law.
            </Text>
          </>
        );
      case 'liability':
        return (
          <>
            <Title order={2} mb="md">Limitation of Liability</Title>
            <Text mb="lg">
              Habits Forge is provided "as is" without any warranties. We are not liable for any damages arising from your use of the service.
            </Text>
          </>
        );
      case 'changes':
        return (
          <>
            <Title order={2} mb="md">Changes to Terms</Title>
            <Text mb="lg">
              We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the service after such changes constitutes your acceptance of the new Terms.
            </Text>
          </>
        );
      case 'contact':
        return (
          <>
            <Title order={2} mb="md">Contact Us</Title>
            <Text mb="lg">
              If you have any questions about these Terms, please contact us at <Anchor component={Link} to="/contact">our Contact Us page</Anchor>.
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
      padding: '2rem 0',
      transition: 'background 0.5s',
    }}>
      <Container size="md" px={{ base: 'xs', sm: 'md' }}>
        <Paper shadow="xl" radius="xl" p="xl" mb="xl" withBorder style={{
          background: 'linear-gradient(90deg, #fff 60%, #e3f2fd 100%)',
        }}>
          <Title order={2} align="center" style={{ color: '#1976d2', letterSpacing: 1, fontWeight: 800 }}>Welcome to Habits Forge</Title>
          <Text align="center" size="lg" mt="sm" c="dimmed">
            Please review our Terms of Service below. We value your trust and are committed to transparency and your privacy.
          </Text>
        </Paper>
        <Paper shadow="md" radius="lg" p={{ base: 'md', sm: 'xl' }} withBorder style={{ background: 'rgba(255,255,255,0.97)' }}>
          <Title order={1} mb="md" fw={700} align="center" style={{ letterSpacing: 1 }}>Terms of Service</Title>
          <Text c="dimmed" mb="xl" align="center">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
          <Group align="flex-start" spacing={0} noWrap style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 0,
          }}>
            {/* Sidebar TOC */}
            <Box
              component="nav"
              sx={(theme) => ({
                minWidth: 220,
                maxWidth: 260,
                marginRight: 32,
                [theme.fn.smallerThan('sm')]: {
                  minWidth: '100%',
                  maxWidth: '100%',
                  marginRight: 0,
                  marginBottom: 24,
                },
              })}
            >
              <Stack spacing="xs">
                {sections.map((section, idx) => (
                  <Group
                    key={section.id}
                    spacing={8}
                    sx={(theme) => ({
                      cursor: 'pointer',
                      background: activeSection === section.id ? '#e3f2fd' : 'transparent',
                      color: activeSection === section.id ? theme.colors.blue[7] : theme.colors.gray[7],
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontWeight: 500,
                      transition: 'background 0.2s',
                      '&:hover': {
                        background: '#e3f2fd',
                        color: theme.colors.blue[7],
                      },
                    })}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <Badge color="cyan" size="sm" variant="light">{idx + 1}</Badge>
                    <Text size="sm">{section.label}</Text>
                  </Group>
                ))}
              </Stack>
            </Box>
            {/* Main Content */}
            <Box sx={(theme) => ({
              flex: 1,
              minWidth: 0,
              [theme.fn.smallerThan('sm')]: {
                width: '100%',
              },
            })}>
              <Paper p="md" radius="md" withBorder shadow="xs" style={{ background: '#f8fafc' }}>
                {renderSectionContent(activeSection)}
              </Paper>
            </Box>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
}

export default TermsOfService;