import statisticsData from "@/services/mockData/statistics.json";
import verificationsData from "@/services/mockData/verifications.json";

// Dynamic stats calculation based on current data
export const getDashboardStats = async () => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 200));
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Calculate real-time stats from verification data
  const totalVerified = verificationsData.length;
  const todayVerified = verificationsData.filter(v => 
    new Date(v.verifiedAt) >= today
  ).length;
  
  const statusCounts = verificationsData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  
  const deliverableCount = statusCounts.deliverable || 0;
  const riskCount = statusCounts.risky || 0;
  const avgResponseTime = Math.round(
    verificationsData.reduce((sum, item) => sum + item.responseTime, 0) / totalVerified
  );
  
  return {
    ...statisticsData,
    totalVerified,
    todayVerified,
    deliverableRate: Math.round((deliverableCount / totalVerified) * 100),
    riskRate: Math.round((riskCount / totalVerified) * 100),
    avgResponseTime,
    lastUpdated: new Date().toISOString()
  };
};

export const getRecentVerifications = async (limit = 10) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  // Get fresh verification data and sort by newest first
  const recent = [...verificationsData]
    .sort((a, b) => new Date(b.verifiedAt) - new Date(a.verifiedAt))
    .slice(0, limit);
  
  // Add some dynamic properties for realism
  return recent.map(v => ({
    ...v,
    isRecent: (new Date() - new Date(v.verifiedAt)) < 3600000, // Less than 1 hour
    responseQuality: v.responseTime < 1000 ? 'excellent' : v.responseTime < 3000 ? 'good' : 'slow'
  }));
};

export const getTrendData = async (period = "7d") => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 150));
  
  // Generate realistic trend data based on actual verification patterns
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
  
  // Analyze actual verification data for realistic trends
  const statusDistribution = verificationsData.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {});
  
  const totalVerifications = verificationsData.length;
  const actualDeliverableRate = ((statusDistribution.deliverable || 0) / totalVerifications) * 100;
  const actualRiskRate = ((statusDistribution.risky || 0) / totalVerifications) * 100;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic data with variance around actual rates
    const baseVerifications = Math.floor(Math.random() * 40) + 15 + (i === 0 ? 10 : 0); // More recent activity
    const deliverableVariance = (Math.random() - 0.5) * 10; // ±5% variance
    const riskVariance = (Math.random() - 0.5) * 8; // ±4% variance
    
    const deliverableRate = Math.max(60, Math.min(95, actualDeliverableRate + deliverableVariance));
    const riskRate = Math.max(2, Math.min(25, actualRiskRate + riskVariance));
    const undeliverableRate = 100 - deliverableRate - riskRate;
    
    data.push({
      date: date.toISOString().split("T")[0],
      verifications: baseVerifications,
      deliverable: Math.floor(baseVerifications * (deliverableRate / 100)),
      risky: Math.floor(baseVerifications * (riskRate / 100)),
      undeliverable: Math.floor(baseVerifications * (undeliverableRate / 100)),
      deliverableRate: Math.round(deliverableRate * 10) / 10,
      riskRate: Math.round(riskRate * 10) / 10,
      avgResponseTime: Math.floor(Math.random() * 1000) + 800 // 800-1800ms
    });
  }
  
  return data;
};

export const getTopDomains = async (limit = 5) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  // Calculate actual top domains from verification data
  const domainCounts = verificationsData.reduce((acc, v) => {
    if (v.domain) {
      acc[v.domain] = (acc[v.domain] || 0) + 1;
    }
    return acc;
  }, {});
  
  // Sort by count and return top domains with percentages
  const sortedDomains = Object.entries(domainCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([domain, count]) => ({
      domain,
      count,
      percentage: Math.round((count / verificationsData.length) * 100)
    }));
  
  return sortedDomains;
};

export const getRiskFactorDistribution = async () => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  // Calculate actual risk factor distribution
  const riskFactorCounts = {};
  let totalFactors = 0;
  
  verificationsData.forEach(v => {
    if (v.riskFactors && v.riskFactors.length > 0) {
      v.riskFactors.forEach(factor => {
        riskFactorCounts[factor] = (riskFactorCounts[factor] || 0) + 1;
        totalFactors++;
      });
    }
  });
  
  // Convert to percentages
  const distribution = {};
  Object.entries(riskFactorCounts).forEach(([factor, count]) => {
    distribution[factor] = Math.round((count / totalFactors) * 100);
  });
  
  return distribution;
};

export const updateDashboardStats = async (newStats) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
  
  // Simulate updating stats with validation
  const updatedStats = await getDashboardStats();
  
  return { 
    success: true, 
    message: "Dashboard stats refreshed successfully",
    data: { ...updatedStats, ...newStats, lastUpdated: new Date().toISOString() }
  };
};

// Get performance metrics
export const getPerformanceMetrics = async () => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
  
  const responseTimes = verificationsData.map(v => v.responseTime);
  const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  
  return {
    avgResponseTime: Math.round(avgResponseTime),
    minResponseTime: Math.min(...responseTimes),
    maxResponseTime: Math.max(...responseTimes),
    p95ResponseTime: Math.round(responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)]),
    uptime: 99.9,
    totalRequests: verificationsData.length,
    successRate: Math.round((verificationsData.filter(v => v.status !== 'unknown').length / verificationsData.length) * 100)
  };
};