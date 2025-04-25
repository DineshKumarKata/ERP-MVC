/**
 * API Test Utility
 * This file is used for testing API endpoints from the browser console
 */

import axios from 'axios';

// Test registration endpoint
export const testRegistrationEndpoint = async () => {
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:4001/vignanAPI';
  const endpoint = `${baseUrl}/v1/student/studentRegistration`;
  
  console.log('Testing registration endpoint:', endpoint);
  
  const testData = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    mobile: "1234567890",
    dob: "2000-01-01",
    country: "India",
    category: "General",
    program: "Undergraduation",
    course: "B.Tech",
    specialization: "Computer Science"
  };
  
  try {
    const response = await axios.post(endpoint, testData);
    console.log('Registration test response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration test error:', error.response?.data || error.message);
    return {
      status: "Failure",
      message: error.response?.data?.message || error.message
    };
  }
};

// Export functions to global window object for browser console testing
if (typeof window !== 'undefined') {
  window.testApi = {
    testRegistrationEndpoint
  };
}

export default {
  testRegistrationEndpoint
}; 