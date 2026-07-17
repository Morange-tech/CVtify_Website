// Classic Formal Serif Letter Template
import React from 'react';
import { Source_Serif_4 } from 'next/font/google';

// Source Serif 4 closely mimics the classic "Times New Roman" look used in formal letters
const serif = Source_Serif_4({ subsets: ['latin'], weight: ['400', '700'] });

export default function LetterTemplate5({ letterData = {}, sectionTitleOverrides = {} }) {
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
    <div className={`w-full max-w-[800px] bg-white shadow-lg min-h-[1100px] p-[2.5cm] text-[#000] text-[15px] leading-normal flex flex-col ${serif.className}`}>
      {/* SENDER INFO (Top Left) */}
      {(fullName || senderInfo.address || senderInfo.city) && (
        <div className="mb-12">
          {fullName && <p className="font-semibold uppercase">{fullName}</p>}
          {senderInfo.address && <p>{senderInfo.address}</p>}
          {senderInfo.city && <p>{senderInfo.city}</p>}
        </div>
      )}

      {/* RECIPIENT INFO (Right Aligned/Indented) */}
      {(recipientInfo.company || recipientFullName) && (
        <div className="ml-auto w-1/2 mb-12">
          <p className="font-semibold mb-2">À</p>
          {recipientInfo.company && (
            <p className="font-semibold uppercase underline underline-offset-2">{recipientInfo.company}</p>
          )}
          {recipientFullName && <p className="font-semibold">{recipientFullName}</p>}
        </div>
      )}

      {/* DATE AND CITY (Right Aligned) */}
      {senderInfo.date && (
        <div className="text-right mb-12">
          <p>
            {senderInfo.city ? `${senderInfo.city}, ` : ''}le {senderInfo.date}
          </p>
        </div>
      )}

      {/* SUBJECT SECTION */}
      {subject && (
        <div className="mb-10">
          <p className="font-bold mb-1">
            {sectionTitleOverrides?.subject || 'Objet'} : <span className="font-normal italic">{subject}</span>
          </p>
        </div>
      )}

      {/* SALUTATION */}
      {opening && <div className="mb-6 [&_p]:m-0">{renderHtml(opening)}</div>}

      {/* BODY TEXT */}
      <div className="space-y-6 text-justify leading-[1.6] [&_p]:mb-6">
        {renderHtml(body)}
        {renderHtml(closing)}
      </div>

      {/* SIGNATURE (Right Aligned) */}
      {(signature?.signatureType === 'upload' || signature?.signatureType === 'draw') && signature?.signature ? (
        <img
          src={signature.signature}
          alt="Signature"
          className="mt-16 self-end h-14 max-w-[200px]"
        />
      ) : (
        ((signature?.signatureType === 'type' && signature?.signature) || fullName) && (
          <div className="mt-16 text-right">
            <p className="font-semibold pr-10">
              {(signature?.signatureType === 'type' && signature?.signature) || fullName}
            </p>
          </div>
        )
      )}
    </div>
  );
}
