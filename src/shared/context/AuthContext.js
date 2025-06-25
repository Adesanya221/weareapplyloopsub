import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import authService from '../services/authService';
import { signOutGoogle, processGoogleResponse } from '../utils/googleAuth';

// Create auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load auth state on startup
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        setIsLoading(true);
        
        // Check for auth token and user data in localStorage
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('orderlyAuthToken');
          const userData = localStorage.getItem('orderlyUserData');
          
          if (token) {
            setIsAuthenticated(true);
            
            if (userData) {
              setUser(JSON.parse(userData));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load auth state:', err);
        setError('Failed to restore authentication state.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Handle login with email and password
  const login = async (credentials) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Use the authService to handle login
      const response = await authService.login(credentials);
      
      // Save token and user data
      localStorage.setItem('orderlyAuthToken', response.token);
      if (response.refreshToken) {
        localStorage.setItem('orderlyRefreshToken', response.refreshToken);
      }
      localStorage.setItem('orderlyUserData', JSON.stringify(response.user));
      
      // Update state
      setUser(response.user);
      setIsAuthenticated(true);
      
      return { success: true, user: response.user };
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Failed to sign in');
      return { success: false, error: err.message || 'Failed to sign in' };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google authentication
  const loginWithGoogle = async (googleResponse) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Process the Google response
      const { idToken, user: googleUser } = processGoogleResponse(googleResponse);
      
      // Use the authService to handle Google login
      const response = await authService.loginWithGoogle(idToken);
      
      // Save token and user data
      localStorage.setItem('orderlyAuthToken', response.token);
      if (response.refreshToken) {
        localStorage.setItem('orderlyRefreshToken', response.refreshToken);
      }
      localStorage.setItem('orderlyUserData', JSON.stringify(response.user));
      
      // Update state
      setUser(response.user);
      setIsAuthenticated(true);
      
      return { success: true, user: response.user };
    } catch (err) {
      console.error('Google login failed:', err);
      setError(err.message || 'Failed to sign in with Google');
      return { success: false, error: err.message || 'Failed to sign in with Google' };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Check if user logged in with Google
      const userData = localStorage.getItem('orderlyUserData');
      const userObj = userData ? JSON.parse(userData) : null;
      
      if (userObj?.authProvider === 'google') {
        // Sign out from Google
        signOutGoogle();
      }
      
      // Use the authService to handle logout
      await authService.logout();
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to login page
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout failed:', err);
      setError(err.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup
  const signup = async (userData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Use the authService to handle signup
      const response = await authService.signup(userData);
      
      // Save token and user data
      localStorage.setItem('orderlyAuthToken', response.token);
      if (response.refreshToken) {
        localStorage.setItem('orderlyRefreshToken', response.refreshToken);
      }
      
      // Store additional registration data to be used in vendor registration
      const userWithRegistrationData = {
        ...response.user,
        registration: {
          fullName: userData.name,
          email: userData.email,
          phone: userData.phone
        },
        verificationStatus: 'Pending' // Set initial verification status to pending
      };
      
      localStorage.setItem('orderlyUserData', JSON.stringify(userWithRegistrationData));
      
      // Also add to vendors list for admin management
      const uniqueId = 'vendor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const newVendor = {
        id: uniqueId, 
        ...userWithRegistrationData,
        registeredAt: new Date().toISOString(),
        verificationStatus: 'Pending'
      };
      
      // Save to vendors list
      const existingVendors = JSON.parse(localStorage.getItem('orderlyVendors') || '[]');
      localStorage.setItem('orderlyVendors', JSON.stringify([...existingVendors, newVendor]));
      
      // Update state
      setUser(userWithRegistrationData);
      setIsAuthenticated(true);
      
      return { success: true, user: userWithRegistrationData };
    } catch (err) {
      console.error('Signup failed:', err);
      setError(err.message || 'Failed to create account');
      return { success: false, error: err.message || 'Failed to create account' };
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Use the authService to update profile
      const updatedUserData = await authService.updateProfile(profileData);
      
      // Update local storage
      const updatedUser = { ...user, ...updatedUserData, updatedAt: new Date().toISOString() };
      localStorage.setItem('orderlyUserData', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err.message || 'Failed to update profile');
      return { success: false, error: err.message || 'Failed to update profile' };
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Use the authService to change password
      const response = await authService.changePassword(passwordData);
      return { success: true, message: response.message };
    } catch (err) {
      console.error('Password change failed:', err);
      setError(err.message || 'Failed to change password');
      return { success: false, error: err.message || 'Failed to change password' };
    } finally {
      setIsLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Use the authService to request password reset
      const response = await authService.requestPasswordReset(email);
      return { success: true, message: response.message };
    } catch (err) {
      console.error('Password reset request failed:', err);
      setError(err.message || 'Failed to request password reset');
      return { success: false, error: err.message || 'Failed to request password reset' };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (resetData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Use the authService to reset password
      const response = await authService.resetPassword(resetData);
      return { success: true, message: response.message };
    } catch (err) {
      console.error('Password reset failed:', err);
      setError(err.message || 'Failed to reset password');
      return { success: false, error: err.message || 'Failed to reset password' };
    } finally {
      setIsLoading(false);
    }
  };

  // Get current auth token
  const getToken = () => {
    return authService.getToken();
  };

  // Check if user is authenticated
  const checkAuth = () => {
    return authService.isAuthenticated() && !!user;
  };

  // The value to be provided to consumers of this context
  const value = {
    user,
    isAuthenticated: checkAuth(),
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    signup,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 