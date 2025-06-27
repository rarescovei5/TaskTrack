import { Funnel } from "lucide-react";
import NavTabs from "./NavTabs";

const ViewControls = ({ basePath }: { basePath: string }) => {
  return (
    <div className="flex justify-between border-b border-b-border">
      <NavTabs basePath={basePath} />
      <div>
        <button className="px-4 py-2 flex gap-2 items-center transition-colors cursor-pointer">
          <Funnel size={16} />
          Filters
        </button>
      </div>
    </div>
  );
};

export default ViewControls;
