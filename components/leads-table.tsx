"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Download,
    Mail,
    MoreHorizontal,
    Phone,
    Search,
    User,
    Clock
} from "lucide-react";
import { useState } from "react";

interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    status: string;
    createdAt: string | Date;
    notes?: string | null;
}

interface LeadsTableProps {
    leads: Lead[];
    projectName: string;
}

export function LeadsTable({ leads, projectName }: LeadsTableProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = () => {
        const headers = ["Name", "Email", "Phone", "Status", "Date", "Notes"];
        const csvContent = [
            headers.join(","),
            ...leads.map(lead => [
                `"${lead.name}"`,
                `"${lead.email}"`,
                `"${lead.phone || ""}"`,
                `"${lead.status}"`,
                `"${new Date(lead.createdAt).toLocaleDateString()}"`,
                `"${lead.notes || ""}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${projectName.toLowerCase().replace(/\s+/g, '-')}-leads.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (leads.length === 0) {
        return (
            <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <User className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No leads yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2">
                    When visitors sign up on your landing page, they will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm h-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button
                    variant="outline"
                    className="font-bold border-gray-100 h-11 px-6 rounded-xl hover:bg-gray-50"
                    onClick={handleExport}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                            <TableHead className="font-bold text-gray-900 h-14">Lead</TableHead>
                            <TableHead className="font-bold text-gray-900 h-14">Contact</TableHead>
                            <TableHead className="font-bold text-gray-900 h-14">Status</TableHead>
                            <TableHead className="font-bold text-gray-900 h-14">Joined</TableHead>
                            <TableHead className="text-right h-14"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLeads.map((lead) => (
                            <TableRow key={lead.id} className="hover:bg-gray-50/30 transition-colors">
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-9 h-9 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                                            {lead.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 capitalize">{lead.name}</p>
                                            <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                                                <Clock className="w-2.5 h-2.5 mr-1" />
                                                New Lead
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm text-gray-600 font-medium">
                                            <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                            {lead.email}
                                        </div>
                                        {lead.phone && (
                                            <div className="flex items-center text-sm text-gray-600 font-medium">
                                                <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                {lead.phone}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-bold uppercase text-[10px] tracking-widest px-2.5">
                                        {lead.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-gray-500 font-medium">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-900 rounded-lg">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
