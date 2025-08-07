import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = "primary",
  delay = 0 
}) => {
  const colors = {
    primary: "from-primary to-secondary",
    success: "from-success to-emerald-600",
    warning: "from-warning to-orange-600",
    error: "from-error to-red-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2 }}
    >
      <Card className="p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            {change && (
              <p className={`text-sm ${change.startsWith("+") ? "text-success" : "text-error"}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;