import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MessageCircle, ArrowRight, ChevronLeft, Shield } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[+\d][\d\s-]{8,}$/, "Enter a valid Nigerian phone number"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "Enter the 6-digit code"),
});

type PhoneForm = z.infer<typeof phoneSchema>;
type OtpForm = z.infer<typeof otpSchema>;

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "+234" + digits.slice(1);
  if (digits.startsWith("234")) return "+" + digits;
  if (!digits.startsWith("+")) return "+234" + digits;
  return phone;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const expired = searchParams.get("error") === "link_expired";

  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: "" },
  });

  async function onSendOtp(data: PhoneForm) {
    setLoading(true);
    const normalized = normalizePhone(data.phoneNumber);
    try {
      await api.post("/auth/send-otp", { phoneNumber: normalized });
      setPhone(normalized);
      setStep("otp");
      toast.success("OTP sent to your WhatsApp!");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Could not send OTP. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyOtp() {
    if (otpValue.length !== 6) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { phoneNumber: phone, otp: otpValue });
      login(res.data.token, {
        trader_id: res.data.trader_id,
        trader_name: res.data.trader_name,
        business_name: res.data.business_name,
      });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Invalid OTP. Try again.";
      toast.error(msg);
      setOtpValue("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200 mb-4">
            <span className="text-white font-bold text-3xl">À</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Àjọ</h1>
          <p className="text-gray-500 text-sm text-center">Your Business. Your Community. Your Voice.</p>
        </motion.div>

        {expired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-orange-50 border border-orange-200 text-orange-700 text-sm rounded-xl px-4 py-3 mb-6 w-full max-w-sm text-center"
          >
            Your dashboard link has expired. Please log in again.
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 border border-gray-100"
        >
          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
                <p className="text-gray-400 text-sm mb-7">Enter your WhatsApp number to continue</p>

                <form onSubmit={phoneForm.handleSubmit(onSendOtp)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600">
                        <MessageCircle size={18} />
                      </div>
                      <input
                        {...phoneForm.register("phoneNumber")}
                        type="tel"
                        placeholder="e.g. 08012345678"
                        className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                      />
                    </div>
                    {phoneForm.formState.errors.phoneNumber && (
                      <p className="mt-1.5 text-xs text-red-500">{phoneForm.formState.errors.phoneNumber.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-base"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Send OTP <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>

                <div className="mt-6 flex items-center gap-2 text-gray-400 text-xs">
                  <Shield size={13} />
                  <span>OTP will be sent to your WhatsApp. No password needed.</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <button
                  onClick={() => { setStep("phone"); setOtpValue(""); }}
                  className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm mb-5 -ml-1 transition-colors"
                >
                  <ChevronLeft size={16} /> Back
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-1">Enter OTP</h2>
                <p className="text-gray-400 text-sm mb-2">
                  We sent a 6-digit code to
                </p>
                <p className="text-emerald-600 font-semibold text-sm mb-7">{phone} via WhatsApp</p>

                <div className="flex justify-center mb-7">
                  <OTPInput
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    value={otpValue}
                    onChange={setOtpValue}
                    onComplete={onVerifyOtp}
                    render={({ slots }) => (
                      <div className="flex gap-2">
                        {slots.map((slot, i) => (
                          <div
                            key={i}
                            className={`w-11 h-13 border-2 rounded-xl flex items-center justify-center text-xl font-bold transition-all ${
                              slot.isActive
                                ? "border-emerald-500 bg-emerald-50"
                                : slot.char
                                ? "border-emerald-300 bg-white"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            {slot.char ?? (
                              <span className="text-gray-300">-</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <button
                  onClick={onVerifyOtp}
                  disabled={otpValue.length !== 6 || loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-base"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Verify & Sign In <ArrowRight size={18} /></>
                  )}
                </button>

                <button
                  onClick={() => phoneForm.handleSubmit(onSendOtp)({ phoneNumber: phone })}
                  className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4 transition-colors"
                >
                  Didn't get the code? Resend
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="mt-6 text-xs text-gray-400 text-center max-w-xs">
          Don't have an account? Send <strong className="text-gray-600">"hello"</strong> to our WhatsApp number to get started.
        </p>
      </div>
    </div>
  );
}
