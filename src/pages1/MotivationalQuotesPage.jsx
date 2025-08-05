import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Paper,
  ActionIcon,
  rem,
  Divider,
  Anchor,
  Card,
  Loader,
  Alert,
  Blockquote,
  Box,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconLink,
  IconAlertCircle,
  IconSparkles,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import QuoteResources from '../components/userDashboard/quotes/QuoteResources.jsx';

// Define your Strapi API URLs
const STRAPI_QUOTES_API_URL = 'http://localhost:1337/api/motivational-quotes';
const STRAPI_RESOURCES_API_URL = 'http://localhost:1337/api/quote-resources';

// Animated background keyframes
const animatedBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

function MotivationalQuotesPage() {
  // --- STATE FOR TEXT-BASED QUOTES ---
  const [newQuoteContent, setNewQuoteContent] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [editingQuoteId, setEditingQuoteId] = useState(null);
  const [editingQuoteContent, setEditingQuoteContent] = useState('');
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(true);
  const [errorQuotes, setErrorQuotes] = useState(null);

  // --- STATE FOR ONLINE RESOURCE LINKS ---
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceLink, setNewResourceLink] = useState('');
  const [resources, setResources] = useState([]);
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [editingResourceName, setEditingResourceName] = useState('');
  const [editingResourceLink, setEditingResourceLink] = useState('');
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [errorResources, setErrorResources] = useState(null);

  // --- useEffect for Fetching Text-Based Motivational Quotes ---
  useEffect(() => {
    const fetchQuotes = async () => {
      setIsLoadingQuotes(true);
      setErrorQuotes(null);
      try {
        const response = await fetch(STRAPI_QUOTES_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // --- ADJUSTMENT HERE: Directly access 'content' ---
        const formattedQuotes = data.data.map(item => ({
          id: item.id.toString(),
          content: item.content, // CHANGED from item.attributes.content
        }));
        setQuotes(formattedQuotes);
      } catch (e) {
        console.error("Failed to fetch quotes:", e);
        setErrorQuotes("Failed to load quotes. Please try again. Ensure Strapi is running and 'Motivational Quote' permissions are set.");
      } finally {
        setIsLoadingQuotes(false);
      }
    };

    fetchQuotes();
  }, []);

  // --- useEffect for Fetching Online Resource Links ---
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoadingResources(true);
      setErrorResources(null);
      try {
        const response = await fetch(STRAPI_RESOURCES_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // --- ADJUSTMENT HERE: Directly access 'name' and 'link' ---
        const formattedResources = data.data.map(item => ({
          id: item.id.toString(),
          name: item.name, // CHANGED from item.attributes.name
          link: item.link, // CHANGED from item.attributes.link
        }));
        setResources(formattedResources);
      } catch (e) {
        console.error("Failed to fetch resources:", e);
        setErrorResources("Failed to load resources. Please try again. Ensure Strapi is running and 'Quote Resource' permissions are set.");
      } finally {
        setIsLoadingResources(false);
      }
    };

    fetchResources();
  }, []);

  // --- CRUD OPERATIONS FOR TEXT-BASED QUOTES ---

  const handleAddQuote = async () => {
    const trimmedContent = newQuoteContent.trim();
    if (trimmedContent) {
      setErrorQuotes(null);
      try {
        const response = await fetch(STRAPI_QUOTES_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { content: trimmedContent } }), // Strapi expects `data` wrapper for sending
        });
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMessage = errorJson.error.message;
            }
          } catch (parseError) {
            errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
          }
          throw new Error(errorMessage);
        }
        const addedQuote = await response.json();
        setQuotes((prevQuotes) => [
          ...prevQuotes,
          // --- ADJUSTMENT HERE: Directly access 'content' ---
          { id: addedQuote.data.id.toString(), content: addedQuote.data.content }, // CHANGED from addedQuote.data.attributes.content
        ]);
        setNewQuoteContent('');
      } catch (e) {
        console.error("Failed to add quote:", e);
        setErrorQuotes(`Failed to add quote: ${e.message}. Check Strapi permissions for 'create'.`);
      }
    } else {
      alert('Quote content cannot be empty.');
    }
  };

  const handleDeleteQuote = async (id) => {
    setErrorQuotes(null);
    try {
      const response = await fetch(`${STRAPI_QUOTES_API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error && errorJson.error.message) {
            errorMessage = errorJson.error.message;
          }
        } catch (parseError) {
          errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
        }
        throw new Error(errorMessage);
      }
      setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== id));
      if (editingQuoteId === id) {
        handleCancelQuoteEdit();
      }
    } catch (e) {
      console.error("Failed to delete quote:", e);
      setErrorQuotes(`Failed to delete quote: ${e.message}. Check Strapi permissions for 'delete'.`);
    }
  };

  const handleEditQuote = (quote) => {
    setEditingQuoteId(quote.id);
    setEditingQuoteContent(quote.content);
  };

  const handleUpdateQuote = async (id) => {
    const trimmedContent = editingQuoteContent.trim();
    if (trimmedContent) {
      setErrorQuotes(null);
      try {
        const response = await fetch(`${STRAPI_QUOTES_API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { content: trimmedContent } }), // Strapi expects `data` wrapper for sending
        });
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMessage = errorJson.error.message;
            }
          } catch (parseError) {
            errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
          }
          throw new Error(errorMessage);
        }
        const updatedQuoteData = await response.json();
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.id === id ? {
              id: updatedQuoteData.data.id.toString(),
              content: updatedQuoteData.data.content // CHANGED from updatedQuoteData.data.attributes.content
            } : quote
          )
        );
        setEditingQuoteId(null);
        setEditingQuoteContent('');
      } catch (e) {
        console.error("Failed to update quote:", e);
        setErrorQuotes(`Failed to update quote: ${e.message}. Check Strapi permissions for 'update'.`);
      }
    } else {
      alert('Quote content cannot be empty.');
    }
  };

  const handleCancelQuoteEdit = () => {
    setEditingQuoteId(null);
    setEditingQuoteContent('');
  };

  // --- CRUD OPERATIONS FOR ONLINE RESOURCE LINKS ---

  const handleAddResource = async () => {
    const trimmedName = newResourceName.trim();
    const trimmedLink = newResourceLink.trim();
    const isValidUrl = trimmedLink.startsWith('http://') || trimmedLink.startsWith('https://');

    if (trimmedName && trimmedLink && isValidUrl) {
      setErrorResources(null);
      try {
        const response = await fetch(STRAPI_RESOURCES_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { name: trimmedName, link: trimmedLink } }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMessage = errorJson.error.message;
            }
          } catch (parseError) {
            errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
          }
          throw new Error(errorMessage);
        }
        const addedResource = await response.json();
        setResources((prevResources) => [
          ...prevResources,
          // --- ADJUSTMENT HERE: Directly access 'name' and 'link' ---
          { id: addedResource.data.id.toString(), name: addedResource.data.name, link: addedResource.data.link }, // CHANGED from addedResource.data.attributes.name/link
        ]);
        setNewResourceName('');
        setNewResourceLink('');
      } catch (e) {
        console.error("Failed to add resource:", e);
        setErrorResources(`Failed to add resource: ${e.message}. Check Strapi permissions for 'create'.`);
      }
    } else {
      alert('Please provide a name and a valid URL (starting with http:// or https://) for the resource.');
    }
  };

  const handleDeleteResource = async (id) => {
    setErrorResources(null);
    try {
      const response = await fetch(`${STRAPI_RESOURCES_API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error && errorJson.error.message) {
            errorMessage = errorJson.error.message;
          }
        } catch (parseError) {
          errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
        }
        throw new Error(errorMessage);
      }
      setResources((prevResources) => prevResources.filter((resource) => resource.id !== id));
      if (editingResourceId === id) {
        handleCancelResourceEdit();
      }
    } catch (e) {
      console.error("Failed to delete resource:", e);
      setErrorResources(`Failed to delete resource: ${e.message}. Check Strapi permissions for 'delete'.`);
    }
  };

  const handleEditResource = (resource) => {
    setEditingResourceId(resource.id);
    setEditingResourceName(resource.name);
    setEditingResourceLink(resource.link);
  };

  const handleUpdateResource = async (id) => {
    const trimmedName = editingResourceName.trim();
    const trimmedLink = editingResourceLink.trim();
    const isValidUrl = trimmedLink.startsWith('http://') || trimmedLink.startsWith('https://');

    if (trimmedName && trimmedLink && isValidUrl) {
      setErrorResources(null);
      try {
        const response = await fetch(`${STRAPI_RESOURCES_API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: { name: trimmedName, link: trimmedLink } }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMessage = errorJson.error.message;
            }
          } catch (parseError) {
            errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
          }
          throw new Error(errorMessage);
        }
        const updatedResourceData = await response.json();
        setResources((prevResources) =>
          prevResources.map((resource) =>
            resource.id === id ? {
              id: updatedResourceData.data.id.toString(),
              // --- ADJUSTMENT HERE: Directly access 'name' and 'link' ---
              name: updatedResourceData.data.name, // CHANGED from updatedResourceData.data.attributes.name
              link: updatedResourceData.data.link, // CHANGED from updatedResourceData.data.attributes.link
            } : resource
          )
        );
        setEditingResourceId(null);
        setEditingResourceName('');
        setEditingResourceLink('');
      } catch (e) {
        console.error("Failed to update resource:", e);
        setErrorResources(`Failed to update resource: ${e.message}. Check Strapi permissions for 'update'.`);
      }
    } else {
      alert('Please provide a name and a valid URL (starting with http:// or https://) for the resource.');
    }
  };

  const handleCancelResourceEdit = () => {
    setEditingResourceId(null);
    setEditingResourceName('');
    setEditingResourceLink('');
  };

  return (
    <Box style={{
      minHeight: 'calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))',
      background: 'linear-gradient(120deg, #fffaf3 0%, #fff3e0 50%, #ffe5c0 100%)', // softened orange gradient
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundBlendMode: 'overlay',
      padding: '48px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Container size="md" px="md">
        <Paper p="xl" shadow="xl" radius="md" style={{
          background: 'rgba(255,255,255,0.92)',
          border: '1.5px solid #ffe0b2',
          boxShadow: '0 4px 32px 0 rgba(255,146,43,0.10)',
          backdropFilter: 'blur(8px)',
          margin: '0 auto',
        }}>
          <Title order={2} mb="lg" fw={700} style={{ color: '#ff922b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Motivational Quotes</Title>
          <Text c="#222" mb="xl">Manage, Add, Edit, or Delete Motivational Quotes and Resources</Text>
          <Blockquote
            color="#ff922b"
            cite="Zig Ziglar"
            style={{
              fontSize: '1.1rem',
              margin: '0 auto',
              maxWidth: 500,
              background: 'rgba(255,146,43,0.07)',
              borderRadius: 8,
              padding: '16px 24px',
            }}
            icon={<IconSparkles size={32} color="#ff922b" />}
          >
            <strong>"People often say that motivation doesn't last. Well, neither does bathing – that's why we recommend it daily."</strong>
          </Blockquote>

          <Divider my="xl" label="Text-Based Quotes" labelPosition="center" />

          {/* Section 1: Text-Based Motivational Quotes */}
          <Card withBorder p="lg" radius="lg" mb="xl" style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 12px 0 rgba(255,146,43,0.07)' }}>
            <Title order={3} mb="lg">Add New Quote</Title>
            <Textarea
              label="Quote Content"
              placeholder="Enter a motivational quote"
              value={newQuoteContent}
              onChange={(event) => setNewQuoteContent(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleAddQuote();
                }
              }}
              rows={4}
              autosize
              minRows={2}
              mb="md"
            />
            <Button leftSection={<IconPlus size={16} />} onClick={handleAddQuote} color="#ff922b" style={{ fontWeight: 600 }}>
              Add Quote
            </Button>

            <Divider my="xl" label="Uploaded Quotes" labelPosition="center" />

            {errorQuotes && (
              <Alert icon={<IconAlertCircle size={16} />} title="Error!" color="red" mb="md">
                {errorQuotes}
              </Alert>
            )}

            {isLoadingQuotes ? (
              <Group justify="center" mt="md">
                <Loader />
                <Text>Loading quotes...</Text>
              </Group>
            ) : (
              <Stack>
                {quotes.length === 0 ? (
                  <Text c="dimmed" ta="center">No quotes added yet. Add one above!</Text>
                ) : (
                  quotes.map((quote, idx) => (
                    <motion.div
                      key={quote.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.07 }}
                    >
                      <Card withBorder p="md" radius="md" shadow="md" style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 12px 0 rgba(255,146,43,0.07)' }}>
                        <Group justify="space-between" align="flex-start" wrap="nowrap">
                          {editingQuoteId === quote.id ? (
                            <Textarea
                              flex={1}
                              value={editingQuoteContent}
                              onChange={(event) => setEditingQuoteContent(event.currentTarget.value)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' && !event.shiftKey) {
                                  event.preventDefault();
                                  handleUpdateQuote(quote.id);
                                }
                              }}
                              autoFocus
                              rows={3}
                              autosize
                              minRows={2}
                            />
                          ) : (
                            <Text style={{ flexGrow: 1, color: '#222' }}>{quote.content}</Text>
                          )}

                          <Group gap="xs" ml="md">
                            {editingQuoteId === quote.id ? (
                              <>
                                <Button leftSection={<IconCheck size={16} />} onClick={() => handleUpdateQuote(quote.id)} color="#ff922b" style={{ fontWeight: 600 }}>
                                  Save
                                </Button>
                                <ActionIcon
                                  variant="filled"
                                  color="red"
                                  onClick={handleCancelQuoteEdit}
                                  size="lg"
                                  radius="xl"
                                  aria-label="Cancel edit"
                                >
                                  <IconX style={{ width: rem(20), height: rem(20) }} />
                                </ActionIcon>
                              </>
                            ) : (
                              <>
                                <Button leftSection={<IconEdit size={16} />} onClick={() => handleEditQuote(quote)} color="#ff922b" style={{ fontWeight: 600 }}>
                                  Edit
                                </Button>
                                <ActionIcon
                                  variant="light"
                                  color="red"
                                  onClick={() => handleDeleteQuote(quote.id)}
                                  size="lg"
                                  radius="xl"
                                  aria-label="Delete quote"
                                >
                                  <IconTrash style={{ width: rem(20), height: rem(20) }} />
                                </ActionIcon>
                              </>
                            )}
                          </Group>
                        </Group>
                      </Card>
                    </motion.div>
                  ))
                )}
              </Stack>
            )}
          </Card>

          <Divider my="xl" label="Online Quote Resources" labelPosition="center" />

          {/* Section 2: Online Quote Resources */}
          <Card withBorder p="lg" radius="lg" style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 12px 0 rgba(34,139,230,0.07)' }}>
            <Title order={3} mb="lg">Add New Resource</Title>
            <Stack spacing="md">
              <TextInput
                label="Resource Name"
                placeholder="e.g., BrainyQuote, GoodReads"
                value={newResourceName}
                onChange={(event) => setNewResourceName(event.currentTarget.value)}
              />
              <TextInput
                label="Resource Link (URL)"
                placeholder="e.g., https://www.brainyquote.com"
                value={newResourceLink}
                onChange={(event) => setNewResourceLink(event.currentTarget.value)}
                type="url"
              />
              <Button leftSection={<IconPlus size={16} />} onClick={handleAddResource} color="#ff922b" style={{ fontWeight: 600 }}>
                Add Resource
              </Button>
            </Stack>

            <Divider my="xl" label="Uploaded Resources" labelPosition="center" />

            {errorResources && (
              <Alert icon={<IconAlertCircle size={16} />} title="Error!" color="red" mb="md">
                {errorResources}
              </Alert>
            )}

            {isLoadingResources ? (
              <Group justify="center" mt="md">
                <Loader />
                <Text>Loading resources...</Text>
              </Group>
            ) : (
              <Stack>
                {resources.length === 0 ? (
                  <Text c="#222" ta="center">No resources added yet. Add one above!</Text>
                ) : (
                  resources.map((resource, idx) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.07 }}
                    >
                      <Card withBorder p="md" radius="md" shadow="md" style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 12px 0 rgba(255,146,43,0.07)' }}>
                        <Group justify="space-between" align="center" wrap="nowrap">
                          {editingResourceId === resource.id ? (
                            <Stack flex={1} spacing="xs">
                              <TextInput
                                placeholder="Resource Name"
                                value={editingResourceName}
                                onChange={(event) => setEditingResourceName(event.currentTarget.value)}
                                autoFocus
                                size="sm"
                              />
                              <TextInput
                                placeholder="Resource Link (URL)"
                                value={editingResourceLink}
                                onChange={(event) => setEditingResourceLink(event.currentTarget.value)}
                                type="url"
                                size="sm"
                              />
                            </Stack>
                          ) : (
                            <Anchor
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ flexGrow: 1, color: '#222' }}
                              leftSection={<IconLink size={14} color="#ff922b" />}
                            >
                              {resource.name}
                            </Anchor>
                          )}

                          <Group gap="xs" ml="md">
                            {editingResourceId === resource.id ? (
                              <>
                                <Button leftSection={<IconCheck size={16} />} onClick={() => handleUpdateResource(resource.id)} color="#ff922b" style={{ fontWeight: 600 }}>
                                  Save
                                </Button>
                                <ActionIcon
                                  variant="filled"
                                  color="red"
                                  onClick={handleCancelResourceEdit}
                                  size="lg"
                                  radius="xl"
                                  aria-label="Cancel edit"
                                >
                                  <IconX style={{ width: rem(20), height: rem(20) }} />
                                </ActionIcon>
                              </>
                            ) : (
                              <>
                                <Button leftSection={<IconEdit size={16} />} onClick={() => handleEditResource(resource)} color="#ff922b" style={{ fontWeight: 600 }}>
                                  Edit
                                </Button>
                                <ActionIcon
                                  variant="light"
                                  color="red"
                                  onClick={() => handleDeleteResource(resource.id)}
                                  size="lg"
                                  radius="xl"
                                  aria-label="Delete resource"
                                >
                                  <IconTrash style={{ width: rem(20), height: rem(20) }} />
                                </ActionIcon>
                              </>
                            )}
                          </Group>
                        </Group>
                      </Card>
                    </motion.div>
                  ))
                )}
              </Stack>
            )}
          </Card>
        </Paper>
      </Container>
    </Box>
  );
}

export default MotivationalQuotesPage;