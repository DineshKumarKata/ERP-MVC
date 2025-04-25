import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * This component doesn't render anything visible
 * It's used to set up API configuration and testing utilities
 */
const ApiConfig: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Log environment variables in development
    if (process.env.NODE_ENV === "development") {
      console.log("Environment Variables:");
      console.log("- BACKEND_URL:", process.env.BACKEND_URL || "Not set");
      console.log(
        "- BASE_PATH:",
        process.env.NEXT_PUBLIC_BASE_PATH || "/vignan"
      );

      // Make API test functions available in browser console
      if (typeof window !== "undefined") {
        import("../utils/apiTest").then((module) => {
          (window as any).apiTest = module.default;
          console.log(
            "API testing utilities loaded. Use window.apiTest in console to test endpoints."
          );
        });
      }
    }

    // Validate backend URL
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      console.warn("BACKEND_URL environment variable is not set!");
    }
  }, []);

  return null;
};

export default ApiConfig;
