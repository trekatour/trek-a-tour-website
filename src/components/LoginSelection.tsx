import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Shield, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoginSelectionProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginSelection = ({ isOpen, onClose }: LoginSelectionProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<"admin" | "user" | null>(null);

  const handleAdminLogin = () => {
    setSelectedType("admin");
  };

  const handleUserLogin = () => {
    setSelectedType("user");
  };

  // Check if user is already signed in and redirect accordingly
  if (user && selectedType) {
    const isAdmin = user.primaryEmailAddress?.emailAddress === "saythu000@gmail.com";
    
    if (selectedType === "admin" && isAdmin) {
      navigate("/admin");
      onClose();
      return null;
    } else if (selectedType === "user") {
      onClose();
      return null;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex items-center justify-between">
            Choose Login Type
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleAdminLogin}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Admin Login</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Access admin dashboard to manage trips, packages, and content
              </p>
              <SignInButton 
                mode="modal"
                afterSignInUrl="/admin"
                afterSignUpUrl="/admin"
              >
                <Button className="w-full" variant="default">
                  <Shield className="w-4 h-4 mr-2" />
                  Sign In as Admin
                </Button>
              </SignInButton>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleUserLogin}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                <User className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-lg">User Login</CardTitle>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Sign in to book trips, manage bookings, and access your profile
              </p>
              <SignInButton 
                mode="modal"
                afterSignInUrl="/"
                afterSignUpUrl="/"
              >
                <Button className="w-full" variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Sign In as User
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          New here? Sign up during the login process
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginSelection;
