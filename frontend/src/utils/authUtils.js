import axios from 'axios';

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post('/api/user/login', { email, password });
    if (res.data.success) {
      const { refreshToken, accessToken, user } = res.data.data;
      return { user, accessToken, refreshToken };
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Login error', error);
    throw error;
  }
};

export const registerUser = async (name, fullName, email, password) => {
  try {
    const res = await axios.post('/api/user/register', { username: name, fullName, email, password });
    if (res.data.success) {
      console.log(res.data.data);
      return res.data.data
    } else {
      throw new Error('Registration failed');
    }
  } catch (error) {
    console.error('Registration error', error);
    throw error;
  }
};

export const logoutUser = () => {
  // Clear user data and tokens from localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');


};