export const signup = (user) => {
  return fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: user.username,
    password: user.password
  })
});
};
