import { motion } from "framer-motion";

const ProgressBar = ({ 
  value, 
  max = 100, 
  label, 
  showPercentage = true,
  color = "primary" 
}) => {
  const percentage = Math.round((value / max) * 100);
  
  const colors = {
    primary: "from-primary to-secondary",
    success: "from-success to-emerald-600",
    warning: "from-warning to-orange-600",
    error: "from-error to-red-600"
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-500">{percentage}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;