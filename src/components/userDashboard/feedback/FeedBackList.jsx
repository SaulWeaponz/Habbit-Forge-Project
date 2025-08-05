import { Card, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
const STRAPI_AUTH_TOKEN = import.meta.env.VITE_STRAPI_AUTH_TOKEN
const FeedBackList = ({habitId}) => {
    const [feedbacks, setFeedbacks] = useState([])
    useEffect(()=>{
        const fetchFeedbacks = async()=>{
            const res = await fetch(`http://localhost:1337/api/feedbacks?filters[habit][id][$eq]=${habitId}&populate=from_user`, {
                headers:{
                    Authorization: `Bearer ${STRAPI_AUTH_TOKEN}`
                }
            })

            const data = await res.json();
            setFeedbacks(data.data||[])
        }; fetchFeedbacks()
    },[habitId])
  return (
    <Stack>
        {feedbacks?.map((f)=>(
            <Card key={f.id} shadow='sm' padding='sm' radius='md'>
                <Text size='sm' fw='500'>
                    {f.attributes.fromuser?.data?.attributes?.username || 'Annonymus'}

                </Text>
                <Text>
                    {f.attributes.text}
                </Text>
                <Text>
                    {dayjs(f.attributes.createdAt).fromNow()}
                </Text>

            </Card>
        ))}
    </Stack>
  )
}

export default FeedBackList