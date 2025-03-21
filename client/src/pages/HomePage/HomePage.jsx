import { useState } from "react";
import IncidentTable from "../IncidentTable/IncidentTable";
import IncidentDetailDrawer from "../../components/custom/IncidentDetailDrawer";

export default function HomePage() {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const handleOpenIncident = (incident) => {
    setShowDetail(true);
    setSelectedIncident(incident);
  }

  return (
    <>
      <IncidentTable
        onOpenIncident={handleOpenIncident}
      />
      {showDetail && (
        <IncidentDetailDrawer
          incident={selectedIncident}
          isOpen={showDetail}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}