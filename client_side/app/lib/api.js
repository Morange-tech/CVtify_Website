// ../lib/api.js

export const getCV = async () => {
  // Your API logic here
  // For example, you can make an API call to fetch CV data from a server
  // and return the data as a Promise
  const response = await fetch('/api/cv');
  const data = await response.json();
  return data;
};

export const saveCV = async (cvData) => {
  // Your API logic here
  // For example, you can make an API call to save CV data to a server
  // and return a Promise indicating success or failure
  const response = await fetch('/api/cv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cvData),
  });
  return response.ok;
};