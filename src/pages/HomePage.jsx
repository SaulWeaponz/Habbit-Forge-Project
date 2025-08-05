import { Button, Group, Text, Title, Paper, Badge } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconFlame, IconTarget, IconSparkles, IconArrowRight } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import HabitTrackingImg from '../assets/Habit-tracking.png';
import PersonalizedInsightsImg from '../assets/Personalized-insights.png';
import InteractiveHabitsImg from '../assets/Interactive-habits.png';
// Add for wavy dividers
const WavyDivider = ({ flip }) => (
  <svg viewBox="0 0 1440 60" style={{ display: 'block', width: '100%', height: 60, transform: flip ? 'scaleY(-1)' : undefined }}>
    <path fill="#f8f8f8" d="M0,32L48,37.3C96,43,192,53,288,53.3C384,53,480,43,576,32C672,21,768,11,864,10.7C960,11,1056,21,1152,32C1248,43,1344,53,1392,58.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
  </svg>
);

// Animated SVG background blob
const AnimatedBlob = ({ style, color, duration = 18, delay = 0 }) => (
  <motion.svg
    width="340" height="340" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', ...style, zIndex: 0 }}
    initial={{ scale: 1, rotate: 0, opacity: 0.18 }}
    animate={{ scale: [1, 1.08, 1], rotate: [0, 360], opacity: [0.18, 0.22, 0.18] }}
    transition={{ repeat: Infinity, duration, delay, ease: 'linear' }}
  >
    <ellipse cx="170" cy="170" rx="170" ry="170" fill={color} />
  </motion.svg>
);

// Decorative accent under headings
const HeadingAccent = () => (
  <div style={{ width: 64, height: 6, margin: '0.5rem auto 1.5rem auto', borderRadius: 8, background: 'linear-gradient(90deg, #E67E22 0%, #ffb347 100%)', opacity: 0.7 }} />
);

// Testimonial carousel data
const testimonials = [
  {
    quote: 'This app helped me finally stick to my morning routine!',
    author: 'Priya S.',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    quote: 'I love seeing my streaks and getting daily motivation.',
    author: 'Alex R.',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    quote: 'The analytics make it so easy to see my progress. Highly recommend!',
    author: 'Jamie L.',
    img: 'https://randomuser.me/api/portraits/men/85.jpg',
  }
];

const bgImages = [  
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80', // Mindfulness
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80', // Exercise
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80', // Reading// Original selections
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80', // Journaling, light
  
];

// Responsive utility
const responsive = {
  section: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '3rem 1rem 2rem 1rem',
  },
  '@media (max-width: 900px)': {
    section: {
      padding: '2rem 0.5rem 1.5rem 0.5rem',
    },
  },
  '@media (max-width: 600px)': {
    section: {
      padding: '1.5rem 0.2rem 1rem 0.2rem',
    },
  },
};

function HomePage() {
  const [bgIndex, setBgIndex] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const cardsPerView = windowWidth < 700 ? 1 : 2;
  const isMobile = useMediaQuery('(max-width: 700px)');
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  // Testimonial carousel auto-rotate
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + cardsPerView) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [cardsPerView]);
  return (
    <>
      {/* Hero Section */}
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Animated background images */}
        {bgImages.map((img, i) => (
          <img
            key={img}
            src={img}
            alt="Habit background"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: i === bgIndex ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        ))}
        {/* Overlay for readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(120deg, rgba(34,139,230,0.25), rgba(0,0,0,0.25))',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
        {/* Main content container */}
        <div
          style={{
            flex: 1,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            maxWidth: '1200px',
            margin: '0 auto',
            paddingTop: '80px',
            position: 'relative',
            zIndex: 3,
          }}
        >
          {/* Content with higher z-index to appear above image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: 'calc(100% - 140px)', // Adjust for image strip
            }}
          >
            {/* Tagline */}
            <Text
              size="md"
              mb={8}
              style={{
                color: '#E67E22',
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: 'uppercase',
                textShadow: '0 2px 8px rgba(255,146,43,0.10)',
              }}
            >
              Your journey starts here
            </Text>

            <Title
              order={1}
              style={{
                fontSize: 'clamp(2.2rem, 6vw, 4rem)',
                lineHeight: 1.1,
                color: '#E67E22',
                fontWeight: 900,
                marginBottom: '1.2rem',
                textShadow: '0 4px 16px rgba(34,139,230,0.10), 0 1px 2px #fff',
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              Build Better Habits, One Day at a Time
            </Title>

            <Text 
              size="xl" 
              mb="md" 
              style={{ 
                color: '#222', 
                fontWeight: 700,
                maxWidth: '600px',
                fontSize: '1.35rem',
                textShadow: '0 1px 8px rgba(255,255,255,0.12)',
              }}
            >
              Transform your routines into lasting change. Discover the easiest way to stay motivated, track your progress, and celebrate every win—big or small.
            </Text>

            <Text 
              size="lg" 
              mb="xl" 
              style={{ 
                color: '#444', 
                fontWeight: 500,
                maxWidth: '600px',
                fontSize: '1.1rem',
              }}
            >
              Join a community of achievers. Set clear goals, build positive habits, and unlock your best self—starting today.
            </Text>

            <Group spacing="xl" mb="xl">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  component={Link}
                  to="/features"
                  size="lg"
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: 'orange', to: '#E67E22', deg: 105 }}
                  rightIcon={<IconSparkles size={20} />}
                  style={{
                    fontSize: '1.1rem',
                    padding: '0.75rem 2rem',
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  Start Your Streak
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  component={Link}
                  to="/features"
                  size="lg"
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: '#E67E22', to: 'orange', deg: 105 }}
                  rightIcon={<IconTarget size={20} />}
                  style={{
                    fontSize: '1.1rem',
                    padding: '0.75rem 2rem',
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  See How It Works
                </Button>
              </motion.div>
            </Group>

            <Paper
              p="md"
              mb="xl"
              style={{
                background: 'linear-gradient(90deg, rgba(255,146,43,0.10) 60%, rgba(255,255,255,0.7) 100%)',
                borderLeft: '5px solid #E67E22',
                maxWidth: '600px',
                boxShadow: '0 2px 12px 0 rgba(255,146,43,0.08)',
              }}
            >
              <Text
                size="lg"
                style={{
                  fontStyle: 'italic',
                  color: '#E67E22',
                  fontWeight: 700,
                  lineHeight: 1.6,
                  letterSpacing: 0.5,
                  textShadow: '0 1px 8px rgba(255,255,255,0.10)',
                }}
              >
                "Success is the product of daily habits—not once-in-a-lifetime transformations."
                <br />
                <span style={{ fontSize: '0.95em', color: '#b85c00', fontWeight: 600 }}>- James Clear</span>
              </Text>
            </Paper>

            <Group spacing="md" mb="xl">
              <Badge 
                color="orange" 
                size="xl" 
                variant="filled" 
                leftSection={<IconSparkles size={16} />}
                style={{ fontSize: '1rem', padding: '0.6rem 1.2rem', fontWeight: 700, letterSpacing: 1 }}
              >
                Habit Power
              </Badge>
              <Badge 
                color="orange" 
                size="xl" 
                variant="filled"
                leftSection={<IconFlame size={16} />}
                style={{ fontSize: '1rem', padding: '0.6rem 1.2rem', fontWeight: 700, letterSpacing: 1 }}
              >
                Keep Your Streak
              </Badge>
              <Badge 
                color="orange" 
                size="xl" 
                variant="filled"
                leftSection={<IconTarget size={16} />}
                style={{ fontSize: '1rem', padding: '0.6rem 1.2rem', fontWeight: 700, letterSpacing: 1 }}
              >
                Achieve More
              </Badge>
            </Group>
          </motion.div>
        </div>
      </div>
      {/* Animated background blobs for section */}
      <AnimatedBlob color="#ffe5c2" style={{ top: 320, left: -60, width: 200, height: 200 }} duration={22} />
      <AnimatedBlob color="#E67E22" style={{ top: 900, right: -80, width: 200, height: 200 }} duration={28} />
      <AnimatedBlob color="#ffb347" style={{ top: 1600, left: -50, width: 200, height: 200 }} duration={24} />
      {/* New Sections Below Hero */}
      <div
        style={{
          width: '100%',
          background: 'linear-gradient(120deg, #ffe5c2 0%, #f3e0c7 100%)',
          position: 'relative',
          zIndex: 4,
          boxShadow: '0 8px 32px rgba(230,126,34,0.04)',
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        {/* Soft pattern overlay for extra contrast */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.10,
          backgroundImage: 'radial-gradient(circle at 40% 30%, #e6a96b 0%, transparent 60%), radial-gradient(circle at 70% 80%, #bfae9e 0%, transparent 70%)',
        }} />
        {/* Dark overlay for card contrast */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
          background: 'linear-gradient(120deg, rgba(80,60,30,0.10) 0%, rgba(80,60,30,0.13) 100%)',
        }} />
        <WavyDivider />
        {/* 1. Features Overview */}
        <section
          style={{
            ...responsive.section,
            position: 'relative',
            zIndex: 2,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Title order={2} style={{ color: '#E67E22', fontWeight: 800, marginBottom: 0, textAlign: 'center', letterSpacing: 1.2, fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>Features at a Glance</Title>
          <HeadingAccent />
          <Group
            position="center"
            wrap="wrap"
            style={{
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'center' : 'stretch',
              flexWrap: isMobile ? 'nowrap' : 'wrap',
              gap: isMobile ? 12 : 24,
              width: '100%',
              boxSizing: 'border-box',
              overflowX: isMobile ? 'visible' : 'hidden',
              maxWidth: '100vw',
              margin: 0,
              padding: 0,
            }}
          >
            <motion.div whileHover={{ scale: 1.07, boxShadow: '0 8px 32px #E67E2240' }}
              style={{
                borderRadius: 18,
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(2px)',
                border: '1.5px solid #ffe5c2',
                boxShadow: '0 2px 16px #E67E2208',
                transition: 'box-shadow 0.2s',
                width: isMobile ? '100%' : undefined,
                minWidth: isMobile ? 0 : 220,
                maxWidth: isMobile ? '100%' : 340,
                flex: isMobile ? 'unset' : '1 1 220px',
                flexShrink: 1,
                margin: isMobile ? '8px 0' : '12px 0',
              }}
            >
              <Paper p="md" radius="md" shadow="md" style={{ textAlign: 'center', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <IconFlame size={40} color="#E67E22" style={{ marginBottom: 12 }} />
                <Text weight={700} size="lg">Habit Tracking</Text>
                <Text size="sm" color="dimmed">Easily add, edit, and track your daily habits.</Text>
              </Paper>
            </motion.div>
            <motion.div whileHover={{ scale: 1.07, boxShadow: '0 8px 32px #E67E2240' }}
              style={{
                borderRadius: 18,
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(2px)',
                border: '1.5px solid #ffe5c2',
                boxShadow: '0 2px 16px #E67E2208',
                transition: 'box-shadow 0.2s',
                width: isMobile ? '100%' : undefined,
                minWidth: isMobile ? 0 : 220,
                maxWidth: isMobile ? '100%' : 340,
                flex: isMobile ? 'unset' : '1 1 220px',
                flexShrink: 1,
                margin: isMobile ? '8px 0' : '12px 0',
              }}
            >
              <Paper p="md" radius="md" shadow="md" style={{ textAlign: 'center', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <IconTarget size={40} color="#E67E22" style={{ marginBottom: 12 }} />
                <Text weight={700} size="lg">Goal Setting</Text>
                <Text size="sm" color="dimmed">Set clear goals and milestones to stay motivated.</Text>
              </Paper>
            </motion.div>
            <motion.div whileHover={{ scale: 1.07, boxShadow: '0 8px 32px #E67E2240' }}
              style={{
                borderRadius: 18,
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(2px)',
                border: '1.5px solid #ffe5c2',
                boxShadow: '0 2px 16px #E67E2208',
                transition: 'box-shadow 0.2s',
                width: isMobile ? '100%' : undefined,
                minWidth: isMobile ? 0 : 220,
                maxWidth: isMobile ? '100%' : 340,
                flex: isMobile ? 'unset' : '1 1 220px',
                flexShrink: 1,
                margin: isMobile ? '8px 0' : '12px 0',
              }}
            >
              <Paper p="md" radius="md" shadow="md" style={{ textAlign: 'center', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <IconSparkles size={40} color="#E67E22" style={{ marginBottom: 12 }} />
                <Text weight={700} size="lg">Motivation</Text>
                <Text size="sm" color="dimmed">Get daily quotes and tips to keep you inspired.</Text>
              </Paper>
            </motion.div>
          </Group>
        </section>
        <WavyDivider flip />
        {/* 2. How It Works */}
        <section
          style={{
            ...responsive.section,
            padding: '2.5rem 1rem 2rem 1rem',
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 2px 16px #E67E2208',
            marginTop: 32,
            position: 'relative',
            zIndex: 2,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Title order={2} style={{ color: '#E67E22', fontWeight: 800, marginBottom: 0, textAlign: 'center', letterSpacing: 1.2, fontSize: 'clamp(1.3rem, 5vw, 2.2rem)' }}>How It Works</Title>
          <HeadingAccent />
          <Group position="center" spacing="xl" grow wrap="wrap" style={{ position: 'relative', marginTop: 32, flexWrap: 'wrap', gap: 24 }}>
            {/* Connectors between steps */}
            <div style={{ position: 'absolute', top: 60, left: '18%', width: '64%', height: 0, zIndex: 0, display: window.innerWidth < 700 ? 'none' : 'block' }}>
              <svg width="100%" height="32" viewBox="0 0 600 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="0,16 600,16" stroke="#ffe5c2" strokeWidth="4" strokeDasharray="16 12" />
                <circle cx="0" cy="16" r="6" fill="#E67E22" />
                <circle cx="200" cy="16" r="6" fill="#E67E22" />
                <circle cx="400" cy="16" r="6" fill="#E67E22" />
                <circle cx="600" cy="16" r="6" fill="#E67E22" />
              </svg>
            </div>
            <motion.div whileHover={{ scale: 1.06 }} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.8)', boxShadow: '0 2px 16px #E67E2208', border: '1.5px solid #ffe5c2', minWidth: 180, flex: '1 1 220px', textAlign: 'center', zIndex: 1, margin: '12px 0' }}>
              <Paper p="md" radius="md" shadow="xs" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <Text weight={700} size="lg">1. Set Your Goal</Text>
                <Text size="sm" color="dimmed">Choose what habit you want to build.</Text>
              </Paper>
            </motion.div>
            <motion.div whileHover={{ scale: 1.06 }} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.8)', boxShadow: '0 2px 16px #E67E2208', border: '1.5px solid #ffe5c2', minWidth: 180, flex: '1 1 220px', textAlign: 'center', zIndex: 1, margin: '12px 0' }}>
              <Paper p="md" radius="md" shadow="xs" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <Text weight={700} size="lg">2. Build Your Habit</Text>
                <Text size="sm" color="dimmed">Add it to your dashboard and start tracking.</Text>
              </Paper>
            </motion.div>
            <motion.div whileHover={{ scale: 1.06 }} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.8)', boxShadow: '0 2px 16px #E67E2208', border: '1.5px solid #ffe5c2', minWidth: 180, flex: '1 1 220px', textAlign: 'center', zIndex: 1, margin: '12px 0' }}>
              <Paper p="md" radius="md" shadow="xs" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <Text weight={700} size="lg">3. Track Progress</Text>
                <Text size="sm" color="dimmed">See your streaks and analytics grow.</Text>
              </Paper>
            </motion.div>
            <motion.div whileHover={{ scale: 1.06 }} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.8)', boxShadow: '0 2px 16px #E67E2208', border: '1.5px solid #ffe5c2', minWidth: 180, flex: '1 1 220px', textAlign: 'center', zIndex: 1, margin: '12px 0' }}>
              <Paper p="md" radius="md" shadow="xs" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <Text weight={700} size="lg">4. Celebrate Wins</Text>
                <Text size="sm" color="dimmed">Earn badges and rewards for consistency.</Text>
              </Paper>
            </motion.div>
          </Group>
        </section>
        <WavyDivider />
        {/* 3. Screenshots/Demo */}
        <section
          style={{
            ...responsive.section,
            padding: '2.5rem 1rem 2rem 1rem',
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 2px 16px #E67E2208',
            marginTop: 32,
            position: 'relative',
            zIndex: 2,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Title order={2} style={{ color: '#E67E22', fontWeight: 800, marginBottom: 0, textAlign: 'center', letterSpacing: 1.2, fontSize: 'clamp(1.3rem, 5vw, 2.2rem)' }}>See It In Action</Title>
          <HeadingAccent />
          <Group position="center" spacing="xl" grow wrap="wrap" style={{ alignItems: 'flex-end', marginTop: 32, flexWrap: 'wrap', gap: 24 }}>
            {/* Overlapping screenshots, stack on mobile */}
            <motion.img whileHover={{ scale: 1.08, boxShadow: '0 8px 32px #228be640' }} src={HabitTrackingImg} alt="Habit Tracking Screenshot" style={{ borderRadius: 20, boxShadow: '0 2px 12px rgba(34,139,230,0.10)', width: 'min(300px, 95vw)', height: 210, objectFit: 'cover', transition: 'box-shadow 0.2s', marginRight: window.innerWidth > 700 ? -40 : 0, zIndex: 2, border: '4px solid #fff', marginBottom: window.innerWidth <= 700 ? 16 : 0 }} />
            <motion.img whileHover={{ scale: 1.08, boxShadow: '0 8px 32px #228be640' }} src={PersonalizedInsightsImg} alt="Personalized Insights Screenshot" style={{ borderRadius: 20, boxShadow: '0 2px 12px rgba(34,139,230,0.10)', width: 'min(300px, 95vw)', height: 210, objectFit: 'cover', transition: 'box-shadow 0.2s', zIndex: 3, border: '4px solid #fff', marginBottom: window.innerWidth <= 700 ? 16 : 0 }} />
            <motion.img whileHover={{ scale: 1.08, boxShadow: '0 8px 32px #228be640' }} src={InteractiveHabitsImg} alt="Interactive Habits Screenshot" style={{ borderRadius: 20, boxShadow: '0 2px 12px rgba(34,139,230,0.10)', width: 'min(300px, 95vw)', height: 210, objectFit: 'cover', transition: 'box-shadow 0.2s', marginLeft: window.innerWidth > 700 ? -40 : 0, zIndex: 2, border: '4px solid #fff', marginBottom: window.innerWidth <= 700 ? 16 : 0 }} />
          </Group>
        </section>
        <WavyDivider flip />
        {/* 4. Testimonials */}
        <section
          style={{
            ...responsive.section,
            padding: '2.5rem 1rem 2rem 1rem',
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 2px 16px #E67E2208',
            marginTop: 32,
            position: 'relative',
            zIndex: 2,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Title order={2} style={{ color: '#E67E22', fontWeight: 800, marginBottom: 0, textAlign: 'center', letterSpacing: 1.2, fontSize: 'clamp(1.3rem, 5vw, 2.2rem)' }}>What Our Users Say</Title>
          <HeadingAccent />
          <Group position="center" spacing="xl" grow wrap="wrap" style={{ marginTop: 32, flexWrap: 'wrap', gap: 24, overflow: 'hidden', width: '100%' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx + '-' + cardsPerView}
                initial={{ opacity: 0, x: 120 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -120 }}
                transition={{ duration: 0.6 }}
                style={{ display: 'flex', gap: 24, width: '100%', justifyContent: 'center' }}
              >
                {Array.from({ length: cardsPerView }).map((_, i) => {
                  const idx = (testimonialIdx + i) % testimonials.length;
                  const t = testimonials[idx];
                  return (
                    <div
                      key={t.author}
                      style={{
                        borderRadius: 20,
                        minWidth: 220,
                        maxWidth: 420,
                        margin: '0 auto',
                        background: '#fff',
                        boxShadow: '0 12px 36px 0 #b85c0030',
                        border: '2px solid #ffe5c2',
                        padding: 24,
                        position: 'relative',
                        zIndex: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={t.img}
                        alt={t.author}
                        style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, border: '3px solid #ffe5c2', boxShadow: '0 2px 8px #E67E2240' }}
                      />
                      <Text size="lg" style={{ fontStyle: 'italic', marginBottom: 16, color: '#E67E22', fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>
                        “{t.quote}”
                      </Text>
                      <Text size="sm" color="dimmed" style={{ fontWeight: 600, letterSpacing: 1, textAlign: 'right' }}>- {t.author}</Text>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </Group>
        </section>
        <WavyDivider />
        {/* 7. Call to Action */}
        <section
          style={{
            ...responsive.section,
            padding: '2.5rem 1rem 3rem 1rem',
            textAlign: 'center',
            background: 'linear-gradient(90deg, #E67E22 0%, #ffb347 100%)',
            borderRadius: 22,
            boxShadow: '0 2px 32px #E67E2240',
            marginTop: 32,
            position: 'relative',
            zIndex: 2,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Title order={2} style={{ color: '#fff', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: 1.2, textShadow: '0 2px 16px #E67E22', fontSize: 'clamp(1.3rem, 6vw, 2.3rem)' }}>Ready to Start Your Journey?</Title>
          <HeadingAccent />
          <Button
            component={Link}
            to="/signup"
            size="xl"
            radius="xl"
            variant="white"
            leftIcon={<IconArrowRight size={24} />}
            style={{ fontSize: '1.1rem', padding: '1rem 2rem', fontWeight: 800, letterSpacing: 1, color: '#E67E22', background: '#fff', boxShadow: '0 2px 16px #fffbe6', transition: 'background 0.2s', width: 'min(320px, 90vw)' }}
            onMouseOver={e => e.currentTarget.style.background='#ffe5c2'}
            onMouseOut={e => e.currentTarget.style.background='#fff'}
          >
            Join Now – It’s Free!
          </Button>
        </section>
      </div>
    </>
  );
}

export default HomePage;