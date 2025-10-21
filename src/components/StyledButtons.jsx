"use client";
import React from 'react';
import { useEffect, useState } from "react";

const GetStartedBtn = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  return (
    <div className="styled-button-wrapper">
      <style>
        {`
        .styled-button {
          --main-size: 1.5em;
          --color-text: #ffffff;
          --color-background: #ff135a;
          --color-background-hover: #ff1472;
          --color-outline: #ff145a40;
          --color-shadow: #00000040;
          cursor: pointer; 
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          border: none;
          border-radius: calc(var(--main-size) * 100);
          padding: 0.33em 0 0.33em 0.66em;
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          font-size: var(--main-size);
          color: var(--color-text);
          background: var(--color-background);
          box-shadow: 0 0 0.2em 0 var(--color-background);
          transition: 1s;
        }

        .styled-button:active {
          transform: scale(0.95);
        }

        .styled-button:hover {
          outline: 0.1em solid transparent;
          outline-offset: 0.2em;
          box-shadow: 0 0 1em 0 var(--color-background);
          animation: ripple 1s linear infinite, colorize 1s infinite;
          transition: 0.5s;
        }

        .styled-button span {
          margin-right: 0.3em;
          transition: 0.5s;
        }

        .styled-button:hover span {
          text-shadow: 5px 5px 5px var(--color-shadow);
        }

        .styled-button:active span {
          text-shadow: none;
        }

        .styled-button svg {
          height: 0.8em;
          fill: var(--color-text);
          margin-right: -0.16em;
          position: relative;
          transition: 0.5s;
        }

        .styled-button:hover svg {
          margin-right: 0.66em;
          transition: 0.5s;
          filter: drop-shadow(5px 5px 2.5px var(--color-shadow));
        }

        .styled-button:active svg {
          filter: none;
        }

        .styled-button svg polygon:nth-child(1) {
          transition: 0.4s;
          transform: translateX(-60%);
        }

        .styled-button svg polygon:nth-child(2) {
          transition: 0.5s;
          transform: translateX(-30%);
        }

        .styled-button:hover svg polygon:nth-child(1) {
          transform: translateX(0%);
          animation: opacity 1s infinite 0.6s;
        }

        .styled-button:hover svg polygon:nth-child(2) {
          transform: translateX(0%);
          animation: opacity 1s infinite 0.4s;
        }

        .styled-button:hover svg polygon:nth-child(3) {
          animation: opacity 1s infinite 0.2s;
        }

        @keyframes opacity {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes colorize {
          0% { background: var(--color-background); }
          50% { background: var(--color-background-hover); }
          100% { background: var(--color-background); }
        }

        @keyframes ripple {
          0% {
            outline: 0em solid transparent;
            outline-offset: -0.1em;
          }
          50% {
            outline: 0.2em solid var(--color-outline);
            outline-offset: 0.2em;
          }
          100% {
            outline: 0.4em solid transparent;
            outline-offset: 0.4em;
          }
        }

        @media (max-width: 640px) {
          .styled-button {
            --main-size: 1.1rem;
          }
        }
      `}
      </style>

      <button className="styled-button">
        <span>Get Started for Free</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 43">
          <polygon points="39.58,4.46 44.11,0 66,21.5 44.11,43 39.58,38.54 56.94,21.5" />
          <polygon points="19.79,4.46 24.32,0 46.21,21.5 24.32,43 19.79,38.54 37.15,21.5" />
          <polygon points="0,4.46 4.53,0 26.42,21.5 4.53,43 0,38.54 17.36,21.5" />
        </svg>
      </button>
    </div>
  );
};

export default GetStartedBtn;
