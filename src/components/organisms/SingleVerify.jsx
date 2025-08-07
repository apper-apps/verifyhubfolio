import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import EmailStatusBadge from "@/components/molecules/EmailStatusBadge";
import { verifyEmail } from "@/services/api/verificationService";

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
    try {
      const verificationResult = await verifyEmail(email);
      setResult(verificationResult);
      toast.success("Email verification completed");
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
                      <span className="font-medium">{result.responseTime}ms</span>
                    </div>
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
                      <ApperIcon 
                        name={result.syntaxValid ? "Check" : "X"} 
                        className={`w-4 h-4 ${result.syntaxValid ? "text-success" : "text-error"}`}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Domain Valid:</span>
                      <ApperIcon 
                        name={result.domainValid ? "Check" : "X"} 
                        className={`w-4 h-4 ${result.domainValid ? "text-success" : "text-error"}`}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">MX Records:</span>
                      <ApperIcon 
                        name={result.mxRecords ? "Check" : "X"} 
                        className={`w-4 h-4 ${result.mxRecords ? "text-success" : "text-error"}`}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">SMTP Check:</span>
                      <ApperIcon 
                        name={result.smtpCheck ? "Check" : "X"} 
                        className={`w-4 h-4 ${result.smtpCheck ? "text-success" : "text-error"}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              {result.riskFactors && result.riskFactors.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900 flex items-center mb-3">
                    <ApperIcon name="AlertTriangle" className="w-4 h-4 mr-2 text-warning" />
                    Risk Factors
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
            </Card.Content>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default SingleVerify;