import type React from "react";
export const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z"/></svg>
);
const S = (d: string) => () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
export const IconWeb = S("M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01");
export const IconApp = S("M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM11 18h2");
export const IconGame = S("M6 11h4M8 9v4M15 12h.01M18 10h.01M17.3 5H6.7a4 4 0 0 0-3.9 3.2l-1 5.6A3 3 0 0 0 6.5 16.6L8 15h8l1.5 1.6a3 3 0 0 0 4.7-2.8l-1-5.6A4 4 0 0 0 17.3 5z");
export const IconGrow = S("M3 17l6-6 4 4 8-8M15 7h6v6");
export const IconMail = S("M3 5h18v14H3zM3 7l9 6 9-6");
export const IconPhone = S("M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z");
export const IconInsta = S("M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4zM17.5 6.5h.01");
export const serviceIcon: Record<string, () => React.ReactElement> = {
  "website-development": IconWeb, "app-development": IconApp, "game-development": IconGame, "digital-marketing": IconGrow,
};
