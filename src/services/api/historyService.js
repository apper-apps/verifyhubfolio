import verificationsData from "@/services/mockData/verifications.json";

export const getVerificationHistory = async (filters = {}) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
  
  let history = verificationsData.map(v => ({ ...v }));
  
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
  
  const history = verificationsData;
  const total = history.length;
  
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
  
  const index = verificationsData.findIndex(v => v.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Verification not found");
  }
  
  // In a real app, this would make an API call to delete the record
  // For mock data, we'll simulate success
  return { success: true, message: "Verification deleted successfully" };
};

export const exportHistory = async (historyData) => {
  if (!historyData || !Array.isArray(historyData)) {
    throw new Error("No history data to export");
  }

  // Create CSV content
  const headers = [
    "Email", "Status", "Sub Status", "Domain", 
    "Response Time (ms)", "Risk Factors", "Verified Date"
  ];
  
  const csvContent = [
    headers.join(","),
    ...historyData.map(item => [
      item.email,
      item.status,
      item.subStatus || "",
      item.domain,
      item.responseTime,
      item.riskFactors ? item.riskFactors.join("; ") : "",
      new Date(item.verifiedAt).toLocaleString()
    ].map(field => `"${field}"`).join(","))
  ].join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `verification-history-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
};

export const clearHistory = async () => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
  
  // In a real app, this would make an API call to clear all history
  // For mock data, we'll simulate success
  return { success: true, message: "History cleared successfully" };
};