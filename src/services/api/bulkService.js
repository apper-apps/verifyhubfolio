import bulkJobsData from "@/services/mockData/bulkJobs.json";

// Import verification service for individual email processing
const EMAIL_STATUS = {
DELIVERABLE: "deliverable",
  UNDELIVERABLE: "undeliverable", 
  RISKY: "risky",
  UNKNOWN: "unknown"
};

const SUB_STATUS = {
  VALID_MAILBOX: "valid_mailbox",
  INVALID_SYNTAX: "invalid_syntax",
  INVALID_DOMAIN: "invalid_domain", 
  INVALID_MAILBOX: "invalid_mailbox",
  CATCH_ALL: "catch_all",
  DISPOSABLE: "disposable",
  ROLE_BASED: "role_based",
  FREE_PROVIDER: "free_provider",
  GREYLISTED: "greylisted",
  TIMEOUT: "timeout",
  SERVER_ERROR: "server_error"
};

const DOMAIN_CHARACTERISTICS = {
  "gmail.com": { provider: "free", reliable: true, mxVerified: true },
  "yahoo.com": { provider: "free", reliable: true, mxVerified: true },
  "outlook.com": { provider: "free", reliable: true, mxVerified: true },
  "hotmail.com": { provider: "free", reliable: true, mxVerified: true },
  "aol.com": { provider: "free", reliable: true, mxVerified: true },
  "icloud.com": { provider: "free", reliable: true, mxVerified: true },
  "tempmail.org": { provider: "disposable", reliable: false, mxVerified: false },
  "10minutemail.com": { provider: "disposable", reliable: false, mxVerified: false },
  "guerrillamail.com": { provider: "disposable", reliable: false, mxVerified: false },
  "mailinator.com": { provider: "disposable", reliable: false, mxVerified: false },
  "company.com": { provider: "corporate", reliable: true, mxVerified: true },
  "business.org": { provider: "corporate", reliable: true, mxVerified: true }
};

const ROLE_PREFIXES = [
  "admin", "support", "info", "contact", "sales", "marketing", 
  "noreply", "no-reply", "help", "service", "team", "office",
  "webmaster", "postmaster", "abuse", "security", "billing"
];

// Enhanced email verification with comprehensive validation
const performBulkEmailVerification = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const syntaxValid = emailRegex.test(email);
  
  if (!syntaxValid) {
    return {
      email,
      status: EMAIL_STATUS.UNDELIVERABLE,
      subStatus: SUB_STATUS.INVALID_SYNTAX,
      domain: "",
      syntaxValid: false,
      domainValid: false,
      mxRecords: false,
      smtpCheck: false,
      responseTime: Math.floor(Math.random() * 200) + 50,
      riskFactors: ["invalid_format"],
      verifiedAt: new Date().toISOString()
    };
  }

  const [localPart, domain] = email.split("@");
  const domainLower = domain.toLowerCase();
  const localLower = localPart.toLowerCase();
  
  const domainInfo = DOMAIN_CHARACTERISTICS[domainLower];
  let status = EMAIL_STATUS.DELIVERABLE;
  let subStatus = SUB_STATUS.VALID_MAILBOX;
  let riskFactors = [];
  
  // Advanced domain validation
  const domainValid = !domainLower.includes("nonexistent") && 
                     !domainLower.includes("invalid") && 
                     !domainLower.includes("fake") &&
                     domainLower.length >= 4;
  
  const mxRecords = domainValid && (domainInfo?.mxVerified !== false);
  let smtpCheck = domainValid;
  
  if (!domainValid) {
    status = EMAIL_STATUS.UNDELIVERABLE;
    subStatus = SUB_STATUS.INVALID_DOMAIN;
    smtpCheck = false;
  } else {
    // Role-based email detection
    const isRoleBased = ROLE_PREFIXES.some(prefix => localLower.startsWith(prefix));
    if (isRoleBased) {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.ROLE_BASED;
      riskFactors.push("role_based");
    }
    
    // Disposable email detection
    if (domainInfo?.provider === "disposable") {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.DISPOSABLE;
      riskFactors.push("disposable", "temporary");
      smtpCheck = false;
    }
    
    // Free provider detection
    if (domainInfo?.provider === "free" && status === EMAIL_STATUS.DELIVERABLE) {
      riskFactors.push("free_provider");
    }
    
    // Catch-all domain simulation
    if (domainLower.includes("example") || domainLower.includes("test") || 
        domainLower.endsWith(".test") || domainLower.includes("catchall")) {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.CATCH_ALL;
      riskFactors.push("catch_all");
    }
    
    // Timeout simulation for certain patterns
    if (domainLower.includes("timeout") || localLower.includes("slow")) {
      status = EMAIL_STATUS.UNKNOWN;
      subStatus = SUB_STATUS.TIMEOUT;
      riskFactors.push("timeout");
      smtpCheck = false;
    }
    
    // Invalid mailbox simulation
    if (localLower.includes("nonexistent") || localLower.includes("invalid") ||
        localLower.includes("notfound") || localLower.includes("fake")) {
      status = EMAIL_STATUS.UNDELIVERABLE;
      subStatus = SUB_STATUS.INVALID_MAILBOX;
      smtpCheck = false;
      riskFactors = [];
    }
    
    // Greylisting simulation
    if (localLower.includes("greylist") || domainLower.includes("greylist")) {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.GREYLISTED;
      riskFactors.push("greylisted");
    }
    
    // Additional risk factors
    if (localPart.length < 2) {
      riskFactors.push("short_local_part");
    }
    
    if (localPart.includes("..") || localPart.startsWith(".") || localPart.endsWith(".")) {
      status = EMAIL_STATUS.UNDELIVERABLE;
      subStatus = SUB_STATUS.INVALID_SYNTAX;
      riskFactors = ["invalid_format"];
    }
  }
  
  // Realistic response time based on status
  let responseTime;
  switch (status) {
    case EMAIL_STATUS.UNDELIVERABLE:
      responseTime = Math.floor(Math.random() * 800) + 200; // 200-1000ms
      break;
    case EMAIL_STATUS.RISKY:
      responseTime = Math.floor(Math.random() * 2000) + 800; // 800-2800ms
      break;
    case EMAIL_STATUS.UNKNOWN:
      responseTime = Math.floor(Math.random() * 5000) + 3000; // 3000-8000ms
      break;
    default:
      responseTime = Math.floor(Math.random() * 1500) + 400; // 400-1900ms
  }
  
  return {
    email,
    status,
    subStatus,
    domain,
    syntaxValid,
    domainValid,
    mxRecords,
    smtpCheck,
    responseTime,
    riskFactors,
    verifiedAt: new Date().toISOString()
  };
};

export const processBulkVerification = async (emailList, onProgress = null) => {
  if (!Array.isArray(emailList) || emailList.length === 0) {
    throw new Error("Invalid email list provided");
  }

  const jobId = `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const results = [];
  const batchSize = 10;
  const totalEmails = emailList.length;
  
  // Process in batches for realistic progress tracking
  for (let i = 0; i < totalEmails; i += batchSize) {
    const batch = emailList.slice(i, i + batchSize);
    
    // Simulate processing time per batch
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200));
    
    // Process each email in the batch
    const batchResults = batch.map(email => {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        return {
          email: trimmedEmail,
          status: EMAIL_STATUS.UNDELIVERABLE,
          subStatus: SUB_STATUS.INVALID_SYNTAX,
          domain: "",
          syntaxValid: false,
          domainValid: false,
          mxRecords: false,
          smtpCheck: false,
          responseTime: 0,
          riskFactors: ["empty_email"],
          verifiedAt: new Date().toISOString()
        };
      }
      
      return performBulkEmailVerification(trimmedEmail);
    });
    
    results.push(...batchResults);
    
    // Report progress if callback provided
    if (onProgress) {
      onProgress({
        processed: results.length,
        total: totalEmails,
        percentage: Math.round((results.length / totalEmails) * 100)
      });
    }
  }

  // Calculate summary statistics
  const statusCounts = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] || 0) + 1;
    return acc;
  }, {});

  return {
    id: jobId,
    uploadedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    totalEmails: totalEmails,
    processed: totalEmails,
    status: "completed",
    results,
    summary: {
      deliverable: statusCounts.deliverable || 0,
      undeliverable: statusCounts.undeliverable || 0,
      risky: statusCounts.risky || 0,
      unknown: statusCounts.unknown || 0,
      deliverableRate: Math.round(((statusCounts.deliverable || 0) / totalEmails) * 100),
      riskRate: Math.round(((statusCounts.risky || 0) / totalEmails) * 100)
    }
  };
};

export const getBulkJob = async (jobId) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  const job = bulkJobsData.find(job => job.Id.toString() === jobId || job.id === jobId);
  if (!job) {
    throw new Error(`Bulk job with ID ${jobId} not found`);
  }
  
  return { 
    ...job,
    accessedAt: new Date().toISOString()
  };
};

export const getAllBulkJobs = async (filters = {}) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
  
  let jobs = bulkJobsData.map(job => ({ ...job }));
  
  // Apply filters if provided
  if (filters.status && filters.status !== "all") {
    jobs = jobs.filter(job => job.status === filters.status);
  }
  
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    jobs = jobs.filter(job => new Date(job.uploadedAt) >= fromDate);
  }
  
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    jobs = jobs.filter(job => new Date(job.uploadedAt) <= toDate);
  }
  
  // Sort by upload date, newest first
  jobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  
  return jobs;
};

// Download results functionality
export const downloadResults = async (results, format = 'csv') => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  if (format === 'csv') {
    const headers = [
      'Email', 'Status', 'Sub Status', 'Domain', 'Syntax Valid', 
      'Domain Valid', 'MX Records', 'SMTP Check', 'Response Time (ms)', 
      'Risk Factors', 'Verified At'
    ];
    
    const csvContent = [
      headers.join(','),
      ...results.map(result => [
        result.email,
        result.status,
        result.subStatus || '',
        result.domain,
        result.syntaxValid ? 'Yes' : 'No',
        result.domainValid ? 'Yes' : 'No',
        result.mxRecords ? 'Yes' : 'No',
        result.smtpCheck ? 'Yes' : 'No',
        result.responseTime,
        (result.riskFactors || []).join('; '),
        new Date(result.verifiedAt).toLocaleString()
      ].map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `bulk_verification_results_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return { success: true, message: "Results downloaded successfully" };
  }
  
  throw new Error("Unsupported download format");
};

export const downloadResults = async (results) => {
  if (!results || !Array.isArray(results)) {
    throw new Error("No results to download");
  }

  // Create CSV content
  const headers = ["Email", "Status", "Sub Status", "Domain", "Response Time (ms)", "Risk Factors"];
  const csvContent = [
    headers.join(","),
    ...results.map(result => [
      result.email,
      result.status,
      result.subStatus || "",
      result.domain,
      result.responseTime,
      result.riskFactors ? result.riskFactors.join("; ") : ""
    ].map(field => `"${field}"`).join(","))
  ].join("\n");

  // Create and download file
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `email-verification-results-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 500));
};