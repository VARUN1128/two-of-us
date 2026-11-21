import React, { useState, useRef, useEffect } from 'react';
import { RANDOM_QUESTION_BANK } from '../../constants/questions';
import { 
  X, 
  Camera, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

interface BingoInteractionModalProps {
  isOpen: boolean;
  letter: string;
  onClose: () => void;
  onSubmit: (data: {
    letter: string;
    personName: string;
    selfieSource: File | string;
    randomQuestion: string;
    questionAnswer: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export const BingoInteractionModal: React.FC<BingoInteractionModalProps> = ({
  isOpen,
  letter,
  onClose,
  onSubmit,
}) => {
  // Steps: 1: Person Details, 2: Selfie, 3: Random Question, 4: Final Submit
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form fields
  const [personName, setPersonName] = useState('');
  const [selfieSource, setSelfieSource] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [photoConsent, setPhotoConsent] = useState(false);
  const [assignedQuestion, setAssignedQuestion] = useState('');
  const [questionAnswer, setQuestionAnswer] = useState('');

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Validation & Submission
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Attach video stream whenever camera becomes active or stream updates
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => console.warn('Video playback error:', err));
    }
  }, [isCameraActive]);

  // Pick or load fixed random question for this letter session
  useEffect(() => {
    if (isOpen && letter) {
      setStep(1);
      setPersonName('');
      setSelfieSource(null);
      setSelfieFile(null);
      setPhotoConsent(false);
      setQuestionAnswer('');
      setErrorMsg(null);
      stopCamera();

      // Keep fixed random question for this specific letter
      const sessionKey = `two_of_us_q_${letter.toUpperCase()}`;
      let storedQ = sessionStorage.getItem(sessionKey);
      if (!storedQ) {
        const randomIndex = Math.floor(Math.random() * RANDOM_QUESTION_BANK.length);
        storedQ = RANDOM_QUESTION_BANK[randomIndex];
        sessionStorage.setItem(sessionKey, storedQ);
      }
      setAssignedQuestion(storedQ);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, letter]);

  // Clean up camera on unmount or close
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    // If getUserMedia is not supported in this browser, open device camera directly
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    try {
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (stream) {
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('getUserMedia error, opening native camera app:', err);
      // Fallback: Trigger device's native front camera directly
      cameraInputRef.current?.click();
    }
  };

  const toggleCameraFacing = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (isCameraActive) {
      stopCamera();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: nextMode } },
          audio: false,
        });
        streamRef.current = stream;
        setIsCameraActive(true);
      } catch (e) {
        console.warn('Failed to switch camera:', e);
      }
    }
  };

  const capturePhotoFromVideo = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally if front camera for natural mirror effect
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setSelfieSource(dataUrl);
    setSelfieFile(null);
    stopCamera();
  };

  // Handle photo captured from phone's native front camera
  const handleNativeCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelfieSource(event.target?.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1 Validation
  const handleValidateStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = personName.trim();
    if (!cleanName) {
      setErrorMsg("Please enter the person's first name.");
      return;
    }
    if (cleanName.charAt(0).toUpperCase() !== letter.toUpperCase()) {
      setErrorMsg(`Their first name must start with the letter "${letter.toUpperCase()}".`);
      return;
    }
    setErrorMsg(null);
    setStep(2);
    // Automatically open camera when moving to Step 2
    setTimeout(() => {
      startCamera();
    }, 120);
  };

  // Step 2 Validation
  const handleValidateStep2 = () => {
    if (!selfieSource) {
      setErrorMsg('Please take a selfie together.');
      return;
    }
    if (!photoConsent) {
      setErrorMsg('Please confirm that the other person consented to this photo.');
      return;
    }
    stopCamera();
    setErrorMsg(null);
    setStep(3);
  };

  // Step 3 Validation
  const handleValidateStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionAnswer.trim()) {
      setErrorMsg('Please enter their answer to the question.');
      return;
    }
    setErrorMsg(null);
    setStep(4);
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    if (!selfieSource) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const source = selfieFile || selfieSource;

    const result = await onSubmit({
      letter: letter.toUpperCase(),
      personName: personName.trim(),
      selfieSource: source,
      randomQuestion: assignedQuestion,
      questionAnswer: questionAnswer.trim(),
    });

    setIsSubmitting(false);
    if (!result.success) {
      setErrorMsg(result.error || 'Failed to submit connection.');
    } else {
      // Clear session question on successful submit
      sessionStorage.removeItem(`two_of_us_q_${letter.toUpperCase()}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B3B3D]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#A3C4CB]/40 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="p-4 px-5 border-b border-[#A3C4CB]/30 flex items-center justify-between bg-[#F4F8F9]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-[#E05A47] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              {letter.toUpperCase()}
            </span>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#0B3B3D]">
                Found someone for '{letter.toUpperCase()}'?
              </h3>
              <p className="text-[11px] text-[#0B3B3D]/70 font-sans">
                Step {step} of 4 • Human Bingo
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-full text-[#0B3B3D]/60 hover:text-[#0B3B3D] hover:bg-white/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Modal Body: Steps */}
        <div className="p-5 overflow-y-auto flex-1 font-sans">
          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <form onSubmit={handleValidateStep1} className="space-y-5">
              <div className="text-center space-y-1 py-2">
                <div className="text-xs text-[#E05A47] font-semibold uppercase tracking-wider">
                  Step 1 • Identity Check
                </div>
                <h4 
                  className="text-2xl font-medium text-[#0B3B3D]"
                  style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
                >
                  Who did you meet?
                </h4>
                <p className="text-xs text-[#0B3B3D]/75">
                  Their first name must begin with the letter <strong>{letter.toUpperCase()}</strong>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B3B3D] mb-1.5">
                  Person's First Name
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${letter.toUpperCase()}arjun, ${letter.toUpperCase()}anvi...`}
                  value={personName}
                  onChange={(e) => {
                    setPersonName(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-[#A3C4CB] bg-white text-base text-[#0B3B3D] placeholder-[#A3C4CB] focus:outline-none focus:border-[#E05A47] focus:ring-1 focus:ring-[#E05A47]"
                  autoFocus
                  required
                />
              </div>

              {personName && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    personName.trim().charAt(0).toUpperCase() === letter.toUpperCase()
                      ? 'bg-[#FDF2F0] border-[#E05A47]/30 text-[#E05A47]'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  {personName.trim().charAt(0).toUpperCase() === letter.toUpperCase() ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Starts with <strong>{letter.toUpperCase()}</strong>! Perfect match.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        Starts with '{personName.trim().charAt(0).toUpperCase()}', but letter is '{letter.toUpperCase()}'.
                      </span>
                    </>
                  )}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#E05A47] hover:bg-[#C44633] text-white text-sm font-semibold transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Next: Take a Selfie</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="text-xs text-[#E05A47] font-semibold uppercase tracking-wider">
                  Step 2 • Take a Selfie
                </div>
                <h4 
                  className="text-2xl font-medium text-[#0B3B3D]"
                  style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
                >
                  Capture the moment with {personName}
                </h4>
                <p className="text-xs text-[#0B3B3D]/75">
                  Take a quick selfie together with {personName}.
                </p>
              </div>

              {/* Camera Preview / Captured Photo */}
              <div className="relative rounded-2xl overflow-hidden bg-[#0B3B3D] aspect-4/3 flex items-center justify-center border border-[#A3C4CB]/40">
                {selfieSource ? (
                  <div className="relative w-full h-full">
                    <img
                      src={selfieSource}
                      alt="Selfie preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelfieSource(null);
                          setSelfieFile(null);
                          startCamera();
                        }}
                        className="px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-medium hover:bg-black/90 transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                      >
                        <RotateCw className="w-3 h-3" />
                        <span>Retake</span>
                      </button>
                    </div>
                  </div>
                ) : isCameraActive ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />
                    {/* Controls overlay */}
                    <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-4">
                      <button
                        onClick={toggleCameraFacing}
                        type="button"
                        className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md cursor-pointer transition-colors"
                        title="Flip Camera"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={capturePhotoFromVideo}
                        type="button"
                        className="w-14 h-14 rounded-full bg-white border-4 border-[#E05A47] shadow-lg flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
                        title="Capture Photo"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#E05A47]" />
                      </button>
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        type="button"
                        className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md cursor-pointer transition-colors"
                        title="Open Native Camera App"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <Camera className="w-7 h-7 text-[#E05A47]" />
                    </div>
                    <p className="text-xs text-white/90">
                      Ready to snap a selfie with {personName}?
                    </p>
                    <div className="flex flex-col gap-2 justify-center w-full max-w-xs">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#E05A47] text-white text-xs font-semibold hover:bg-[#C44633] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Open Camera</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="w-full py-2 px-4 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs font-medium flex items-center justify-center gap-1.5 border border-white/20 cursor-pointer transition-all"
                      >
                        <span>Use Phone Camera App</span>
                      </button>
                    </div>
                    {cameraError && (
                      <p className="text-[11px] text-amber-200 mt-1 max-w-xs">{cameraError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Native front selfie camera input (No gallery upload) */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleNativeCameraCapture}
              />

              {/* Mandatory Consent Checkbox */}
              <div
                onClick={() => {
                  setPhotoConsent(!photoConsent);
                  if (errorMsg) setErrorMsg(null);
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-colors flex items-start gap-2.5 ${
                  photoConsent
                    ? 'bg-[#FDF2F0] border-[#E05A47]/40 text-[#0B3B3D]'
                    : 'bg-[#F4F8F9] border-[#A3C4CB]/40 text-[#0B3B3D]/80'
                }`}
              >
                <button type="button" className="mt-0.5 text-[#E05A47] shrink-0 focus:outline-none cursor-pointer">
                  {photoConsent ? (
                    <CheckSquare className="w-4 h-4 fill-[#E05A47] text-white" />
                  ) : (
                    <Square className="w-4 h-4 text-[#A3C4CB]" />
                  )}
                </button>
                <div className="text-xs leading-relaxed">
                  I confirm that <strong>{personName || 'the other person'}</strong> has clearly agreed and consented to being photographed and having this selfie submitted. <span className="text-red-600 font-bold">*</span>
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setStep(1);
                  }}
                  className="w-1/3 py-3 rounded-xl border border-[#A3C4CB] text-xs font-medium text-[#0B3B3D] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleValidateStep2}
                  disabled={!selfieSource || !photoConsent}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selfieSource && photoConsent
                      ? 'bg-[#E05A47] hover:bg-[#C44633] text-white shadow-xs'
                      : 'bg-[#A3C4CB]/40 text-[#0B3B3D]/40 cursor-not-allowed'
                  }`}
                >
                  <span>Next: Fun Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && (
            <form onSubmit={handleValidateStep3} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="text-xs text-[#E05A47] font-semibold uppercase tracking-wider">
                  Step 3 • The Fun Question
                </div>
                <h4 
                  className="text-2xl font-medium text-[#0B3B3D]"
                  style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
                >
                  Ask {personName}:
                </h4>
              </div>

              {/* The Assigned Random Question Card */}
              <div className="p-4 rounded-2xl bg-[#FDF2F0] border border-[#E05A47]/30 text-center space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E05A47]">
                  Random Conversation Starter
                </span>
                <p 
                  className="text-lg md:text-xl font-medium text-[#0B3B3D] leading-snug"
                  style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
                >
                  "{assignedQuestion}"
                </p>
              </div>

              {/* Answer input */}
              <div>
                <label className="block text-xs font-semibold text-[#0B3B3D] mb-1.5">
                  {personName}'s Answer:
                </label>
                <textarea
                  placeholder={`Enter ${personName}'s witty or unhinged response...`}
                  value={questionAnswer}
                  onChange={(e) => {
                    setQuestionAnswer(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#A3C4CB] bg-white text-sm text-[#0B3B3D] placeholder-[#A3C4CB] focus:outline-none focus:border-[#E05A47]"
                  required
                  autoFocus
                />
              </div>

              {/* Step 3 Actions */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 rounded-xl border border-[#A3C4CB] text-xs font-medium text-[#0B3B3D]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!questionAnswer.trim()}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    questionAnswer.trim()
                      ? 'bg-[#E05A47] hover:bg-[#C44633] text-white shadow-xs'
                      : 'bg-[#A3C4CB]/40 text-[#0B3B3D]/40 cursor-not-allowed'
                  }`}
                >
                  <span>Review & Complete</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 4 ================= */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-[#FDF2F0] text-[#E05A47] flex items-center justify-center mx-auto mb-1">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 
                  className="text-2xl font-medium text-[#0B3B3D]"
                  style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
                >
                  Got your connection!
                </h4>
                <p className="text-xs text-[#0B3B3D]/75">
                  Confirm the details below to mark letter <strong>{letter.toUpperCase()}</strong> on your board.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 space-y-3">
                <div className="flex items-center gap-3">
                  {selfieSource && (
                    <img
                      src={selfieSource}
                      alt="Connection selfie"
                      className="w-14 h-14 rounded-xl object-cover border border-[#E05A47]/30"
                    />
                  )}
                  <div>
                    <div className="text-xs text-[#E05A47] font-semibold">
                      Letter '{letter.toUpperCase()}'
                    </div>
                    <div className="text-base font-semibold text-[#0B3B3D]">
                      {personName}
                    </div>
                    <div className="text-[11px] text-[#0B3B3D]/60">
                      Consented selfie attached
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#A3C4CB]/30 space-y-1">
                  <div className="text-[11px] font-semibold text-[#0B3B3D]">
                    Q: {assignedQuestion}
                  </div>
                  <div className="text-xs italic text-[#E05A47] bg-white p-2 rounded-lg border border-[#A3C4CB]/30">
                    "{questionAnswer}"
                  </div>
                </div>
              </div>

              {/* Final Submit Actions */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={isSubmitting}
                  className="w-1/3 py-3 rounded-xl border border-[#A3C4CB] text-xs font-medium text-[#0B3B3D]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#E05A47] hover:bg-[#C44633] text-white text-xs font-semibold transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving Connection...</span>
                  ) : (
                    <>
                      <span>Mark Off Letter '{letter.toUpperCase()}'</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
