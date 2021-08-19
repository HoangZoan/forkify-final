import { async } from 'regenerator-runtime';
import { TIME_OUT_SEC } from './config';

const timeOut = async function (sec) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${sec} second`));
    }, sec * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeOut(TIME_OUT_SEC)]);
    const data = await res.json();
    // console.log(data);

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const formatQuantity = function (num) {
  const numStr = num.toFixed(2).toString();
  if (numStr.includes('00')) return numStr.slice(0, -3);
  else return numStr;
};
