"use client";

import * as React from "react";
import {
  Menu,
  User,
  Bell,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuItem } from "../ui/dropdown-menu";
import { useAuth } from "../../hooks/use-auth";
import Link from "next/link";

export interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout, isLoggingOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      window.location.href = "/login";
    }
  };

  const displayName = user?.name || "Active User";
  const displayEmail = user?.email || "user@resumeai.com";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 border-b border-border bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
          Production SaaS Platform
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* User profile dropdown */}
        <DropdownMenu
          trigger={
            <button
              type="button"
              className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center cursor-pointer text-primary hover:bg-primary/20 transition-colors text-xs font-semibold"
              aria-label="User profile menu"
            >
              {initials || <User className="h-4 w-4" />}
            </button>
          }
        >
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-semibold text-foreground truncate max-w-[180px]">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">
              {displayEmail}
            </p>
          </div>
          <DropdownMenuItem
            onClick={() => {
              window.location.href = "/settings";
            }}
          >
            <SettingsIcon className="h-4 w-4 mr-2" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleSignOut}
            className="text-destructive hover:text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoggingOut ? "Signing out..." : "Sign Out"}
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </header>
  );
}
