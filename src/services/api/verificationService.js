import verificationsData from "@/services/mockData/verifications.json";

// Email status types
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

// Risk factors
const RISK_FACTORS = [
  "role_based", "disposable", "catch_all", "free_provider", 
  "temporary", "no_reply", "timeout", "invalid_format"
];

// Common domains and their characteristics
const DOMAIN_CHARACTERISTICS = {
  "gmail.com": { provider: "free", reliable: true },
  "yahoo.com": { provider: "free", reliable: true },
  "outlook.com": { provider: "free", reliable: true },
  "hotmail.com": { provider: "free", reliable: true },
  "tempmail.org": { provider: "disposable", reliable: false },
  "10minutemail.com": { provider: "disposable", reliable: false },
  "guerrillamail.com": { provider: "disposable", reliable: false }
};

// Role-based email prefixes
const ROLE_PREFIXES = [
  "admin", "support", "info", "contact", "sales", "marketing", 
  "noreply", "no-reply", "help", "service", "team", "office"
];

const simulateVerification = (email) => {
  // Add realistic delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = performEmailVerification(email);
      resolve(result);
    }, Math.random() * 800 + 400); // 400-1200ms delay
  });
};

const performEmailVerification = (email) => {
  // Basic syntax validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
      responseTime: 0,
      riskFactors: ["invalid_format"],
      verifiedAt: new Date().toISOString()
    };
  }

  const [localPart, domain] = email.split("@");
  const domainLower = domain.toLowerCase();
  const localLower = localPart.toLowerCase();
  
  // Check domain characteristics
  const domainInfo = DOMAIN_CHARACTERISTICS[domainLower];
  let status = EMAIL_STATUS.DELIVERABLE;
  let subStatus = SUB_STATUS.VALID_MAILBOX;
  let riskFactors = [];
  
  // Domain validation
  const domainValid = !domainLower.includes("nonexistent") && !domainLower.includes("invalid");
  const mxRecords = domainValid;
  let smtpCheck = domainValid;
  
  if (!domainValid) {
    status = EMAIL_STATUS.UNDELIVERABLE;
    subStatus = SUB_STATUS.INVALID_DOMAIN;
  } else {
    // Check for role-based emails
    const isRoleBased = ROLE_PREFIXES.some(prefix => localLower.startsWith(prefix));
    if (isRoleBased) {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.ROLE_BASED;
      riskFactors.push("role_based");
    }
    
    // Check for disposable emails
    if (domainInfo?.provider === "disposable") {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.DISPOSABLE;
      riskFactors.push("disposable", "temporary");
    }
    
    // Check for free providers
    if (domainInfo?.provider === "free" && status === EMAIL_STATUS.DELIVERABLE) {
      // Only add risk factor, don't change status for free providers
      riskFactors.push("free_provider");
    }
    
    // Simulate some catch-all domains
    if (domainLower.includes("example") || domainLower.includes("test")) {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.CATCH_ALL;
      riskFactors.push("catch_all");
      if (isRoleBased) riskFactors.push("role_based");
    }
    
    // Simulate timeout scenarios
    if (domainLower.includes("timeout")) {
      status = EMAIL_STATUS.UNKNOWN;
      subStatus = SUB_STATUS.TIMEOUT;
      riskFactors.push("timeout");
      smtpCheck = false;
    }
    
    // Simulate invalid mailbox for certain patterns
    if (localLower.includes("nonexistent") || localLower.includes("invalid")) {
      status = EMAIL_STATUS.UNDELIVERABLE;
      subStatus = SUB_STATUS.INVALID_MAILBOX;
      smtpCheck = false;
      riskFactors = [];
    }
  }
  
  const responseTime = Math.floor(Math.random() * 4000) + 500; // 500-4500ms
  
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

export const verifyEmail = async (email) => {
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email address");
  }
  
  return await simulateVerification(email.trim());
};

export const getVerificationById = async (id) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  const verification = verificationsData.find(v => v.Id === parseInt(id));
  if (!verification) {
    throw new Error("Verification not found");
  }
  
  return { ...verification };
};

export const getAllVerifications = async () => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
  
  return verificationsData.map(v => ({ ...v }));
};