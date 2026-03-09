import { useState } from 'react';
import { GradientButton } from '@/components/ui/gradient-button';

export default function FileUpload({ onSubmit }) {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    year: '',
    department: '',
    category: 'Notes',
    tags: ''
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    if (!file) return alert('Select a file');
    onSubmit({ ...form, file });
  };

  return (
    <form onSubmit={submit} className="card" style={{ display: 'grid', gap: 10 }}>
      <input name="title" placeholder="Title" value={form.title} onChange={handle} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handle} />
      <input name="subject" placeholder="Subject" value={form.subject} onChange={handle} required />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <input name="year" placeholder="Year (1-6)" type="number" value={form.year} onChange={handle} required />
        <input name="department" placeholder="Department" value={form.department} onChange={handle} required />
      </div>
      <select name="category" value={form.category} onChange={handle}>
        <option value="Notes">Notes</option>
        <option value="PYQ">PYQ</option>
        <option value="Syllabus">Syllabus</option>
        <option value="Assignment">Assignment</option>
        <option value="Other">Other</option>
      </select>
      <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handle} />
      <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={(e) => setFile(e.target.files[0])} />
      <GradientButton type="submit">Upload</GradientButton>
    </form>
    );
}
