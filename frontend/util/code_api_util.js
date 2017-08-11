export const newCode = (code) => {
  return fetch('/api/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filename: code.filename,
      code: code.code
    })
  });
};

export const deleteCode = (filename) => {
  return fetch('/api/code', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      filename: filename,
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
      filename: code.filename,
      code: code.code
    })
  });
};
