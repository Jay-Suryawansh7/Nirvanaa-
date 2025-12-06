"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Shield, Settings, User } from "lucide-react";

export function StaffHeader() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }));
  }, []);

  return (
    <header className="w-full py-6 px-8 flex items-end justify-between border-b border-border/40 bg-background/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex flex-col gap-1">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-foreground">Registry Portal</h1>
            <p className="text-sm text-muted-foreground font-mono opacity-80">{currentDate}</p>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative hover:bg-secondary/50">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-background" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-secondary/50">
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-secondary/50">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
        
        {/* Profile */}
        <div className="flex items-center gap-3 pl-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-foreground">Staff Member</p>
            <p className="text-xs text-muted-foreground">Registry Dept.</p>
          </div>
          <Button variant="outline" size="icon" className="w-10 h-10 rounded-full border-blue-500/30 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
