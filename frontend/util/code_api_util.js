export const allCode = (user) => {
  return fetch('/api/code', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: user.username,
    })
  });
};

export const newCode = (code) => {
  return fetch('/api/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: code,
    })
  });
};

export const deleteCode = (name) => {
  return fetch('/api/code', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
    })
  });
};

export const updateCode = (code) => {
  return fetch('/api/code', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: code.name,
      code: code.code
    })
  });
};
