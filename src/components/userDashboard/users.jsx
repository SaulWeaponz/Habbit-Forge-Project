import {useState} from 'react'

const STRAPI_AUTH_TOKEN = import.meta.env.VITE_STRAPI_AUTH_TOKEN
export const getUsers =()=>{
     const [users, setUsers] = useState([]);
    fetch("http://localhost:1337/api/users", {

              headers: {
        Authorization: `Bearer ${STRAPI_AUTH_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error);

      return {users}

}

 
    


