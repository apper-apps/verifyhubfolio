import Badge from "@/components/atoms/Badge";

const EmailStatusBadge = ({ status, subStatus }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "deliverable":
        return { 
          variant: "deliverable", 
          icon: "CheckCircle", 
          label: "Deliverable" 
        };
      case "undeliverable":
        return { 
          variant: "undeliverable", 
          icon: "XCircle", 
          label: "Undeliverable" 
        };
      case "risky":
        return { 
          variant: "risky", 
          icon: "AlertTriangle", 
          label: "Risky" 
        };
      case "unknown":
        return { 
          variant: "unknown", 
          icon: "HelpCircle", 
          label: "Unknown" 
        };
      default:
        return { 
          variant: "default", 
          icon: "Minus", 
          label: status 
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="flex flex-col gap-1">
      <Badge
        variant={config.variant}
        icon={config.icon}
        size="sm"
      >
        {config.label}
      </Badge>
      {subStatus && (
        <Badge variant="default" size="sm" className="text-xs">
          {subStatus.replace(/_/g, " ")}
        </Badge>
      )}
    </div>
  );
};

export default EmailStatusBadge;