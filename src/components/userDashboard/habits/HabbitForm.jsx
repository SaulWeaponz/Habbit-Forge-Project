import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Select,
  Text,
} from "@mantine/core";

const HabbitForm = ({ initialValues = null, onSubmit, onClose, opened }) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      frequency: "",
      startDate: "",
      endDate: "",
      ...initialValues,
    },
    validate: {
      title: (value) =>
        value.length < 2 ? "Title must be at least 2 characters" : null,
      description: (value) =>
        value.length < 5 ? "Description must be at least 5 characters" : null,
      startDate: (value) => {
        if (!value) return "Start date is required";
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today ? "Start date cannot be in the past" : null;
      },
      endDate: (value) => {
        if (!value) return "End date is required";
        const start = new Date(form.values.startDate);
        const end = new Date(value); 
        if (end <= start) return "End date must be after start date";
        return null;
      },
      frequency: (value) => (!value ? "Frequency is required" : null),
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.setValues({
        ...initialValues,
      });
    }
  }, [initialValues]);

  const clearForm = () => {
    form.reset();
  };

  const handleSubmit = async (values) => {
    const formatted = {
      ...values,      
      startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
    };
    
    // Clean up the data before sending
    const { id, ...dataToSend } = formatted;
    
    // Final validation - ensure no empty strings are sent for any field
    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] === '' || dataToSend[key] === null || dataToSend[key] === undefined) {
        delete dataToSend[key];
      }
    });
    
    // Validate that we have the required fields
    if (!dataToSend.title || !dataToSend.description || !dataToSend.frequency || !dataToSend.startDate || !dataToSend.endDate) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please fill in all required fields.',
        color: 'red',
      });
      return;
    }
    
    onSubmit(dataToSend);
    clearForm();
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        clearForm();
        onClose();
        initialValues={}
      }}
      title={initialValues ? "Update Habit" : "Add New Habit"}
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Habit Title"
          placeholder="Enter habit title"
          required
          {...form.getInputProps("title")}
        />

        <Textarea
          label="Habit Description"
          placeholder="Describe your habit"
          required
          mt="sm"
          {...form.getInputProps("description")}
        />

        <Select
          label="Frequency"
          placeholder="Pick one"
          data={["Daily", "Weekly", "Monthly"]}
          required
          mt="sm"
          {...form.getInputProps("frequency")}
        />

        <TextInput
          type="date"
          label="Start Date"
          required
          mt="sm"
          {...form.getInputProps("startDate")}
        />

        <TextInput
          type="date"
          label="End Date"
          required
          mt="sm"
          {...form.getInputProps("endDate")}
        />

        <Button fullWidth type="submit" mt="lg">
          {initialValues ? "Update Habit" : "Create Habit"}
        </Button>
        
      </form>
    </Modal>
  );
};

export default HabbitForm;
