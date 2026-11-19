import React, { useState } from 'react';
import { User, Phone, ArrowLeft, ArrowRight, ShieldCheck, CheckSquare, Square } from 'lucide-react';
import { TermsModal } from './TermsModal';
import { AppDataStore, sanitizeAndValidateIndianMobile } from '../../lib/store';
import type { Participant } from '../../types';

interface RegistrationPageProps {
  onBack: () => void;
  onRegistered: (participant: Participant) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  onBack,
  onRegistered,
}) => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<{
    fullName?: string;
    mobileNumber?: string;
    instagramId?: string;
    terms?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name should be at least 2 characters';
    }

    const mobileCheck = sanitizeAndValidateIndianMobile(mobileNumber);
    if (!mobileCheck.isValid) {
      newErrors.mobileNumber = mobileCheck.error;
    }

    if (!instagramId.trim()) {
      newErrors.instagramId = 'Instagram ID is required to connect';
    } else if (instagramId.trim().length < 2) {
      newErrors.instagramId = 'Please enter a valid Instagram handle';
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must be 18+ and accept the Terms & Conditions to participate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await AppDataStore.registerParticipant(
        fullName,
        mobileNumber,
        instagramId,
        !marketingConsent // marketing_opt_out is true if NOT consenting
      );

      if (result.success && result.participant) {
        onRegistered(result.participant);
      } else {
        setErrors({ general: result.error || 'Registration failed. Please check details.' });
      }
    } catch {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-start max-w-md mx-auto w-full px-5 py-6 animate-in fade-in duration-300">
      {/* Header back link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0B3B3D]/70 hover:text-[#E05A47] transition-colors py-1.5 -ml-1 mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </button>

      {/* Screen Title */}
      <div className="mb-6 space-y-1">
        <h2 
          className="text-3xl font-medium tracking-tight text-[#0B3B3D]"
          style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
        >
          Create Your Profile
        </h2>
        <p className="text-xs text-[#0B3B3D]/70 font-sans">
          Your name and Instagram will be visible to your event connections.
        </p>
      </div>

      {errors.general && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {errors.general}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[#0B3B3D] mb-1.5">
            Full Name <span className="text-[#D34E2A]">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none select-none text-[#D34E2A]">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="e.g. Ananya Sharma"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: undefined });
              }}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#0B3B3D] placeholder-[#A3C4CB] transition-all focus:outline-none ${
                errors.fullName
                  ? 'border-red-400 focus:ring-1 focus:ring-red-400'
                  : 'border-[#A3C4CB]/60 focus:border-[#D34E2A]'
              }`}
              required
            />
          </div>
          {errors.fullName && (
            <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-[#0B3B3D]">
              Mobile Number (India) <span className="text-[#D34E2A]">*</span>
            </label>
            <span className="text-[10px] text-[#D34E2A] font-medium">Never shared publicly</span>
          </div>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center gap-1.5 pointer-events-none select-none z-10">
              <Phone className="w-4 h-4 text-[#D34E2A]" />
              <span className="text-xs font-semibold text-[#122B32]/75 pr-2 border-r border-[#A3C4CB]/60">
                +91
              </span>
            </div>
            <input
              type="tel"
              placeholder="9876543210"
              value={mobileNumber}
              onChange={(e) => {
                setMobileNumber(e.target.value);
                if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: undefined });
              }}
              className={`w-full pl-20 pr-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#0B3B3D] placeholder-[#A3C4CB] transition-all focus:outline-none ${
                errors.mobileNumber
                  ? 'border-red-400 focus:ring-1 focus:ring-red-400'
                  : 'border-[#A3C4CB]/60 focus:border-[#D34E2A]'
              }`}
              maxLength={10}
              required
            />
          </div>
          {errors.mobileNumber && (
            <p className="text-[11px] text-red-600 mt-1">{errors.mobileNumber}</p>
          )}
        </div>

        {/* Instagram ID */}
        <div>
          <label className="block text-xs font-semibold text-[#0B3B3D] mb-1.5">
            Instagram Handle <span className="text-[#D34E2A]">*</span>
          </label>
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none select-none text-[#D34E2A]">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="@yourhandle"
              value={instagramId}
              onChange={(e) => {
                setInstagramId(e.target.value);
                if (errors.instagramId) setErrors({ ...errors, instagramId: undefined });
              }}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#0B3B3D] placeholder-[#A3C4CB] transition-all focus:outline-none ${
                errors.instagramId
                  ? 'border-red-400 focus:ring-1 focus:ring-red-400'
                  : 'border-[#A3C4CB]/60 focus:border-[#D34E2A]'
              }`}
              required
            />
          </div>
          {errors.instagramId && (
            <p className="text-[11px] text-red-600 mt-1">{errors.instagramId}</p>
          )}
        </div>

        {/* Mandatory Checkbox: 18+ and Terms */}
        <div className="pt-2">
          <div
            onClick={() => {
              setTermsAccepted(!termsAccepted);
              if (errors.terms) setErrors({ ...errors, terms: undefined });
            }}
            className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
              errors.terms
                ? 'bg-red-50/50 border-red-300'
                : termsAccepted
                ? 'bg-[#FDF2F0] border-[#E05A47]/40'
                : 'bg-[#F4F8F9] border-[#A3C4CB]/40'
            }`}
          >
            <button
              type="button"
              className="mt-0.5 text-[#E05A47] shrink-0 focus:outline-none"
              aria-label="Toggle terms agreement"
            >
              {termsAccepted ? (
                <CheckSquare className="w-4 h-4 fill-[#E05A47] text-white" />
              ) : (
                <Square className="w-4 h-4 text-[#A3C4CB]" />
              )}
            </button>
            <div className="text-xs text-[#0B3B3D] leading-relaxed">
              <span>I confirm that I am <strong>18 years or older</strong> and agree to the </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTermsOpen(true);
                }}
                className="text-[#E05A47] underline font-semibold hover:text-[#C44633]"
              >
                Terms & Conditions and Privacy Policy
              </button>
              <span className="text-red-600 font-bold"> *</span>
            </div>
          </div>
          {errors.terms && (
            <p className="text-[11px] text-red-600 mt-1 pl-1">{errors.terms}</p>
          )}
        </div>

        {/* Optional Marketing Consent */}
        <div
          onClick={() => setMarketingConsent(!marketingConsent)}
          className="flex items-start gap-2.5 p-3 rounded-xl border border-[#A3C4CB]/30 bg-white cursor-pointer hover:bg-[#F4F8F9]/50 transition-colors"
        >
          <button
            type="button"
            className="mt-0.5 text-[#E05A47] shrink-0 focus:outline-none"
            aria-label="Toggle marketing consent"
          >
            {marketingConsent ? (
              <CheckSquare className="w-4 h-4 fill-[#E05A47] text-white" />
            ) : (
              <Square className="w-4 h-4 text-[#A3C4CB]" />
            )}
          </button>
          <p className="text-xs text-[#0B3B3D]/80 leading-relaxed">
            (Optional) I'm open to receiving updates and invitations for future Two of Us social gatherings.
          </p>
        </div>

        {/* Submit CTA */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#E05A47] hover:bg-[#C44633] text-white font-medium text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Creating Your Profile...</span>
            ) : (
              <>
                <span>Continue to Questionnaire</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#0B3B3D]/60 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E05A47]" />
          <span>Encrypted Indian DPDP 2023 compliant</span>
        </div>
      </form>

      {/* Terms Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </div>
  );
};
