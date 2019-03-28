import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Account from './Account/Account';
import Analysis from './Analysis/Analysis';
import Dashboard from './Dashboard/Dashboard';
import DataQuality from './DataQuality/DataQuality';
import CreateGraph from './Graph/CreateGraph';
import SaveGraph from './Graph/SaveGraph';
import LocationSelector from './LocationSelector/LocationSelector';
import MetricSelector from './MetricSelector/MetricSelector';
import NavigationMenu from './NavigationMenu/NavigationMenu';
import RangeSelector from './RangeSelector/RangeSelector';
import Users from './Users/Users';
import CreateModifyDeleteUser from './Users/CreateModifyDeleteUser';
import Visualizer from './Visualizer/Visualizer';
import VisualizerManager from './Visualizer/VisualizerManager';
import db from './Database/database';
import * as chai from 'chai';

it('renders Application without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders Account component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<Account />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders Analysis component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<Analysis />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders Dashboard component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<Dashboard />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders DataQuality component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<DataQuality />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders CreateGraph component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<CreateGraph />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders SaveGraph component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<SaveGraph />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders LocationSelector component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<LocationSelector />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders MetricSelector component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<MetricSelector />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders NavigationMenu component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<NavigationMenu />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders RangeSelector component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<RangeSelector initialData={{Dates: {StartDate: new Date(), EndDate: new Date()}}}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders Users component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<Users />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders CreateModifyDeleteUser component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<CreateModifyDeleteUser />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders Visualizer component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<Visualizer />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders VisualizerManager component without crashing', () => {
  const div = document.createElement('username');
  ReactDOM.render(<VisualizerManager />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('Testing retrieval of Metric data', async () =>{
  db.Metrics.toArray((data) => {
    chai.should().exist(data);
  });
})

it('Testing retrieval of LGA data', async () =>{
  db.LGA.toArray((data) => {
    chai.should().exist(data);
  });
})

it('Testing retrieval of LocalUser data', async () =>{
  db.LocalUser.toArray((data) => {
    chai.should().exist(data);
  });
})

it('Testing retrieval of State data', async () =>{
  db.State.toArray((data) => {
    chai.should().exist(data);
  });
})

it('Testing retrieval of Ward data', async () =>{
  db.Ward.toArray((data) => {
    chai.should().exist(data);
  });
})

it('Testing retrieval of Data data', async () =>{
  db.Data.toArray((data) => {
    chai.should().exist(data);
  });
})

it('Testing retrieval of Sets data', async () =>{
  db.Sets.toArray((data) => {
    chai.should().exist(data);
  });
})

it('Testing retrieval of Groups data', async () =>{
  db.Groups.toArray((data) => {
    chai.should().exist(data);
  });
})

it('Testing retrieval of Facility data', async () =>{
  db.Facility.toArray((data) => {
    chai.should().exist(data);
  });
})

it('Testing retrieval of DashboardData data', async () =>{
  db.DashboardData.toArray((data) => {
    chai.should().exist(data);
  });
})

it('Testing retrieval of User data', async () =>{
  db.User.toArray((data) => {
    chai.should().exist(data);
  });
})