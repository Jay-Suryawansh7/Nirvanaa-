"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Save } from "lucide-react";

export function CaseFiling() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    caseIdentifier: "",
    category: "Civil",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/cases", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsOpen(false);
        setFormData({ title: "", caseIdentifier: "", category: "Civil", description: "" });
        // Trigger refresh if possible, or just alert
        alert("Case Filed Successfully");
      } else {
        alert("Failed to file case");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) {
    return (
        <div className="bg-card rounded-xl border border-border/50 p-6 flex flex-col items-center justify-center gap-4 shadow-sm text-center h-full min-h-[200px]">
            <div className="p-4 rounded-full bg-blue-500/10 text-blue-500">
                <FileText className="w-8 h-8" />
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-1">New Case Filing</h3>
                <p className="text-sm text-muted-foreground mb-4">Register a new case into the system.</p>
                <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    File New Case
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 flex flex-col gap-4 shadow-sm h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Case Details</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <label className="text-xs font-medium text-muted-foreground">Case Number</label>
            <input 
                className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm mt-1"
                placeholder="e.g. CR-2024-001"
                required
                value={formData.caseIdentifier}
                onChange={(e) => setFormData({...formData, caseIdentifier: e.target.value})}
            />
        </div>
        <div>
            <label className="text-xs font-medium text-muted-foreground">Case Title / Parties</label>
            <input 
                className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm mt-1"
                placeholder="State vs. Doe"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <select 
                    className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm mt-1"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                    <option value="Civil">Civil</option>
                    <option value="Criminal">Criminal</option>
                    <option value="Family">Family</option>
                </select>
            </div>
        </div>
        <div>
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea 
                className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm mt-1 h-20"
                placeholder="Brief details..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
        </div>

        <Button type="submit" className="mt-2 bg-blue-600 hover:bg-blue-700 w-full">
            <Save className="w-4 h-4 mr-2" />
            Submit Filing
        </Button>
      </form>
    </div>
  );
}
