async function makeRequest(method: 'GET' | 'POST', url = "", data = {}) {
  const response = await fetch(url, {
    method,
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Authorization: `Bearer ${import.meta.env.VITE_ROWS_API_KEY}`,
    },
    body: method !== 'GET' ? JSON.stringify(data) : null,
  });

  return response.json();
}

export default {
  post: function (url: string, data = {}) {
    return makeRequest('POST', url, data);
  }
}
