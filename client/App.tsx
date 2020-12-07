import React from 'react';
import { Switch, Route, Link, useLocation } from 'react-router-dom';

import { Layout, Menu, Typography } from 'antd';
import { Registration } from './Users/Registration';
import { Users } from './Users/Users';
import { Login } from './Users/Login';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export const App = () => {
  const location = useLocation();

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ float: 'left' }}>
          <Title style={{ color: 'white', margin: 0 }}>Moments</Title>
        </div>
        <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
          <Menu.Item key="/">
            <Link to="/">Users</Link>
          </Menu.Item>
          <Menu.Item key="/login">
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="/registration">
            <Link to="/registration">Register</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ margin: '40px auto' }}>
        <Switch>
          <Route path="/registration">
            <Registration />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Users />
          </Route>
        </Switch>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Moments ©2018 Created by David Li</Footer>
    </Layout>
  );
};
