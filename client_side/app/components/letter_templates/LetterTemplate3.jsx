// Split-Column Editorial Letter Template
import React from 'react';
import { Cinzel, Montserrat, Dancing_Script } from 'next/font/google';

// Loading fonts to match the style
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500'] });
const signatureFont = Dancing_Script({ subsets: ['latin'], weight: ['400'] });

export default function LetterTemplate3({ letterData = {} }) {
  const {
    senderInfo = {},
    opening = '',
    body = '',
    closing = '',
    signature = '',
  } = letterData;

  const fullName = [senderInfo.firstName, senderInfo.lastName].filter(Boolean).join(' ');

  const renderHtml = (html) => (html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null);

  const renderSignature = () => {
    if (signature?.signatureType === 'upload' || signature?.signatureType === 'draw') {
      return (
        <img
          src={signature.signature}
          alt="Signature"
          className="h-16 md:h-20 max-w-[260px] inline-block"
        />
      );
    }
    const text = (signature?.signatureType === 'type' && signature?.signature) || fullName;
    return text ? <p className={`${signatureFont.className} text-6xl md:text-7xl opacity-80`}>{text}</p> : null;
  };

  return (
    <div className={`w-full max-w-[850px] min-h-[1100px] shadow-2xl flex relative overflow-hidden text-[#5b4b41] ${montserrat.className}`}>
      {/* Left Column Background */}
      <div className="w-[42%] bg-[#e2dfd5]"></div>

      {/* Right Column Background */}
      <div className="w-[58%] bg-[#eeebe3]"></div>

      {/* Absolute Content Overlay */}
      <div className="absolute inset-0 flex flex-col p-12 md:p-20">
        {/* Header Section */}
        {(senderInfo.firstName || senderInfo.lastName || senderInfo.title) && (
          <header className="mb-16">
            {(senderInfo.firstName || senderInfo.lastName) && (
              <h1 className={`${cinzel.className} text-7xl md:text-8xl leading-[0.8] mb-4 tracking-tighter uppercase`}>
                {senderInfo.firstName}
                {senderInfo.firstName && senderInfo.lastName && <br />}
                {senderInfo.lastName}
              </h1>
            )}
            {senderInfo.title && (
              <p className="text-lg md:text-xl tracking-[0.2em] font-light uppercase border-t border-[#5b4b41] pt-4 inline-block">
                {senderInfo.title}
              </p>
            )}
          </header>
        )}

        {/* Body Content */}
        <main className="flex-grow">
          {opening && (
            <div className={`${cinzel.className} text-3xl md:text-4xl mb-8 tracking-widest uppercase [&_p]:m-0`}>
              {renderHtml(opening)}
            </div>
          )}

          <div className="space-y-6 text-sm md:text-[15px] leading-relaxed text-justify [&_p]:mb-6">
            {renderHtml(body)}
            {renderHtml(closing)}
          </div>
        </main>

        {/* Signature Section */}
        <footer className="mt-12 flex justify-end">
          <div className="text-right">{renderSignature()}</div>
        </footer>
      </div>
    </div>
  );
}
