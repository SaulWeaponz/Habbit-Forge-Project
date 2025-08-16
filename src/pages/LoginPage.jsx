import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Paper,
  Divider,
  Center,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconLogin } from "@tabler/icons-react";
import { motion } from "framer-motion";
import axios from "axios";
import "./LoginPage.css";
import { saveUserToStorage } from '../utils/localStorage';
import { API_ENDPOINTS } from '../config/strapi';

const STRAPI_URL = API_ENDPOINTS.AUTH;

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${STRAPI_URL}/local`,
        {
          identifier: form.email,
          password: form.password,
        }
      );
      if (response.data.jwt) {
        const user = response.data.user;
        // Fetch the full user with role
        const userWithRoleRes = await axios.get(
          `${API_ENDPOINTS.USERS}/${user.id}?populate=role`
        );
        const userWithRole = userWithRoleRes.data;
        saveUserToStorage({
          ...userWithRole,
          picture: userWithRole.profilePicture
            ? (Array.isArray(userWithRole.profilePicture)
                ? userWithRole.profilePicture[0]?.url
                : userWithRole.profilePicture.url)
            : '',
          profilePicture: userWithRole.profilePicture,
        }, response.data.jwt);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("authMethod", "strapi");
        notifications.show({
          title: "Success",
          message: `Welcome back, ${userWithRole.username || userWithRole.email}!`,
          color: "green",
        });
        if (userWithRole.role && (userWithRole.role.name === "Administrator" || userWithRole.role.type === "admin")) {
          navigate("/admin");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        notifications.show({
          title: "Error",
          message: "Invalid credentials",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Strapi login error:", error);
      notifications.show({
        title: "Error",
        message: "Failed to log in",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-bg">
      <motion.div
        className="login-motion-wrapper"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="login-page-right" style={{ margin: '0 auto' }}>
          <Paper className="login-paper" shadow="md">
            <Title order={2} align="center" mb="md" className="login-title">
              Welcome back
            </Title>
            <Text align="center" mb="md" className="login-subtitle">
              Login to your account
            </Text>
            <form onSubmit={handleSubmit} className="login-form">
              <TextInput
                label="Email"
                placeholder="Enter your email"
                name="email"
                value={form.email}
                onChange={handleChange}
                mb="md"
                className="login-input"
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                name="password"
                value={form.password}
                onChange={handleChange}
                mb="md"
                className="login-input"
              />
              <Button
                type="submit"
                fullWidth
                loading={loading}
                leftSection={<IconLogin />}
                mb="md"
                className="login-btn"
                size="md"
              >
                Login
              </Button>
            </form>
            <Divider label="Or continue with" labelPosition="center" my="md" className="login-divider" />
            <Center>
              <Text size="sm" color="dimmed" className="login-signup-text">
                Don't have an account?{' '}
                <Link to="/register" className="login-signup-link">
                  Register
                </Link>
              </Text>
            </Center>
          </Paper>
        </div>
      </motion.div>
    </div>
  );
}