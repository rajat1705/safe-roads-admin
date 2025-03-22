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
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "@/components/ui/pagination";

const incidents = [
  {
    id: "c8d81e77-5c13-499e-b9c9-cf6f90fcd6da",
    created_at: "2025-03-18T17:34:37.327766+00:00",
    type: "Pothole",
    description: "Large pothole on Main Road",
    city: "New Delhi",
    state: "Delhi",
    status: "pending",
    issue_type: "hazard",
    severity: "medium",
  },
  {
    id: 2,
    created_at: "2025-03-17T14:22:10.123456+00:00",
    type: "Broken Signal",
    description: "Traffic light not working.",
    city: "Gurgaon",
    state: "Haryana",
    status: "approved",
    issue_type: "signal",
    severity: "high",
  },
  {
    id: 3,
    created_at: "2025-03-16T09:11:05.654321+00:00",
    type: "Fallen Sign",
    description: "Stop sign knocked over.",
    city: "Noida",
    state: "UP",
    status: "rejected",
    issue_type: "signage",
    severity: "low",
  },
];

const statusColors = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  resolved: "bg-blue-500"
};

export default function IncidentTable() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const filteredIncidents = incidents
    .filter(
      (incident) =>
        incident.type.toLowerCase().includes(search.toLowerCase()) ||
        incident.city?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((incident) => (filterStatus === "all" ? true : incident.status === filterStatus));

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  const paginatedIncidents = filteredIncidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by type or city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select onValueChange={(value) => setFilterStatus(value)}>
          <SelectTrigger className="w-[180px] bg-white text-black">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Created At</TableHead>
            <TableHead>Incident Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Issue Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedIncidents.map((incident) => (
            <TableRow key={incident.id}>
              <TableCell>{new Date(incident.created_at).toLocaleString()}</TableCell>
              <TableCell>{incident.type}</TableCell>
              <TableCell>{incident.description}</TableCell>
              <TableCell>{incident.city || "N/A"}</TableCell>
              <TableCell>{incident.state || "N/A"}</TableCell>
              <TableCell>{incident.issue_type}</TableCell>
              <TableCell>{incident.severity}</TableCell>
              <TableCell>
                <Badge className={`${statusColors[incident.status]} text-white`}>
                  {incident.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}