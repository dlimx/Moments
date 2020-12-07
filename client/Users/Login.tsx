import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Input } from 'antd';
import { IUser } from '../../types/user';
import { UserCard } from './UserCard';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<IUser>();
  const [error, setError] = useState('');

  const sendData = () => {
    setUser(undefined);
    setError('');
    axios
      .post<IUser>('/api/users/login', { email, password })
      .then(({ data }) => {
        setUser(data);
      })
      .catch((e) => {
        setError('An error occurred');
      });
  };

  return (
    <div>
      <Form>
        <Input
          size="large"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          style={{ marginBottom: 10 }}
        />
        <Input.Password
          size="large"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          style={{ marginBottom: 10 }}
        />
      </Form>
      <Button onClick={sendData} type="primary" size="large" style={{ float: 'right' }}>
        Login
      </Button>

      {!!user && (
        <div style={{ marginTop: 150 }}>
          <h3>User logged in:</h3>
          <UserCard user={user} />
        </div>
      )}
      {!!error && (
        <div style={{ marginTop: 150 }}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      )}
    </div>
  );
};
