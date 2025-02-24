import React, { useContext } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Recommendation from './components/Recommendation';
import Registration from './components/Registration';
import { UserContext } from './context/UserContext';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

const App = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        navigate('/');
    };

    return (
        <>
            {/* Header with conditional navigation */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Product Recommendation System
                    </Typography>
                    {!user ? (
                        <>
                            <Button color="inherit" component={Link} to="/">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Register
                            </Button>
                        </>
                    ) : (
                        <Box style={{ marginLeft: 'auto' }}>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            
            {/* App routes */}
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
                <Route path="/register" element={<Registration />} />
            </Routes>
        </>
    );
};

export default App;
