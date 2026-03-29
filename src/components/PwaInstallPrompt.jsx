import { useEffect, useState } from "react";

import "./PwaInstallPrompt.css";

function isStandaloneDisplayMode() {
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.navigator?.standalone === true
  );
}

function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    setIsInstalled(isStandaloneDisplayMode());

    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallEvent(event);
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setInstallEvent(null);
      setIsInstalling(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function onInstallClick() {
    if (!installEvent || isInstalling) return;

    setIsInstalling(true);
    installEvent.prompt();

    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      setInstallEvent(null);
    }
    setIsInstalling(false);
  }

  if (isInstalled || !installEvent) {
    return null;
  }

  return (
    <div className="pwa-install-wrap" role="status" aria-live="polite">
      <button
        type="button"
        className="pwa-install-btn"
        onClick={onInstallClick}
        disabled={isInstalling}
      >
        {isInstalling ? "Installing..." : "Install App"}
      </button>
    </div>
  );
}

export default PwaInstallPrompt;
