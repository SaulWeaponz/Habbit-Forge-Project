import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Autocomplete,
  Select,
} from "@mantine/core";
import { API_ENDPOINTS } from '../../../config/strapi';

const HabbitForm = ({ initialValues = null, onSubmit, onClose, opened }) => {
  const STRAPI_AUTH_TOKEN = import.meta.env.VITE_STRAPI_AUTH_TOKEN;
  const [users, setUsers] = useState([]);


  // Fetch users
  useEffect(() => {
    fetch(API_ENDPOINTS.USERS, {
      headers: {
        Authorization: `Bearer ${STRAPI_AUTH_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      description: "",
      frequency: "",
      startDate: "",
      endDate: "",
      partnerSearch: "",
      accountabilityPartner: '',
      ...initialValues,
    },
    validate: {
      title: (value) =>
        value.length < 2 ? "Title must be at least 2 characters" : null,
      description: (value) =>
        value.length < 5 ? "Description must be at least 5 characters" : null,
      startDate: (value) => {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today ? "Start date must be in the future" : null;
      },
      endDate: (value) => {
        const start = new Date(form.values.startDate);
        const end = new Date(value); 
        return end < start ? "End date must be after start date" : null;
      },
      frequency: (value) => (!value ? "Frequency is required" : null),
      accountabilityPartner: (value, values) => {
        if (!value && !values.partnerSearch) {
          return "Please select an accountability partner";
        }
        return null;
      },
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.setValues({
        ...initialValues,
        partnerSearch: "", //  prefill display string
      });
    }
  }, [initialValues]);

  const handleSubmit = async (values) => {
    const formatted = {
      ...values,      
      startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
     
    };
  
    const {partnerSearch, id,...dataToSend } = formatted;
  onSubmit(dataToSend)
  form.reset()
 
};
  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
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

        <Autocomplete
          label="Accountability Partner"
          placeholder="Search by username or email"
          searchable
          nothingFound="No users found"
          mt="sm"
          value={form.values.partnerSearch}
          onChange={(val) => form.setFieldValue("partnerSearch", val)}
          onOptionSubmit={(val) => {
            const selectedUser = users.find(
              (u) => `${u.username} (${u.email})` === val
            );
            form.setFieldValue("partnerSearch", val);
            form.setFieldValue("accountabilityPartner", selectedUser?.id);
          }}
          data={users?.map((u) => `${u.username} (${u.email})`)}
        />

        <Button fullWidth type="submit" mt="lg">
          {initialValues ? "Update Habit" : "Create Habit"}
        </Button>
      </form>
    </Modal>
  );
};

export default HabbitForm;
