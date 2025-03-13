import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'; // Import icons
import Swal from 'sweetalert2';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    // Add this after the existing useState declarations
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email === 'admin@gmail.com' && (password === (newPassword || 'admin'))) {
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

                // Make API call to admin login endpoint
                const response = await fetch('http://localhost:5000/api/auth/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Welcome Admin!',
                        text: 'Login successful',
                        confirmButtonColor: '#3B82F6',
                        timer: 1500,
                        timerProgressBar: true
                    });

                    // Store admin token and info
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('isAdmin', 'true');
                    localStorage.setItem('role', 'admin');
                    localStorage.setItem('user', JSON.stringify({
                        role: 'admin',
                        email: email,
                        name: 'Admin'
                    }));

                    window.dispatchEvent(new Event('authChange'));

                    navigate('/admin');
                    return;
                } else {
                    throw new Error(data.message || 'Admin login failed');
                }
            } catch (err: any) {
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: errorMessage,
                    confirmButtonColor: '#3B82F6'
                });
                return;
            }
        }

        // If not admin credentials, show error
        Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'Invalid admin credentials',
            confirmButtonColor: '#3B82F6',
        });
    };

    // Add this after the handleSubmit function
    const handleForgotPassword = async () => {


        const { value: formValues } = await Swal.fire({
            title: 'Change Admin Password',
            html: `
            <input 
                id="swal-new-password" 
                type="password" 
                placeholder="Enter new password" 
                class="swal2-input"
            >
            <input 
                id="swal-confirm-password" 
                type="password" 
                placeholder="Confirm new password" 
                class="swal2-input"
            >
        `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#3B82F6',
            preConfirm: () => {
                const newPass = (document.getElementById('swal-new-password') as HTMLInputElement).value;
                const confirmPass = (document.getElementById('swal-confirm-password') as HTMLInputElement).value;

                if (!newPass || !confirmPass) {
                    Swal.showValidationMessage('Please fill in all fields');
                    return false;
                }

                if (newPass !== confirmPass) {
                    Swal.showValidationMessage('Passwords do not match');
                    return false;
                }

                return newPass;
            }
        });

        if (formValues) {
            try {
                setNewPassword(formValues);
                await Swal.fire({
                    icon: 'success',
                    title: 'Password Updated',
                    text: 'Your password has been successfully changed',
                    confirmButtonColor: '#3B82F6',
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to update password',
                    confirmButtonColor: '#3B82F6',
                });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <div className="flex justify-center">
                        <ShieldCheck className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="mt-4 text-3xl font-bold text-gray-900">Admin Portal</h2>
                    <p className="mt-2 text-sm text-gray-600">Welcome back! Please sign in to continue.</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>



                    </div>
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
                        >
                            Sign in to Dashboard
                        </button>
                    </div>
                </form>

                <div className="text-sm">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleForgotPassword();
                        }}
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Forgot password?
                    </button>
                </div>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Protected area</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;