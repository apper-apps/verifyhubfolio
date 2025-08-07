import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Badge = ({ 
  variant = "default", 
  size = "md", 
  children, 
  icon,
  className,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    deliverable: "bg-gradient-to-r from-success/20 to-emerald-500/20 text-success border border-success/20",
    undeliverable: "bg-gradient-to-r from-error/20 to-red-500/20 text-error border border-error/20",
    risky: "bg-gradient-to-r from-warning/20 to-orange-500/20 text-warning border border-warning/20",
    unknown: "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 border border-gray-200"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && (
        <ApperIcon name={icon} className="w-3 h-3 mr-1" />
      )}
      {children}
    </span>
  );
};

export default Badge;