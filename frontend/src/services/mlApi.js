const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:5001';

export const predictPCOS = async (data) => {
  const response = await fetch(`${ML_API_URL}/predict/pcos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const predictDiabetes = async (data) => {
  const response = await fetch(`${ML_API_URL}/predict/diabetes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const predictHeart = async (data) => {
  const response = await fetch(`${ML_API_URL}/predict/heart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const predictObesity = async (data) => {
  const response = await fetch(`${ML_API_URL}/predict/obesity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const predictInfertility = async (data) => {
  const response = await fetch(`${ML_API_URL}/predict/infertility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const getLifestyleRecommendation = async (data) => {
  const response = await fetch(`${ML_API_URL}/recommend/lifestyle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

