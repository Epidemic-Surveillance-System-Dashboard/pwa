import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './SamplePage.css';

class App extends Component {
    render() {
        return (
            <div className="sampleApp">
                <header className="sampleApp-header">
                    <p>
                        This is the sample page!
                    </p>
                </header>
            </div>
        );
    }
}

export default App;
