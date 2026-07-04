export const homeScrollStorageKey = "office-portfolio:home-scroll";

type HomeScrollPosition = {
  x: number;
  y: number;
};

export function saveHomeScrollPosition() {
  if (typeof window === "undefined") return;

  const position: HomeScrollPosition = {
    x: window.scrollX,
    y: window.scrollY,
  };

  window.sessionStorage.setItem(
    homeScrollStorageKey,
    JSON.stringify(position)
  );
}

export function readHomeScrollPosition(): HomeScrollPosition | null {
  if (typeof window === "undefined") return null;

  const rawPosition = window.sessionStorage.getItem(homeScrollStorageKey);
  if (!rawPosition) return null;

  try {
    const position = JSON.parse(rawPosition) as Partial<HomeScrollPosition>;
    if (typeof position.x !== "number" || typeof position.y !== "number") {
      return null;
    }

    return {
      x: position.x,
      y: position.y,
    };
  } catch {
    return null;
  }
}

export function clearHomeScrollPosition() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(homeScrollStorageKey);
}
