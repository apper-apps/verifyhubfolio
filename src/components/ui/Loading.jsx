import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 mb-3"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="animate-pulse">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="bg-gray-50 border-b border-gray-100">
              <div className="grid grid-cols-5 gap-4 p-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="border-b border-gray-100 last:border-b-0"
              >
                <div className="grid grid-cols-5 gap-4 p-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="animate-pulse">
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center py-12"
    >
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20 animate-ping"></div>
          <div className="relative w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full animate-spin">
            <div className="absolute inset-2 bg-white rounded-full"></div>
          </div>
        </div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </motion.div>
  );
};

export default Loading;