export const login = (user) => {
  return fetch('/api/session', {
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

export const logout = () => {
  return fetch('/api/session', {
    method: 'GET'
  });
};

export const handleRefresh = () => {
  return fetch('/refresh', {
    method: 'GET'
  });
};
