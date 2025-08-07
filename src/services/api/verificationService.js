import verificationsData from "@/services/mockData/verifications.json";
import React from "react";
import Error from "@/components/ui/Error";

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

// Comprehensive risk factors
const RISK_FACTORS = [
  "role_based", "disposable", "catch_all", "free_provider", 
  "temporary", "no_reply", "timeout", "invalid_format",
  "greylisted", "short_local_part", "suspicious_pattern"
];

// Enhanced domain characteristics database
const DOMAIN_CHARACTERISTICS = {
  // Major free email providers
  "gmail.com": { provider: "free", reliable: true, mxVerified: true, reputation: "excellent" },
  "yahoo.com": { provider: "free", reliable: true, mxVerified: true, reputation: "good" },
  "outlook.com": { provider: "free", reliable: true, mxVerified: true, reputation: "excellent" },
  "hotmail.com": { provider: "free", reliable: true, mxVerified: true, reputation: "good" },
  "aol.com": { provider: "free", reliable: true, mxVerified: true, reputation: "fair" },
  "icloud.com": { provider: "free", reliable: true, mxVerified: true, reputation: "good" },
  "protonmail.com": { provider: "free", reliable: true, mxVerified: true, reputation: "excellent" },
  
  // Disposable/temporary email providers
  "tempmail.org": { provider: "disposable", reliable: false, mxVerified: false, reputation: "poor" },
  "10minutemail.com": { provider: "disposable", reliable: false, mxVerified: false, reputation: "poor" },
  "guerrillamail.com": { provider: "disposable", reliable: false, mxVerified: false, reputation: "poor" },
  "mailinator.com": { provider: "disposable", reliable: false, mxVerified: false, reputation: "poor" },
  "throwaway.email": { provider: "disposable", reliable: false, mxVerified: false, reputation: "poor" },
  
  // Corporate domains (examples)
  "company.com": { provider: "corporate", reliable: true, mxVerified: true, reputation: "excellent" },
"business.org": { provider: "corporate", reliable: true, mxVerified: true, reputation: "good" },
  "enterprise.net": { provider: "corporate", reliable: true, mxVerified: true, reputation: "good" },
  
  // Dynamic domain classification - any domain not explicitly listed will be treated as corporate
  // This allows the system to work with any valid domain structure
  "*": { provider: "corporate", reliable: true, mxVerified: true, reputation: "good", dynamic: true }
};

// Extended role-based email prefixes
const ROLE_PREFIXES = [
  "admin", "support", "info", "contact", "sales", "marketing", 
  "noreply", "no-reply", "help", "service", "team", "office",
  "webmaster", "postmaster", "abuse", "security", "billing",
  "careers", "jobs", "hr", "legal", "privacy", "compliance"
];

// Enhanced verification simulation with realistic delays
// SMTP Configuration following technical requirements
const SMTP_CONFIG = {
  smtpPorts: [25, 587, 2525],
  connectionTimeout: 10000, // ms
  commandTimeout: 5000, // ms
  maxRetries: 3,
  retryDelay: 1000, // ms
  tlsOptions: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  fromEmail: "verify@yourdomain.com",
  helloHostname: "yourdomain.com"
};

const simulateVerification = (email) => {
  return new Promise((resolve) => {
    // SMTP verification simulation with realistic delays
    const complexity = email.includes('@gmail.com') ? 0.5 : 
                      email.includes('disposable') ? 2.0 : 1.0;
    const baseDelay = Math.random() * 600 + 300; // 300-900ms base
    const adjustedDelay = baseDelay * complexity;
    
    // Simulate connection timeout for certain domains
    const shouldTimeout = email.includes('timeout') || email.includes('slow');
    const finalDelay = shouldTimeout ? SMTP_CONFIG.connectionTimeout : adjustedDelay;
    
    setTimeout(() => {
      const result = performEmailVerification(email);
      resolve(result);
    }, finalDelay);
  });
};

// Comprehensive email verification engine
const performEmailVerification = (email) => {
  // Enhanced syntax validation with RFC compliance
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const syntaxValid = emailRegex.test(email) && 
                     !email.includes('..') && 
                     !email.startsWith('.') && 
                     !email.endsWith('.');
  
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
      verifiedAt: new Date().toISOString(),
      confidence: 100,
      smtp: {
        connected: false,
        port: null,
        tlsEnabled: false,
        responseCode: null,
        responseMessage: "Invalid syntax - no SMTP check performed"
      }
    };
  }

  const [localPart, domain] = email.split("@");
  const domainLower = domain.toLowerCase();
  const localLower = localPart.toLowerCase();
  
  // Enhanced domain characteristics lookup
  const domainInfo = DOMAIN_CHARACTERISTICS[domainLower] || 
                    { provider: "corporate", reliable: true, mxVerified: true, reputation: "good" };
  let status = EMAIL_STATUS.DELIVERABLE;
  let subStatus = SUB_STATUS.VALID_MAILBOX;
  let riskFactors = [];
  let confidence = 85;

  // Enhanced domain validation with proper TLD checking
  const validTLDs = /\.(com|org|net|edu|gov|mil|int|co|uk|ca|de|fr|it|es|au|jp|cn|ru|br|mx|za|in|nl|se|no|dk|fi|pl|ch|at|be|ie|pt|gr|cz|hu|ro|bg|hr|si|sk|lt|lv|ee|is|mt|cy|lu)$/i;
  const domainStructure = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const hasConsecutiveChars = /(.)\1{3,}/; // 4+ consecutive same characters
  
  const domainValid = !domainLower.includes("nonexistent") && 
                     !domainLower.includes("invalid") && 
                     !domainLower.includes("fake") &&
                     domainLower.includes('.') &&
                     domainLower.length >= 4 &&
                     domainLower.length <= 253 &&
                     validTLDs.test(domainLower) &&
                     domainStructure.test(domainLower) &&
                     !hasConsecutiveChars.test(domainLower) &&
                     !domainLower.includes('..') &&
                     !domainLower.startsWith('.') &&
                     !domainLower.endsWith('.') &&
                     !domainLower.startsWith('-') &&
                     !domainLower.endsWith('-');
  
  const mxRecords = domainValid && (domainInfo?.mxVerified !== false);
  let smtpCheck = domainValid;
  
  // SMTP Connection Simulation
  let smtpResult = {
    connected: false,
    port: null,
    tlsEnabled: false,
    responseCode: null,
    responseMessage: "",
    retryCount: 0,
    greylistDetected: false
  };
  
  if (domainValid && mxRecords) {
    // Simulate SMTP connection attempt through multiple ports
    const ports = SMTP_CONFIG.smtpPorts;
    let connectionSuccessful = false;
    
    for (let i = 0; i < ports.length && !connectionSuccessful; i++) {
      const port = ports[i];
      const connectionChance = port === 25 ? 0.7 : port === 587 ? 0.9 : 0.8;
      
      if (Math.random() < connectionChance) {
        smtpResult.connected = true;
        smtpResult.port = port;
        smtpResult.tlsEnabled = port !== 25; // STARTTLS simulation
        connectionSuccessful = true;
        
        // Simulate RCPT TO command
        if (localLower.includes("greylist") || domainLower.includes("greylist")) {
          smtpResult.responseCode = 451;
          smtpResult.responseMessage = "451 4.7.1 Greylisted, please try again later";
          smtpResult.greylistDetected = true;
          status = EMAIL_STATUS.RISKY;
          subStatus = SUB_STATUS.GREYLISTED;
          riskFactors.push("greylisted");
          confidence -= 15;
        } else if (localLower.includes("nonexistent") || localLower.includes("invalid") ||
                   localLower.includes("notfound") || localLower.includes("fake")) {
          smtpResult.responseCode = 550;
          smtpResult.responseMessage = "550 5.1.1 User unknown";
          status = EMAIL_STATUS.UNDELIVERABLE;
          subStatus = SUB_STATUS.INVALID_MAILBOX;
          smtpCheck = false;
          confidence = 95;
        } else if (localLower.includes("full") || localLower.includes("quota")) {
          smtpResult.responseCode = 452;
          smtpResult.responseMessage = "452 4.2.2 Mailbox full";
          status = EMAIL_STATUS.RISKY;
          riskFactors.push("mailbox_full");
          confidence -= 25;
        } else {
          smtpResult.responseCode = 250;
          smtpResult.responseMessage = "250 2.1.5 OK";
        }
      }
    }
    
    // Handle connection timeout simulation
    if (domainLower.includes("timeout") || localLower.includes("slow")) {
      smtpResult.connected = false;
      smtpResult.responseCode = null;
      smtpResult.responseMessage = "Connection timeout";
      status = EMAIL_STATUS.UNKNOWN;
      subStatus = SUB_STATUS.TIMEOUT;
      riskFactors.push("timeout");
      smtpCheck = false;
      confidence = 0;
    }
    
    // Rate limiting simulation
    if (Math.random() < 0.1) { // 10% chance of rate limiting
      smtpResult.retryCount = Math.floor(Math.random() * SMTP_CONFIG.maxRetries) + 1;
      if (smtpResult.retryCount >= SMTP_CONFIG.maxRetries) {
        smtpResult.responseMessage += " (Max retries reached)";
      }
    }
  }

  if (!domainValid) {
    status = EMAIL_STATUS.UNDELIVERABLE;
    subStatus = SUB_STATUS.INVALID_DOMAIN;
    smtpCheck = false;
    confidence = 100;
    smtpResult.responseMessage = "Domain validation failed - no SMTP check performed";
  } else {
    // Role-based email detection with comprehensive checking
    const isRoleBased = ROLE_PREFIXES.some(prefix => localLower.startsWith(prefix));
    if (isRoleBased) {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.ROLE_BASED;
      riskFactors.push("role_based");
      confidence -= 20;
    }
    
    // Disposable email detection
    if (domainInfo?.provider === "disposable") {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.DISPOSABLE;
      riskFactors.push("disposable", "temporary");
      smtpCheck = false;
      confidence -= 30;
      smtpResult.responseMessage = "Disposable domain - SMTP check skipped";
    }
    
    // Free provider handling
    if (domainInfo?.provider === "free" && status === EMAIL_STATUS.DELIVERABLE) {
      riskFactors.push("free_provider");
      confidence -= 5;
    }
    
    // Corporate email detection (higher confidence)
    if (domainInfo?.provider === "corporate") {
      confidence += 10;
    }
    
    // Catch-all domain detection
    if (domainLower.includes("example") || domainLower.includes("test") || 
        domainLower.endsWith(".test") || domainLower.includes("catchall")) {
      status = EMAIL_STATUS.RISKY;
      subStatus = SUB_STATUS.CATCH_ALL;
      riskFactors.push("catch_all");
      confidence -= 25;
    }
    
    // Invalid mailbox patterns and random character detection
    const hasRandomPattern = /^[a-z]*[fdsw]{3,}[a-z]*$/.test(localLower) || 
                            localLower.length > 8 && /([a-z])\1{2,}/.test(localLower) ||
                            localLower.match(/^[a-z]{10,}$/) && !localLower.match(/^(admin|support|info|contact|sales|marketing|test|demo|user|guest|public)$/);
    
    if (hasRandomPattern || (domainInfo?.strictMailbox && localLower.match(/^[a-z]+[0-9]*[a-z]*$/) && localLower.length > 6)) {
      if (smtpResult.responseCode !== 250) { // Only override if SMTP didn't already validate
        status = EMAIL_STATUS.UNDELIVERABLE;
        subStatus = SUB_STATUS.INVALID_MAILBOX;
        smtpCheck = false;
        riskFactors = [];
        confidence = 95;
      }
    }
    
    // Additional risk factor analysis
    if (localPart.length < 2) {
      riskFactors.push("short_local_part");
      confidence -= 10;
    }
    
    if (localLower.includes("test") || localLower.includes("demo")) {
      riskFactors.push("suspicious_pattern");
      confidence -= 15;
    }
    
    // Reputation-based adjustments
    if (domainInfo?.reputation === "excellent") {
      confidence += 5;
    } else if (domainInfo?.reputation === "poor") {
      confidence -= 20;
    }
  }
  
  // Ensure confidence stays within bounds
  confidence = Math.max(0, Math.min(100, confidence));
  
  // Realistic response time based on verification complexity and SMTP operations
  let responseTime;
  switch (status) {
    case EMAIL_STATUS.UNDELIVERABLE:
      responseTime = Math.floor(Math.random() * 600) + 200; // 200-800ms
      break;
    case EMAIL_STATUS.RISKY:
      responseTime = Math.floor(Math.random() * 1500) + 600; // 600-2100ms
      break;
    case EMAIL_STATUS.UNKNOWN:
      responseTime = Math.floor(Math.random() * 4000) + 2000; // 2000-6000ms
      break;
    default:
      responseTime = Math.floor(Math.random() * 1000) + 400; // 400-1400ms
  }
  
  // Add SMTP connection time if applicable
  if (smtpResult.connected) {
    responseTime += Math.floor(Math.random() * 500) + 100; // 100-600ms additional for SMTP
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
    verifiedAt: new Date().toISOString(),
    confidence,
    smtp: smtpResult
  };
};

export const verifyEmail = async (email) => {
  if (!email || typeof email !== "string" || email.trim().length === 0) {
    throw new Error("Invalid email address provided");
  }
  
  const trimmedEmail = email.trim();
  
  // Validate SMTP configuration
  if (!SMTP_CONFIG.smtpPorts || SMTP_CONFIG.smtpPorts.length === 0) {
    throw new Error("SMTP configuration is invalid - no ports specified");
  }
  
  if (SMTP_CONFIG.connectionTimeout <= 0 || SMTP_CONFIG.commandTimeout <= 0) {
    throw new Error("SMTP configuration is invalid - timeouts must be positive");
  }
  
  // Perform SMTP verification simulation
  const result = await simulateVerification(trimmedEmail);
  
  // Import and add to history (avoiding circular dependency)
  try {
    const { addVerificationToHistory } = await import('./historyService.js');
    addVerificationToHistory(result);
  } catch (error) {
    console.warn('Could not add verification to history:', error.message);
  }
  
  return result;
};

export const getVerificationById = async (id) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
  
  const verificationId = parseInt(id);
  if (isNaN(verificationId)) {
    throw new Error("Invalid verification ID provided");
  }
  
  const verification = verificationsData.find(v => v.Id === verificationId);
  if (!verification) {
    throw new Error(`Verification with ID ${id} not found`);
  }
  
  return { 
    ...verification,
    accessedAt: new Date().toISOString()
  };
};

export const getAllVerifications = async (filters = {}) => {
  // Add delay for realistic loading
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
  
  let verifications = verificationsData.map(v => ({ ...v }));
  
  // Apply filters if provided
  if (filters.status && filters.status !== "all") {
    verifications = verifications.filter(v => v.status === filters.status);
  }
  
  if (filters.domain) {
    verifications = verifications.filter(v => 
      v.domain.toLowerCase().includes(filters.domain.toLowerCase())
    );
  }
  
  if (filters.riskFactorsOnly) {
    verifications = verifications.filter(v => 
      v.riskFactors && v.riskFactors.length > 0
    );
  }
  
  // Sort by verification date, newest first
  verifications.sort((a, b) => new Date(b.verifiedAt) - new Date(a.verifiedAt));
  
  return verifications;
};

// Batch verification for multiple emails
export const verifyEmailBatch = async (emails, onProgress = null) => {
  if (!Array.isArray(emails) || emails.length === 0) {
    throw new Error("Invalid email array provided");
  }
  
  const results = [];
  const batchSize = 5;
  
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(email => simulateVerification(email.trim()))
    );
    
    results.push(...batchResults);
    
    if (onProgress) {
      onProgress({
        completed: results.length,
        total: emails.length,
        percentage: Math.round((results.length / emails.length) * 100)
      });
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
};