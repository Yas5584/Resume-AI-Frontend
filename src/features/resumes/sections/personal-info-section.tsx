import * as React from "react";
import { PersonalInfo } from "@resumeai/shared";
import { Input } from "../../../components/ui/input";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
} from "lucide-react";

interface PersonalInfoSectionProps {
  value: PersonalInfo;
  onChange: (value: PersonalInfo) => void;
}

export function PersonalInfoSection({
  value,
  onChange,
}: PersonalInfoSectionProps) {
  const handleChange = (field: keyof PersonalInfo, val: string) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. Alex Morgan"
          value={value.fullName || ""}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />
        <Input
          label="Headline / Professional Title"
          placeholder="e.g. Senior Full Stack Engineer"
          value={value.headline || ""}
          onChange={(e) => handleChange("headline", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. alex@example.com"
          value={value.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <Input
          label="Phone Number"
          placeholder="e.g. +1 (555) 019-2834"
          value={value.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Location (City, State / Country)"
          placeholder="e.g. San Francisco, CA"
          value={value.location || ""}
          onChange={(e) => handleChange("location", e.target.value)}
        />
        <Input
          label="Personal Website / Portfolio"
          placeholder="e.g. https://alexmorgan.dev"
          value={value.website || ""}
          onChange={(e) => handleChange("website", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="LinkedIn Profile URL"
          placeholder="e.g. https://linkedin.com/in/alexmorgan"
          value={value.linkedin || ""}
          onChange={(e) => handleChange("linkedin", e.target.value)}
        />
        <Input
          label="GitHub Profile URL"
          placeholder="e.g. https://github.com/alexmorgan"
          value={value.github || ""}
          onChange={(e) => handleChange("github", e.target.value)}
        />
      </div>
    </div>
  );
}
