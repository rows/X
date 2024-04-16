const ROWS_API_KEY = 'rows-13hUkRvhR3aPkLbw7k46T8UjT84CTGIsJpb4diHBYFZa';

async function makeRequest(method: 'GET' | 'POST', url = "", data = {}) {
  const response = await fetch(url, {
    method,
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ROWS_API_KEY}`,
    },
    body: method !== 'GET' ? JSON.stringify(data) : null,
  });

  return response.json();
}

export default {
  get: function (url: string) {
    return makeRequest('GET', url);
  },
  post: function (url: string, data = {}) {
    return makeRequest('POST', url, data);
  }
}