import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available", 
  description = "Get started by adding some data.",
  action,
  actionLabel = "Get Started",
  icon = "Inbox"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-8">
          {description}
        </p>
        {action && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;