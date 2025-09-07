import React from "react";

// Password strength calculation
const calculatePasswordStrength = (password: string) => {
  let score = 0;

  // Basic length check (required for any strength)
  if (password.length >= 8) {
    score += 1;
  }

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  // Length bonuses for longer passwords
  if (password.length >= 12) score += 0.5;
  if (password.length >= 16) score += 0.5;

  // Additional complexity bonus
  if (password.length >= 10 && /[a-z]/.test(password) && /[A-Z]/.test(password))
    score += 0.5;
  if (
    password.length >= 12 &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  )
    score += 0.5;

  // Round score to nearest integer and cap at 5
  const finalScore = Math.min(Math.round(score), 5);

  return {
    score: finalScore,
    checks: {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    level:
      finalScore <= 1
        ? "Weak"
        : finalScore <= 2
        ? "Fair"
        : finalScore <= 3
        ? "Good"
        : finalScore <= 4
        ? "Strong"
        : "Very Strong",
    color:
      finalScore <= 1
        ? "#bf2600"
        : finalScore <= 2
        ? "#ff5630"
        : finalScore <= 3
        ? "#ffab00"
        : finalScore <= 4
        ? "#36b37e"
        : "#00875a",
  };
};

interface PasswordStrengthIndicatorProps {
  password: string | undefined;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password }) => {
  const strength = calculatePasswordStrength(password || "");

  return (
    <div className="mt-2">
      <div className="flex items-center gap-[5px]">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className="h-[2px] rounded-sm"
            style={{
              width: "60px",
              backgroundColor:
                level <= strength.score ? strength.color : "#dcdfe4",
            }}
          />
        ))}
      </div>
      <div className="text-xs text-[#5e6c84] mt-1 text-center">
        {password && password.length > 0
          ? strength.level
          : "Password must have at least 8 characters"}
      </div>
    </div>
  );
};
