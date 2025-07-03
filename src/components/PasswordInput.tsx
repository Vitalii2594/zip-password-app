import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react';

interface PasswordInputProps {
  password: string;
  onPasswordChange: (password: string) => void;
  disabled?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  onPasswordChange,
  disabled = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: 0, text: '', color: '' };
    if (pass.length < 6) return { strength: 1, text: 'Weak', color: 'text-red-500' };
    if (pass.length < 12) return { strength: 2, text: 'Medium', color: 'text-yellow-500' };
    return { strength: 3, text: 'Strong', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="w-5 h-5 text-gray-400" />
        </div>
        
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Enter password for ZIP files"
          disabled={disabled}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        
        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Password Strength Indicator */}
      {password.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {passwordStrength.strength >= 2 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
            <span className={`text-sm font-medium ${passwordStrength.color}`}>
              Password Strength: {passwordStrength.text}
            </span>
          </div>
          
          <div className="flex gap-1">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`h-2 flex-1 rounded-full ${
                  level <= passwordStrength.strength
                    ? level === 1
                      ? 'bg-red-500'
                      : level === 2
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Password Tips */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Password Security Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use at least 12 characters for better security</li>
          <li>• Include uppercase, lowercase, numbers, and symbols</li>
          <li>• Avoid common words or personal information</li>
          <li>• This password will be used for all selected files</li>
        </ul>
      </div>
    </div>
  );
};