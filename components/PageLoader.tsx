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
    // Reveal content on the first hydrated frame, without a cosmetic wait.
    const frame = window.requestAnimationFrame(() => setVisible(false));
    return () => window.cancelAnimationFrame(frame);
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
          transition={{ duration: 0.15, ease: "easeInOut" }}
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
