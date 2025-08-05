// src/components/PublicFooter.jsx
import React from 'react'
import { Group, Text, Anchor, Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconBrandTwitter, IconBrandFacebook, IconBrandLinkedin, IconBrandYoutube, IconArrowUp } from '@tabler/icons-react';


const PublicFooter = () => {
  return (
    <Box
      component="footer"
      style={{
        width: '100%',
        background: 'linear-gradient(90deg, #232526 0%, #414345 100%)',
        color: '#f0f0f0',
        padding: '2.5rem 0 1.5rem 0',
        borderTop: 'none',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.18)',
        minHeight: '140px',
        position: 'relative',
      }}
    >
      {/* Divider above footer */}
      <Box style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
        <div style={{ height: 4, width: '100%', background: 'linear-gradient(90deg, #E67E22 0%, #ffb347 100%)', opacity: 0.85, borderRadius: '0 0 8px 8px' }} />
      </Box>
      <Box maw="1200px" mx="auto" px="md" style={{ position: 'relative', zIndex: 2 }}>
        <Group justify="space-between" align="flex-start" style={{ flexWrap: 'wrap' }}>
          {/* Left: Logo, Name, Tagline */}
          <Box>
            <Group gap="xs">
              <Text fw={800} size="xl" style={{ letterSpacing: 1, color: '#fff', textShadow: '0 2px 8px #E67E22' }}>Habits Forge</Text>
              <Text size="sm" c="dimmed">© {new Date().getFullYear()}</Text>
            </Group>
            <Text size="sm" mt={4} c="gray.3" style={{ maxWidth: 240, fontStyle: 'italic', color: '#ffb347', fontWeight: 500 }}>
              Empowering you to build better habits, one day at a time.
            </Text>
            {/* Social Icons */}
            <Group mt={16} gap="xs">
              <Anchor href="https://twitter.com/" target="_blank" rel="noopener" aria-label="Twitter" style={{ background: '#222', borderRadius: '50%', padding: 6, display: 'inline-flex', transition: 'background 0.2s', boxShadow: '0 2px 8px #1da1f2', color: '#1da1f2' }} onMouseOver={e => e.currentTarget.style.background='#1da1f2'} onMouseOut={e => e.currentTarget.style.background='#222'}>
                <IconBrandTwitter size={22} color="#fff" />
              </Anchor>
              <Anchor href="https://facebook.com/" target="_blank" rel="noopener" aria-label="Facebook" style={{ background: '#222', borderRadius: '50%', padding: 6, display: 'inline-flex', transition: 'background 0.2s', boxShadow: '0 2px 8px #1877f3', color: '#1877f3' }} onMouseOver={e => e.currentTarget.style.background='#1877f3'} onMouseOut={e => e.currentTarget.style.background='#222'}>
                <IconBrandFacebook size={22} color="#fff" />
              </Anchor>
              <Anchor href="https://linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn" style={{ background: '#222', borderRadius: '50%', padding: 6, display: 'inline-flex', transition: 'background 0.2s', boxShadow: '0 2px 8px #0077b5', color: '#0077b5' }} onMouseOver={e => e.currentTarget.style.background='#0077b5'} onMouseOut={e => e.currentTarget.style.background='#222'}>
                <IconBrandLinkedin size={22} color="#fff" />
              </Anchor>
              <Anchor href="https://youtube.com/" target="_blank" rel="noopener" aria-label="YouTube" style={{ background: '#222', borderRadius: '50%', padding: 6, display: 'inline-flex', transition: 'background 0.2s', boxShadow: '0 2px 8px #ff0000', color: '#ff0000' }} onMouseOver={e => e.currentTarget.style.background='#ff0000'} onMouseOut={e => e.currentTarget.style.background='#222'}>
                <IconBrandYoutube size={22} color="#fff" />
              </Anchor>
            </Group>
          </Box>

          {/* Center: Navigation Links in columns */}
          <Group gap="xl" style={{ flexWrap: 'wrap', marginTop: 8 }}>
            <Box>
              <Text fw={700} size="sm" mb={4} c="gray.2" style={{ letterSpacing: 1, textTransform: 'uppercase' }}>Navigate</Text>
              <Anchor component={Link} to="/" size="sm" style={{ display: 'block', marginBottom: 4, color: '#fff', fontWeight: 500, opacity: 0.92, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='#E67E22'} onMouseOut={e => e.currentTarget.style.color='#fff'}>
                Home
              </Anchor>
              <Anchor component={Link} to="/about" size="sm" style={{ display: 'block', marginBottom: 4, color: '#fff', fontWeight: 500, opacity: 0.92, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='#E67E22'} onMouseOut={e => e.currentTarget.style.color='#fff'}>
                About Us
              </Anchor>
              <Anchor component={Link} to="/contact" size="sm" style={{ display: 'block', marginBottom: 4, color: '#fff', fontWeight: 500, opacity: 0.92, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='#E67E22'} onMouseOut={e => e.currentTarget.style.color='#fff'}>
                Contact Us
              </Anchor>
              <Anchor component={Link} to="/terms-of-service" size="sm" style={{ display: 'block', color: '#fff', fontWeight: 500, opacity: 0.92, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color='#E67E22'} onMouseOut={e => e.currentTarget.style.color='#fff'}>
                Terms of Service
              </Anchor>
            </Box>
          </Group>

          {/* Right: Back to Top */}
          <Box style={{ textAlign: 'right', minWidth: 120, marginTop: 8 }}>
            <Anchor
              href="#top"
              size="sm"
              style={{ color: '#E67E22', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '1.05rem', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '6px 12px', boxShadow: '0 2px 8px #E67E22', transition: 'background 0.2s' }}
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              onMouseOver={e => e.currentTarget.style.background='#E67E22'}
              onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
            >
              <IconArrowUp size={18} /> Back to Top
            </Anchor>
          </Box>
        </Group>
      </Box>
    </Box>
  );
};

export default PublicFooter;