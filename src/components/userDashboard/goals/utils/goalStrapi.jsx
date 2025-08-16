import { useEffect, useState, useCallback } from "react";
import { API_ENDPOINTS } from '../../../../config/strapi';

const useGoalsStorage = (authToken) => {
    const [loading, setLoading] = useState(true)
    const [goals, setGoals] = useState([])
    const AllGoals_Api = `${API_ENDPOINTS.GOALS}?populate[associatedHabits][populate]=*`
    const Goals_Api = API_ENDPOINTS.GOALS

    const headers = {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    }

const fetchGoals =useCallback( async()=>{
    try{
        setLoading(true)
        const res = await fetch(`${AllGoals_Api}`,{headers})
        const response = await res.json();
        setGoals(response)

    }catch(error){
        console.error('Error Fetching Goals',error)

    }finally{
setLoading(false)

    }

},[authToken])

useEffect(()=>{fetchGoals()},[fetchGoals]);

const addGoal = async(goal)=>{
    console.log('Adding goal:', goal);

    const {partnerSearch, associatedHabits = [], ...data} = goal;
    try {
        // Convert habit IDs to integers if they're strings
        const processedHabits = associatedHabits.map(id => parseInt(id)).filter(id => !isNaN(id));
        const payload = {
            data: {
                ...data,
                completed: false,
                subgoals: [],
                notes: [],
                progress: 0,
                habitProgress: Object.fromEntries(processedHabits.map(id => [id, 0])),
                associatedHabits: processedHabits
            }
        };
        console.log('Payload sent to Strapi for addGoal:', payload);
        const res = await fetch(`${Goals_Api}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
        });
        const responseData = await res.json();
        console.log('Response from Strapi for addGoal:', responseData);
        if (!res.ok) {
            console.error('Server error:', responseData);
            throw new Error(responseData.error?.message || 'Failed to create goal');
        }
        await fetchGoals();
    } catch(err) {
        console.error('Error adding goal:', err);
        throw err; // Re-throw to handle in the UI
    }
}

const deleteGoal=async(goalId)=>{
    const goal = goals.data?.find((goal)=>goal.documentId === goalId)
    try{
        const response = await fetch(`${Goals_Api}/${goal.documentId}`,{
        method:'DELETE',
        headers        
    })
    if(!response.ok){
        const errordata = await res.json()
        console.error(errordata)
    }
    await fetchGoals()
    }catch(err){
        console.error('Error deleting Goal', err)
    }

    
}

const addSubgoal = async(goalId, subgoal)=>{
   console.log(subgoal)
   const cleandata = {title:subgoal.title, description:subgoal.description, startDate:subgoal.startDate, endDate:subgoal.endDate,  priority:subgoal.priority ,completed:false, progress:50}


    try{
    const goal = goals.data?.find((goal)=> goal.documentId ===goalId)

    const sanitizedSubgoals = goal.subgoals.map(({id, ...rest})=>rest)
    const updatedSubgoals = [...(sanitizedSubgoals || []), cleandata]
    const {id, documentId,createdAt,updatedAt,notes,...dataToSend} = goal
    const data = {...dataToSend, subgoals:updatedSubgoals}
    console.log(data)
    await updateGoal(goalId, data )

    }catch(error){
        console.error('Error Adding subgoals to your goal', error)
    }

}

const addNote=async(goalId, notes)=>{
    const newNote = {title:notes.title,
        description:notes.description,
        createdAt: new Date().toISOString()
    }
    try{
    const goal = goals.data.find((goal)=>goal.documentId === goalId)
    const sanitizedNotes = goal.notes.map(({id, ...rest})=>rest)

    const {id, documentId,createdAt,updatedAt,subgoals,...dataToSend} = goal
    const updatedNotes = [...(sanitizedNotes|| []), newNote]
    const data = {...dataToSend, notes:updatedNotes }
    console.log(data)
    await updateGoal(goalId, data)
    }
    catch(err){
        console.error('Error adding Notes' , err)
    }
}

const updateHabitProgress = async (goalId, habitId, progress) => {
  const goal = goals.data?.find((g) => g.documentId === goalId);
  if (!goal) return;

  const { id, documentId, createdAt, updatedAt, ...dataToSend } = goal;
  const habitProgress = { ...goal.habitProgress, [habitId]: progress };
  
  await updateGoal(goalId, {
    ...dataToSend,
    habitProgress
  });
};

const updateGoal = async(id, updatedData)=>{
  try{
    // If associatedHabits is an array, wrap it in { set: [...] }
    const dataToSend = { ...updatedData };
    if (Array.isArray(dataToSend.associatedHabits)) {
      dataToSend.associatedHabits = { set: dataToSend.associatedHabits.map(Number) };
    }
    const res = await fetch(`${Goals_Api}/${id}`,{
      method:'PUT',
      headers,
      body: JSON.stringify({data: dataToSend})
    });

    if(!res.ok){
        const errordata = await res.json()
        console.error(errordata)
    }
    await fetchGoals();
}catch(err){
    console.error('Error updating goal', err)
}
}

const deleteNotes = async(goalId, noteIdToDelete)=>{
    const goal =goals.data?.find(goal=>goalId ===goal.documentId)
    if(!goal){
        console.error('No goals to delete')
        return;
    }
    const updatedNotes = (goal.notes || []).filter((note)=>note.id !== noteIdToDelete)
    const {
      id,
      documentId,
      createdAt,
      updatedAt,
      publishedAt,
      ...rest
    } = goal;
 const sanitizedsub = goal.subgoals.map(({id, ...rest})=>rest)
      const updatedData = {
      ...rest,
      notes: updatedNotes,
      subgoals: sanitizedsub|| [],  // ensure subgoals are retained
    };

   try{  const res = await fetch(`${Goals_Api}/${goalId}`,{
        method:'PUT',
        headers,
        body: JSON.stringify({data:updatedData})
    })

    const result = await res.json()
    if (!res.ok) {
      throw new Error(result?.error?.message || "Failed to update goal");
    }
      console.log("Note deleted successfully");
  } catch (error) {
    console.error("Error deleting note:", error);


  }}
  const toggleSubgoalCompletion = async (goalId, subgoalId) => {
  const goal = goals.data?.find((g) => g.documentId === goalId);
  if (!goal) return;

  // Update the specific subgoal's completion status
  const updatedSubgoalsWithId = goal.subgoals.map((sub) =>
    sub.id === subgoalId ? { ...sub, completed: !sub.completed } : sub
  );

  // Remove the `id` field from subgoals before sending to Strapi
  const updatedSubgoals = updatedSubgoalsWithId.map(({ id, ...rest }) => rest);

  // Check if all subgoals are completed
  const allCompleted = updatedSubgoalsWithId.every((sub) => sub.completed);

  // Prepare goal data to update (excluding system fields)
  const { id, documentId, createdAt, updatedAt, notes, ...dataToSend } = goal;
  const submissions = {
    ...dataToSend,
    subgoals: updatedSubgoals,
    completed: allCompleted,
  }
  console.log(submissions)

  await updateGoal(goalId, submissions);
};

const markGoalsAsComplete = async (goalId) => {
  const goal = goals.data?.find((g) => g.documentId === goalId);
  if (!goal) return;

  // Destructure to remove unwanted fields
  const { id, updatedAt, createdAt, documentId, notes, ...rest } = goal;

  // Remove `id` from each subgoal and toggle `completed`
  const sanitizedSubgoals = goal.subgoals.map(({ id, ...sub }) => ({
    ...sub,
    completed: !sub.completed,
  }));

  await updateGoal(goalId, {
    ...rest,
    completed: !goal.completed,
    subgoals: sanitizedSubgoals,
  });
};

const deleteSubgoals=async(goalId, subgoalsId)=>{
    const goal = goals.data.find((goal)=>goal.documentId ===goalId )
       if(!goal){
        console.error('No goals to delete')
        return;
    }
     const updatedSubgoals = (goal.subgoals || []).filter((subgoal)=>subgoal.id !== subgoalsId)
    const {
      id,
      documentId,
      createdAt,
      updatedAt,
      publishedAt,
      ...rest
    } = goal;
    const mynotes = goal.notes.map(({id,...rest})=>rest)

      const updatedData = {
      ...rest,
      notes:mynotes|| [],
      subgoals: updatedSubgoals  // ensure subgoals are retained
    };

   try{  const res = await fetch(`${Goals_Api}/${goalId}`,{
        method:'PUT',
        headers,
        body: JSON.stringify({data:updatedData})
    })

    const result = await res.json()
    if (!res.ok) {
      throw new Error(result?.error?.message || "Failed to update goal");
    }
      console.log("Note deleted successfully");
  } catch (error) {
    console.error("Error deleting note:", error);
  }


}
const removeGoals = async () => {
    try {
        const deletePromises = goals.data?.map((goal) =>
            fetch(`${Goals_Api}/${goal.documentId}`, {
                method: 'DELETE',
                headers,
            })
        );
        await Promise.all(deletePromises)
        await fetchGoals()
    }
    catch(err){
        console.error('Error removin goals', err)
    }}
    
return {
    goals,
    loading,
    addGoal,
    addSubgoal,
    addNote,
    toggleSubgoalCompletion,
    deleteNotes,
    markGoalsAsComplete,
    removeGoals,
    deleteSubgoals,
    deleteGoal,
    updateHabitProgress,
    updateGoal
}
  

}
export default useGoalsStorage