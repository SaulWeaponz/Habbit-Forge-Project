import React from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Text,
  Button,
  Group,
  Burger,
  AppShellSection,
  ScrollArea,
} from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
const UserDashBoard = () => {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);

  const handleNavigate = (path) => {
    navigate(path);
    toggle();
  };
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar width={{ base: 250 }} hidden={!opened}>
        <AppShell.Section pr={20}>
          <ScrollArea style={{ height: "100%" }} mx="auto">
            <Text size="xl" weight={700} mb="md">
              Dashboard
            </Text>

            
            <Button
              variant="gradient"
              fullWidth
              m="md"
              onClick={() => handleNavigate("/user-dashboard/profile")}
            >
              Profile
            </Button>
            <Button
              fullWidth
              variant="gradient"
              m="md"
              onClick={() =>
                handleNavigate("/user-dashboard/habbits-management")
              }
            >
              Habbits Management
            </Button>
            <Button
              fullWidth
              variant="gradient"
              m="md"
              onClick={() => handleNavigate("/user-dashboard/goals-management")}
            >
              Goals Management
            </Button>
            <Button
              fullWidth
              variant="gradient"
              m="md"
              onClick={() =>
                handleNavigate("/user-dashboard/motivational-quotes")
              }
            >
              Motivational quotes
            </Button>
            <Button
              fullWidth
              variant="gradient"
              m="md"
              onClick={() => handleNavigate("/user-dashboard/tips")}
            >
              Tips
            </Button>
          </ScrollArea>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <AppShell.Section grow>
          <Text>Welcome to the user dashboard!</Text>
          <Outlet />
        </AppShell.Section>
      </AppShell.Main>
      <AppShell.Footer>
        <AppShellSection>
      
        </AppShellSection>
      </AppShell.Footer>
    </AppShell>
  );
};

export default UserDashBoard;
