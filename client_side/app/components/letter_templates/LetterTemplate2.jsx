// Corporate Header Letter Template
import React from 'react';
import { Montserrat } from 'next/font/google';
import { MapPin, Phone, Mail } from 'lucide-react';

// Using Montserrat for that clean, professional corporate look
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export default function LetterTemplate2({ letterData = {}, sectionTitleOverrides = {} }) {
  const {
    senderInfo = {},
    recipientInfo = {},
    subject = '',
    opening = '',
    body = '',
    closing = '',
    signature = '',
  } = letterData;

  const fullName = [senderInfo.firstName, senderInfo.lastName].filter(Boolean).join(' ');
  const recipientFullName = [recipientInfo.firstName, recipientInfo.lastName].filter(Boolean).join(' ');

  const renderHtml = (html) => (html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null);

  return (
    <div className={`w-full max-w-[850px] bg-white shadow-2xl min-h-[1100px] flex flex-col ${montserrat.className}`}>
      {/* Header Section - Dark Blue */}
      <div className="bg-[#293347] text-white pt-12 pb-8 px-6 flex flex-col items-center">
        {senderInfo.photo && (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden mb-6 bg-gray-300">
            <img src={senderInfo.photo} alt={fullName || 'Photo'} className="w-full h-full object-cover" />
          </div>
        )}

        {fullName && (
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-2 text-center">
            {fullName}
          </h1>
        )}
        {senderInfo.title && (
          <p className="text-sm md:text-base tracking-widest font-medium uppercase mb-8 opacity-90">
            {senderInfo.title}
          </p>
        )}

        {(senderInfo.address || senderInfo.city || senderInfo.phone || senderInfo.email) && (
          <div className="w-full max-w-2xl flex flex-wrap justify-center gap-6 md:gap-12 text-[11px] md:text-xs font-light border-t border-white/20 pt-6">
            {(senderInfo.address || senderInfo.city) && (
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-white" />
                <span>{[senderInfo.address, senderInfo.city].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {senderInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-white" />
                <span>{senderInfo.phone}</span>
              </div>
            )}
            {senderInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-white" />
                <span>{senderInfo.email}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-grow p-12 md:p-20 text-gray-800 flex flex-col">
        {/* Date & Recipient (Right Aligned) */}
        {(recipientFullName || recipientInfo.company || senderInfo.date) && (
          <div className="self-end text-right text-sm space-y-1 mb-10">
            {senderInfo.date && (
              <p className="font-semibold">
                {senderInfo.city ? `${senderInfo.city}, ` : ''}
                {senderInfo.date}
              </p>
            )}
            {recipientFullName && <p>{recipientFullName}</p>}
            {recipientInfo.position && <p>{recipientInfo.position}</p>}
            {recipientInfo.company && <p>{recipientInfo.company}</p>}
            {(recipientInfo.address || recipientInfo.city) && (
              <p>{[recipientInfo.address, recipientInfo.city].filter(Boolean).join(', ')}</p>
            )}
          </div>
        )}

        {/* Subject Line */}
        {subject && (
          <div className="mb-8">
            <p className="font-bold text-sm md:text-base">
              {sectionTitleOverrides?.subject || 'Objet'} : <span className="font-normal">{subject}</span>
            </p>
          </div>
        )}

        {/* Body Text */}
        <div className="text-sm md:text-[15px] leading-relaxed text-justify [&_p]:mb-6">
          {renderHtml(opening)}
          {renderHtml(body)}
          {renderHtml(closing)}
        </div>

        {/* Signature / Sign-off */}
        <div className="mt-16 self-end text-right">
          {signature?.signatureType === 'upload' || signature?.signatureType === 'draw' ? (
            <img src={signature.signature} alt="Signature" className="h-14 max-w-[200px] mb-1 inline-block" />
          ) : signature?.signatureType === 'type' && signature?.signature ? (
            <p className="text-2xl mb-1" style={{ fontFamily: '"Dancing Script", cursive' }}>
              {signature.signature}
            </p>
          ) : null}
          {fullName && <p className="font-semibold text-sm md:text-base tracking-wide">{fullName}</p>}
        </div>
      </div>
    </div>
  );
}
