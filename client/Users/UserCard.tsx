import React from 'react';
import { Card } from 'antd';
import { IUser } from '../../types/user';

interface IUserCard {
  user: IUser;
}

export const UserCard: React.FC<IUserCard> = ({ user }) => (
  <Card title={user.name} style={{ margin: '10px 0', minWidth: '300 px' }}>
    <p>
      <strong>ID</strong> - {user.id}
    </p>
    <p>
      <strong>Email</strong> - {user.email}
    </p>
    <p>
      <strong>Name</strong> - {user.name}
    </p>
    {!!user.token && (
      <p>
        <strong>Token</strong> - {user.token}
      </p>
    )}
  </Card>
);
