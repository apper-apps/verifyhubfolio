import verificationsData from "@/services/mockData/verifications.json";

// In-memory storage for dynamic history management
let dynamicHistory = [...verificationsData];
let nextId = Math.max(...verificationsData.map(v => v.Id)) + 1;

// Add verification result to history
export const addVerificationToHistory = (verificationResult) => {
  const historyItem = {
    ...verificationResult,
    Id: nextId++,
    verifiedAt: new Date().toISOString()
  };
  dynamicHistory.unshift(historyItem);
  return historyItem;
};

export const getVerificationHistory = async (filters = {}) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
  
  let history = dynamicHistory.map(v => ({ ...v }));
  
  // Apply filters if provided
  if (filters.status && filters.status !== "all") {
    history = history.filter(item => item.status === filters.status);
  }
  
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    history = history.filter(item => new Date(item.verifiedAt) >= fromDate);
  }
  
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    history = history.filter(item => new Date(item.verifiedAt) <= toDate);
  }
  
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    history = history.filter(item =>
      item.email.toLowerCase().includes(term) ||
      item.domain.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term)
    );
  }
  
  // Sort by verification date, newest first
  history.sort((a, b) => new Date(b.verifiedAt) - new Date(a.verifiedAt));
  
  return history;
};

export const getHistoryStats = async () => {
  // Add delay for realistic loading  
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  const history = dynamicHistory;
  const total = history.length;
  
  if (total === 0) {
    return {
      total: 0,
      deliverable: 0,
      undeliverable: 0,
      risky: 0,
      unknown: 0,
      avgResponseTime: 0
    };
  }
  
  const statusCounts = history.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  
  return {
    total,
    deliverable: statusCounts.deliverable || 0,
    undeliverable: statusCounts.undeliverable || 0,
    risky: statusCounts.risky || 0,
    unknown: statusCounts.unknown || 0,
    avgResponseTime: Math.round(
      history.reduce((sum, item) => sum + item.responseTime, 0) / total
    )
  };
};

export const deleteVerification = async (id) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  const index = dynamicHistory.findIndex(v => v.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Verification not found");
  }
  
  // Actually remove from dynamic history
  const deletedItem = dynamicHistory.splice(index, 1)[0];
  return { 
    success: true, 
    message: "Verification deleted successfully",
    deletedItem
  };
};

// Export history functionality
export const exportHistory = async (historyData = null) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
  
  const dataToExport = historyData || dynamicHistory;
  
  // Create CSV content
  const headers = ['Email', 'Status', 'Sub Status', 'Domain', 'Response Time (ms)', 'Verified At', 'Risk Factors'];
  const csvContent = [
    headers.join(','),
    ...dataToExport.map(item => [
      item.email,
      item.status,
      item.subStatus || '',
      item.domain,
      item.responseTime,
      new Date(item.verifiedAt).toLocaleString(),
      (item.riskFactors || []).join('; ')
    ].map(field => `"${field}"`).join(','))
  ].join('\n');
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `email_verification_history_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return { success: true, message: "History exported successfully" };
};

export const clearHistory = async () => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
  
  // Actually clear the dynamic history
  const clearedCount = dynamicHistory.length;
  dynamicHistory = [];
  nextId = 1;
  
  return { 
    success: true, 
    message: `History cleared successfully (${clearedCount} items removed)`,
    clearedCount 
  };
};