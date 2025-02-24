import React, { useState, useContext } from 'react'; 
import { fetchRecommendations } from '../api';
import {
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CircularProgress,
    Snackbar,
    Alert,
    Grow,
    Fade
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { UserContext } from '../context/UserContext';

const Recommendation = () => {
    const { user } = useContext(UserContext);
    const [product_title, setProductTitle] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchRecommendations = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchRecommendations(user.user_id, product_title, 5);
            setRecommendations(data);
        } catch (error) {
            console.error('Error in component:', error);
            setError('Failed to fetch recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setError(null);
    };

    return (
        <Container maxWidth="md" style={{ marginTop: '2rem' }}>
            <Fade in timeout={1000}>
                <Typography variant="h3" align="center" gutterBottom>
                    Product Recommendations
                </Typography>
            </Fade>

            <Grid container spacing={2} justifyContent="center" style={{ marginBottom: '2rem' }}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Product Title"
                        value={product_title}
                        onChange={(e) => setProductTitle(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFetchRecommendations}
                        startIcon={<SearchIcon />}
                        disabled={loading || !user}
                        style={{ padding: '0.75rem 2rem' }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Get Recommendations'}
                    </Button>
                </Grid>
            </Grid>

            {recommendations.length > 0 && (
                <Fade in timeout={1000}>
                    <Typography variant="h5" gutterBottom>
                        Recommendations
                    </Typography>
                </Fade>
            )}

            <Grid container spacing={3}>
                {recommendations.map((item, index) => (
                    <Grow in timeout={500 + index * 200} key={index}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card elevation={6} style={{ borderRadius: '16px' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={item.image_url || 'https://via.placeholder.com/200'}
                                    alt={item.title}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/200';
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.brand}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Rating: {item.rating}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grow>
                ))}
            </Grid>

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

export default Recommendation;
