import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  Title,
  Text,
  Paper,
  Notification,
} from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { motion } from "framer-motion";
import axios from "axios";
import { API_ENDPOINTS } from '../config/strapi';

const STRAPI_URL = API_ENDPOINTS.AUTH;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Send POST request to Strapi forgot-password endpoint
      await axios.post(`${STRAPI_URL}/forgot-password`, {
        email: values.email,
      });

      setEmailSent(true);
      notifications.show({
        title: "Success",
        message: "If the email exists, a reset link has been sent.",
        color: "green",
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error",
        message: "Failed to send reset email. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper radius="md" p="xl" shadow="lg" className="auth-paper">
          <Title order={2} ta="center" mb="md">
            Forgot Password
          </Title>
          <Text ta="center" mb="xl" c="dimmed">
            Enter your email to receive password reset instructions.
          </Text>

          {emailSent ? (
            <Notification
              title="Email Sent"
              color="teal"
              withCloseButton={false}
              mt="md"
            >
              If an account with that email exists, a reset link has been sent.
              Please check your inbox.
            </Notification>
          ) : (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")}
                mb="xl"
              />

              <Button
                fullWidth
                type="submit"
                leftSection={<IconMail size={18} />}
                loading={loading}
                size="md"
                color="teal"
                style={{
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  marginBottom: "1rem",
                }}
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <Text ta="center" mt="md">
            Remembered your password?{" "}
            <Text component={Link} to="/login" fw={500} td="underline">
              Back to Login
            </Text>
          </Text>
        </Paper>
      </motion.div>
    </div>
  );
}
