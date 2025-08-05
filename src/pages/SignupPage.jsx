import { useForm } from "@mantine/form";
import React, { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Paper,
  Divider,
  SegmentedControl,
  Loader,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconBrandGoogle, IconUserPlus } from "@tabler/icons-react";
import { motion } from "framer-motion";
import axios from "axios";
import "./LoginPage.css";

const STRAPI_URL = "http://localhost:1337/api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState("strapi");
  const [adminRoles, setAdminRoles] = useState([]);

  useEffect(() => {
    const fetchAdminRoles = async () => {
      try {
        const response = await axios.get(`${STRAPI_URL}/users-permissions/roles`);
        const adminRoles = response.data.roles.filter(role => 
          role.type === 'admin' || role.name === 'Administrator'
        );
        setAdminRoles(adminRoles);
      } catch (error) {
        console.error("Failed to fetch admin roles:", error);
        notifications.show({
          title: "theres an Error",
          message: "Failed to load role information",
          color: "red",
        });
      }
    };
    fetchAdminRoles();
  }, []);

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: 'user'
    },
    validate: {
      username: (value) => (value.length > 3 ? null : "Minimum 4 characters"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length >= 6 ? null : "Minimum 6 characters"),
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords don't match",
    },
  });

  const isUserAdmin = (user) => {
    if (!user.role) return false;
    return adminRoles.some(adminRole => 
      adminRole.id === user.role.id || adminRole.id === user.role
    );
  };

  const handleStrapiSignup = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${STRAPI_URL}/auth/local/register`,
        {
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
        }
      );

      const { jwt, user } = response.data;

      // Fetch complete user data with role
      const userWithRole = await axios.get(`${STRAPI_URL}/users/${user.id}?populate=role`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });

      localStorage.setItem("authToken", jwt);
      localStorage.setItem("user", JSON.stringify(userWithRole.data));

      notifications.show({
        title: "Success",
        message: `Welcome, ${user.username}!`,
        color: "green",
      });

      if (isUserAdmin(userWithRole.data)) {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
      
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message?.[0]?.messages?.[0]?.message || 
               "Registration failed. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values) => {
    handleStrapiSignup(values);
  };

  return (
    <div className="auth-page-container login-page-bg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="login-motion-wrapper"
      >
        <Paper radius="md" p="xl" shadow="lg" className="auth-paper login-paper">
          <Title order={2} ta="center" mb="md" className="login-title">
            Create Account
          </Title>
          <Text ta="center" mb="xl" c="dimmed" className="login-subtitle">
            Start your journey to better habits today
          </Text>

          <SegmentedControl
            fullWidth
            value={authMethod}
            onChange={setAuthMethod}
            data={[
              { label: "Email Signup", value: "strapi" },
              { label: "Social Signup", value: "auth0" },
            ]}
            mb="xl"
            className="login-segmented"
          />

          {authMethod === "strapi" ? (
            <form onSubmit={form.onSubmit(handleSubmit)} className="login-form">
              <TextInput
                label="Username"
                placeholder="Your username"
                {...form.getInputProps("username")}
                mb="md"
                required
                className="login-input"
              />

              <TextInput
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")}
                mb="md"
                required
                className="login-input"
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                {...form.getInputProps("password")}
                mb="md"
                required
                className="login-input"
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm password"
                {...form.getInputProps("confirmPassword")}
                mb="xl"
                required
                className="login-input"
              />

              <Button
                fullWidth
                type="submit"
                leftSection={<IconUserPlus size={18} />}
                loading={loading}
                className="login-btn"
              >
                Create Account
              </Button>
            </form>
          ) : (
            <Button
              fullWidth
              leftSection={<IconBrandGoogle size={18} />}
              onClick={() => {
                // This button is now for social signup, but Auth0 is removed.
                // For now, it will just show a notification or redirect to a placeholder.
                notifications.show({
                  title: "Social Signup",
                  message: "Social signup is not yet implemented.",
                  color: "blue",
                });
              }}
              disabled={true} // Disable as social signup is not implemented
              className="login-google-btn"
            >
              Sign up with Google
            </Button>
          )}

          <Divider label="OR" labelPosition="center" my="lg" className="login-divider" />

          <Text ta="center" mt="md" className="login-signup-text">
            Already have an account?{" "}
            <Text component={Link} to="/login" fw={500} td="underline" className="login-signup-link">
              Log in
            </Text>
          </Text>
        </Paper>
      </motion.div>
    </div>
  );
}