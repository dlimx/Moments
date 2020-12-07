import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users').then(({ data }) => setUsers(data));
  }, []);
  return <div>{JSON.stringify(users)}</div>;
};
