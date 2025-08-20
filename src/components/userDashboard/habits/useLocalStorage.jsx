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
    const cleanedItem = { ...item };
    
    // Remove any undefined or null values that might cause issues
    Object.keys(cleanedItem).forEach(key => {
      if (cleanedItem[key] === undefined) {
        delete cleanedItem[key];
      }
    });
    
    try {
      const requestBody = { data: cleanedItem };
      
      const response = await fetch(API_ENDPOINTS.HABITS, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || `Failed to create habit: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Refresh the habits list
      await fetchHabits();
      
      return responseData;
    } catch (error) {
      throw error;
    }
  };

  // Update habit
  const updateItem = async (id, updatedData) => {
    const formattedData = {
      title: updatedData.title,
      description: updatedData.description,
      frequency: updatedData.frequency,
      startDate: updatedData.startDate,
      endDate: updatedData.endDate,
      completedDates: updatedData.completedDates || [],
    };
    
    // Remove any undefined values
    Object.keys(formattedData).forEach(key => {
      if (formattedData[key] === undefined) {
        delete formattedData[key];
      }
    });
    
    try {
      const response = await fetch(`${API_ENDPOINTS.HABITS}/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ data: formattedData }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || `Failed to update habit: ${response.status}`);
      }
      
      await fetchHabits();
    } catch (error) {
      throw error;
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.HABITS}/${id}`, {
        method: "DELETE",
        headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || `Failed to delete habit: ${response.status}`);
      }
      
      await fetchHabits();
    } catch (error) {
      throw error;
    }
  };

  const toggleHabbitCompletion = async (habitId) => {
    try {
      // Get current habit
      const res = await fetch(`${API_ENDPOINTS.HABITS}/${habitId}`, { headers });
      if (!res.ok) {
        throw new Error(`Failed to fetch habit: ${res.status}`);
      }
      
      const habit = await res.json();
      const existingDates = habit?.data?.attributes?.completedDates || [];
      
      // Get today's date
      const today = dayjs().format("YYYY-MM-DD");
      
      // Prevent duplicates
      const isCompletedToday = existingDates.includes(today);

      const updatedDates = isCompletedToday
        ? existingDates.filter((date) => date !== today)
        : [...existingDates, today];
        
      const response = await fetch(`${API_ENDPOINTS.HABITS}/${habitId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          data: {
            completedDates: updatedDates,
          },
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || `Failed to update habit completion: ${response.status}`);
      }
      
      await fetchHabits();
    } catch (error) {
      throw error;
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
      throw error;
    }
  };

  // Fetch habits
  const fetchHabits = useCallback(async () => {
    if (!token) {
      setError('Authentication required. Please log in again.');
      setList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(API_ENDPOINTS.HABITS, { 
        headers,
        method: 'GET',
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        const errorText = await res.text();
        throw new Error(`Server error (${res.status}): ${errorText}`);
      }
      
      const data = await res.json();

      if (!data || !data.data) {
        throw new Error('Invalid API response structure');
      }

      // Transform the data to include both ID and attributes at the top level
      const transformedData = data.data.map(item => {
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
        return transformed;
      });

      setList(transformedData);
      setError(null);

    } catch (error) {
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
    toggleHabbitCompletion,
    refreshHabits: fetchHabits, // Expose refresh function
  };
};

export default useStrapiHabits;
