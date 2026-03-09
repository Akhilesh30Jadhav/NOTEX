import { useState } from "react";
import { GradientButton } from '@/components/ui/gradient-button';

export default function FileList({ files = [], color = "#1e293b" }) {
  const [open, setOpen] = useState(false);
  if (!files || files.length === 0) return null;

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <GradientButton
        onClick={() => setOpen(o => !o)}
        variant="variant"
        className="px-3 py-1.5 min-w-0 text-xs"
      >
        {open ? "Hide files" : `More files (${files.length})`}
      </GradientButton>

      {open && (
        <div
          style={{
            marginTop: 10,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {files.map((f, i) => (
            <div
              key={f.path || i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderTop: i === 0 ? "none" : "1px solid #eef2f7",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                {f.title || (f.path?.split("/").pop() ?? "File")}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a
                  href={f.path}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "6px 10px",
                    background: "#fff",
                    color,
                    border: `2px solid ${color}`,
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  View
                </a>
                <a
                  href={f.path}
                  download
                  style={{
                    padding: "6px 10px",
                    background: color,
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
