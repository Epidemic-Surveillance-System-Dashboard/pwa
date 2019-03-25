import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Account from './Account/Account';
import db from './Database/database';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders account without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<Account />, div);
  ReactDOM.unmountComponentAtNode(div);
});
