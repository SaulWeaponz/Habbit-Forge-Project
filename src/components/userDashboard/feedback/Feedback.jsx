import { Button, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useState } from 'react'

const FeedBackForm = ({habitId, fromUserId, toUserId,onFeedBackAdded}) => {
     const STRAPI_AUTH_TOKEN =
    "8028d866d1749f3da8e80af54837e6dc203de30c34eed26a91d180bbbbd3e923a5e6e41bd6f3c3c93220accf8e7fb59a5de57902b15258e8eb0ebb2fb1220e3a8f8e1164affc503672f8b913e607bca96cfbadf2e4e818988db0fe6d2676730cf47120ca8dbd004d0f967cdb3f33915b0d62f35de2422fe8499a5dda9e052738";

    const [text, setText]=useState('')
    const handleSubmit = async()=>{
        try{
           const res = await fetch("http://localhost:1337/api/feedbacks",{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${STRAPI_AUTH_TOKEN}`
            },
            body:JSON.stringify({
                data:{
                    text,
                    fromuser:fromUserId,
                    touser:toUserId,
                    habit: habitId
                }
            })
           }) 
           const response = await res.json()
           if(!res.ok) throw new Error(response.error?.message || 'Failed');
           setText('');
           notifications.show({
            title:'Feedback Sent',
            message: 'Your comment has been submitted',
            color:'green'
           });
           onFeedBackAdded?.(response.data)

        }catch(err){
            notifications.show({
                title:'Error',
                message: err.message,
            color:'red'            })
        }
    }
    
  return (
    <>
    <Textarea
    label='Leave Feedback'
    placeholder='Encourage or suggest improvements'
    value={text}
    onChange={(e)=>setText(e.currentTarget.value)}
    minRows={5}
    >

    </Textarea>
    <Button mt='md' onClick={handleSubmit} disabled={!text.trim()}>Submit FeedBack</Button>
    </>
  )
}

export default FeedBackForm

