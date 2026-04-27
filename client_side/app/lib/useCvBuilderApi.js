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

  const errorBody = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => "");
  const message =
    typeof errorBody === "string"
      ? errorBody
      : (errorBody?.message || JSON.stringify(errorBody, null, 2));

  throw new Error(message || `Request failed (${res.status})`);
}

export function useCvBuilderApi() {
  const baseURL = process.env.NEXT_PUBLIC_API_URL; // e.g. http://localhost:8000/api

  const request = useCallback(
    async (path, options = {}) => {
      if (!baseURL) {
        throw new Error("NEXT_PUBLIC_API_URL is not set");
      }

      const url = joinUrl(baseURL, path);

      const res = await fetch(url, {
        // If you use Laravel Sanctum (cookies), keep credentials include:
        credentials: "include",
        ...options,
      });

      return parseResponse(res);
    },
    [baseURL]
  );

  const getCv = useCallback((id) => request(`/cvs/${id}/`), [request]);

  const createCv = useCallback(
    (payload) =>
      request(`/cvs/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    [request]
  );

  const updateCv = useCallback(
    (id, payload) =>
      request(`/cvs/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    [request]
  );

  const parseCvFile = useCallback(
    (file) => {
      const formData = new FormData();
      formData.append("file", file);

      return request(`/cvs/parse`, {
        method: "POST",
        body: formData,
        // DO NOT set Content-Type for FormData; browser sets boundary
      });
    },
    [request]
  );

  return { getCv, createCv, updateCv, parseCvFile };
}