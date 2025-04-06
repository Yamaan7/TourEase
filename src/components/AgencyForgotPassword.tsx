import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import Swal from 'sweetalert2';

interface AgencyForgotPasswordProps {
    currentEmail?: string;
}

const AgencyForgotPassword: React.FC<AgencyForgotPasswordProps> = ({ currentEmail = '' }) => {
    const handleForgotPassword = async () => {
        // First step: Get and verify email
        const { value: email } = await Swal.fire({
            title: 'Enter Agency Email',
            input: 'email',
            inputLabel: 'Your agency email address',
            inputValue: currentEmail,
            showCancelButton: true,
            confirmButtonColor: '#3B82F6',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter your agency email address';
                }
            }
        });

        if (!email) return;

        try {
            // Verify email exists in database
            const response = await fetch('http://localhost:5000/api/auth/agency/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Agency email not found');
            }

            // If email verified, show password reset dialog
            const { value: password } = await Swal.fire({
                title: 'Reset Agency Password',
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
                confirmButtonText: 'Reset Password',
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

            if (password) {
                // Update password in database
                const updateResponse = await fetch('http://localhost:5000/api/auth/agency/update-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!updateResponse.ok) {
                    throw new Error('Failed to update agency password');
                }

                await Swal.fire({
                    icon: 'success',
                    title: 'Password Updated',
                    text: 'Your agency password has been successfully changed',
                    confirmButtonColor: '#3B82F6',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error instanceof Error ? error.message : 'Failed to reset password',
                confirmButtonColor: '#3B82F6',
            });
        }
    };

    return (
        <button
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-500"
        >
            Forgot password?
        </button>
    );
};

export default AgencyForgotPassword;