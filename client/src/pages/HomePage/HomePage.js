import { Button } from "@/components/ui/button";
import { IconReport, IconChartBar, IconAlertTriangle } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Button
        icon={<IconReport />}
        label="Reports"
        onClick={() => console.log("Reports button clicked")}
      />
    </>
  );
}