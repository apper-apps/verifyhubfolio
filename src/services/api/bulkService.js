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
  "gmail.com": { provider: "free", reliable: true },
  "yahoo.com": { provider: "free", reliable: true },
  "outlook.com": { provider: "free", reliable: true },
  "hotmail.com": { provider: "free", reliable: true },
  "tempmail.org": { provider: "disposable", reliable: false },
  "10minutemail.com": { provider: "disposable", reliable: false }
};

const ROLE_PREFIXES = [
  "admin", "support", "info", "contact", "sales", "marketing", 
  "noreply", "no-reply", "help", "service", "team", "office"
];

const performBulkEmailVerification = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const syntaxValid = emailRegex.test(email);
  
  if (!syntaxValid) {
    return {
      email,
      status: EMAIL_STATUS.UNDELIVERABLE,
      subStatus: SUB_STATUS.INVALID_SYNTAX,
      domain: "",
      responseTime: 0,
      riskFactors: ["invalid_format"]
    };
  }

  const [localPart, domain] = email.split("@");
  const domainLower = domain.toLowerCase();
  const localLower = localPart.toLowerCase();
  
  const domainInfo = DOMAIN_CHARACTERISTICS[domainLower];
  let status = EMAIL_STATUS.DELIVERABLE;
  let subStatus = SUB_STATUS.VALID_MAILBOX;
  let riskFactors = [];
  
  const domainValid = !domainLower.includes("nonexistent") && !domainLower.includes("invalid");
  
  if (!domainValid) {
    status = EMAIL_STATUS.UNDELIVERABLE;
    subStatus = SUB_STATUS.INVALID_DOMAIN;
  } else {
    const isRoleBased = ROLE_PREFIXES.some(prefix => localLower.startsWith(prefix));
    if (isRoleBased) {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.ROLE_BASED;
      riskFactors.push("role_based");
    }
    
    if (domainInfo?.provider === "disposable") {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.DISPOSABLE;
      riskFactors.push("disposable", "temporary");
    }
    
    if (domainInfo?.provider === "free" && status === EMAIL_STATUS.DELIVERABLE) {
      riskFactors.push("free_provider");
    }
    
    if (domainLower.includes("example") || domainLower.includes("test")) {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.CATCH_ALL;
      riskFactors.push("catch_all");
    }
    
    if (localLower.includes("nonexistent") || localLower.includes("invalid")) {
      status = EMAIL_STATUS.UNDELIVERABLE;
      subStatus = SUB_STATUS.INVALID_MAILBOX;
      riskFactors = [];
    }
  }
  
  const responseTime = Math.floor(Math.random() * 3000) + 400;
  
  return {
    email,
    status,
    subStatus,
    domain,
    responseTime,
    riskFactors
  };
};

export const processBulkVerification = async (emailList) => {
  if (!Array.isArray(emailList) || emailList.length === 0) {
    throw new Error("Invalid email list");
  }

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

  const results = emailList.map(email => performBulkEmailVerification(email.trim()));
  
  const jobId = Math.random().toString(36).substr(2, 9);
  
  return {
    id: jobId,
    uploadedAt: new Date().toISOString(),
    totalEmails: emailList.length,
    processed: emailList.length,
    status: "completed",
    results
  };
};

export const getBulkJob = async (jobId) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  const job = bulkJobsData.find(job => job.Id.toString() === jobId);
  if (!job) {
    throw new Error("Bulk job not found");
  }
  
  return { ...job };
};

export const getAllBulkJobs = async () => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
  
  return bulkJobsData.map(job => ({ ...job }));
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