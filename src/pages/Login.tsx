import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

const Login = () => {
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

    // Check for admin credentials
    // Replace the admin credentials check section with this:
    // Check for admin credentials
    if (formData.email === 'admin@gmail.com' && formData.password === 'admin') {
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
          body: JSON.stringify(formData)
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
          localStorage.setItem('role', 'admin'); // Add this line
          localStorage.setItem('user', JSON.stringify({
            role: 'admin',
            email: formData.email,
            name: 'Admin'
          }));

          window.dispatchEvent(new Event('authChange'));

          navigate('/admin');
          return;
        } else {
          throw new Error(data.message || 'Admin login failed');
        }
      } catch (err: any) { // Type assertion for error
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

    // Regular user authentication
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

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message for regular user
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back!',
          confirmButtonColor: '#3B82F6',
          timer: 1500,
          timerProgressBar: true
        });

        // Store user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('isAdmin', 'false');

        // Redirect to user dashboard
        navigate('/dashboard');
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
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="text-center mb-8">
          <LogIn className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-gray-600">Please sign in to your account</p>
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
                  placeholder="Enter your email"
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

            {/* Add the guest button */}
            <Link
              to="/home"
              className="w-full block text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Continue as Guest
            </Link>
            <Link
              to="/agencylogin"
              className="block text-center bg-blue-50 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Continue as Agency
            </Link>
            <Link
              to="/admin/login"
              className="block text-center bg-red-50 text-red-700 py-3 px-4 rounded-lg hover:bg-red-100 transition-colors"
            >
              Continue as Admin
            </Link>
          </div>
        </form>

        {/* // Add error message display before the "Don't have an account?" text */}
        {error && (
          <div className="mt-4 text-red-600 text-center">
            {error}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;