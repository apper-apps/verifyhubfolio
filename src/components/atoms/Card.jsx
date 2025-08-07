import { cn } from "@/utils/cn";

const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("p-6 border-b border-gray-100", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardContent = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    >
      {children}
    </h3>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Title = CardTitle;

export default Card;