import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useAppStore, initTheme } from "./store/useAppStore";
import { AuthPage } from "./components/auth/AuthPage";
import { AppLayout } from "./components/layout/AppLayout";

// Initialize theme before first render
initTheme();

function App() {
  const { isAuthenticated, isDark } = useAppStore();

  // Sync theme class on mount and changes
  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "var(--color-card)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            backdropFilter: "blur(20px)",
            fontFamily: "var(--font-canva)",
            fontSize: "13px",
            borderRadius: "12px",
            padding: "10px 14px",
          },
          success: {
            iconTheme: { primary: "#00C4CC", secondary: "white" },
          },
          error: {
            iconTheme: { primary: "#FF4EAD", secondary: "white" },
          },
          loading: {
            iconTheme: { primary: "#8B5CF6", secondary: "transparent" },
          },
        }}
      />
      {isAuthenticated ? <AppLayout /> : <AuthPage />}
    </>
  );
}

export default App;
