import React, { Component } from 'react';
//Routing
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './SampleHome.css';

class App extends Component {
    render() {
        return (
            <div className="sampleApp">
                <header className="sampleApp-header">
                    <p>
                        This is the Home Page
                    </p>
                </header>
            </div>
        );
    }
}

export default App;
