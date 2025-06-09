const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://taskflow-1-7mlh.onrender.com/api'
    : 'http://localhost:5000/api'
};

export default config;
