"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CircularText from "@/components/CircularText";
import { useTheme } from "@/lib/theme";
import { useWorkLayout } from "@/lib/workLayout";

export default function PageLoader() {
  const theme = useTheme();
  const { loaderSettings } = useWorkLayout();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let hidden = false;
    const hide = () => {
      if (hidden) return;
      hidden = true;
      setVisible(false);
    };

    // Hide once the page has loaded, but keep a short minimum so the
    // loader doesn't just flash on fast loads. A max fallback guarantees
    // it always clears.
    const minTimer = window.setTimeout(() => {
      if (document.readyState === "complete") hide();
      else window.addEventListener("load", hide, { once: true });
    }, 1100);
    const maxTimer = window.setTimeout(hide, 2600);

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(maxTimer);
      window.removeEventListener("load", hide);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && loaderSettings.enabled && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 grid place-items-center"
          style={{ backgroundColor: theme.background, zIndex: 200 }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <CircularText
            text={loaderSettings.text || " "}
            onHover={loaderSettings.onHover}
            spinDuration={loaderSettings.spinDuration}
            color={theme.accent}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
