import { useState } from "react";
import { GoalForm } from "./GoalList";
import { 
  Container, 
  Stack, 
  Button, 
  Modal, 
  Text, 
  Loader,
  Paper,
  Title,
  Group,
  Box,
  Center,
  Tabs,
  Grid,
} from "@mantine/core";
import { 
  IconPlus, 
  IconTrash, 
  IconLayoutGrid, 
  IconList,
  IconChartBar,
} from '@tabler/icons-react';
import useGoalsStorge from './utils/goalStrapi';
import { useDisclosure } from "@mantine/hooks";
import InteractiveGoalTracker from './utils/InteractiveGoalTracker';
import GoalAnalytics from './utils/GoalAnalytics';
import useStrapiHabits from '../habits/useLocalStorage';
import dayjs from 'dayjs';
import { getAuthToken } from '../../../utils/auth';


const GoalsManagement = () => {
  const [opened, {open, close}] = useDisclosure(false);
  const {
    goals,
    addGoal,
    addNote,
    loading,
    addSubgoal,
    deleteGoal,
    markGoalsAsComplete,
    removeGoals,
    deleteNotes,
    deleteSubgoals,
    toggleSubgoalCompletion,
    updateGoal
  } = useGoalsStorge(getAuthToken());

  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [viewGoal, setViewGoal] = useState(null);
  const STRAPI_AUTH_TOKEN = getAuthToken();
  const { list: habitsList } = useStrapiHabits(STRAPI_AUTH_TOKEN);

  if (loading) {
    return (
      <Container size="lg">
        <Center style={{ height: '50vh' }}>
          <Stack align="center" spacing="md">
            <Loader size="lg" color="orange" />
            <Text size="lg" style={{ color: '#ff922b', fontWeight: 600 }}>
              Loading your goals...
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #ffe0b2',
          boxShadow: '0 4px 32px 0 rgba(255,146,43,0.10)',
        }}
      >
        <Group justify="space-between" mb="xl">
          <div>
            <Title
              order={1}
              style={{
                color: '#ff922b',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem'
              }}
            >
              Goals Management
            </Title>
            <Text size="lg" color="#222" style={{ fontWeight: 500 }}>
              Set, track, and achieve your personal goals
            </Text>
          </div>
        </Group>

        <Button
          variant="gradient"
          gradient={{ from: '#ff922b', to: '#ffa726', deg: 45 }}
          fullWidth
          size="lg"
          onClick={() => { setEditingGoal(null); setFormOpen(true); }}
          leftSection={<IconPlus size={20} />}
          style={{
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(255,146,43,0.25)',
            marginBottom: '2rem',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 6px 16px rgba(255,146,43,0.35)'
            }
          }}
        >
          Add New Goal
        </Button>

        <GoalForm
          opened={formOpen}
          onClose={() => { setFormOpen(false); setEditingGoal(null); }}
          onSubmit={async (goal) => {
            if (editingGoal) {
              await updateGoal(editingGoal.documentId, goal);
            } else {
              await addGoal(goal);
            }
            setFormOpen(false);
            setEditingGoal(null);
          }}
          initialValues={editingGoal}
        />

        <Stack spacing="lg">
          {(Array.isArray(goals.data) ? goals.data : []).length === 0 ? (
            <Box
              style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                borderRadius: 16,
                border: '2px dashed #ffd180'
              }}
            >
              <Text size="xl" style={{ color: '#ff922b', fontWeight: 700, marginBottom: '1rem' }}>
                No Goals Yet!
              </Text>
              <Text size="md" color="#666">
                Start by adding your first goal above.
              </Text>
            </Box>
          ) : (
            <>
              {(Array.isArray(goals.data) ? goals.data : []).map((goal) => {
                // Map associated habit IDs to titles
                const associatedHabitTitles = (goal.associatedHabits || []).map(hid => {
                  const found = habitsList.find(h => h.documentId === String(hid) || h.id === hid);
                  return found ? found.title : hid;
                });
                return (
                  <Paper key={goal.id} shadow="sm" radius="md" p="md" withBorder>
                    <Group position="apart" align="flex-start">
                      <div style={{width: '100%'}}>
                        <Title order={3} style={{ color: '#ff922b', fontWeight: 700 }}>{goal.title}</Title>
                        <Text size="sm" color="dimmed" mb="xs">{goal.description}</Text>
                        {goal.targetDate && (
                          <Text size="xs" color="gray">Target Date: {goal.targetDate}</Text>
                        )}
                        {goal.accountabilityPartner && (
                          <Text size="xs" color="gray">
                            Accountability Partner: {
                              typeof goal.accountabilityPartner === 'object'
                                ? (goal.accountabilityPartner.username || goal.accountabilityPartner.email || goal.accountabilityPartner.id)
                                : goal.accountabilityPartner
                            }
                          </Text>
                        )}
                        {associatedHabitTitles.length > 0 && (
                          <Text size="xs" color="gray">Associated Habits: {associatedHabitTitles.join(', ')}</Text>
                        )}
                        {goal.subgoals && goal.subgoals.length > 0 && (
                          <>
                            <Text size="xs" color="#ff922b" mt="xs">Subgoals:</Text>
                            <ul style={{margin: 0, paddingLeft: 16}}>
                              {goal.subgoals.map((sub, idx) => (
                                <li key={idx}>
                                  <b>{sub.title}</b> {sub.description && `- ${sub.description}`}
                                  {sub.startDate && ` | Start: ${sub.startDate}`}
                                  {sub.endDate && ` | End: ${sub.endDate}`}
                                  {sub.priority && ` | Priority: ${sub.priority}`}
                                  {sub.completed !== undefined && ` | Completed: ${sub.completed ? 'Yes' : 'No'}`}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        {goal.notes && goal.notes.length > 0 && (
                          <>
                            <Text size="xs" color="#ff922b" mt="xs">Notes:</Text>
                            <ul style={{margin: 0, paddingLeft: 16}}>
                              {goal.notes.map((note, idx) => (
                                <li key={idx}>
                                  <b>{note.title}</b>: {note.description}
                                  {note.createdAt && (
                                    <span style={{color: '#888'}}> ({dayjs(note.createdAt).format('YYYY-MM-DD HH:mm')})</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                      <Group>
                        <Button size="xs" color="blue" variant="outline" onClick={() => setViewGoal(goal)}>View</Button>
                        <Button size="xs" color="orange" variant="outline" onClick={() => { setEditingGoal(goal); setFormOpen(true); }}>Edit</Button>
                        <Button size="xs" color="red" variant="outline" onClick={() => deleteGoal(goal.documentId)}>Delete</Button>
                      </Group>
                    </Group>
                  </Paper>
                );
              })}
              {(Array.isArray(goals.data) ? goals.data : []).length > 0 && (
                <Button
                  mt="xl"
                  color="red"
                  variant="light"
                  onClick={removeGoals}
                  leftSection={<IconTrash size={16} />}
                  style={{
                    background: '#ffebee',
                    color: '#d32f2f',
                    fontWeight: 600,
                    border: '1px solid #ffcdd2'
                  }}
                >
                  Clear All Goals
                </Button>
              )}
            </>
          )}
        </Stack>

        {/* View Goal Modal */}
        <Modal opened={!!viewGoal} onClose={() => setViewGoal(null)} title={viewGoal?.title || 'Goal Details'} size="lg">
          {viewGoal && (
            <div>
              <Text size="sm" color="dimmed" mb="xs">{viewGoal.description}</Text>
              {viewGoal.targetDate && (
                <Text size="xs" color="gray">Target Date: {viewGoal.targetDate}</Text>
              )}
              {viewGoal.accountabilityPartner && (
                <Text size="xs" color="gray">
                  Accountability Partner: {
                    typeof viewGoal.accountabilityPartner === 'object'
                      ? (viewGoal.accountabilityPartner.username || viewGoal.accountabilityPartner.email || viewGoal.accountabilityPartner.id)
                      : viewGoal.accountabilityPartner
                  }
                </Text>
              )}
              {(viewGoal.associatedHabits || []).length > 0 && (
                <Text size="xs" color="gray">
                  Associated Habits: {
                    (viewGoal.associatedHabits || []).map(h => {
                      if (typeof h === 'object' && h !== null) {
                        return h.title || h.id;
                      }
                      const found = habitsList.find(habit => habit.documentId === String(h) || habit.id === h);
                      return found ? found.title : h;
                    }).join(', ')
                  }
                </Text>
              )}
              {viewGoal.subgoals && viewGoal.subgoals.length > 0 && (
                <>
                  <Text size="xs" color="#ff922b" mt="xs">Subgoals:</Text>
                  <ul style={{margin: 0, paddingLeft: 16}}>
                    {viewGoal.subgoals.map((sub, idx) => (
                      <li key={idx}>
                        <b>{sub.title}</b> {sub.description && `- ${sub.description}`}
                        {sub.startDate && ` | Start: ${sub.startDate}`}
                        {sub.endDate && ` | End: ${sub.endDate}`}
                        {sub.priority && ` | Priority: ${sub.priority}`}
                        {sub.completed !== undefined && ` | Completed: ${sub.completed ? 'Yes' : 'No'}`}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {viewGoal.notes && viewGoal.notes.length > 0 && (
                <>
                  <Text size="xs" color="#ff922b" mt="xs">Notes:</Text>
                  <ul style={{margin: 0, paddingLeft: 16}}>
                    {viewGoal.notes.map((note, idx) => (
                      <li key={idx}>
                        <b>{note.title}</b>: {note.description}
                        {note.createdAt && (
                          <span style={{color: '#888'}}> ({dayjs(note.createdAt).format('YYYY-MM-DD HH:mm')})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </Modal>
      </Paper>
    </Container>
  );
};

export default GoalsManagement;
