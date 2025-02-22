import React, { useState, useContext } from 'react'; // Add useContext
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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { UserContext } from '../context/UserContext'; // Import UserContext

const Recommendation = () => {
    const { user } = useContext(UserContext); // Access user from context
    const [product_title, setProductTitle] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchRecommendations = async () => {
        setLoading(true);
        setError(null);
        try {
            // Use user.user_id from context
            const data = await fetchRecommendations(user.user_id, product_title, 5);
            console.log('API Response:', data); // Debugging
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
            <Typography variant="h3" align="center" gutterBottom>
                Product Recommendations
            </Typography>

            {/* Input Fields */}
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
                        disabled={loading || !user} // Disable if user is not logged in
                    >
                        {loading ? <CircularProgress size={24} /> : 'Get Recommendations'}
                    </Button>
                </Grid>
            </Grid>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <Typography variant="h5" gutterBottom>
                    Recommendations
                </Typography>
            )}
            <Grid container spacing={3}>
                {recommendations.map((item, index) => {
                    console.log('Image URL:', item.image_url); // Debugging
                    return (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={item.image_url || 'https://via.placeholder.com/200'} // Fallback image
                                    alt={item.title}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/200'; // Fallback image
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
                    );
                })}
            </Grid>

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

export default Recommendation;