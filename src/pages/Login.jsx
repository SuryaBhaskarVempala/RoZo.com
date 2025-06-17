import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
// import { Cookie } from 'lucide-react'; // No longer needed if not used

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState(''); // State for general submission errors

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prevState => ({
                ...prevState,
                [name]: ''
            }));
        }
        setSubmitError(''); // Clear general submit error on input change
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${apiUrl}/user/login`, { // Use 'http://' or 'https://'
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json(); // Parse the JSON response

                if (!response.ok) {
                    // If the response was not ok (e.g., 401, 400, 500)
                    throw new Error(data.message || 'Login failed. Please try again.');
                }

                localStorage.setItem('token', data.token);
                console.log(data.user);
                console.log('Login successful, token:', data.token); // For debugging
                navigate('/'); // Redirect to home page on successful login

            } catch (error) {
                console.error('Login error:', error);
                setSubmitError(error.message || 'Login failed. Please try again.'); // Set general submit error
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="subtitle">Sign in to your account</p>

                {submitError && ( // Use submitError state for general errors
                    <div className="error-message">
                        {submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <span className="error-text">{errors.email}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="Enter your password"
                        />
                        {errors.password && (
                            <span className="error-text">{errors.password}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <button type="submit" className="login-button">
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/signup" className="register-link">
                            Sign up
                        </Link>
                    </p>
                    <p
                        onClick={() => navigate('/')}
                        className='loginToHomeBtn'
                    >
                        Home
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;