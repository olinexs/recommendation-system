import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Snackbar,
    Alert,
    Divider,
    Box,
    Grow
} from '@mui/material';

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('http://127.0.0.1:5000/register', {
                username,
                password
            });
            if (response.status === 201) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (error) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setError('');
        setSuccess('');
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '4rem' }}>
            <Grow in timeout={1000}>
                <Card elevation={10} style={{ borderRadius: '16px', padding: '2rem' }}>
                    <CardContent>
                        <Typography variant="h3" align="center" gutterBottom style={{ fontWeight: 'bold', color: '#1976D2' }}>
                            Create an Account
                        </Typography>
                        <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
                            Fill in the details below to get started
                        </Typography>
                        <Divider style={{ margin: '1rem 0' }} />
                        
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                variant="outlined"
                                margin="normal"
                                InputProps={{ style: { borderRadius: '8px' } }}
                                required
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
                                required
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={loading}
                                style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: '8px', fontSize: '1.1rem' }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                            </Button>
                        </form>

                        <Box mt={3} textAlign="center">
                            <Typography variant="body2">
                                Already have an account? <Button color="primary" onClick={() => navigate('/')}>Login here</Button>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grow>

            {/* Snackbar for success or error messages */}
            <Snackbar open={!!error || !!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
                    {error || success}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Registration;