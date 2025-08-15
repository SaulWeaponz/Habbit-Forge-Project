import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/strapi';

const STRAPI_AUTH_TOKEN = import.meta.env.VITE_STRAPI_AUTH_TOKEN
export const getUsers =()=>{
     const [users, setUsers] = useState([]);
    fetch(API_ENDPOINTS.USERS, {

              headers: {
        Authorization: `Bearer ${STRAPI_AUTH_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);

      return {users}

}

 
    


