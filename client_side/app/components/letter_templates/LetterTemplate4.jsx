// Two-Tone Banner Letter Template
import React from 'react';
import { Inter } from 'next/font/google';

// Clean sans-serif font for professional documents
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '600'] });

export default function LetterTemplate4({ letterData = {}, sectionTitleOverrides = {} }) {
  const {
    senderInfo = {},
    subject = '',
    opening = '',
    body = '',
    closing = '',
    signature = '',
  } = letterData;

  const fullName = [senderInfo.firstName, senderInfo.lastName].filter(Boolean).join(' ');

  const renderHtml = (html) => (html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null);

  return (
    <div className={`w-full max-w-[850px] bg-white shadow-2xl min-h-[1100px] flex flex-col ${inter.className}`}>
      {/* Header Section */}
      <div className="flex h-36">
        {/* Light Blue Part */}
        <div className="w-[82%] bg-[#5d8cb1] flex items-center pl-16">
          <h1 className="text-white text-3xl font-light tracking-[0.25em] uppercase">
            Lettre de Motivation
          </h1>
        </div>
        {/* Dark Blue Part */}
        <div className="w-[18%] bg-[#2b445a]"></div>
      </div>

      {/* Content Section */}
      <div className="p-16 md:p-20 text-[#333] flex flex-col">
        {/* Sender Info (Left Aligned) */}
        {(fullName || senderInfo.address || senderInfo.city || senderInfo.email || senderInfo.phone) && (
          <div className="mb-14 text-[15px] leading-6">
            {fullName && <p className="font-semibold text-gray-800">{fullName}</p>}
            {senderInfo.address && <p>{senderInfo.address}</p>}
            {senderInfo.city && <p>{senderInfo.city}</p>}
            {senderInfo.email && <p>{senderInfo.email}</p>}
            {senderInfo.phone && <p>{senderInfo.phone}</p>}
          </div>
        )}

        {/* Subject Line */}
        {subject && (
          <div className="mb-12 text-[15px]">
            <p className="font-bold">
              {sectionTitleOverrides?.subject || 'Objet'} :{' '}
              <span className="font-normal underline underline-offset-2">{subject}</span>
            </p>
          </div>
        )}

        {/* Salutation */}
        {opening && <div className="mb-10 text-[15px] [&_p]:m-0">{renderHtml(opening)}</div>}

        {/* Letter Body */}
        <div className="space-y-8 text-[15px] leading-relaxed text-justify [&_p]:mb-8">
          {renderHtml(body)}
          {renderHtml(closing)}
        </div>

        {/* Signature */}
        {(signature?.signatureType === 'upload' || signature?.signatureType === 'draw') && signature?.signature ? (
          <img
            src={signature.signature}
            alt="Signature"
            className="mt-8 h-14 max-w-[200px]"
          />
        ) : (
          ((signature?.signatureType === 'type' && signature?.signature) || fullName) && (
            <p className="mt-8 text-[15px] font-semibold">
              {(signature?.signatureType === 'type' && signature?.signature) || fullName}
            </p>
          )
        )}
      </div>
    </div>
  );
}
