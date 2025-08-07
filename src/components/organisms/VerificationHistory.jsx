import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import EmailStatusBadge from "@/components/molecules/EmailStatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { getVerificationHistory, exportHistory } from "@/services/api/historyService";

const VerificationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVerificationHistory();
      setHistory(data);
    } catch (err) {
      setError("Failed to load verification history");
      console.error("History loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const filteredHistory = getFilteredHistory();
      await exportHistory(filteredHistory);
      toast.success("History exported successfully");
    } catch (error) {
      toast.error("Failed to export history");
    }
  };

  const getFilteredHistory = () => {
    let filtered = [...history];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.email.toLowerCase().includes(term) ||
        item.domain.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      if (dateFilter !== "all") {
        filtered = filtered.filter(item => 
          new Date(item.verifiedAt) >= filterDate
        );
      }
    }

    return filtered.sort((a, b) => new Date(b.verifiedAt) - new Date(a.verifiedAt));
  };

  const filteredHistory = getFilteredHistory();

  const getStatusCounts = () => {
    return history.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = getStatusCounts();

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadHistory} />;
  
  if (history.length === 0) {
    return (
      <Empty
        title="No verification history"
        description="Start verifying emails to see your history here."
        icon="Clock"
        action={() => window.location.href = "/single"}
        actionLabel="Start Verifying"
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verification History
          </h1>
          <p className="text-gray-600">
            View and manage your email verification history
          </p>
        </div>
        <Button onClick={handleExport} className="flex items-center">
          <ApperIcon name="Download" className="w-4 h-4 mr-2" />
          Export History
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {history.length}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </Card>
        
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {count}
            </div>
            <div className="text-sm text-gray-600 capitalize">{status}</div>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by email, domain, or status..."
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
              >
                <option value="all">All Statuses</option>
                <option value="deliverable">Deliverable</option>
                <option value="undeliverable">Undeliverable</option>
                <option value="risky">Risky</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date Filter
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredHistory.length === 0 ? (
          <Empty
            title="No matching results"
            description="Try adjusting your search criteria or filters."
            icon="Search"
          />
        ) : (
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <Card.Title>
                  Verification Results ({filteredHistory.length})
                </Card.Title>
                <div className="text-sm text-gray-500">
                  Showing {Math.min(filteredHistory.length, 100)} results
                </div>
              </div>
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
                      <th className="text-left p-4 font-medium text-gray-900">Verified Date</th>
                      <th className="text-left p-4 font-medium text-gray-900">Risk Factors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.slice(0, 100).map((item, index) => (
                      <motion.tr
                        key={item.Id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="p-4 font-medium text-gray-900">
                          {item.email}
                        </td>
                        <td className="p-4">
                          <EmailStatusBadge 
                            status={item.status}
                            subStatus={item.subStatus}
                          />
                        </td>
                        <td className="p-4 text-gray-600">
                          {item.domain}
                        </td>
                        <td className="p-4 text-gray-600">
                          {item.responseTime}ms
                        </td>
                        <td className="p-4 text-gray-600">
                          {format(new Date(item.verifiedAt), "MMM dd, yyyy HH:mm")}
                        </td>
                        <td className="p-4">
                          {item.riskFactors && item.riskFactors.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.riskFactors.slice(0, 2).map((factor, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-warning/10 text-warning text-xs rounded border border-warning/20"
                                >
                                  {factor.replace(/_/g, " ")}
                                </span>
                              ))}
                              {item.riskFactors.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{item.riskFactors.length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {filteredHistory.length > 100 && (
                  <div className="p-4 text-center text-gray-500 bg-gray-50">
                    Showing first 100 results. Use filters to narrow down or export for complete data.
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default VerificationHistory;