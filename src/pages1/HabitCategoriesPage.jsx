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
  IconAlertCircle,
  IconSparkles,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import { API_ENDPOINTS } from '../config/strapi';

// Define your Strapi API URL for habit categories
const STRAPI_CATEGORIES_API_URL = API_ENDPOINTS.HABIT_CATEGORIES;

// Animated background keyframes
const animatedBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

function HabitCategoriesPage() {
  // --- STATE FOR HABIT CATEGORIES ---
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingCategoryDescription, setEditingCategoryDescription] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  // --- useEffect for Fetching Habit Categories ---
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setErrorCategories(null);
      try {
        const response = await fetch(STRAPI_CATEGORIES_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // --- ADJUSTMENT HERE: Directly access 'name' and 'description' ---
        // Strapi returns data in a 'data' array, but 'attributes' is NOT nested.
        const formattedCategories = data.data.map(item => ({
          id: item.id.toString(),
          name: item.name,          // CHANGED: from item.attributes.name to item.name
          description: item.description, // CHANGED: from item.attributes.description to item.description
        }));
        setCategories(formattedCategories);
      } catch (e) {
        console.error("Failed to fetch categories:", e);
        setErrorCategories("Failed to load categories. Please try again. Make sure your Strapi server is running and permissions are set.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount

  // --- CRUD OPERATIONS FOR HABIT CATEGORIES ---

  const handleAddCategory = async () => {
    const trimmedName = newCategoryName.trim();
    const trimmedDescription = newCategoryDescription.trim();

    if (trimmedName) { // Description is optional, but name is required
      setErrorCategories(null);
      try {
        const response = await fetch(STRAPI_CATEGORIES_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: { // When sending, Strapi v5 still expects `data` wrapper for attributes
              name: trimmedName,
              description: trimmedDescription,
            }
          }),
        });

        if (!response.ok) {
          // Attempt to parse error message from Strapi
          const errorText = await response.text();
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMessage = errorJson.error.message;
            }
          } catch (parseError) {
            // If it's not JSON, use the raw text
            errorMessage = `HTTP error! status: ${response.status}. Response: ${errorText}`;
          }
          throw new Error(errorMessage);
        }

        const addedCategory = await response.json();
        setCategories((prevCategories) => [
          ...prevCategories,
          {
            id: addedCategory.data.id.toString(),
            // --- ADJUSTMENT HERE: Directly access 'name' and 'description' ---
            name: addedCategory.data.name,          // CHANGED: from addedCategory.data.attributes.name to addedCategory.data.name
            description: addedCategory.data.description, // CHANGED: from addedCategory.data.attributes.description to addedCategory.data.description
          },
        ]);
        setNewCategoryName('');
        setNewCategoryDescription('');
      } catch (e) {
        console.error("Failed to add category:", e);
        setErrorCategories(`Failed to add category: ${e.message}. Check Strapi permissions for 'create'.`);
      }
    } else {
      alert('Category name cannot be empty.');
    }
  };

  const handleDeleteCategory = async (id) => {
    setErrorCategories(null);
    try {
      const response = await fetch(`${STRAPI_CATEGORIES_API_URL}/${id}`, {
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
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
      if (editingCategoryId === id) {
        handleCancelCategoryEdit();
      }
    } catch (e) {
      console.error("Failed to delete category:", e);
      setErrorCategories(`Failed to delete category: ${e.message}. Check Strapi permissions for 'delete'.`);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setEditingCategoryDescription(category.description);
  };

  const handleUpdateCategory = async (id) => {
    const trimmedName = editingCategoryName.trim();
    const trimmedDescription = editingCategoryDescription.trim();

    if (trimmedName) {
      setErrorCategories(null);
      try {
        const response = await fetch(`${STRAPI_CATEGORIES_API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: { // When sending, Strapi v5 still expects `data` wrapper for attributes
              name: trimmedName,
              description: trimmedDescription,
            }
          }),
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

        const updatedCategoryData = await response.json();
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === id
              ? {
                  id: updatedCategoryData.data.id.toString(),
                  // --- ADJUSTMENT HERE: Directly access 'name' and 'description' ---
                  name: updatedCategoryData.data.name,          // CHANGED
                  description: updatedCategoryData.data.description, // CHANGED
                }
              : category
          )
        );
        setEditingCategoryId(null);
        setEditingCategoryName('');
        setEditingCategoryDescription('');
      } catch (e) {
        console.error("Failed to update category:", e);
        setErrorCategories(`Failed to update category: ${e.message}. Check Strapi permissions for 'update'.`);
      }
    } else {
      alert('Category name cannot be empty.');
    }
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
    setEditingCategoryDescription('');
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
          <Title order={2} mb="lg" fw={700} style={{ color: '#ff922b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Habit Categories</Title>
          <Text c="#222" mb="xl">Manage, Add, Edit, or Delete Habit Categories</Text>
          <Blockquote
            color="#ff922b"
            cite="James Clear"
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
            <strong>"You do not rise to the level of your goals. You fall to the level of your systems."</strong>
          </Blockquote>

          <Divider my="xl" label="Add New Category" labelPosition="center" />

          {/* Section: Add New Habit Category */}
          <Card withBorder p="lg" radius="lg" mb="xl" style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 12px 0 rgba(255,146,43,0.07)' }}>
            <Title order={3} mb="lg">Add Category</Title>
            <Stack spacing="md">
              <TextInput
                label="Category Name"
                placeholder="e.g., Health, Learning, Finance"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleAddCategory();
                  }
                }}
                required
              />
              <Textarea
                label="Category Description (Optional)"
                placeholder="Brief description of this category"
                value={newCategoryDescription}
                onChange={(event) => setNewCategoryDescription(event.currentTarget.value)}
                autosize
                minRows={2}
              />
              <Button leftSection={<IconPlus size={16} />} onClick={handleAddCategory} color="#ff922b" style={{ fontWeight: 600 }}>
                Add Category
              </Button>
            </Stack>
          </Card>

          <Divider my="xl" label="Existing Categories" labelPosition="center" />

          {/* Section: Display and Manage Existing Habit Categories */}
          {errorCategories && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error!" color="red" mb="md">
              {errorCategories}
            </Alert>
          )}

          {isLoadingCategories ? (
            <Group justify="center" mt="md">
              <Loader />
              <Text>Loading categories...</Text>
            </Group>
          ) : (
            <Stack>
              {categories.length === 0 ? (
                <Text c="#222" ta="center">No categories added yet. Add one above!</Text>
              ) : (
                categories.map((category, idx) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.07 }}
                  >
                    <Card withBorder p="md" radius="md" shadow="md" style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 12px 0 rgba(255,146,43,0.07)' }}>
                      <Group justify="space-between" align="flex-start" wrap="nowrap">
                        {editingCategoryId === category.id ? (
                          <Stack flex={1} spacing="xs">
                            <TextInput
                              placeholder="Category Name"
                              value={editingCategoryName}
                              onChange={(event) => setEditingCategoryName(event.currentTarget.value)}
                              autoFocus
                              size="sm"
                              required
                            />
                            <Textarea
                              placeholder="Category Description"
                              value={editingCategoryDescription}
                              onChange={(event) => setEditingCategoryDescription(event.currentTarget.value)}
                              autosize
                              minRows={2}
                              size="sm"
                            />
                          </Stack>
                        ) : (
                          <Stack flex={1} spacing={4}>
                            <Text fw={600} size="lg" style={{ color: '#222' }}>{category.name}</Text>
                            {category.description && (
                              <Text size="sm" style={{ color: '#222' }}>{category.description}</Text>
                            )}
                          </Stack>
                        )}

                        <Group gap="xs" ml="md">
                          {editingCategoryId === category.id ? (
                            <>
                              <Button leftSection={<IconCheck size={16} />} onClick={() => handleUpdateCategory(category.id)} color="#ff922b" style={{ fontWeight: 600 }}>
                                Save
                              </Button>
                              <ActionIcon
                                variant="filled"
                                color="red"
                                onClick={handleCancelCategoryEdit}
                                size="lg"
                                radius="xl"
                                aria-label="Cancel edit"
                              >
                                <IconX style={{ width: rem(20), height: rem(20) }} />
                              </ActionIcon>
                            </>
                          ) : (
                            <>
                              <Button leftSection={<IconEdit size={16} />} onClick={() => handleEditCategory(category)} color="#ff922b" style={{ fontWeight: 600 }}>
                                Edit
                              </Button>
                              <ActionIcon
                                variant="light"
                                color="red"
                                onClick={() => handleDeleteCategory(category.id)}
                                size="lg"
                                radius="xl"
                                aria-label="Delete category"
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
        </Paper>
      </Container>
    </Box>
  );
}

export default HabitCategoriesPage;