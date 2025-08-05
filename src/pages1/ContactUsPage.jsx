import React, { useState } from 'react';
import { Title, Text, Container, Paper, Group, TextInput, Textarea, Button, Box, Divider, Center, ThemeIcon } from '@mantine/core';
import { IconMail, IconPhone, IconUser, IconMessage, IconCheck, IconMapPin, IconBrandTwitter, IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin } from '@tabler/icons-react';

// Replace illustration with a call/communication image
const callImageUrl = 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=400&q=80'; // Appealing, friendly communication image
import './ContactUsPage.css';

function ContactUsPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  return (
    <Box className="contactus-bg" style={{ minHeight: 'calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0' }}>
      <Container size="md" px="md">
        <Paper shadow="xl" radius="lg" p="xl" className="contactus-paper contactus-paper-flex">
          <div className="contactus-header-main">
            <Title order={1} className="contactus-title-main">Contact HabitsForge</Title>
            <Text size="lg" color="dimmed" className="contactus-subtitle-main">We'd love to hear from you! Reach out to us through any of the methods below.</Text>
          </div>
          <div className="contactus-flex-row">
            <div className="contactus-img-col">
              <img src={callImageUrl} alt="Person making a call" className="contactus-img-contained" />
            </div>
            <div className="contactus-details-col">
              <Title order={2} className="contactus-comm-title">Get in Touch</Title>
              <ul className="contactus-details-list">
                <li><IconMail size={18} color="#ff9800" /> <a href="mailto:support@habitsforge.com" className="contactus-link">support@habitsforge.com</a></li>
                <li><IconPhone size={18} color="#ff9800" /> +1 (123) 456-7890</li>
                <li><IconMapPin size={18} color="#ff9800" /> 123 Habit Lane, Productivity City, 45678</li>
                <li><IconBrandTwitter size={18} color="#1da1f2" /> <a href="https://twitter.com/habitsforge" className="contactus-link" target="_blank" rel="noopener noreferrer">@habitsforge</a></li>
                <li><IconBrandFacebook size={18} color="#1877f3" /> <a href="https://facebook.com/habitsforge" className="contactus-link" target="_blank" rel="noopener noreferrer">facebook.com/habitsforge</a></li>
                <li><IconBrandInstagram size={18} color="#e4405f" /> <a href="https://instagram.com/habitsforge" className="contactus-link" target="_blank" rel="noopener noreferrer">@habitsforge</a></li>
                <li><IconBrandLinkedin size={18} color="#0077b5" /> <a href="https://linkedin.com/company/habitsforge" className="contactus-link" target="_blank" rel="noopener noreferrer">linkedin.com/company/habitsforge</a></li>
              </ul>
            </div>
          </div>
        </Paper>
      </Container>
    </Box>
  );
}

export default ContactUsPage;