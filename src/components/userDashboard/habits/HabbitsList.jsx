import React from "react";
import { Card, Group, Text, Button, Stack } from "@mantine/core";
import { IconEdit, IconTrash } from '@tabler/icons-react';

export function HabbitsList({ list, removeItem, updateItem, setEditingHabit, open }) {
  return (
    <Stack spacing="md">
      {list.map((habit) => (
        <Card key={habit.documentId} shadow="sm" padding="lg" radius="md" withBorder>
          <Group position="apart" align="flex-start">
            <div>
              <Text size="lg" weight={700} color="#ff922b">{habit.title}</Text>
              <Text size="sm" color="dimmed">{habit.description}</Text>
              <Text size="xs" color="gray">Frequency: {habit.frequency}</Text>
              {habit.startDate && <Text size="xs" color="gray">Start: {habit.startDate}</Text>}
              {habit.endDate && <Text size="xs" color="gray">End: {habit.endDate}</Text>}
            </div>
            <Group>
              <Button
                size="xs"
                variant="outline"
                color="orange"
                leftSection={<IconEdit size={14} />}
                onClick={() => {
                  setEditingHabit(habit);
                  open();
                }}
              >
                Edit
              </Button>
              <Button
                size="xs"
                variant="outline"
                color="red"
                leftSection={<IconTrash size={14} />}
                onClick={() => removeItem(habit.documentId)}
              >
                Delete
              </Button>
            </Group>
          </Group>
        </Card>
      ))}
    </Stack>
  );
} 