"use client";

import { useState, useCallback } from "react";
import {
  Plus, MoreHorizontal, Building2, User, Calendar,
  DollarSign, ArrowRight, Zap, Filter, ChevronDown, Search
} from "lucide-react";

const STAGES = [
  { id: "lead", name: "Lead", color: "#94a3b8", probability: 10, deals: 0 },
  { id: "qualified", name: "Qualified", color: "#60a5fa", probability: 25, deals: 0 },
  { id: "proposal", name: "Proposal Sent", color: "#f59e0b", probability: 50, deals: 0 },
  { id: "negotiation", name: "Negotiation", color: "#f97316", probability: 75, deals: 0 },
  { id: "won", name: "Won", color: "#22c55e", probability: 100, deals: 0 },
];

const MOCK_DEALS = [
  { id: "d1", stageId: "lead", title: "EduTech Africa SaaS", company: "EduTech Africa", contact: "James Mwangi", value: 18000, currency: "USD", probability: 10, priority: "high", daysInStage: 2, expectedClose: "Apr 15", aiScore: 72 },
  { id: "d2", stageId: "lead", title: "Nairobi Realty Platform", company: "Realty KE", contact: "Amara Osei", value: 9600, currency: "USD", probability: 10, priority: "medium", daysInStage: 5, expectedClose: "Apr 30", aiScore: 45 },
  { id: "d3", stageId: "qualified", title: "Safari Logistics - Pro", company: "Safari Logistics", contact: "Priya Nair", value: 24000, currency: "USD", probability: 25, priority: "high", daysInStage: 3, expectedClose: "Mar 30", aiScore: 81 },
  { id: "d4", stageId: "qualified", title: "FinTech Africa Integration", company: "FinTech Africa", contact: "David Ochieng", value: 36000, currency: "USD", probability: 30, priority: "urgent", daysInStage: 1, expectedClose: "Apr 5", aiScore: 68 },
  { id: "d5", stageId: "proposal", title: "TechStartup UAE Growth", company: "TechStartup UAE", contact: "Omar Hassan", value: 12000, currency: "USD", probability: 50, priority: "high", daysInStage: 7, expectedClose: "Mar 25", aiScore: 88 },
  { id: "d6", stageId: "proposal", title: "Global Retail SG — E-comm", company: "Global Retail SG", contact: "Mei Zhang", value: 48000, currency: "USD", probability: 55, priority: "high", daysInStage: 4, expectedClose: "Apr 8", aiScore: 77 },
  { id: "d7", stageId: "negotiation", title: "Acme Corp Enterprise Plan", company: "Acme Corp", contact: "Sofia Rodrigues", value: 96000, currency: "USD", probability: 75, priority: "urgent", daysInStage: 9, expectedClose: "Mar 20", aiScore: 91 },
  { id: "d8", stageId: "negotiation", title: "Retail Hub KE — Starter", company: "Retail Hub Kenya", contact: "Kemi Adeyemi", value: 3600, currency: "USD", probability: 80, priority: "medium", daysInStage: 2, expectedClose: "Mar 18", aiScore: 84 },
  { id: "d9", stageId: "won", title: "TechCorp Kenya — Enterprise", company: "TechCorp Kenya", contact: "James Kariuki", value: 72000, currency: "USD", probability: 100, priority: "high", daysInStage: 0, expectedClose: "Mar 10", aiScore: 99 },
];

const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-400",
  medium: "bg-yellow-400",
  low: "bg-slate-300",
};

interface Deal {
  id: string; stageId: string; title: string; company: string;
  contact: string; value: number; currency: string; probability: number;
  priority: string; daysInStage: number; expectedClose: string; aiScore: number;
}

function DealCard({ deal, onDragStart }: { deal: Deal; onDragStart: (d: Deal) => void }) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(deal)}
      className="deal-card group select-none"
    >
      {/* Priority + AI score */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[deal.priority]}`} />
          <span className="text-xs text-muted-foreground capitalize">{deal.priority}</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Zap className="h-3 w-3 text-amber-400" />
          <span className="text-amber-600 dark:text-amber-400 font-medium">{deal.aiScore}%</span>
        </div>
      </div>

      {/* Title */}
      <p className="font-medium text-sm leading-snug mb-1.5 group-hover:text-primary transition-colors">
        {deal.title}
      </p>

      {/* Company & Contact */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Building2 className="h-3 w-3 shrink-0" /> {deal.company}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3 shrink-0" /> {deal.contact}
        </div>
      </div>

      {/* Value & Close date */}
      <div className="flex items-center justify-between pt-2.5 border-t">
        <span className="font-semibold text-sm font-mono">
          ${deal.value.toLocaleString()}
        </span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {deal.expectedClose}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/60 transition-all"
          style={{ width: `${deal.probability}%` }}
        />
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [dragging, setDragging] = useState<Deal | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const handleDrop = useCallback(
    (stageId: string) => {
      if (!dragging) return;
      setDeals((prev) =>
        prev.map((d) => (d.id === dragging.id ? { ...d, stageId } : d))
      );
      setDragging(null);
      setDragOverStage(null);
    },
    [dragging]
  );

  const stagesWithDeals = STAGES.map((stage) => ({
    ...stage,
    items: deals.filter((d) => d.stageId === stage.id),
    totalValue: deals.filter((d) => d.stageId === stage.id).reduce((s, d) => s + d.value, 0),
  }));

  const totalPipeline = deals.filter((d) => d.stageId !== "won").reduce((s, d) => s + d.value, 0);
  const totalWon = deals.filter((d) => d.stageId === "won").reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-6 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            ${totalPipeline.toLocaleString()} in pipeline · ${totalWon.toLocaleString()} won
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
          <button className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors">
            Sales Pipeline <ChevronDown className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" /> New Deal
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex flex-1 gap-4 overflow-x-auto p-6 pb-8 scrollbar-hidden">
        {stagesWithDeals.map((stage) => (
          <div
            key={stage.id}
            className={`flex flex-col w-72 shrink-0 rounded-xl border transition-colors ${
              dragOverStage === stage.id ? "border-primary bg-primary/5" : "bg-muted/20"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverStage(stage.id);
            }}
            onDragLeave={() => setDragOverStage(null)}
            onDrop={() => handleDrop(stage.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: stage.color }}
                />
                <span className="font-medium text-sm">{stage.name}</span>
                <span className="flex items-center justify-center h-5 min-w-5 rounded-full bg-muted text-xs font-medium px-1.5">
                  {stage.items.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground font-mono">
                  ${(stage.totalValue / 1000).toFixed(0)}k
                </span>
                <button className="rounded-md p-1 hover:bg-muted transition-colors">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Deals */}
            <div className="flex-1 overflow-y-auto scrollbar-hidden p-3 space-y-2.5">
              {stage.items.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onDragStart={setDragging}
                />
              ))}

              {stage.items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mb-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Drop deals here</p>
                </div>
              )}
            </div>

            {/* Add deal button */}
            <div className="p-3 border-t">
              <button className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add deal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
