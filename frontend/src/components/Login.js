import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; 
import {
    Container,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Divider,
    Box
} from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setUser({ user_id: data.user_id });
                navigate('/recommendations');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setError(null);
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '4rem' }}>
            <Card elevation={10} style={{ borderRadius: '16px', padding: '2rem' }}>
                <CardContent>
                    <Typography variant="h3" align="center" gutterBottom style={{ fontWeight: 'bold', color: '#1976D2' }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
                        Please enter your login credentials to access your account
                    </Typography>
                    <Divider style={{ margin: '1rem 0' }} />

                    <TextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        InputProps={{ style: { borderRadius: '8px' } }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        InputProps={{ style: { borderRadius: '8px' } }}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                        disabled={loading}
                        style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: '8px', fontSize: '1.1rem' }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                    </Button>
                    
                    <Box mt={3} textAlign="center">
                        <Typography variant="body2">
                            Don't have an account? <Link to="/register" style={{ color: '#1976D2', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Error Snackbar */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseError}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Login;