import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { verifyEmail } from "@/services/api/verificationService";
import ApperIcon from "@/components/ApperIcon";
import EmailStatusBadge from "@/components/molecules/EmailStatusBadge";
import Header from "@/components/organisms/Header";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const SingleVerify = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address");
      return;
}

    setLoading(true);
    setResult(null);
    try {
      const verificationResult = await verifyEmail(email);
      setResult(verificationResult);
      
      // Show appropriate toast based on result
      const statusMessages = {
        deliverable: "✅ Email verified as deliverable!",
        undeliverable: "❌ Email is undeliverable",
        risky: "⚠️ Email flagged as risky",
        unknown: "❓ Email status could not be determined"
      };
      
      toast.success(statusMessages[verificationResult.status] || "Email verification completed");
    } catch (error) {
      toast.error("Verification failed. Please try again.");
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewVerification = () => {
    setEmail("");
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Single Email Verification
        </h1>
        <p className="text-gray-600">
          Verify individual email addresses with detailed results
        </p>
      </motion.div>

      {/* Verification Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to verify"
                className="text-lg py-3"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="flex-1"
              >
                <ApperIcon name="Search" className="w-5 h-5 mr-2" />
                Verify Email
              </Button>
              
              {result && (
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleNewVerification}
                  className="flex-1 sm:flex-none"
                >
                  <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                  New Verification
                </Button>
              )}
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <Card.Header>
<div className="flex items-center justify-between">
                <Card.Title>Verification Results</Card.Title>
                <EmailStatusBadge 
                  status={result.status}
                  subStatus={result.subStatus}
                />
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <ApperIcon name="Info" className="w-4 h-4 mr-2 text-primary" />
                    Basic Information
                  </h4>
                  <div className="space-y-3 pl-6">
<div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{result.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Domain:</span>
                      <span className="font-medium">{result.domain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time:</span>
                      <span className={`font-medium ${
                        result.responseTime < 1000 ? 'text-success' : 
                        result.responseTime < 3000 ? 'text-warning' : 'text-error'
                      }`}>
                        {result.responseTime}ms
                      </span>
                    </div>
                    {result.confidence && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className={`font-medium ${
                          result.confidence >= 80 ? 'text-success' : 
                          result.confidence >= 60 ? 'text-warning' : 'text-error'
                        }`}>
                          {result.confidence}%
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verified At:</span>
                      <span className="font-medium">
                        {new Date(result.verifiedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Technical Checks */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2 text-success" />
                    Technical Checks
                  </h4>
<div className="space-y-3 pl-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Syntax Valid:</span>
                      <div className="flex items-center">
                        <ApperIcon 
                          name={result.syntaxValid ? "Check" : "X"} 
                          className={`w-4 h-4 ${result.syntaxValid ? "text-success" : "text-error"}`}
                        />
                        <span className="text-xs text-gray-500 ml-1">
                          {result.syntaxValid ? "Valid" : "Invalid"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Domain Valid:</span>
                      <div className="flex items-center">
                        <ApperIcon 
                          name={result.domainValid ? "Check" : "X"} 
                          className={`w-4 h-4 ${result.domainValid ? "text-success" : "text-error"}`}
                        />
                        <span className="text-xs text-gray-500 ml-1">
                          {result.domainValid ? "Valid" : "Invalid"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">MX Records:</span>
                      <div className="flex items-center">
                        <ApperIcon 
                          name={result.mxRecords ? "Check" : "X"} 
                          className={`w-4 h-4 ${result.mxRecords ? "text-success" : "text-error"}`}
                        />
                        <span className="text-xs text-gray-500 ml-1">
                          {result.mxRecords ? "Found" : "Not found"}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">SMTP Check:</span>
                      <div className="flex items-center">
                        <ApperIcon 
                          name={result.smtpCheck ? "Check" : "X"} 
                          className={`w-4 h-4 ${result.smtpCheck ? "text-success" : "text-error"}`}
                        />
                        <span className="text-xs text-gray-500 ml-1">
                          {result.smtpCheck ? "Passed" : "Failed"}
                        </span>
                      </div>
</div>
                  </div>
                </div>
              </div>
            </Card.Content>
              {/* SMTP Details */}
              {result.smtp && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 flex items-center mb-4">
                    <ApperIcon name="Server" className="w-4 h-4 mr-2 text-primary" />
                    SMTP Verification Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Connection:</span>
                        <div className="flex items-center">
                          <ApperIcon 
                            name={result.smtp.connected ? "Check" : "X"} 
                            className={`w-4 h-4 ${result.smtp.connected ? "text-success" : "text-error"}`}
                          />
                          <span className="text-xs text-gray-500 ml-1">
                            {result.smtp.connected ? "Connected" : "Failed"}
                          </span>
                        </div>
                      </div>
                      {result.smtp.port && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Port:</span>
                          <span className="font-medium">{result.smtp.port}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">TLS Enabled:</span>
                        <div className="flex items-center">
                          <ApperIcon 
                            name={result.smtp.tlsEnabled ? "Shield" : "ShieldOff"} 
                            className={`w-4 h-4 ${result.smtp.tlsEnabled ? "text-success" : "text-gray-400"}`}
                          />
                          <span className="text-xs text-gray-500 ml-1">
                            {result.smtp.tlsEnabled ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {result.smtp.responseCode && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Response Code:</span>
                          <span className={`font-medium ${
                            result.smtp.responseCode >= 200 && result.smtp.responseCode < 300 ? 'text-success' :
                            result.smtp.responseCode >= 400 && result.smtp.responseCode < 500 ? 'text-warning' :
                            'text-error'
                          }`}>
                            {result.smtp.responseCode}
                          </span>
                        </div>
                      )}
                      {result.smtp.greylistDetected && (
                        <div className="flex items-center text-warning text-sm">
                          <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                          Greylisting Detected
                        </div>
                      )}
                      {result.smtp.retryCount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Retries:</span>
                          <span className="text-warning">{result.smtp.retryCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {result.smtp.responseMessage && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 font-mono">
                        {result.smtp.responseMessage}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Risk Factors */}
              {result.riskFactors && result.riskFactors.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 flex items-center mb-3">
                    <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-2 text-warning" />
                    Risk Factors ({result.riskFactors.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.riskFactors.map((factor, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-warning/10 text-warning text-sm rounded-full border border-warning/20"
                      >
                        {factor.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default SingleVerify;