import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Shield, ArrowLeft } from "lucide-react";
import { initEmailJS, sendOTPEmail, generateOTP } from "@/lib/emailService";

const AdminLogin = () => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState<number>(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Authorized admin emails
  const authorizedEmails = [
    "saythu000@gmail.com",
    "trekatour@gmail.com"
  ];

  useEffect(() => {
    // Initialize EmailJS when component mounts
    initEmailJS();
  }, []);

  const sendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if email is authorized
    if (!authorizedEmails.includes(email.toLowerCase().trim())) {
      toast({
        title: "Access Denied",
        description: "This email is not authorized for admin access",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Generate OTP
      const newOtp = generateOTP();
      setGeneratedOtp(newOtp);
      
      // Set OTP expiry (5 minutes from now)
      setOtpExpiry(Date.now() + 5 * 60 * 1000);

      // Send OTP via email - REAL EMAIL OR DEMO MODE
      const emailSent = await sendOTPEmail(email.toLowerCase().trim(), newOtp);
      
      if (emailSent) {
        // Check if we're in demo mode (EmailJS not configured)
        const isDemo = import.meta.env.VITE_EMAILJS_SERVICE_ID === 'service_your_id' || 
                       !import.meta.env.VITE_EMAILJS_SERVICE_ID;
        
        if (isDemo) {
          toast({
            title: "Demo Mode - OTP Generated",
            description: `EmailJS not set up. Demo OTP: ${newOtp}. Check console for setup instructions.`,
          });
        } else {
          toast({
            title: "OTP Sent Successfully!",
            description: `A 6-digit OTP has been sent to ${email}. Please check your email inbox and spam folder.`,
          });
        }
        setStep('otp');
      } else {
        // EmailJS failed, show demo mode
        toast({
          title: "Demo Mode - EmailJS Setup Needed",
          description: `Real email failed. Demo OTP: ${newOtp}. Set up EmailJS for real emails.`,
        });
        setStep('otp');
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again later.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const verifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if OTP is expired
    if (Date.now() > otpExpiry) {
      toast({
        title: "OTP Expired",
        description: "OTP has expired. Please request a new one.",
        variant: "destructive",
      });
      setStep('email');
      setOtp("");
      setLoading(false);
      return;
    }

    // Verify OTP
    if (otp === generatedOtp) {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', email.toLowerCase().trim());
      
      // Trigger custom event to update useAdmin hook
      window.dispatchEvent(new Event('adminStatusChanged'));
      
      toast({
        title: "Login Successful",
        description: `Welcome to the admin panel, ${email}!`,
      });
      
      navigate('/admin');
    } else {
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setStep('email');
    setEmail("");
    setOtp("");
    setGeneratedOtp("");
    setOtpExpiry(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            {step === 'email' ? (
              <Mail className="w-6 h-6 text-orange-600" />
            ) : (
              <Shield className="w-6 h-6 text-orange-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {step === 'email' ? 'Admin Login' : 'Verify OTP'}
          </CardTitle>
          <p className="text-gray-600">
            {step === 'email' 
              ? 'Enter your authorized email address' 
              : `OTP sent to ${email}`
            }
          </p>
        </CardHeader>
        <CardContent>
          {step === 'email' ? (
            <form onSubmit={sendOTP} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-center"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyOTP} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="w-full" 
                onClick={resetForm}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Email
              </Button>
            </form>
          )}

          {step === 'email' && (
            <div className="mt-6 text-center">
              <div className="text-xs text-gray-500">
                Enter your authorized admin email address to receive an OTP
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                OTP expires in 5 minutes. Check your email for the code.
              </p>
            </div>
          )}

          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-sm"
            >
              ← Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
