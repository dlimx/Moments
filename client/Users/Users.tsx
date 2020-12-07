import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Row } from 'antd';
import { IUser } from '../../types/user';
import { UserCard } from './UserCard';

export const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    axios.get('/api/users').then(({ data }) => setUsers(data));
  }, []);

  return (
    <div style={{ margin: 10 }}>
      <Row gutter={16}>
        {users.map((user) => (
          <Col span={8}>
            <UserCard user={user} />
          </Col>
        ))}
      </Row>
    </div>
  );
};
