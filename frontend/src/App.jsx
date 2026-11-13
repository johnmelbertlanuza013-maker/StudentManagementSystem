import React, { useCallback, useEffect, useMemo, useState } from 'react';

const initialForm = { fullName: '', email: '', course: 'BSIT', yearLevel: '2', status: 'ACTIVE' };
const email = 'johnmelbertlanuza22@gmail.com';

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
  } catch (_) {
    throw new Error('Cannot reach the API. Start the Express backend and MySQL first.');
  }
  if (response.status === 204) return null;
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `Request failed (HTTP ${response.status}).`);
  return result;
}

function Menu() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container header-inner">
    <a className="brand" href="#home" onClick={() => setOpen(false)}><span className="brand-icon">J.</span> John Melbert <strong>Lanuza</strong></a>
    <button className="mobile-menu" type="button" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(x => !x)}>☰</button>
    <nav className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
      {[['About', 'about'], ['Skills', 'skills'], ['Projects', 'projects'], ['Education', 'education'], ['Student App', 'student-management'], ['Contact', 'contact']].map(([name, anchor]) =>
        <a key={anchor} href={`#${anchor}`} className={anchor === 'student-management' ? 'nav-app' : ''} onClick={() => setOpen(false)}>{name}</a>)}
    </nav>
  </div></header>;
}

function StudentManager() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [connected, setConnected] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await request('/api/health');
      const result = await request('/api/students');
      setStudents(result);
      setConnected(true);
      setError('');
    } catch (err) {
      setConnected(false);
      setError(err.message);
      setStudents([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => students.filter(student =>
    [student.fullName, student.email, student.course].some(value =>
      String(value).toLowerCase().includes(search.trim().toLowerCase()))
  ), [students, search]);

  function change(event) {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  }
  function resetForm() {
    setForm(initialForm);
    setEditId(null);
  }
  async function submit(event) {
    event.preventDefault();
    setNotice('');
    setError('');
    setBusy(true);
    try {
      const body = JSON.stringify({ ...form, yearLevel: Number(form.yearLevel) });
      await request(editId ? `/api/students/${editId}` : '/api/students', {
        method: editId ? 'PUT' : 'POST', body
      });
      setNotice(editId ? 'Student information updated successfully.' : 'New student added successfully.');
      resetForm();
      await load();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  function editStudent(student) {
    setEditId(student.id);
    setForm({
      fullName: student.fullName, email: student.email, course: student.course,
      yearLevel: String(student.yearLevel), status: student.status
    });
    setNotice('Editing a record. Save changes when finished.');
    setError('');
    document.getElementById('student-management')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  async function deleteStudent(student) {
    if (!window.confirm(`Delete ${student.fullName}'s record? This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await request(`/api/students/${student.id}`, { method: 'DELETE' });
      if (editId === student.id) resetForm();
      setNotice('Student record deleted successfully.');
      await load();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  const active = students.filter(student => student.status === 'ACTIVE').length;
  return <section className="student-section section" id="student-management">
    <div className="container">
      <div className="section-tag">04 — FULL-STACK APPLICATION</div>
      <div className="section-lead app-lead"><div><h2>Student <span>Management System.</span></h2><p>A real CRUD project powered by React, Express, Prisma ORM and MySQL.</p></div>
        <div className={`connection ${connected ? 'online' : connected === false ? 'offline' : ''}`} role="status"><i /> {connected === null ? 'Checking database…' : connected ? 'Database connected' : 'Backend offline'}</div>
      </div>
      <div className="architecture" aria-label="System architecture"><span>React frontend</span><b>→</b><span>Express API</span><b>→</b><span>Prisma ORM</span><b>→</b><span>MySQL</span></div>
      <div className="stats"><div className="stat"><span>Total students</span><strong>{connected ? students.length : '—'}</strong></div><div className="stat"><span>Active</span><strong>{connected ? active : '—'}</strong></div><div className="stat"><span>Inactive</span><strong>{connected ? students.length - active : '—'}</strong></div></div>
      {error && <div className="alert error" role="alert">{error}</div>}
      {notice && <div className="alert success" role="status">{notice}</div>}
      <div className="app-grid">
        <div className="app-panel">
          <div className="panel-title"><span className="round-symbol">＋</span><div><h3>{editId ? 'Edit student' : 'Add a student'}</h3><p>{editId ? `Record #${editId}` : 'Enter sample student details below.'}</p></div></div>
          <form onSubmit={submit}>
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" value={form.fullName} onChange={change} placeholder="e.g. Alex Santos" minLength="2" maxLength="100" autoComplete="off" required />
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" value={form.email} onChange={change} placeholder="e.g. alex@example.com" maxLength="150" type="email" autoComplete="off" required />
            <div className="form-row"><div><label htmlFor="course">Course</label><input id="course" name="course" value={form.course} onChange={change} minLength="2" maxLength="80" required /></div>
              <div><label htmlFor="yearLevel">Year level</label><select id="yearLevel" name="yearLevel" value={form.yearLevel} onChange={change}>{[1, 2, 3, 4].map(year => <option key={year} value={year}>{year}</option>)}</select></div></div>
            <label htmlFor="status">Status</label><select id="status" name="status" value={form.status} onChange={change}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select>
            <div className="form-buttons"><button type="submit" className="btn primary" disabled={busy || !connected}>{busy ? 'Saving…' : editId ? 'Save Changes' : '+ Add Student'}</button>
              {editId && <button type="button" className="btn subtle" onClick={resetForm}>Cancel</button>}</div>
          </form>
        </div>
        <div className="app-panel records-panel">
          <div className="panel-title records-header"><span className="round-symbol">▤</span><div><h3>Student records</h3><p>Saved in the MySQL database.</p></div><button type="button" className="refresh" aria-label="Refresh list" onClick={load} disabled={loading || busy}>↻</button></div>
          <div className="search-box"><span>⌕</span><input aria-label="Search students" type="search" placeholder="Search by name, course or email" value={search} onChange={event => setSearch(event.target.value)} /></div>
          <div className="table-wrap"><table><thead><tr><th>Student</th><th>Course</th><th>Year</th><th>Status</th><th>Action</th></tr></thead><tbody>
            {filtered.map(student => <tr key={student.id}><td><strong>{student.fullName}</strong><small>{student.email}</small></td><td>{student.course}</td><td>{student.yearLevel}</td><td><span className={student.status === 'ACTIVE' ? 'status active' : 'status'}>{student.status === 'ACTIVE' ? 'Active' : 'Inactive'}</span></td><td><div className="row-actions"><button type="button" disabled={busy} onClick={() => editStudent(student)}>Edit</button><button type="button" className="danger" disabled={busy} onClick={() => deleteStudent(student)}>Delete</button></div></td></tr>)}
            {!filtered.length && <tr><td className="empty" colSpan="5">{loading ? 'Loading student records…' : !connected ? 'Start the backend and connect MySQL to load records.' : search ? 'No matching students found.' : 'No records yet. Add your first sample student!'}</td></tr>}
          </tbody></table></div>
          <div className="table-foot">Showing {filtered.length} of {students.length} student records</div>
        </div>
      </div>
      <p className="privacy"><strong>Classroom demo:</strong> Use fictional records only. This demo has no user authentication; do not upload real student data or deploy it publicly without adding security.</p>
    </div>
  </section>;
}

function App() {
  return <><Menu /><main>
    <section className="hero" id="home"><div className="container hero-grid"><div className="hero-text"><div className="eyebrow"><span className="pulse" /> BSIT STUDENT · FUTURE WEB DEVELOPER</div><p className="intro">Hello, I'm</p><h1>John Melbert<br /><em>Lanuza.</em></h1><p className="description">I'm an Information Technology student who enjoys learning programming, building useful websites, and understanding how databases work with web applications.</p>
      <div className="hero-actions"><a href="#student-management" className="btn primary">Explore My Student App <span>↗</span></a><a href="#projects" className="btn outline">View Projects</a></div>
      <div className="hero-bottom"><span>📍 Philippines</span><span>✉ {email}</span></div></div><div className="hero-art"><div className="glow glow-one" /><div className="glow glow-two" /><div className="art-circle"><span>JML</span><small>IT STUDENT · DEVELOPER</small></div><div className="float-badge top-badge"><b>✧</b> Creating for the web</div><div className="float-badge bottom-badge"><b>▦</b> Learning database systems</div></div></div></section>

    <section className="section" id="about"><div className="container split"><div><div className="section-tag">01 — ABOUT ME</div><h2>Get to <span>know me.</span></h2></div><div className="body-text"><p>My name is <strong>John Melbert Lanuza</strong>. I am studying Bachelor of Science in Information Technology at Laguna State Polytechnic University, Siniloan Campus.</p><p>I'm building my skills in web development and database programming through hands-on school projects. This portfolio shows what I am learning and includes a functional student management application.</p><div className="tags"><span>Web development</span><span>Database management</span><span>Problem solving</span></div></div></div></section>

    <section className="section tinted" id="skills"><div className="container"><div className="section-tag">02 — MY SKILLS</div><div className="section-lead"><h2>Skills & <span>technologies.</span></h2><p>Tools and concepts I'm studying and practicing.</p></div><div className="feature-grid"><article className="feature-card"><div className="feature-icon">&lt;/&gt;</div><h3>Front-end development</h3><p>Designing responsive websites and user interfaces.</p><div className="tags mini"><span>HTML</span><span>CSS</span><span>JavaScript</span><span>React</span></div></article><article className="feature-card"><div className="feature-icon">{`{ }`}</div><h3>Back-end development</h3><p>Handling requests, creating REST APIs, and processing data.</p><div className="tags mini"><span>Node.js</span><span>Express.js</span><span>REST API</span></div></article><article className="feature-card"><div className="feature-icon">▤</div><h3>Database management</h3><p>Working with structured student records using an ORM.</p><div className="tags mini"><span>MySQL</span><span>Prisma ORM</span><span>CRUD</span></div></article></div></div></section>

    <section className="section" id="projects"><div className="container"><div className="section-tag">03 — MY WORK</div><div className="section-lead"><h2>Featured <span>projects.</span></h2><p>Practice projects that build my technical skills.</p></div><div className="project-grid"><article className="project-card featured"><div className="project-preview"><div className="preview-window"><div className="preview-dots">● ● ●</div><div className="preview-title">STUDENT RECORDS</div><div className="preview-line" /><div className="preview-line shorter" /><div className="preview-cards"><i /><i /><i /></div></div></div><div className="project-copy"><div className="project-number">PROJECT 01 · FULL-STACK WEB APP</div><h3>Student Management System</h3><p>A practical application to create, retrieve, update, delete, and search student records. React communicates with Express and MySQL through Prisma ORM.</p><a href="#student-management" className="project-link">Try the project ↗</a></div></article><article className="project-card simple-project"><div className="simple-art">&lt; portfolio /&gt;</div><div className="project-copy"><div className="project-number">PROJECT 02 · PERSONAL WEBSITE</div><h3>Personal Portfolio</h3><p>A responsive website where I present my background, skills, projects, and contact details.</p><a href="#home" className="project-link">View portfolio ↗</a></div></article></div></div></section>

    <StudentManager />

    <section className="section tinted" id="education"><div className="container"><div className="section-tag">05 — BACKGROUND</div><div className="section-lead"><h2>Education & <span>progress.</span></h2><p>Continuing my journey in Information Technology.</p></div><div className="edu-grid"><div className="education-card"><span className="edu-emoji">🎓</span><div><small>COLLEGE EDUCATION</small><h3>Laguna State Polytechnic University</h3><p>Siniloan Campus<br />Bachelor of Science in Information Technology</p></div></div><div className="education-card"><span className="edu-emoji">✦</span><div><small>ACHIEVEMENTS</small><h3>Learning by doing</h3><p>I'm building experience through academic exercises and web development projects. Certificates can be added here when available.</p></div></div></div></div></section>

    <section className="section contact-section" id="contact"><div className="container"><div className="section-tag">06 — CONTACT</div><div className="contact-card"><div><h2>Let's <span>connect.</span></h2><p>For academic collaboration or future opportunities, you can reach me through email.</p></div><a className="btn primary" href={`mailto:${email}`}>Email me ↗</a></div><div className="contact-meta"><span>✉ {email}</span><span>📍 Philippines</span></div></div></section>
  </main><footer><div className="container footer-inner"><span>© 2026 John Melbert Lanuza. All rights reserved.</span><span>Made with React, Express, Prisma ORM & MySQL</span></div></footer></>;
}

export default App;
