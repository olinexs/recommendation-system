import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Recommendation from './components/Recommendation';
import { UserContext } from './context/UserContext'; // Import the UserContext

const App = () => {
    const { user } = useContext(UserContext); // Access user from context

    return (
        <Routes>
            <Route
                path="/"
                element={
                    user ? (
                        <Navigate to="/recommendations" />
                    ) : (
                        <Login />
                    )
                }
            />
            <Route
                path="/recommendations"
                element={
                    user ? (
                        <Recommendation />
                    ) : (
                        <Navigate to="/" />
                    )
                }
            />
        </Routes>
    );
};

export default App;