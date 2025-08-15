import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import { API_ENDPOINTS } from '../../../config/strapi';

const useStrapiHabits = (token) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Add habit
  const addItem = async (item) => {
    console.log('addItem - item to send:', item);
    try {
      const response = await fetch(API_ENDPOINTS.HABITS, {
        method: "POST",
        headers,
        body: JSON.stringify({ data: item }),
      });
      const responseData = await response.json();
      console.log('addItem - response from backend:', responseData);
      await fetchHabits();
    } catch (error) {
      console.error("Error adding habit", error);
    }
  };

  // Update habit
  const updateItem = async (id, updatedData) => {
    console.log(typeof id);

    const formateddata = {
      title: updatedData.title,
      description: updatedData.description,
      frequency: updatedData.frequency,
      startDate: updatedData.startDate,
      endDate: updatedData.endDate,

      completedDates: updatedData.completedDates || [],

      //partnerId:updatedData.partnerId
    };
    try {
      await fetch(`${API_ENDPOINTS.HABITS}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ data: formateddata }),
      });
      await fetchHabits();
    } catch (error) {
      console.error("Error updating habit", error);
    }
  };

  const removeItem = async (id) => {
    console.log("executed");
    console.log(`${API_ENDPOINTS.HABITS}/${id}`);
    console.log(headers);
    try {
      await fetch(`${API_ENDPOINTS.HABITS}/${id}`, {
        method: "DELETE",
        headers,
      });
      await fetchHabits();
    } catch (error) {
      console.error("Error deleting habit", error);
    }
  };
  const toggleHabbitCompletion = async (habitId) => {
    try {
      //get currennt habbit
      const res = await fetch(`${API_ENDPOINTS.HABITS}/${habitId}`);
      const habit = await res.json();
      const existingDates = habit?.data?.attributes?.completedDates || [];
      // Get today's date
      const today = dayjs().format("YYYY-MM-DD");
      // Prevent duplicates
      const isCompletedToday = existingDates.includes(today);

      const updatedDates = isCompletedToday
        ? existingDates.filter((date) => date !== today)
        : [...existingDates, today];
        console.log(updatedDates)
      const response = await fetch(`${API_ENDPOINTS.HABITS}/${habitId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          data: {
            completedDates: updatedDates,
          },
        }),
      });
      if(!response.ok){
        console.log(response.error)
      }
      await fetchHabits();
    } catch (error) {
      console.error("Error updating progress", error);
    }
  };
  const clearList = async () => {
    try {
      const deletePromises = list.map((habit) =>
        fetch(`${API_ENDPOINTS.HABITS}/${habit.id}`, {
          method: "DELETE",
          headers,
        })
      );
      await Promise.all(deletePromises);
      await fetchHabits();
    } catch (error) {
      console.error("Error clearing habits", error);
    }
  };

  // Fetch habits
  const fetchHabits = useCallback(async () => {
    if (!token) {
      console.warn('No token available for fetching habits');
      setError('Authentication required');
      setList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Attempting to fetch habits from:', API_ENDPOINTS.HABITS);
      console.log('Using headers:', headers);
      
      const res = await fetch(API_ENDPOINTS.HABITS, { 
        headers,
        method: 'GET',
        credentials: 'include' // Include credentials if using cookies
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server response:', errorText);
        throw new Error(`Server error (${res.status}): ${errorText}`);
      }
      
      const data = await res.json();
      console.log('fetchHabits - data received from backend:', data);

      if (!data || !data.data) {
        throw new Error('Invalid API response structure');
      }

      // Transform the data to include both ID and attributes at the top level
      const transformedData = data.data.map(item => {
        console.log('Raw habit item:', item);
        // Use attributes if present, otherwise fallback to item itself
        const attributes = item.attributes || item;
        const transformed = {
          id: item.id,
          documentId: item.id.toString(),
          title: attributes.title || 'Untitled',
          description: attributes.description || '',
          frequency: attributes.frequency || 'Not Set',
          startDate: attributes.startDate || null,
          endDate: attributes.endDate || null,
          completedDates: attributes.completedDates || [],
          ...attributes // Include any other attributes
        };
        console.log('Transformed habit item:', transformed);
        return transformed;
      });

      setList(transformedData);
      setError(null);

    } catch (error) {
      console.error("Error fetching habits:", error);
      setError(error.message);
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [token]); // Only depend on token, not headers which is derived from token

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]); // fetchHabits already handles the token check

  return {
    list,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearList,
    toggleHabbitCompletion
  };
};

export default useStrapiHabits;
