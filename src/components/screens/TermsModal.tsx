import React from 'react';
import { X, ShieldCheck, Camera, Lock, UserCheck, AlertCircle } from 'lucide-react';
import { LEGAL_CONFIG } from '../../constants/config';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B3B3D]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#A3C4CB]/40 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#A3C4CB]/30 flex items-center justify-between bg-[#F4F8F9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FDF2F0] flex items-center justify-center text-[#E05A47]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="terms-title" className="font-serif text-xl font-medium text-[#0B3B3D]">
                Terms & Conditions
              </h3>
              <p className="text-xs text-[#0B3B3D]/70 font-sans">
                Two of Us Event Guidelines & Privacy Policy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#0B3B3D]/60 hover:text-[#0B3B3D] hover:bg-white/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#0B3B3D]/85 leading-relaxed font-sans">
          {/* Section 1 */}
          <section className="space-y-2">
            <h4 className="font-serif text-base font-semibold text-[#0B3B3D] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#E05A47]" />
              1. Eligibility & Acceptance
            </h4>
            <p>
              You must be <strong>18 years or older</strong> to participate in Two of Us. Ticking the consent checkbox counts as your digital signature confirming you have read, understood, and agreed to these terms and the event privacy policy.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h4 className="font-serif text-base font-semibold text-[#0B3B3D] flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#E05A47]" />
              2. Consent to Photography & Selfies
            </h4>
            <p>
              Completing your Human Bingo board requires taking selfies with other event attendees. By playing, you consent to being photographed by other players and appearing in their selfie memories.
            </p>
            <p className="p-3 bg-[#FDF2F0] rounded-xl text-xs text-[#0B3B3D] border border-[#E05A47]/20">
              <strong>Device Storage Guarantee:</strong> All connection photos are stored directly on the attendee's personal phone and are <strong>never uploaded to our database or remote servers</strong>.
            </p>
            <p className="text-xs text-[#0B3B3D]/75">
              <strong>Golden Rule:</strong> Never take a selfie with someone who hasn't clearly agreed to it. Always ask first.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h4 className="font-serif text-base font-semibold text-[#0B3B3D] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#E05A47]" />
              3. Your Data & Privacy
            </h4>
            <p>
              We collect your <strong>Full Name</strong>, <strong>Mobile Number</strong>, and <strong>Instagram Handle</strong> at sign-up to run the game and facilitate matches.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-[#0B3B3D]/80">
              <li>Your Name and Instagram handle may be shown to players you interact with.</li>
              <li><strong>Your mobile number is never shared with other players</strong> and is used solely for session authentication and duplicate prevention.</li>
              <li>Your data is stored securely and used only for this event's gameplay and matchmaking.</li>
              <li>All personal data is deleted from our systems within 30 days of the event, unless you request earlier deletion.</li>
              <li>You can request access, correction, or deletion of your data anytime by contacting: <span className="font-mono text-[#E05A47]">{LEGAL_CONFIG.organizerEmail}</span>.</li>
              <li>We do not sell your personal data to any third parties.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h4 className="font-serif text-base font-semibold text-[#0B3B3D] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#E05A47]" />
              4. Code of Conduct
            </h4>
            <p>
              We enforce a strict <strong>zero tolerance policy</strong> for harassment, unwanted physical contact, non-consensual interactions, or inappropriate behavior toward other participants.
            </p>
            <p>
              Do not upload any photo, answer, or content that is obscene, abusive, defamatory, or discriminatory.
            </p>
            <p>
              Organizers reserve the right to remove any player from the event or app immediately, without refund, for violating this code.
            </p>
            <p className="text-xs bg-[#F4F8F9] p-3 rounded-xl border border-[#A3C4CB]/30">
              Report any uncomfortable interaction to event staff immediately — look for personnel wearing the <strong>{LEGAL_CONFIG.staffIdentifier}</strong>.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h4 className="font-serif text-base font-semibold text-[#0B3B3D]">
              5. Organizer Liability
            </h4>
            <p className="text-xs">
              Two of Us facilitates introductions during the event only; we do not vet attendees and aren't responsible for their conduct. Any interaction, communication, or meeting after the event or outside the app is solely between the individuals involved.
            </p>
            <p className="text-xs">
              We are not liable for any loss, damage, dispute, or harm arising from connections made through the app, including after the event ends. The organizer reserves the right to modify, pause, or end the game at any time for safety or operational reasons.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2 border-t border-[#A3C4CB]/30 pt-3">
            <h4 className="font-serif text-base font-semibold text-[#0B3B3D]">
              6. Governing Law
            </h4>
            <p className="text-xs text-[#0B3B3D]/75">
              These terms are governed by the laws of India; disputes are subject to the jurisdiction of the courts in <strong>{LEGAL_CONFIG.jurisdictionCity}</strong>, in alignment with India's Digital Personal Data Protection Act (DPDP), 2023.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#A3C4CB]/30 bg-[#F4F8F9] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#E05A47] hover:bg-[#C44633] text-white text-sm font-medium transition-colors shadow-xs active:scale-98"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
