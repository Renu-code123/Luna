// src/utils/healthUtils.js

export const calculateBMI = (weight, heightCm) => {
  if (!weight || !heightCm) return null;
  const heightInMeters = heightCm / 100;
  if (heightInMeters <= 0) return null;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Number(bmi.toFixed(1));
};

export const assessRisk = (userData, generateRecommendations) => {
  let riskScore = 0;
  const ageNum = Number(userData.age);
  if (!Number.isNaN(ageNum) && ageNum >= 18 && ageNum <= 40) riskScore += 20;

  const bmi = calculateBMI(userData.weight, userData.height);
  if (bmi !== null && bmi >= 25) riskScore += 30;

  riskScore += (userData.symptoms?.length || 0) * 5;
  riskScore += (userData.lifestyleFactors?.length || 0) * 4;

  if (userData.cycleRegularity === 'irregular') riskScore += 25;
  riskScore = Math.min(100, riskScore);

  let riskLevel = 'Low';
  if (riskScore >= 70) riskLevel = 'High';
  else if (riskScore >= 40) riskLevel = 'Moderate';

  return {
    score: riskScore,
    level: riskLevel,
    recommendations: generateRecommendations(riskScore, userData)
  };
};