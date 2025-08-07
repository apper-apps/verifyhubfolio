import statisticsData from "@/services/mockData/statistics.json";
import verificationsData from "@/services/mockData/verifications.json";

export const getDashboardStats = async () => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 200));
  
  return { ...statisticsData };
};

export const getRecentVerifications = async (limit = 10) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  // Sort by verification date, newest first
  const recent = [...verificationsData]
    .sort((a, b) => new Date(b.verifiedAt) - new Date(a.verifiedAt))
    .slice(0, limit);
  
  return recent.map(v => ({ ...v }));
};

export const getTrendData = async (period = "7d") => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 150));
  
  // Generate sample trend data based on period
  const now = new Date();
  const data = [];
  let days = 7;
  
  switch (period) {
    case "24h":
      days = 1;
      break;
    case "30d":
      days = 30;
      break;
    case "90d":
      days = 90;
      break;
    default:
      days = 7;
  }
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate sample data with some variance
    const baseVerifications = Math.floor(Math.random() * 50) + 20;
    const deliverableRate = Math.random() * 20 + 70; // 70-90%
    const riskRate = Math.random() * 15 + 5; // 5-20%
    
    data.push({
      date: date.toISOString().split("T")[0],
      verifications: baseVerifications,
      deliverable: Math.floor(baseVerifications * (deliverableRate / 100)),
      risky: Math.floor(baseVerifications * (riskRate / 100)),
      undeliverable: Math.floor(baseVerifications * ((100 - deliverableRate - riskRate) / 100)),
      deliverableRate: Math.round(deliverableRate * 10) / 10,
      riskRate: Math.round(riskRate * 10) / 10
    });
  }
  
  return data;
};

export const getTopDomains = async (limit = 5) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  return statisticsData.topDomains.slice(0, limit);
};

export const getRiskFactorDistribution = async () => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  return { ...statisticsData.riskFactorDistribution };
};

export const updateDashboardStats = async (newStats) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
  
  // In a real app, this would make an API call to update stats
  // For mock data, we'll simulate success
  return { 
    success: true, 
    message: "Dashboard stats updated successfully",
    data: { ...statisticsData, ...newStats, lastUpdated: new Date().toISOString() }
  };
};