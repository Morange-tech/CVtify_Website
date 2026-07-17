"use client";

import { useCallback } from "react";

function joinUrl(base, path) {
  const b = (base || "").replace(/\/+$/, "");
  const p = (path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
}

async function parseResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (res.ok) return isJson ? res.json() : res.text();

  const errorBody = isJson
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");
  const message =
    typeof errorBody === "string"
      ? errorBody
      : errorBody?.message || JSON.stringify(errorBody, null, 2);

  throw new Error(message || `Request failed (${res.status})`);
}

export function useLetterBuilderApi() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  const request = useCallback(
    async (path, options = {}) => {
      if (!baseURL) throw new Error("NEXT_PUBLIC_API_URL is not set");

      const url = joinUrl(baseURL, path);
      const token = localStorage.getItem("token");

      if (!token) throw new Error("No authentication token found");

      const res = await fetch(url, {
        ...options,
        headers: {
          Accept: "application/json",
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      });

      return parseResponse(res);
    },
    [baseURL]
  );

  const getLetter = useCallback(
    (id) => request(`/motivation-letters/${id}`).then((res) => res?.data ?? res),
    [request]
  );

  const createLetter = useCallback(
    (payload) =>
      request("/motivation-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((res) => res?.data ?? res),
    [request]
  );

  const updateLetter = useCallback(
    (id, payload) =>
      request(`/motivation-letters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((res) => res?.data ?? res),
    [request]
  );

  const exportDocx = useCallback(
    async (id) => {
      const url = joinUrl(baseURL, `/motivation-letters/${id}/export-docx`);
      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("DOCX export failed");
      return res.blob();
    },
    [baseURL]
  );

  return { getLetter, createLetter, updateLetter, exportDocx };
}
