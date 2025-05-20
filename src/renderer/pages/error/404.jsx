import React from 'react';

import { useNavigate } from 'react-router-dom';

const Error404 = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Error 404</h1>
            <button onClick={() => navigate('/')}>Go to Home</button>
        </div>
    );
}   

export default Error404;
