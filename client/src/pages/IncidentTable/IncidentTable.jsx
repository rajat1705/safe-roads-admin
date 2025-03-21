import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const incidents = [
  {
    id: 1,
    type: "Pothole",
    description: "Large pothole on Main Road",
    city: "New Delhi",
    state: "Delhi",
    status: "pending",
  },
  {
    id: 2,
    created_at: "2025-03-18T14:22:10.123456+00:00",
    type: "Broken Signal",
    description: "Traffic light not working.",
    city: "Gurgaon",
    state: "Haryana",
    status: "approved",
  },
  {
    id: 3,
    type: "Fallen Sign",
    description: "Stop sign knocked over.",
    city: "Noida",
    state: "UP",
    status: "rejected",
  },
];

const statusColors = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
};

export default function IncidentTable() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredIncidents = incidents
    .filter(
      (incident) =>
        incident.type.toLowerCase().includes(search.toLowerCase()) ||
        incident.city.toLowerCase().includes(search.toLowerCase())
    )
    .filter((incident) =>
      filterStatus ? incident.status === filterStatus : true
    );

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by type or city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" className="bg-white" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Incident Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIncidents.map((incident) => (
            <TableRow key={incident.id}>
              <TableCell>{incident.type}</TableCell>
              <TableCell>{incident.description}</TableCell>
              <TableCell>{incident.city}</TableCell>
              <TableCell>{incident.state}</TableCell>
              <TableCell>
                <Badge
                  className={`${statusColors[incident.status]} text-white`}>
                  {incident.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
