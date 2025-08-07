import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getDashboardStats, getRecentVerifications } from "@/services/api/dashboardService";
import EmailStatusBadge from "@/components/molecules/EmailStatusBadge";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentVerifications, setRecentVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
const [statsData, recentData] = await Promise.all([
        getDashboardStats(),
        getRecentVerifications(8) // Get more recent verifications
      ]);
      setStats(statsData);
      setRecentVerifications(recentData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const quickActions = [
    {
      title: "Single Email Verification",
      description: "Verify individual email addresses with detailed analysis",
      icon: "Mail",
      color: "primary",
      action: () => navigate("/single")
    },
    {
      title: "Bulk Verification",
      description: "Upload CSV or paste multiple emails for batch processing",
      icon: "FileText",
      color: "success",
      action: () => navigate("/bulk")
    },
    {
      title: "View History",
      description: "Browse and export your verification history",
      icon: "Clock",
      color: "warning",
      action: () => navigate("/history")
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to VerifyHub
        </h1>
        <p className="text-xl text-gray-600">
          Professional email verification to improve your deliverability
        </p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Verified"
value={stats.totalVerified.toLocaleString()}
          change={`+${stats.todayVerified} today`}
          icon="CheckCircle"
          color="primary"
          delay={0}
        />
        <StatCard
          title="Deliverable Rate"
          value={`${stats.deliverableRate}%`}
          change={stats.deliverableRate >= 85 ? "+Excellent quality" : 
                  stats.deliverableRate >= 70 ? "+Good quality" : "Needs improvement"}
          icon="TrendingUp"
          color="success"
          delay={0.1}
        />
        <StatCard
          title="Risk Rate"
          value={`${stats.riskRate}%`}
          change={stats.riskRate <= 10 ? "+Very low risk" : 
                  stats.riskRate <= 20 ? "+Low risk" : "Monitor closely"}
          icon="AlertTriangle"
          color="warning"
          delay={0.2}
        />
        <StatCard
          title="Avg Response"
          value={`${stats.avgResponseTime}ms`}
          change={stats.avgResponseTime < 1000 ? "+Excellent speed" : 
                  stats.avgResponseTime < 2000 ? "+Good speed" : "+Needs optimization"}
          icon="Zap"
          color="error"
          delay={0.3}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-6 h-full cursor-pointer hover:shadow-lg transition-all duration-200" onClick={action.action}>
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${
                    action.color === "primary" ? "from-primary to-secondary" :
                    action.color === "success" ? "from-success to-emerald-600" :
                    action.color === "warning" ? "from-warning to-orange-600" :
                    "from-error to-red-600"
                  } rounded-xl flex items-center justify-center shadow-lg`}>
                    <ApperIcon name={action.icon} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {action.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Verifications */}
      {recentVerifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <Card.Title>Recent Verifications</Card.Title>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/history")}
                  className="text-primary"
                >
                  View All
                  <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
                </Button>
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
                      <th className="text-left p-4 font-medium text-gray-900">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
{recentVerifications.slice(0, 5).map((verification, index) => (
                      <motion.tr
key={verification.Id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{verification.email}</div>
                          {verification.isRecent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mt-1">
                              <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
                              Recent
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <EmailStatusBadge
                            status={verification.status}
                            subStatus={verification.subStatus}
                          />
                        </td>
                        <td className="p-4 text-gray-600">
                          <div>{verification.domain}</div>
                          {verification.responseQuality && (
                            <span className={`text-xs ${
                              verification.responseQuality === 'excellent' ? 'text-success' :
                              verification.responseQuality === 'good' ? 'text-warning' : 'text-error'
                            }`}>
                              {verification.responseQuality} speed
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-gray-600">
                          {format(new Date(verification.verifiedAt), "MMM dd, HH:mm")}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      )}

      {/* Getting Started Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
              <ApperIcon name="Lightbulb" className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Pro Tips for Better Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ApperIcon name="Check" className="w-3 h-3 text-success" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Clean Lists Regularly</div>
                  <div className="text-gray-600">Verify your email lists monthly to maintain high deliverability</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ApperIcon name="AlertTriangle" className="w-3 h-3 text-warning" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Monitor Risk Factors</div>
                  <div className="text-gray-600">Pay attention to risky emails to protect your sender reputation</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-info/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ApperIcon name="TrendingUp" className="w-3 h-3 text-info" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Track Performance</div>
                  <div className="text-gray-600">Use our history feature to monitor your email quality trends</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;