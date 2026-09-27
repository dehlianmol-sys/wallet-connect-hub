import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import Home from "@/pages/v2/HomeV2";
import Login from "@/pages/Login";
import Landing from "@/pages/Landing";
import { isInstallHost } from "@/lib/brand";
import { captureRefFromUrl } from "@/lib/referral";
import AppSplash from "@/components/AppSplash";
import UserLayout from "@/components/UserLayout";
import { Navigate } from "@/lib/router-compat";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Skypay — Earn Money Online With Easy Tasks" },
      {
        name: "description",
        content:
          "Download Skypay, complete simple tasks, get fast withdrawals and earn referral rebates every day.",
      },
      { property: "og:title", content: "Skypay — Earn Money Online With Easy Tasks" },
      {
        property: "og:description",
        content: "Download Skypay, complete simple tasks and earn referral rebates every day.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://install.skypaytop.cyou/social-preview.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://install.skypaytop.cyou/social-preview.jpg" },
    ],
  }),
  component: RootEntry,
});

// Plays once per app session: a fresh launch (app not in recents) shows it,
// while in-app navigation, back presses and WebView reloads never replay it.
const SPLASH_KEY = "hk_splash_seen";
const splashSeen = () => {
  try {
    return sessionStorage.getItem(SPLASH_KEY) === "1";
  } catch {
    return false;
  }
};
const markSplashSeen = () => {
  try {
    sessionStorage.setItem(SPLASH_KEY, "1");
  } catch {
    /* private mode: splash just won't persist */
  }
};
function RootEntry() {
  // install.skypaytop.cyou always shows the APK download page.
  if (isInstallHost()) {
    captureRefFromUrl();
    return <Landing />;
  }
  return <AppEntry />;
}

function AppEntry() {
  const { currentUser, loading } = useStore();
  const [startupSplash, setStartupSplash] = useState(() => !splashSeen());
  const [timeDone, setTimeDone] = useState(false);

  const finishSplash = useCallback(() => {
    setTimeDone(true);
  }, []);

  useEffect(() => {
    if (startupSplash && timeDone && !loading) {
      markSplashSeen();
      setStartupSplash(false);
    }
  }, [startupSplash, timeDone, loading]);

  if (startupSplash) return <AppSplash onFinish={finishSplash} />;

  if (loading) {
    return (
      <div style={{ position: "fixed", inset: 0, display: "grid", placeItems: "center", background: "rgba(0,0,0,.82)" }} role="status">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <span className="animate-spin" style={{ width: 34, height: 34, border: "3px solid rgba(255,255,255,.25)", borderTopColor: "#fff", borderRadius: "50%" }} />
          <span style={{ color: "#f2f4f5", fontSize: 13 }}>Loading…</span>
        </div>
      </div>
    );
  }



  if (!currentUser) {
    const ref =
      typeof window === "undefined"
        ? null
        : new URLSearchParams(window.location.search).get("ref");
    if (ref) return <Navigate to={`/download?ref=${encodeURIComponent(ref)}`} replace />;
    return <Login />;
  }
  if (currentUser.role !== "user") return <Navigate to="/admin" />;

  return (
    <UserLayout>
      <Home />
    </UserLayout>
  );
}
