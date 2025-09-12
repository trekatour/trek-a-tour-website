import { useUser } from "@clerk/clerk-react";
import { ReactNode } from "react";

interface ClerkLoadingWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ClerkLoadingWrapper = ({ children, fallback }: ClerkLoadingWrapperProps) => {
  const { isLoaded } = useUser();
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center">
        {fallback || (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        )}
      </div>
    );
  }
  
  return <>{children}</>;
};

export default ClerkLoadingWrapper;