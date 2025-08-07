import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import ProgressBar from "@/components/molecules/ProgressBar";
import EmailStatusBadge from "@/components/molecules/EmailStatusBadge";
import { processBulkVerification, downloadResults } from "@/services/api/bulkService";

const BulkVerify = () => {
  const [emails, setEmails] = useState("");
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef();

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
      setEmails("");
      toast.success("CSV file uploaded successfully");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== "text/csv" && !droppedFile.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(droppedFile);
      setEmails("");
      toast.success("CSV file uploaded successfully");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleProcessBulk = async () => {
    if (!file && !emails.trim()) {
      toast.error("Please upload a CSV file or paste email addresses");
      return;
    }

    setProcessing(true);
    setProgress(0);
    setResults(null);

    try {
      let emailList = [];
      
      if (file) {
        // Parse CSV file
        const text = await file.text();
        const lines = text.split("\n").filter(line => line.trim());
        emailList = lines.map(line => line.split(",")[0].trim()).filter(email => email);
      } else {
        // Parse pasted emails
        emailList = emails
          .split("\n")
          .map(email => email.trim())
          .filter(email => email);
      }

      if (emailList.length === 0) {
        toast.error("No valid emails found");
        setProcessing(false);
        return;
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);

      const bulkResults = await processBulkVerification(emailList);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResults(bulkResults);
      
      toast.success(`Successfully verified ${emailList.length} emails`);
    } catch (error) {
      toast.error("Bulk verification failed. Please try again.");
      console.error("Bulk verification error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (results) {
      try {
        await downloadResults(results.results);
        toast.success("Results downloaded successfully");
      } catch (error) {
        toast.error("Failed to download results");
      }
    }
  };

  const handleReset = () => {
    setEmails("");
    setFile(null);
    setResults(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusStats = () => {
    if (!results?.results) return {};
    
    const stats = results.results.reduce((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1;
      return acc;
    }, {});

    const total = results.results.length;
    return {
      deliverable: { count: stats.deliverable || 0, percentage: ((stats.deliverable || 0) / total * 100).toFixed(1) },
      undeliverable: { count: stats.undeliverable || 0, percentage: ((stats.undeliverable || 0) / total * 100).toFixed(1) },
      risky: { count: stats.risky || 0, percentage: ((stats.risky || 0) / total * 100).toFixed(1) },
      unknown: { count: stats.unknown || 0, percentage: ((stats.unknown || 0) / total * 100).toFixed(1) }
    };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bulk Email Verification
        </h1>
        <p className="text-gray-600">
          Upload a CSV file or paste multiple email addresses for batch verification
        </p>
      </motion.div>

      {!results ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Upload" className="w-5 h-5 mr-2 text-primary" />
                Upload CSV File
              </h3>
              
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary/50 transition-colors duration-200 cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drop your CSV file here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  CSV files only, first column should contain email addresses
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              {file && (
                <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg flex items-center">
                  <ApperIcon name="FileText" className="w-4 h-4 text-success mr-2" />
                  <span className="text-success font-medium">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                    className="ml-auto text-success hover:bg-success/20"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Manual Entry */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Edit3" className="w-5 h-5 mr-2 text-primary" />
                Paste Email Addresses
              </h3>
              
              <textarea
                value={emails}
                onChange={(e) => {
                  setEmails(e.target.value);
                  setFile(null);
                }}
                placeholder="Paste email addresses here (one per line)&#10;example1@email.com&#10;example2@email.com&#10;example3@email.com"
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-500"
                disabled={processing}
              />
              
              {emails && (
                <div className="mt-3 text-sm text-gray-600">
                  {emails.split("\n").filter(email => email.trim()).length} email addresses detected
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      ) : null}

      {/* Processing Progress */}
      {processing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                <ApperIcon name="Zap" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Your Emails
              </h3>
              <p className="text-gray-600">
                Please wait while we verify your email addresses...
              </p>
            </div>
            
            <ProgressBar
              value={progress}
              max={100}
              label="Verification Progress"
              color="primary"
            />
          </Card>
        </motion.div>
      )}

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Results Summary */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  Verification Complete
                </h3>
                <p className="text-gray-600">
                  Processed {results.totalEmails} email addresses
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleDownload}
                  className="flex items-center"
                >
                  <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleReset}
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  New Verification
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(getStatusStats()).map(([status, stats]) => (
                <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.count}
                  </div>
                  <div className="text-sm text-gray-600 mb-1 capitalize">
                    {status}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stats.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Results Table */}
          <Card>
            <Card.Header>
              <Card.Title>Verification Results</Card.Title>
            </Card.Header>
            <Card.Content className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Email</th>
                      <th className="text-left p-4 font-medium text-gray-900">Status</th>
                      <th className="text-left p-4 font-medium text-gray-900">Domain</th>
                      <th className="text-left p-4 font-medium text-gray-900">Response Time</th>
                      <th className="text-left p-4 font-medium text-gray-900">Risk Factors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.slice(0, 50).map((result, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900">
                          {result.email}
                        </td>
                        <td className="p-4">
                          <EmailStatusBadge 
                            status={result.status}
                            subStatus={result.subStatus}
                          />
                        </td>
                        <td className="p-4 text-gray-600">
                          {result.domain}
                        </td>
                        <td className="p-4 text-gray-600">
                          {result.responseTime}ms
                        </td>
                        <td className="p-4">
                          {result.riskFactors && result.riskFactors.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {result.riskFactors.slice(0, 2).map((factor, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-warning/10 text-warning text-xs rounded border border-warning/20"
                                >
                                  {factor.replace(/_/g, " ")}
                                </span>
                              ))}
                              {result.riskFactors.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{result.riskFactors.length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {results.results.length > 50 && (
                  <div className="p-4 text-center text-gray-500 bg-gray-50">
                    Showing first 50 results. Download CSV for complete data.
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      {!processing && !results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={handleProcessBulk}
            disabled={!file && !emails.trim()}
            className="px-8"
          >
            <ApperIcon name="Zap" className="w-5 h-5 mr-2" />
            Start Bulk Verification
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default BulkVerify;