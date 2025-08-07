import bulkJobsData from "@/services/mockData/bulkJobs.json";

// SMTP Configuration for bulk verification
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

// Email status constants
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

// Dynamic domain classification system - works with any valid domain
const KNOWN_FREE_PROVIDERS = [
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "icloud.com",
  "live.com", "msn.com", "yahoo.co.uk", "googlemail.com", "me.com", "mac.com",
  "ymail.com", "rocketmail.com", "mail.com", "gmx.com", "web.de"
];

const KNOWN_DISPOSABLE_PROVIDERS = [
  "tempmail.org", "10minutemail.com", "guerrillamail.com", "mailinator.com",
  "temp-mail.org", "throwaway.email", "getnada.com", "maildrop.cc",
  "sharklasers.com", "guerrillamail.org", "guerrillamail.net", "guerrillamail.biz",
  "guerrillamail.de", "grr.la", "guerrillamailblock.com", "pokemail.net",
  "spam4.me", "boun.cr", "devnullmail.com", "emailondeck.com"
];

// Dynamic domain classification function
const classifyDomain = (domain) => {
  const domainLower = domain.toLowerCase();
  
  if (KNOWN_FREE_PROVIDERS.includes(domainLower)) {
    return { provider: "free", reliable: true, mxVerified: true };
  }
  
  if (KNOWN_DISPOSABLE_PROVIDERS.includes(domainLower)) {
    return { provider: "disposable", reliable: false, mxVerified: false };
  }
  
  // Check for disposable patterns
  if (domainLower.includes("temp") || domainLower.includes("disposable") || 
      domainLower.includes("throw") || domainLower.includes("fake") ||
      domainLower.includes("spam") || domainLower.includes("trash")) {
    return { provider: "disposable", reliable: false, mxVerified: false };
  }
  
  // Default to corporate for any other valid domain
  return { provider: "corporate", reliable: true, mxVerified: true };
};

const ROLE_PREFIXES = [
  "admin", "support", "info", "contact", "sales", "marketing", 
  "noreply", "no-reply", "help", "service", "team", "office",
  "webmaster", "postmaster", "abuse", "security", "billing"
];
// Enhanced email verification with comprehensive validation
// Enhanced bulk verification with SMTP simulation
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
      verifiedAt: new Date().toISOString(),
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
  
  // Use dynamic domain classification instead of hardcoded lookup
  const domainInfo = classifyDomain(domainLower);
  let status = EMAIL_STATUS.DELIVERABLE;
  let subStatus = SUB_STATUS.VALID_MAILBOX;
  let riskFactors = [];

  // Enhanced domain validation with comprehensive TLD checking for all domains
  const validTLDs = /\.(com|org|net|edu|gov|mil|int|co|uk|ca|de|fr|it|es|au|jp|cn|ru|br|mx|za|in|nl|se|no|dk|fi|pl|ch|at|be|ie|pt|gr|cz|hu|ro|bg|hr|si|sk|lt|lv|ee|is|mt|cy|lu|us|info|biz|name|pro|museum|aero|coop|travel|jobs|mobi|tel|asia|xxx|post|geo|cat|arpa|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|aw|ax|az|ba|bb|bd|bf|bh|bi|bj|bm|bn|bo|bq|bs|bt|bv|bw|by|bz|cc|cd|cf|cg|ci|ck|cl|cm|co\.ao|co\.bw|co\.ck|co\.cr|co\.fk|co\.id|co\.il|co\.im|co\.in|co\.jp|co\.ke|co\.kr|co\.ls|co\.ma|co\.nz|co\.th|co\.tz|co\.ug|co\.uk|co\.uz|co\.ve|co\.vi|co\.za|co\.zm|co\.zw|cr|cu|cv|cw|cx|cy|dj|dm|do|dz|ec|ee|eg|eh|er|et|eu|fj|fk|fm|fo|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|id|il|im|io|iq|ir|je|jm|jo|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mu|mv|mw|my|mz|na|nc|ne|nf|ng|ni|nu|nz|om|pa|pe|pf|pg|ph|pk|pm|pn|pr|ps|pw|py|qa|re|rs|rw|sa|sb|sc|sd|sg|sh|sj|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tr|tt|tv|tw|tz|ua|ug|um|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|zm|zw)$/i;
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
  
  // SMTP Connection Simulation for bulk processing
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
    // Simulate SMTP connection with rate limiting for bulk processing
    const ports = SMTP_CONFIG.smtpPorts;
    let connectionSuccessful = false;
    
    // Higher failure rate for bulk to simulate rate limiting
    const bulkConnectionChance = Math.random() * 0.8; // 80% success rate for bulk
    
    if (bulkConnectionChance > 0.2) {
      const selectedPort = ports[Math.floor(Math.random() * ports.length)];
      smtpResult.connected = true;
      smtpResult.port = selectedPort;
      smtpResult.tlsEnabled = selectedPort !== 25;
      connectionSuccessful = true;
      
      // Simulate RCPT TO command with bulk-specific responses
      if (localLower.includes("greylist") || domainLower.includes("greylist")) {
        smtpResult.responseCode = 451;
        smtpResult.responseMessage = "451 4.7.1 Greylisted, please try again later";
        smtpResult.greylistDetected = true;
        status = EMAIL_STATUS.RISKY;
        subStatus = SUB_STATUS.GREYLISTED;
        riskFactors.push("greylisted");
      } else if (localLower.includes("nonexistent") || localLower.includes("invalid") ||
                 localLower.includes("notfound") || localLower.includes("fake")) {
        smtpResult.responseCode = 550;
        smtpResult.responseMessage = "550 5.1.1 User unknown";
        status = EMAIL_STATUS.UNDELIVERABLE;
        subStatus = SUB_STATUS.INVALID_MAILBOX;
        smtpCheck = false;
      } else {
        smtpResult.responseCode = 250;
        smtpResult.responseMessage = "250 2.1.5 OK";
      }
      
      // Simulate rate limiting in bulk processing
      if (Math.random() < 0.15) { // 15% chance of hitting rate limits
        smtpResult.retryCount = Math.floor(Math.random() * SMTP_CONFIG.maxRetries) + 1;
        smtpResult.responseMessage += ` (Retry ${smtpResult.retryCount}/${SMTP_CONFIG.maxRetries})`;
      }
    } else {
      smtpResult.responseMessage = "Connection failed - rate limited or server unavailable";
    }
  }

  if (!domainValid) {
    status = EMAIL_STATUS.UNDELIVERABLE;
    subStatus = SUB_STATUS.INVALID_DOMAIN;
    smtpCheck = false;
    smtpResult.responseMessage = "Domain validation failed - no SMTP check performed";
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
      smtpResult.responseMessage = "Disposable domain - SMTP check skipped";
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
      smtpResult.connected = false;
      smtpResult.responseMessage = "Connection timeout";
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
  
  // Realistic response time based on status and SMTP operations
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
  
  // Add SMTP overhead for bulk processing
  if (smtpResult.connected) {
    responseTime += Math.floor(Math.random() * 300) + 50; // 50-350ms additional
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
    smtp: smtpResult
  };
};

export const processBulkVerification = async (emailList, onProgress = null) => {
  if (!Array.isArray(emailList) || emailList.length === 0) {
    throw new Error("Invalid email list provided");
  }

  // Validate SMTP configuration for bulk processing
  if (!SMTP_CONFIG.smtpPorts || SMTP_CONFIG.smtpPorts.length === 0) {
    throw new Error("SMTP configuration is invalid - no ports specified");
  }

  const jobId = `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const results = [];
  const batchSize = 10;
  const totalEmails = emailList.length;
  let smtpConnections = 0;
  let smtpFailures = 0;
  let greylistCount = 0;
  let retryCount = 0;
  
  // Process in batches for realistic progress tracking and SMTP rate limiting
  for (let i = 0; i < totalEmails; i += batchSize) {
    const batch = emailList.slice(i, i + batchSize);
    
    // Simulate batch processing time with SMTP connection overhead
    const baseDelay = Math.random() * 800 + 200;
    const smtpOverhead = batch.length * 50; // Additional time per SMTP check
    await new Promise(resolve => setTimeout(resolve, baseDelay + smtpOverhead));
    
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
          verifiedAt: new Date().toISOString(),
          smtp: {
            connected: false,
            port: null,
            tlsEnabled: false,
            responseCode: null,
            responseMessage: "Empty email - no SMTP check performed"
          }
        };
      }
      
      const result = performBulkEmailVerification(trimmedEmail);
      
      // Track SMTP statistics
      if (result.smtp?.connected) {
        smtpConnections++;
      } else if (result.smtp?.responseMessage?.includes("failed") || result.smtp?.responseMessage?.includes("timeout")) {
        smtpFailures++;
      }
      
      if (result.smtp?.greylistDetected) {
        greylistCount++;
      }
      
      if (result.smtp?.retryCount > 0) {
        retryCount++;
      }
      
      return result;
    });
    
    results.push(...batchResults);
    
    // Report progress with SMTP statistics if callback provided
    if (onProgress) {
      const progressData = {
        processed: results.length,
        total: totalEmails,
        percentage: Math.round((results.length / totalEmails) * 100),
        smtp: {
          connections: smtpConnections,
          failures: smtpFailures,
          greylistDetected: greylistCount,
          retries: retryCount,
          successRate: smtpConnections > 0 ? Math.round((smtpConnections / (smtpConnections + smtpFailures)) * 100) : 0
        }
      };
      onProgress(progressData);
    }
    
    // Rate limiting simulation - add delay between batches
    if (i + batchSize < totalEmails) {
      await new Promise(resolve => setTimeout(resolve, SMTP_CONFIG.retryDelay / 2));
    }
  }

  // Calculate summary statistics
  const statusCounts = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] || 0) + 1;
    return acc;
  }, {});

  // Calculate SMTP statistics
  const smtpStats = {
    totalConnections: smtpConnections,
    totalFailures: smtpFailures,
    successRate: smtpConnections > 0 ? Math.round((smtpConnections / (smtpConnections + smtpFailures)) * 100) : 0,
    greylistDetected: greylistCount,
    retriesPerformed: retryCount,
    averageResponseTime: Math.round(
      results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
    )
  };

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
    },
    smtpStats
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