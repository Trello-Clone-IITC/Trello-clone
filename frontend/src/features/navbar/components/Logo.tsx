export default function Logo() {
  return (
    <a href="/" className="flex items-center" aria-label="Back to home">
      <div className="flex items-center">
        {/* Trello Logo SVG */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="text-[#0055cc]"
        >
          {/* Background */}
          <path
            d="M0 5C0 2.23858 2.23858 0 5 0H19C21.7614 0 24 2.23858 24 5V19C24 21.7614 21.7614 24 19 24H5C2.23858 24 0 21.7614 0 19V5Z"
            fill="currentColor"
          />

          {/* White lines */}
          <rect
            x="4.43101"
            y="4.43101"
            width="5.90729"
            height="13.803"
            rx="0.947869"
            ry="0.947869"
            fill="white"
          />
          <rect
            x="13.6617"
            y="4.43101"
            width="5.90729"
            height="8.3366"
            rx="0.947869"
            ry="0.947869"
            fill="white"
          />
        </svg>
      </div>
    </a>
  );
}
