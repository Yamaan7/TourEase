import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

const AgencyLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // Show loading state
            Swal.fire({
                title: 'Logging in...',
                text: 'Please wait',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch('http://localhost:5000/api/auth/agency/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message
                await Swal.fire({
                    icon: 'success',
                    title: 'Login Successful!',
                    text: 'Welcome back!',
                    confirmButtonColor: '#3B82F6',
                    timer: 1500,
                    timerProgressBar: true
                });

                // Store agency data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('isAgency', 'true');

                window.dispatchEvent(new Event('authChange'));

                // Redirect to agency dashboard
                navigate('/agency-dashboard');
            } else {
                // Show error message
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message || 'Invalid email or password',
                    confirmButtonColor: '#3B82F6'
                });
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            // Show server error message
            Swal.fire({
                icon: 'error',
                title: 'Server Error',
                text: 'Unable to connect to the server. Please try again later.',
                confirmButtonColor: '#3B82F6'
            });
            setError('Server error. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen py-16 flex items-center">
            <div className="max-w-md mx-auto w-full px-4">
                <div className="text-center mb-8">
                    <LogIn className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Welcome Back, Agency</h2>
                    <p className="text-gray-600">Please sign in to your agency account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your agency email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="mt-4 text-red-600 text-center">
                        {error}
                    </div>
                )}

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an agency account?{' '}
                    <Link to="/agency/register" className="text-blue-600 hover:text-blue-500 font-medium">
                        Register your agency
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AgencyLogin;