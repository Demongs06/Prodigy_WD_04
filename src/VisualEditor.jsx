import { useMemo } from "react";

const fields = {
  profile: [
    ["name", "Full name"], ["role", "Professional title"], ["location", "Location"],
    ["availability", "Availability"], ["tagline", "Short introduction", "long"],
    ["bio", "About you", "long"], ["email", "Email", "email"], ["github", "GitHub URL", "url"],
    ["linkedin", "LinkedIn URL", "url"], ["resumeUrl", "Resume URL", "url"],
    ["imageUrl", "Profile photo URL", "url"]
  ],
  skills: [["category", "Category"], ["items", "Skills (one per line)", "list"]],
  experience: [["title", "Role / title"], ["company", "Company"], ["period", "Period"], ["description", "Description", "long"]],
  projects: [["title", "Project name"], ["category", "Project type"], ["description", "Description", "long"], ["stack", "Technologies (one per line)", "list"], ["github", "GitHub URL", "url"], ["live", "Live demo URL", "url"], ["imageUrl", "Project image URL", "url"]],
  certificates: [["title", "Certificate name"], ["issuer", "Issuing organization"], ["date", "Date"], ["url", "Certificate URL", "url"]]
};

const emptyItems = {
  skills: { category: "New skill group", items: [] },
  experience: { title: "", company: "", period: "", description: "" },
  projects: { title: "", category: "Frontend application", description: "", stack: [], github: "", live: "", imageUrl: "" },
  certificates: { title: "", issuer: "", date: "", url: "" }
};

function parse(value) {
  try { return JSON.parse(value); } catch { return null; }
}

export default function VisualEditor({ section, value, onChange }) {
  const data = useMemo(() => parse(value), [value]);
  const isProfile = section === "profile";
  const entries = isProfile ? (data && !Array.isArray(data) ? data : {}) : (Array.isArray(data) ? data : []);
  const valid = data !== null && (isProfile ? typeof data === "object" && !Array.isArray(data) : Array.isArray(data));

  function commit(next) { onChange(JSON.stringify(next, null, 2)); }
  function updateField(index, key, nextValue) {
    if (isProfile) commit({ ...entries, [key]: nextValue });
    else commit(entries.map((entry, i) => i === index ? { ...entry, [key]: nextValue } : entry));
  }
  function addEntry() {
    if (isProfile) return;
    commit([...entries, { ...emptyItems[section] }]);
  }
  function removeEntry(index) {
    if (isProfile) return;
    commit(entries.filter((_, i) => i !== index));
  }

  if (!valid) return <div className="editor-error" role="alert">This section contains invalid or unexpected data. Reload the section before editing.</div>;

  const renderFields = (entry, index) => fields[section].map(([key, label, type]) => {
    const raw = entry?.[key];
    const fieldValue = type === "list" ? (Array.isArray(raw) ? raw.join("\n") : String(raw ?? "")) : String(raw ?? "");
    const update = next => updateField(index, key, type === "list" ? next.split(/[\n,]/).map(x => x.trim()).filter(Boolean) : next);
    return <label className="visual-field" key={key}>
      <span>{label}</span>
      {type === "long" || type === "list"
        ? <textarea rows={type === "list" ? 3 : 4} value={fieldValue} onChange={e => update(e.target.value)} placeholder={type === "list" ? "Add one item per line" : "Write a short description"} />
        : <input type={type === "email" ? "email" : "text"} value={fieldValue} onChange={e => update(e.target.value)} placeholder={label} />}
    </label>;
  });

  return <div className="visual-editor">
    {isProfile
      ? <section className="visual-card profile-fields"><div className="visual-card-heading"><div><small>PUBLIC PROFILE</small><h2>Personal information</h2><p>These details appear in your portfolio introduction and contact section.</p></div></div><div className="visual-fields">{renderFields(entries, 0)}</div></section>
      : <>
        <div className="visual-list-heading"><div><h2>{section[0].toUpperCase() + section.slice(1)} entries</h2><p>Edit each item below. Changes are saved when you click Save changes.</p></div><button type="button" className="btn primary" onClick={addEntry}>＋ Add {section === "skills" ? "skill group" : section === "projects" ? "project" : section === "experience" ? "experience" : "certificate"}</button></div>
        {entries.length ? <div className="visual-card-list">{entries.map((entry, index) => <section className="visual-card" key={index}>
          <div className="visual-card-heading"><div><small>{section.toUpperCase()} / {String(index + 1).padStart(2, "0")}</small><h2>{entry?.title || entry?.category || entry?.company || "New entry"}</h2></div><button type="button" className="remove-entry" onClick={() => removeEntry(index)} aria-label={"Remove " + section + " entry " + (index + 1)}>Remove</button></div>
          <div className="visual-fields">{renderFields(entry, index)}</div>
        </section>)}</div> : <div className="visual-empty"><p>No {section} added yet.</p><button type="button" className="btn" onClick={addEntry}>Add your first {section === "skills" ? "skill group" : section.slice(0, -1)}</button></div>}
      </>}
  </div>;
}
