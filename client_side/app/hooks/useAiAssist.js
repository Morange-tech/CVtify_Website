"use client";

import { useCallback, useState } from "react";

function joinUrl(base, path) {
  const b = (base || "").replace(/\/+$/, "");
  const p = (path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Converts the plain-text AI response into simple Quill-compatible HTML
function textToHtml(text) {
  const paragraphs = (text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function useAiAssist() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  const [isGenerating, setIsGenerating] = useState(false);

  const generateText = useCallback(
    async ({ contentType, sectionLabel, mode, existingText, context, maxLength }) => {
      if (!baseURL) {
        throw new Error("NEXT_PUBLIC_API_URL is not set");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      setIsGenerating(true);
      try {
        const res = await fetch(joinUrl(baseURL, "/ai/generate-text"), {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content_type: contentType,
            section_label: sectionLabel,
            mode,
            existing_text: existingText,
            context,
            max_length: maxLength,
          }),
        });

        const isJson = (res.headers.get("content-type") || "").includes("application/json");
        const body = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => "");

        if (!res.ok) {
          const message = typeof body === "string" ? body : body?.message;
          throw new Error(message || `AI request failed (${res.status})`);
        }

        return textToHtml(body.text);
      } finally {
        setIsGenerating(false);
      }
    },
    [baseURL]
  );

  return { generateText, isGenerating };
}
