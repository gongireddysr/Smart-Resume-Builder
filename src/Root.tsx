import { useCallback, useEffect, useState } from "react";
import posthog from "posthog-js";
import App from "./App";
import LandingPage from "./pages/LandingPage";

function isAppRoute(pathname: string): boolean {
  return pathname === "/app" || pathname.startsWith("/app/");
}

function Root() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToApp = useCallback(() => {
    posthog.capture("landing_try_demo_clicked");
    window.history.pushState({}, "", "/app");
    setPathname("/app");
  }, []);

  if (isAppRoute(pathname)) {
    return <App />;
  }

  return <LandingPage onTryDemo={navigateToApp} />;
}

export default Root;
