import { useTheme } from "@/hooks/useTheme";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "@/hooks/useAppContext";

export default function Logo() {
  const { theme } = useTheme();
  const { navbarBorderHidden } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isLight = theme === "light";

  // Check if we're in board view (handles both /board/ and /b/ routes)
  const isBoardView =
    location.pathname.startsWith("/board/") ||
    location.pathname.startsWith("/b/");
  // When only board is active (inbox closed), navbar border is visible (!navbarBorderHidden)
  const isBoardOnly = isBoardView && !navbarBorderHidden;

  // Enhanced debug logging
  console.log("Logo Debug (always):", {
    pathname: location.pathname,
    isBoardView,
    navbarBorderHidden,
    isBoardOnly,
    calculation: `${isBoardView} && !${navbarBorderHidden} = ${isBoardOnly}`,
    expectedGray: isBoardOnly,
  });

  const handleLogoClick = () => {
    navigate("/boards");
  };

  return (
    <button
      onClick={handleLogoClick}
      className={`group flex items-center rounded-sm py-1 px-2 transition ease-in-out ${
        isLight ? "hover:bg-[#dddedd]" : "hover:bg-[#37373a]"
      }`}
      aria-label="Back to boards"
    >
      <div className="flex items-center">
        {/* Trello Logo SVG */}
        <svg width="24" height="24" viewBox="0 0 24 24">
          {/* Background */}
          <path
            d="M0 5C0 2.23858 2.23858 0 5 0H19C21.7614 0 24 2.23858 24 5V19C24 21.7614 21.7614 24 19 24H5C2.23858 24 0 21.7614 0 19V5Z"
            fill={`${
              isBoardOnly ? (isLight ? "white" : "#a9abaf") : "#0055cc"
            }`}
          />

          {/* White lines */}
          <rect
            x="4.43101"
            y="4.43101"
            width="5.90729"
            height="13.803"
            rx="0.947869"
            ry="0.947869"
            fill={`${
              isBoardOnly ? (isLight ? "#0a0d12" : "#1f1f21") : "white"
            }`}
            className="group-hover:animate-[reverse-pulse_0.43s_ease-in-out_infinite_alternate]"
          />
          <rect
            x="13.6617"
            y="4.43101"
            width="5.90729"
            height="8.3366"
            rx="0.947869"
            ry="0.947869"
            fill={`${
              isBoardOnly ? (isLight ? "#0a0d12" : "#1f1f21") : "white"
            }`}
            className="group-hover:animate-[forward-pulse_0.43s_ease-in-out_infinite_alternate]"
          />
        </svg>
        <p
          className={`ml-1.5 font-[500] xl:text-sm text-[0px]`}
          style={{
            color: isBoardOnly
              ? isLight
                ? "white"
                : "#a9abaf"
              : isLight
              ? "#172b4d"
              : "white",
          }}
        >
          T<span className="xl:text-[15px] text-[0px]">rello</span>
        </p>
      </div>
    </button>
  );
}
