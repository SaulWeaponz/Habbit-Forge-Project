import { useEffect, useState } from "react"



const useTip=()=>{
    const [tips, setTips] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Fallback tips in case API is not available
    const fallbackTips = [
        {
            id: '1',
            content: "Start small! Choose one habit to focus on and make it so easy you can't fail. Consistency beats perfection every time.",
            category: "Getting Started"
        },
        {
            id: '2', 
            content: "Stack your new habit onto an existing one. For example, after you brush your teeth, do 10 push-ups.",
            category: "Habit Stacking"
        },
        {
            id: '3',
            content: "Track your progress visually. Seeing your streak grow is incredibly motivating and helps you stay committed.",
            category: "Progress Tracking"
        },
        {
            id: '4',
            content: "Make your habit obvious by placing visual cues in your environment. Out of sight, out of mind applies to habits too.",
            category: "Environment Design"
        },
        {
            id: '5',
            content: "Celebrate small wins! Every time you complete your habit, give yourself a moment of recognition.",
            category: "Motivation"
        }
    ]

    const fetchTip=async()=>{
        setLoading(true)
        setError('')

        try{
            const res = await fetch("http://localhost:1337/api/habit-tips")
            if(!res.ok)throw new Error('Failed to fetch Tip')
            const data = await res.json()
            if(data.data && data.data.length > 0) {
                setTips(data.data)
            } else {
                // Use fallback tips if API returns empty data
                setTips(fallbackTips)
            }
        }
        catch(err){
            console.log('Using fallback tips due to API error:', err.message)
            // Use fallback tips when API fails
            setTips(fallbackTips)
            setError('')
        }
        finally{
            setLoading(false)
        }
    }

useEffect(()=>{
    fetchTip();
},[]);

return {tips, loading, error, fetchTip}

}



export default useTip