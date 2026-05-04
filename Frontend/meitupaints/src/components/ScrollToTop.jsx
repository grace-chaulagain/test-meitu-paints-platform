import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Prevent browser restoring scroll position
    try {
      window.history.scrollRestoration = "manual";
    } catch {}

    // Hard jump to top (no animation)
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    const jumpTop = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } catch {
        window.scrollTo(0, 0);
      }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Run multiple times for mobile/iOS reliability
    jumpTop();
    const raf1 = requestAnimationFrame(jumpTop);
    const raf2 = requestAnimationFrame(() => requestAnimationFrame(jumpTop));
    const t0 = setTimeout(jumpTop, 0);
    const t80 = setTimeout(jumpTop, 80);
    const t250 = setTimeout(jumpTop, 250);

    const onPageShow = () => jumpTop(); // iOS Safari bfcache
    window.addEventListener("pageshow", onPageShow);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t0);
      clearTimeout(t80);
      clearTimeout(t250);
      window.removeEventListener("pageshow", onPageShow);
      document.documentElement.style.scrollBehavior = prev;
    };
  }, [pathname]);

  return null;
}
