import { BadgeCheck, Shield } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface RegulatoryBadgeProps {
  medicineName: string;
}

const RegulatoryBadge = ({ medicineName }: RegulatoryBadgeProps) => {
  return (
    <div className="flex items-center gap-2 mt-2">
      <Tooltip>
        <TooltipTrigger>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            <BadgeCheck className="w-3 h-3" />
            Approved Generic
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-[200px]">This medicine is an approved generic verified by regulatory standards (CDSCO/WHO)</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
            <Shield className="w-3 h-3" />
            Regulator Verified
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-[200px]">Quality tested and approved for clinical use in India</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default RegulatoryBadge;
