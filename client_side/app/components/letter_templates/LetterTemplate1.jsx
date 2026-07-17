// Elegant Editorial Letter Template
import React from 'react';
import { Box, Typography } from '@mui/material';

export default function LetterTemplate1({ letterData = {}, sectionTitleOverrides = {} }) {
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
  const sidebarColor = '#8b7362';
  const pageColor = '#f4e9db';

  const renderHtml = (html) =>
    html ? (
      <Box
        component="div"
        dangerouslySetInnerHTML={{ __html: html }}
        sx={{
          fontFamily: '"Inter", Helvetica, Arial, sans-serif',
          fontSize: '10.5pt',
          lineHeight: 1.75,
          color: '#3a332c',
          '& p': { margin: '0 0 10px 0' },
          '& ul, & ol': { paddingLeft: '20px', margin: '0 0 10px 0' },
        }}
      />
    ) : null;

  const renderCursive = (html) =>
    html ? (
      <Box
        component="div"
        dangerouslySetInnerHTML={{ __html: html }}
        sx={{
          fontFamily: '"Dancing Script", cursive',
          fontSize: '22pt',
          color: '#5c4a3a',
          lineHeight: 1.3,
          '& p': { margin: 0 },
        }}
      />
    ) : null;

  return (
    <Box
      className="cv-print-root"
      sx={{
        width: '210mm',
        minHeight: '297mm',
        display: 'flex',
        bgcolor: pageColor,
        fontFamily: '"Inter", Helvetica, Arial, sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Dancing+Script:wght@400;600&family=Inter:wght@300;400;600&display=swap');`}
      </style>

      {/* ── Left Sidebar ── */}
      <Box
        sx={{
          width: '34%',
          bgcolor: sidebarColor,
          color: '#ffffff',
          p: '16mm 10mm',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {senderInfo.photo && (
            <Box
              component="img"
              src={senderInfo.photo}
              alt={fullName || 'Photo'}
              sx={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                objectFit: 'cover',
                mb: 3,
                border: '3px solid rgba(255,255,255,0.4)',
              }}
            />
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: '10pt', opacity: 0.92 }}>
            {senderInfo.phone && <Typography sx={{ fontSize: 'inherit' }}>{senderInfo.phone}</Typography>}
            {senderInfo.email && (
              <Typography sx={{ fontSize: 'inherit', wordBreak: 'break-word' }}>{senderInfo.email}</Typography>
            )}
            {(senderInfo.address || senderInfo.city) && (
              <Typography sx={{ fontSize: 'inherit' }}>
                {[senderInfo.address, senderInfo.city].filter(Boolean).join(', ')}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Bottom arch decoration */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '22%',
            bgcolor: pageColor,
            borderTopRightRadius: '100px',
          }}
        />
      </Box>

      {/* ── Main Content ── */}
      <Box sx={{ flex: 1, p: '18mm 16mm', position: 'relative' }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          {fullName && (
            <Typography
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '30pt',
                textTransform: 'uppercase',
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
                color: '#2b2620',
              }}
            >
              {fullName}
            </Typography>
          )}
          {senderInfo.title && (
            <Box
              sx={{
                display: 'inline-block',
                mt: 2,
                px: 2.5,
                py: 0.5,
                borderRadius: 10,
                bgcolor: '#7c685b',
                color: '#ffffff',
                fontSize: '9pt',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {senderInfo.title}
            </Box>
          )}
        </Box>

        {/* Date / Recipient */}
        {(recipientFullName || recipientInfo.company || senderInfo.date) && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
            <Box>
              {(recipientFullName || recipientInfo.company) && (
                <>
                  <Typography sx={{ fontWeight: 600, fontSize: '10pt', color: '#2b2620' }}>
                    {sectionTitleOverrides?.recipientInfo || 'To'}
                  </Typography>
                  {recipientFullName && (
                    <Typography sx={{ fontSize: '9.5pt', color: '#544a3f' }}>{recipientFullName}</Typography>
                  )}
                  {recipientInfo.position && (
                    <Typography sx={{ fontSize: '9.5pt', color: '#6b6055', fontStyle: 'italic' }}>
                      {recipientInfo.position}
                    </Typography>
                  )}
                  {recipientInfo.company && (
                    <Typography sx={{ fontSize: '9.5pt', color: '#544a3f' }}>{recipientInfo.company}</Typography>
                  )}
                  {(recipientInfo.address || recipientInfo.city) && (
                    <Typography sx={{ fontSize: '9.5pt', color: '#6b6055' }}>
                      {[recipientInfo.address, recipientInfo.city].filter(Boolean).join(', ')}
                    </Typography>
                  )}
                </>
              )}
            </Box>
            {senderInfo.date && (
              <Typography sx={{ fontSize: '9.5pt', color: '#6b6055', fontStyle: 'italic' }}>
                {senderInfo.city ? `${senderInfo.city}, ` : ''}
                {senderInfo.date}
              </Typography>
            )}
          </Box>
        )}

        {/* Subject */}
        {subject && (
          <Typography sx={{ fontSize: '10pt', fontWeight: 700, mb: 2.5, color: '#2b2620' }}>
            {sectionTitleOverrides?.subject || 'Subject'}: {subject}
          </Typography>
        )}

        {/* Greeting */}
        {opening && <Box sx={{ mb: 3 }}>{renderCursive(opening)}</Box>}

        {/* Body */}
        <Box sx={{ mb: 2 }}>{renderHtml(body)}</Box>
        <Box sx={{ mb: 4 }}>{renderHtml(closing)}</Box>

        {/* Signature */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Box sx={{ textAlign: 'right' }}>
            {signature?.signatureType === 'upload' || signature?.signatureType === 'draw' ? (
              <Box
                component="img"
                src={signature.signature}
                alt="Signature"
                sx={{ height: 52, maxWidth: 200, mb: 0.5, display: 'inline-block' }}
              />
            ) : signature?.signatureType === 'type' && signature?.signature ? (
              <Typography sx={{ fontFamily: '"Dancing Script", cursive', fontSize: '22pt', color: '#2b2620', mb: 0.5 }}>
                {signature.signature}
              </Typography>
            ) : null}
            {fullName && (
              <Typography sx={{ fontSize: '10pt', fontWeight: 600, color: '#2b2620' }}>{fullName}</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
