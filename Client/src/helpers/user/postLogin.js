import axios from 'axios';

export const postLogin = async data => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/users/login`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
    throw new Error('An unexpected error occurred during login');
  }
};
