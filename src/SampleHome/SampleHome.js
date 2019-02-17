import React, { Component } from 'react';
//Routing
import './SampleHome.css';
import LocationSelector from "../LocationSelector/LocationSelector"

class App extends Component {
    render() {
        return (
            <div className="sampleApp">
                <header className="sampleApp-header">
                    <p>
                        This is the Home Page
                    </p>
                    <LocationSelector></LocationSelector>
                </header>
            </div>
        );
    }
}

export default App;
