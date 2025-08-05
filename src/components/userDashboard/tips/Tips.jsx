import React, { useState, useEffect } from "react";

import {
  Card,
  Center,
  Container,
  Text,
  Loader,
  Stack,
  Title,
  Button,
  Group,
  Box,
  Image
} from "@mantine/core";
import useTip from "./tipsutil";
import stickyQuotesImg from '../../../assets/stiky-quotes.jpg';

const Tips = () => {
  const { tips, loading, error, fetchtip } = useTip();
  const [tipIndex, setTipIndex] = useState(0);
  
  // Debug logging
  console.log('Tips component rendered:', { tips, loading, error, tipIndex });
  const fetchNextTip = () => {
    if (tips.length === 0) return;
    setTipIndex((prev) => (prev + 1 >= tips.length ? 0 : prev + 1));
  };

  const fetchPrevTip = () => {
    if (tips.length === 0) return;
    setTipIndex((prevIndex) =>
      prevIndex-1<0?0:prevIndex-1 <tips.length?prevIndex-1:0
    );
  };

  // Ensure tipIndex is within bounds
  const safeTipIndex = Math.min(tipIndex, tips.length - 1);
  const currentTip = tips[safeTipIndex];

  // Reset tipIndex when tips change
  useEffect(() => {
    if (tips.length > 0 && tipIndex >= tips.length) {
      setTipIndex(0);
    }
  }, [tips, tipIndex]);

  if (tips) {
    console.log(tips);
  }
  return (
    <Container size="lg" py="xl">
      <Box style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto' }}>
        {/* Left: Tips Card */}
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Stack align="center" spacing="md">
            <Title order={2} style={{ color: '#ff922b', fontWeight: 700 }}>Daily Habit Tip</Title>
            {loading ? (
              <Center>
                <Loader size="lg" color="orange" />
                <Text mt="md" color="#666">Loading your daily tip...</Text>
              </Center>
            ) : error ? (
              <Card shadow="md" padding="lg" radius="md" withBorder style={{ background: '#fff3e0', border: '1px solid #ffd180' }}>
                <Stack align="center" spacing="md">
                  <Text c="red" fw={600}>Unable to load tips</Text>
                  <Text size="sm" c="#666" ta="center">{error}</Text>
                  <Button onClick={fetchtip} variant="light" color="orange">
                    Try Again
                  </Button>
                </Stack>
              </Card>
            ) : (
              <Card shadow="md" padding="xl" radius="lg" withBorder style={{ 
                background: 'rgba(255,255,255,0.95)', 
                border: '2px solid #ffd180',
                maxWidth: 600,
                width: '100%'
              }}>
                {tips?.length > 0 ? (
                  <>
                    <Text size="lg" style={{ lineHeight: 1.6, color: '#333' }}>
                      {currentTip?.content}
                    </Text>
                    <Text size="sm" align="right" c="dimmed" mt="md">
                      — {currentTip?.category || "Habit Building"}
                    </Text>
                    <Group justify="center" align="center" mt="xl">
                      <Button onClick={fetchPrevTip} variant="light" color="orange">
                        Previous Tip
                      </Button>
                      <Button onClick={fetchNextTip} variant="filled" color="orange">
                        Next Tip
                      </Button>
                    </Group>
                    <Text size="xs" c="dimmed" ta="center" mt="md">
                      Tip {safeTipIndex + 1} of {tips.length}
                    </Text>
                  </>
                ) : (
                  <Stack align="center" spacing="md">
                    <Text color="dimmed" size="lg">No tips available at the moment.</Text>
                    <Text size="sm" c="#666" ta="center">
                      Check back later for helpful habit-building tips!
                    </Text>
                    <Button onClick={fetchtip} variant="light" color="orange">
                      Refresh
                    </Button>
                  </Stack>
                )}
              </Card>
            )}
          </Stack>
        </Box>
        {/* Right: Sticky Quotes Image */}
        <Card shadow="xl" p={0} radius={24} style={{ minWidth: 320, maxWidth: 400, flex: '0 0 370px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(120deg, #fffaf3 0%, #ffe0b2 100%)', border: '2.5px solid #ffe0b2', boxShadow: '0 8px 32px 0 rgba(255,146,43,0.15)' }}>
          <Image src={stickyQuotesImg} alt="Sticky Quotes" radius={24} fit="cover" w={350} h={350} style={{ objectFit: 'cover', borderRadius: 24 }} />
        </Card>
      </Box>
    </Container>
  );
};

export default Tips;
