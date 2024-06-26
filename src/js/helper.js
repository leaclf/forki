import { TIMEOUT_SEC } from './config';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    // console.log(data);
    if (!response.ok) throw new Error(`${data.message}(${response.status})`);
    return data;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};
/*
export const getJSON = async function (url) {
  try {
    const fetchPromise = fetch(
      url
      // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    );
    // console.log(fetchPromise);
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    // console.log(data);
    if (!response.ok) throw new Error(`${data.message}(${response.status})`);
    return data;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    // console.log(fetchPromise);
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    // console.log(data);
    if (!response.ok) throw new Error(`${data.message}(${response.status})`);
    return data;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};
*/
