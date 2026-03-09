import { useMemo, useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getMaterialById } from "../utils/materialsStore";
import { GradientButton } from '@/components/ui/gradient-button';

/* ---------- Pretty title helpers ---------- */
const PRETTY_ACRONYMS = new Set(["DBMS","DSA","OOP","PYQ","CSE","AIML","LAB"]);
const toTitleCase = (s) =>
  s.replace(/\w\S*/g,(w)=>{
    const up = w[0].toUpperCase()+w.slice(1).toLowerCase();
    return PRETTY_ACRONYMS.has(up.toUpperCase()) ? up.toUpperCase() : up;
  });
function prettyTitle(f) {
  const raw = (f && typeof f === "object")
    ? (f.title?.trim() || (f.path?.split("/").pop() ?? ""))
    : String(f ?? "");
  const clean = raw.replace(/\.[^.]+$/,"").replace(/[_\-]+/g," ").replace(/\s+/g," ").trim();
  return toTitleCase(clean).replace(/\bQb\b/g,"QB").replace(/\bPyq\b/g,"PYQ");
}
/* ----------------------------------------- */

/* ---------- Rename specific files here (no data change needed) ---------- */
const TITLE_OVERRIDES = {
  "/materials/QB.pdf": "WEEK-2 Question  Bank",
  "/materials/week3_qb.pdf": "Week 3 – QB",
  "/materials/syllabus_dbms.pdf": "DBMS Syllabus 2025",
};
/* ----------------------------------------------------------------------- */

/* small utils */
const extFromPath = (p="") => (p.split("?")[0].split("#")[0].split(".").pop() || "").toLowerCase();
const iconFor = (p) => {
  const ext = extFromPath(p);
  if (["pdf"].includes(ext)) return "📄";
  if (["doc","docx"].includes(ext)) return "📝";
  if (["ppt","pptx","key"].includes(ext)) return "📊";
  if (["xls","xlsx","csv"].includes(ext)) return "📈";
  if (["zip","rar","7z"].includes(ext)) return "🗜️";
  return "📁";
};
const chipColorFor = (p) => {
  const ext = extFromPath(p);
  if (ext === "pdf") return { bg: "#fee2e2", text: "#991b1b", label: "PDF" };
  if (["doc","docx"].includes(ext)) return { bg: "#e0ecff", text: "#1d4ed8", label: "DOC" };
  if (["ppt","pptx","key"].includes(ext)) return { bg: "#ffe7d1", text: "#9a3412", label: "PPT" };
  if (["xls","xlsx","csv"].includes(ext)) return { bg: "#dcfce7", text: "#166534", label: "XLS" };
  if (["zip","rar","7z"].includes(ext)) return { bg: "#f3e8ff", text: "#6b21a8", label: "ZIP" };
  return { bg: "#e5e7eb", text: "#374151", label: ext.toUpperCase() || "FILE" };
};

export default function MaterialFiles() {
  const { id } = useParams();
  const { state } = useLocation();

  // responsive
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isMobile = vw < 640;       // sm
  const isTablet = vw >= 640 && vw < 1024;

  // get material (state -> sessionStorage -> store)
  const material = useMemo(() => {
    if (state?.material) return state.material;
    try {
      const raw = sessionStorage.getItem("notex_last_material");
      if (raw) {
        const obj = JSON.parse(raw);
        if (String(obj?._id) === String(id)) return obj;
      }
    } catch {}
    return getMaterialById(id);
  }, [state, id]);

  // UI state
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("az"); // az | za
  const [copiedKey, setCopiedKey] = useState(null);

  // Copy helper
  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1200);
    } catch {}
  };

  if (!material) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f1f5f9,#eef2ff)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: "#0f172a" }}>Files</h1>
          <p style={{ color: "#64748b", marginTop: 8 }}>
            Material not found. Open the Materials page once to load items, then try again.
          </p>
          <Link to="/materials" style={styles.backLink(isMobile)}>← Back to Materials</Link>
        </div>
      </div>
    );
  }

  // Build, filter, sort files
  const filesRaw = [
    ...(material.file ? [{ title: material.fileTitle || "Primary", path: material.file, _primary: true }] : []),
    ...(Array.isArray(material.files) ? material.files : [])
  ];
  const files = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = filesRaw.filter((f) => {
      const t = (TITLE_OVERRIDES[f.path] || f.title || prettyTitle(f)).toLowerCase();
      return q === "" || t.includes(q);
    });
    arr = arr.sort((a, b) => {
      const ta = (TITLE_OVERRIDES[a.path] || a.title || prettyTitle(a));
      const tb = (TITLE_OVERRIDES[b.path] || b.title || prettyTitle(b));
      return sort === "az" ? ta.localeCompare(tb) : tb.localeCompare(ta);
    });
    // keep primary on top regardless of sort
    arr.sort((x, y) => ((y._primary ? 1 : 0) - (x._primary ? 1 : 0)));
    return arr;
    // eslint-disable-next-line
  }, [filesRaw, query, sort]);

  const total = filesRaw.length;

  return (
    <div style={styles.pageBg}>
      <div style={styles.shell(isMobile, isTablet)}>
        {/* Hero */}
        <div style={styles.hero}>
          <div style={{ flex: "1 1 auto" }}>
            <div style={styles.breadcrumb(isMobile)}>
              <Link to="/materials" style={styles.crumbLink}>Materials</Link>
              <span style={{ opacity: 0.6, margin: "0 6px" }}>›</span>
              <span style={{ opacity: 0.8 }}>{material.subject}</span>
            </div>
            <h1 style={styles.title(isMobile, isTablet)}>{material.title}</h1>

            <div style={styles.pillsRow}>
              {pill(material.subject)}
              {pill(material.year)}
              {pill(material.semester)}
              {pill(`${total} file${total > 1 ? "s" : ""}`, "#e2e8f0", "#0f172a")}
            </div>
          </div>

          <Link to="/materials" style={styles.backLink(isMobile)}>← Back</Link>
        </div>

        {/* Toolbar */}
        <div style={styles.toolbar(isMobile)}>
          <div style={styles.searchWrap}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files…"
              aria-label="Search files"
              style={styles.searchInput(isMobile)}
            />
            {query && (
              <button onClick={() => setQuery("")} style={styles.clearBtn} aria-label="Clear search">✕</button>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label style={styles.sortLabel(isMobile)}>Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={styles.select(isMobile)}
              aria-label="Sort files"
            >
              <option value="az">Title A–Z</option>
              <option value="za">Title Z–A</option>
            </select>
          </div>
        </div>

        {/* Card */}
        <div style={styles.card}>
          {/* Meta */}
          <div style={styles.metaRow(isMobile)}>
            <span>👤 {material.uploadedBy?.name || "—"}</span>
            <span style={{ margin: "0 8px" }}>•</span>
            <span>{new Date(material.createdAt).toLocaleDateString()}</span>
            <span style={{ margin: "0 8px" }}>•</span>
            <span>📥 {material.downloadCount} downloads</span>
          </div>

          {/* Files */}
          {files.length === 0 ? (
            <div style={{ padding: 20, color: "#64748b" }}>No files match “{query}”.</div>
          ) : files.map((f, i) => {
              const display = TITLE_OVERRIDES[f.path] || f.title || prettyTitle(f);
              const typeChip = chipColorFor(f.path);
              return (
                <div key={f.path || i} style={styles.row(isMobile, i === 0)}>
                  <div style={styles.leftInfo}>
                    <span style={styles.iconBox(isMobile, f._primary)}>{f._primary ? "★" : iconFor(f.path)}</span>

                    <div style={{ minWidth: 0 }}>
                      <div style={styles.fileTitle}>
                        {display}
                      </div>
                      <div style={styles.filePath(isMobile)}>{f.path}</div>
                    </div>

                    {/* file type chip */}
                    <span
                      style={{
                        marginLeft: 8,
                        padding: isMobile ? "2px 8px" : "3px 10px",
                        borderRadius: 999,
                        background: typeChip.bg,
                        color: typeChip.text,
                        fontWeight: 800,
                        fontSize: isMobile ? 10 : 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {typeChip.label}
                    </span>
                  </div>

                  <div style={styles.actions(isMobile)}>
                    <GradientButton
                      onClick={() => copy(new URL(f.path, window.location.origin).toString(), f.path)}
                      variant="variant"
                      className="px-3 py-1.5 min-w-0 text-xs"
                      aria-label="Copy link"
                      title="Copy link"
                    >
                      {copiedKey === f.path ? "Copied!" : "Copy link"}
                    </GradientButton>
                    <a href={f.path} target="_blank" rel="noreferrer" style={styles.btnOutline(isMobile)}>
                      View
                    </a>
                    <a href={f.path} download style={styles.btnSolid(isMobile)}>
                      Download
                    </a>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------- styles -------------------------- */
const styles = {
  pageBg: {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#f1f5f9 0%, #eef2ff 50%, #f8fafc 100%)"
  },
  shell: (isMobile, isTablet) => ({
    maxWidth: isTablet ? 900 : 1100,
    margin: "0 auto",
    padding: isMobile ? "1rem" : "2rem"
  }),
  hero: {
    marginBottom: 14,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    background: "rgba(255,255,255,0.6)",
    border: "1px solid rgba(148,163,184,0.25)",
    borderRadius: 18,
    padding: "18px 16px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
  },
  breadcrumb: (isMobile) => ({
    fontSize: isMobile ? 12 : 13,
    color: "#475569",
    marginBottom: 6,
    display: "flex",
    alignItems: "center"
  }),
  crumbLink: {
    textDecoration: "none",
    color: "#0f172a",
    fontWeight: 700
  },
  title: (isMobile, isTablet) => ({
    margin: 0,
    fontWeight: 900,
    fontSize: isMobile ? 28 : isTablet ? 36 : 44,
    lineHeight: 1.1,
    background: "linear-gradient(135deg,#0f172a,#1e293b)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent"
  }),
  pillsRow: {
    marginTop: 10,
    display: "flex",
    gap: 8,
    flexWrap: "wrap"
  },
  backLink: (isMobile) => ({
    textDecoration: "none",
    fontWeight: 700,
    color: "#334155",
    border: "2px solid #cbd5e1",
    padding: isMobile ? "6px 10px" : "8px 12px",
    borderRadius: 10,
    background: "white"
  }),
  toolbar: (isMobile) => ({
    margin: isMobile ? "10px 0 14px" : "12px 0 16px",
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between"
  }),
  searchWrap: {
    position: "relative",
    flex: "1 1 320px",
    maxWidth: 520
  },
  searchInput: (isMobile) => ({
    width: "100%",
    borderRadius: 12,
    border: "2px solid #e5e7eb",
    padding: isMobile ? "10px 36px 10px 12px" : "12px 42px 12px 14px",
    fontSize: isMobile ? 14 : 15,
    outline: "none",
    background: "white",
    boxShadow: "0 4px 14px rgba(15,23,42,0.05)"
  }),
  clearBtn: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "#e2e8f0",
    color: "#0f172a",
    borderRadius: 8,
    fontWeight: 800,
    padding: "4px 7px",
    cursor: "pointer"
  },
  sortLabel: (isMobile) => ({ color: "#64748b", fontSize: isMobile ? 12 : 13, fontWeight: 700 }),
  select: (isMobile) => ({
    borderRadius: 10,
    border: "2px solid #e5e7eb",
    padding: isMobile ? "8px 10px" : "10px 12px",
    fontWeight: 700,
    background: "white"
  }),
  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(15,23,42,0.06)"
  },
  metaRow: (isMobile) => ({
    padding: isMobile ? "10px 12px" : "14px 16px",
    borderBottom: "1px solid #eef2f7",
    color: "#64748b",
    fontSize: isMobile ? 12 : 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    background: "linear-gradient(180deg,#fff, #f8fafc)"
  }),
  row: (isMobile, first) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: isMobile ? 10 : 14,
    padding: isMobile ? "12px" : "14px 16px",
    borderTop: first ? "none" : "1px solid #eef2f7"
  }),
  leftInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
    flex: "1 1 300px"
  },
  iconBox: (isMobile, primary) => ({
    width: isMobile ? 32 : 36,
    height: isMobile ? 32 : 36,
    borderRadius: 10,
    background: primary ? "linear-gradient(135deg,#fde68a,#facc15)" : "#f8fafc",
    border: primary ? "1px solid #f59e0b" : "1px solid #e5e7eb",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    color: primary ? "#7c2d12" : "#475569",
    flex: "0 0 auto",
    boxShadow: primary ? "inset 0 0 0 1px rgba(124,45,18,0.08)" : "none"
  }),
  fileTitle: {
    fontWeight: 800,
    color: "#0f172a",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100%"
  },
  filePath: (isMobile) => ({ fontSize: isMobile ? 11 : 12, color: "#64748b", wordBreak: "break-all" }),
  actions: (isMobile) => ({
    display: "flex",
    gap: 8,
    width: isMobile ? "100%" : "auto",
    justifyContent: isMobile ? "flex-end" : "flex-start",
    flex: isMobile ? "1 1 100%" : "0 0 auto"
  }),
  btnSolid: (isMobile) => ({
    padding: isMobile ? "8px 10px" : "8px 12px",
    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 800,
    textDecoration: "none",
    boxShadow: "0 10px 22px rgba(109,40,217,0.25)"
  }),
  btnOutline: (isMobile) => ({
    padding: isMobile ? "8px 10px" : "8px 12px",
    background: "#fff",
    color: "#6d28d9",
    border: "2px solid #e9d5ff",
    borderRadius: 10,
    fontWeight: 800,
    textDecoration: "none",
    boxShadow: "0 6px 18px rgba(109,40,217,0.12)"
  }),
  btnGhost: (isMobile) => ({
    padding: isMobile ? "8px 10px" : "8px 12px",
    background: "transparent",
    color: "#334155",
    border: "2px dashed #cbd5e1",
    borderRadius: 10,
    fontWeight: 800,
    textDecoration: "none"
  })
};

function pill(text, bg = "#eef2ff", color = "#3730a3") {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        background: bg,
        color,
        fontWeight: 800,
        fontSize: 12
      }}
    >
      {text}
    </span>
  );
}
