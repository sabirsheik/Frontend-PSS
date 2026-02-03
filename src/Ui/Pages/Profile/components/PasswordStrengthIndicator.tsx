/**
 * ============================================================
 * Password Strength Indicator Component
 * ============================================================
 *
 * Displays password strength and validation requirements.
 *
 * @module Ui/Pages/Profile/components
 */

import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

// Password Validation Configuration
const PASSWORD_REQUIREMENTS = [
  { key: "length", label: "At least 8 characters", pattern: /.{8,}/ },
  { key: "letter", label: "Contains a letter", pattern: /[A-Za-z]/ },
  { key: "number", label: "Contains a number", pattern: /\d/ },
  { key: "special", label: "Contains a special character", pattern: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ },
] as const;

interface PasswordStrengthIndicatorProps {
  password: string;
  touched: boolean;
}

export const PasswordStrengthIndicator = ({ password, touched }: PasswordStrengthIndicatorProps) => {
  const results = useMemo(() => {
    return PASSWORD_REQUIREMENTS.map((req) => ({
      ...req,
      met: req.pattern.test(password),
    }));
  }, [password]);

  const strength = useMemo(() => {
    const metCount = results.filter((r) => r.met).length;
    if (metCount === 0) return { level: 0, label: "Too weak", color: "bg-gray-200" };
    if (metCount === 1) return { level: 25, label: "Weak", color: "bg-red-500" };
    if (metCount === 2) return { level: 50, label: "Fair", color: "bg-amber-500" };
    if (metCount === 3) return { level: 75, label: "Good", color: "bg-emerald-400" };
    return { level: 100, label: "Strong", color: "bg-emerald-600" };
  }, [results]);

  if (!password || !touched) return null;

  return (
    <div className="space-y-3 mt-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Password strength</span>
          <span className={`font-medium ${
            strength.level === 100 ? "text-emerald-600" :
            strength.level >= 75 ? "text-emerald-500" :
            strength.level >= 50 ? "text-amber-500" :
            "text-red-500"
          }`}>
            {strength.label}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${strength.level}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-2 gap-1.5">
        {results.map((check) => (
          <div
            key={check.key}
            className={`flex items-center gap-1.5 text-xs ${
              check.met ? "text-emerald-600" : "text-gray-400"
            }`}
          >
            {check.met ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { PASSWORD_REQUIREMENTS };