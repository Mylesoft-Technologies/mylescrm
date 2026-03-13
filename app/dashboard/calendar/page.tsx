"use client";
import { useState } from "react";
import { Calendar, Plus, Clock, Video, Phone, Users, ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const EVENTS = [
  { id:"1", title:"Discovery call — Safaricom", type:"call", time:"09:00", duration:30, date:new Date().getDate(), color:"bg-blue-500" },
  { id:"2", title:"Product demo — Andela", type:"meeting", time:"11:30", duration:60, date:new Date().getDate(), color:"bg-emerald-500" },
  { id:"3", title:"Follow-up: M-KOPA contract", type:"call", time:"14:00", duration:15, date:new Date().getDate()+1, color:"bg-amber-500" },
  { id:"4", title:"Onboarding: Kenya Airways", type:"meeting", time:"10:00", duration:90, date:new Date().getDate()+3, color:"bg-purple-500" },
];

export default function CalendarPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState(now.getDate());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const cells = Array.from({length: firstDay + daysInMonth}, (_, i) => i < firstDay ? null : i - firstDay + 1);

  const todayEvents = EVENTS.filter(e => e.date === selected);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Calendar</h1><p className="text-sm text-muted-foreground">Schedule meetings via Cal.com integration</p></div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"><Plus className="h-4 w-4"/>Schedule Meeting</button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{MONTHS[month]} {year}</h3>
            <div className="flex gap-1">
              <button onClick={()=>{if(month===0){setMonth(11);setYear(y=>y-1)}else setMonth(m=>m-1)}} className="rounded-lg border p-1.5 hover:bg-muted"><ChevronLeft className="h-4 w-4"/></button>
              <button onClick={()=>{if(month===11){setMonth(0);setYear(y=>y+1)}else setMonth(m=>m+1)}} className="rounded-lg border p-1.5 hover:bg-muted"><ChevronRight className="h-4 w-4"/></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(d=><div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              const hasEvents = day && EVENTS.some(e=>e.date===day);
              const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
              const isSelected = day === selected;
              return (
                <button key={i} onClick={()=>day&&setSelected(day)}
                  className={"relative rounded-lg p-2 text-sm text-center transition-colors "+(day?(isSelected?"bg-primary text-white":isToday?"border-2 border-primary text-primary font-semibold hover:bg-primary/10":"hover:bg-muted"):"cursor-default")}>
                  {day}
                  {hasEvents && !isSelected && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"/>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="font-semibold mb-4">
            {selected === now.getDate() ? "Today" : `${MONTHS[month]} ${selected}`}
            <span className="ml-2 text-xs text-muted-foreground font-normal">{todayEvents.length} events</span>
          </h3>
          {todayEvents.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Calendar className="mx-auto mb-2 h-6 w-6 opacity-30"/>No events
            </div>
          ) : (
            <div className="space-y-3">
              {todayEvents.map((e) => (
                <div key={e.id} className="rounded-lg border p-3">
                  <div className="flex items-start gap-2">
                    <div className={"h-2 w-2 mt-1.5 rounded-full flex-shrink-0 "+e.color}/>
                    <div>
                      <p className="text-sm font-medium">{e.title}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3"/>{e.time}
                        <span>·</span>
                        <span>{e.duration} min</span>
                      </div>
                    </div>
                  </div>
                  <button className="mt-2 w-full rounded-lg border py-1.5 text-xs font-medium hover:bg-muted transition-colors flex items-center justify-center gap-1">
                    <Video className="h-3 w-3"/> Join Meeting
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 rounded-lg border border-dashed p-3 text-center">
            <p className="text-xs text-muted-foreground">Powered by Cal.com</p>
            <a href="https://cal.com" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Set up booking page →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
