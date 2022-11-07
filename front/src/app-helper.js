module.exports = {
  API_URL: process.env.REACT_APP_BACK_END_LINK || "http://localhost:8000/api",
  getAccessToken: () => localStorage.getItem("token"),
  toJSON: (response) => response.json(),
};
