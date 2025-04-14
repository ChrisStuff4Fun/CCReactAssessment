import React from 'react';
import {Link} from 'react-router-dom';

const Start = () => {
    return (
        <div>
        <h1>Welcome to the Home Page</h1>

        <div class = 'fadedLine'></div>
        
        <div class='poshBox'>
            <Link to="/postcodes"><button>Start</button></Link>
        </div>

        </div>
    );
};

export default Start;