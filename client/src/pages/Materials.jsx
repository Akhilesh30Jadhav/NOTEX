import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import FileList from "../components/FileList";
import { registerMaterials } from "../utils/materialsStore";
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { GradientButton } from '@/components/ui/gradient-button';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';

export default function Materials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [selectedType, setSelectedType] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [searchQuery, selectedType, selectedBranch, selectedYear, selectedSemester]);

  // Fetch user bookmarks
  useEffect(() => {
    if (user) {
      api.get('/bookmarks').then(res => {
        const ids = new Set((res.data || []).map(b => b.material?._id || b.material));
        setBookmarkedIds(ids);
      }).catch(() => {});
    }
  }, [user]);

  // Search autocomplete
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      const matches = materials
        .filter(m => m.title.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q))
        .slice(0, 5)
        .map(m => m.title);
      setSuggestions([...new Set(matches)]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, materials]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleBookmark = async (materialId) => {
    if (!user) return;
    try {
      if (bookmarkedIds.has(materialId)) {
        await api.delete(`/bookmarks/${materialId}`);
        setBookmarkedIds(prev => { const n = new Set(prev); n.delete(materialId); return n; });
      } else {
        await api.post('/bookmarks', { materialId });
        setBookmarkedIds(prev => new Set(prev).add(materialId));
      }
    } catch { /* ignore */ }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      
     
      const materialsData = [
        {
          _id: '1', title: 'Engineering Chemistry', subject: 'ES', branch: 'CSE AIML', year: '1st Year', semester: 'Semester 2', fileType: 'PDF', uploadedBy: { name: 'Admin' }, createdAt: new Date().toISOString(), downloadCount: 12
        },
        {
          _id: '2', title: 'Engineering Mathematics II', subject: 'EM II', branch: 'CSE AIML', year: '1st Year', semester: 'Semester 2', fileType: 'PDF', uploadedBy: { name: 'Admin' }, createdAt: new Date().toISOString(), downloadCount: 8
        },
        {
          _id: '20', title: 'Design and Analysis of Algorithms', subject: 'DAA', branch: 'CSE AIML', year: '2nd Year', semester: 'Semester 3', fileType: 'PDF', uploadedBy: { name: 'Admin' }, createdAt: new Date().toISOString(), downloadCount: 45,
          file: '/materials/DAA-FULL.pdf',
          files: [
            { title: 'DAA_2024', path: '/materials/DAA_2024_MAY.pdf' },
            { title: 'DAA_DEC_2022', path: '/materials/DAA_DEC_2022.pdf' },
            { title: 'DAA LAB MANUAL', path: '/materials/DAA_Labmanual.pdf' },
          ]
        },
        {
          _id: '21', title: 'Database Management System', subject: 'DBMS', branch: 'CSE AIML', year: '2nd Year', semester: 'Semester 3', fileType: 'PDF', uploadedBy: { name: 'Admin' }, createdAt: new Date().toISOString(), downloadCount: 32,
          file: '/materials/QB.pdf',
          files: [
            { title: 'DBMS_MAY_2024', path: '/materials/DBMS_MAY_2024.pdf' },
            { title: 'DBMS_QB', path: '/materials/DBMS_QB.pdf' },
          ]
        },
         {
          _id: '3',
          title: 'Data Structures and Algorithms',
          subject: 'DSA',
          branch: 'CSE AIML',
          year: '1st Year',
          semester: 'Semester 2',
          fileType: 'PDF',
          uploadedBy: { name: '-----' },
          createdAt: new Date().toISOString(),
          downloadCount: 0
        },
        {
          _id: '4',
          title: 'Digital Logic Design',
          subject: 'DLD',
          branch: 'CSE AIML',
          year: '1st Year',
          semester: 'Semester 2',
          fileType: 'PPTX',
          uploadedBy: { name: '----' },
          createdAt: new Date().toISOString(),
          downloadCount: 0
        },
        {
          _id: '5',
          title: 'EC Lab ',
          subject: 'Chemistry',
          branch: 'CSE AIML',
          year: '1st Year',
          semester: 'Semester 2',
          fileType: 'PDF',
          uploadedBy: { name: '----' },
          createdAt: new Date().toISOString(),
          downloadCount: 0
        },
        {
          _id: '6',
          title: 'Data Structures LAB',
          subject: 'DSA LAB',
          branch: 'CSE AIML',
          year: '1st Year',
          semester: 'Semester 2',
          fileType: 'DOCX',
          uploadedBy: { name: '----' },
          createdAt: new Date().toISOString(),
          downloadCount: 0
        },
        {
          _id: '7',
          title: 'DLD LAB',
          subject: 'DLD',
          branch: 'CSE AIML',
          year: '1st Year',
          semester: 'Semester 2',
          fileType: 'PDF',
          uploadedBy: { name: '----' },
          createdAt: new Date().toISOString(),
          downloadCount: 0
        },
        
        
      
        {
          _id: '13',
          title: 'Engineering Mathematics I',
          subject: 'DBMS',
          branch: 'CSE AIML',
          year: '1st Year',
          semester: 'Semester 1',
          fileType: 'PDF',
          uploadedBy: { name: '-----' },
          createdAt: new Date().toISOString(),
          downloadCount: 0
        },
        {
          _id: '14',
          title: 'Engineering Physics ',
          subject: 'EP',
          branch: 'CSE AIML',
          year: '1st Year',
          semester: 'Semester 1',
          fileType: 'PDF',
          uploadedBy: { name: '----' },
          createdAt: new Date().toISOString(),
          downloadCount: 0
        },
        {
          _id: '15',
          title: 'Structured Programming in C',
          subject: 'SP',
          branch: 'CSE AIML',
          year: '1st Year',
          semester: 'Semester 1',
          fileType: 'PDF',
          uploadedBy: { name: '----' },
          createdAt: new Date().toISOString(),
          downloadCount: 0
        },
        {
          _id: '16',
          title: 'Principles of Electronics Engineering',
          subject: 'PEE',
          branch: 'CSE AIML',
          year: '1st Year',
          semester: 'Semester 1',
          fileType: 'PDF',
          uploadedBy: { name: '----' },
          createdAt: new Date().toISOString(),
          downloadCount: 0
        },
        {
          _id: '17',
          title: 'English for Engineers',
          subject: 'EE',
          branch: 'CSE AIML',
          year: '1st Year',
          semester: 'Semester 1',
          fileType: 'PDF',
          uploadedBy: { name: '----' },
          createdAt: new Date().toISOString(),
          downloadCount: 0
        },
        {
          _id: '18',
          title: 'EP - LAB',
          subject: 'EP',
          branch: 'CSE AIML',
          year: '1st Year',
          semester: 'Semester 1',
          fileType: 'PDF',
          uploadedBy: { name: '----' },
          createdAt: new Date().toISOString(),
          downloadCount: 0
        },
        {
          _id: '19',
          title: 'PEE - LAB',
          subject: 'PEE',
          branch: 'CSE AIML',
          year: '1st Year',
          semester: 'Semester 1',
          fileType: 'PDF',
          uploadedBy: { name: '----' },
          createdAt: new Date().toISOString(),
          downloadCount: 0
        },

      ];

      setMaterials(materialsData);
      registerMaterials(materialsData);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const branches = ['CSE', 'CSE AIML', 'CSE AIDS', 'CSE Business Studies'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
  const fileTypes = ['PDF', 'DOCX', 'PPTX', 'TXT'];

  const availableSemesters = selectedYear 
    ? (() => {
        const yearMap = {
          '1st Year': ['Semester 1', 'Semester 2'],
          '2nd Year': ['Semester 3', 'Semester 4'], 
          '3rd Year': ['Semester 5', 'Semester 6'],
          '4th Year': ['Semester 7', 'Semester 8']
        };
        return yearMap[selectedYear] || semesters;
      })()
    : semesters;

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          material.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || material.fileType === selectedType;
    const matchesBranch = !selectedBranch || material.branch === selectedBranch;
    const matchesYear = !selectedYear || material.year === selectedYear;
    const matchesSemester = !selectedSemester || material.semester === selectedSemester;
    return matchesSearch && matchesType && matchesBranch && matchesYear && matchesSemester;
  });

  const accentColor = '#818cf8'; 

  return (
    <div style={{
      minHeight: '100vh',
      color: '#fff',
      padding: isMobile ? '2rem 1rem' : '3rem 2rem',
    }}>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header - Clean & Structural */}
        <div style={{ textAlign: 'left', marginBottom: isMobile ? '2rem' : '3rem', borderBottom: '1px solid #27272a', paddingBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            background: '#18181b',
            borderRadius: '6px',
            border: '1px solid #27272a',
            marginBottom: '1rem',
          }}>
            <span style={{ fontSize: '12px' }}>📚</span>
            <span style={{ 
              color: '#a1a1aa', 
              fontWeight: 600, 
              fontSize: '12px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}>
              D Y PATIL UNIVERSITY
            </span>
          </div>
          
          <h1 style={{
            fontSize: isMobile ? '2rem' : '3rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}>
            Materials <span style={{ color: accentColor }}>Library</span>
          </h1>
          
          <p style={{
            fontSize: '1rem',
            color: '#a1a1aa',
            maxWidth: '600px',
            lineHeight: 1.6,
          }}>
            Access study resources, past papers, and notes. Filter by branch and semester to find exactly what you need.
          </p>
        </div>

        {/* Controls Container - Solid & Boxed */}
        <div style={{
          background: 'rgba(9, 9, 11, 0.8)',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid rgba(39, 39, 42, 0.6)',
          marginBottom: '2rem',
          backdropFilter: 'blur(12px)',
        }}>
          {/* Search Bar with Autocomplete */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative' }} ref={searchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search by title, subject, or keyword..."
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  background: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '6px',
                  fontSize: '15px',
                  color: 'white',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onBlur={(e) => e.target.style.borderColor = '#27272a'}
              />
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#71717a'
              }}>
                🔍
              </div>
              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20,
                  background: '#18181b', border: '1px solid #27272a', borderRadius: '0 0 6px 6px',
                  overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}>
                  {suggestions.map((s, i) => (
                    <div key={i} onClick={() => { setSearchQuery(s); setShowSuggestions(false); }}
                      style={{ padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '0.85rem', color: '#e4e4e7', borderBottom: '1px solid #27272a' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(129,140,248,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filters Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '1rem'
          }}>
            <FilterSelect label="Branch" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} options={['All Branches', ...branches]} />
            <FilterSelect label="Year" value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value); setSelectedSemester(''); }} options={['All Years', ...years]} />
            <FilterSelect label="Semester" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} options={['All Semesters', ...availableSemesters]} />
            <FilterSelect label="File Type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} options={['All Types', ...fileTypes]} />
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || selectedBranch || selectedYear || selectedSemester || selectedType) && (
            <button
              onClick={() => {
                setSearchQuery(''); setSelectedType(''); setSelectedBranch(''); setSelectedYear(''); setSelectedSemester('');
              }}
              style={{
                marginTop: '1.5rem',
                padding: '0.6rem 1.2rem',
                background: '#27272a',
                color: '#e4e4e7',
                border: '1px solid #3f3f46',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: 'fit-content'
              }}
            >
              ✕ Clear Filters
            </button>
          )}
        </div>

        {/* Results Info */}
        {!loading && (
          <div style={{
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px',
            color: '#71717a'
          }}>
            <span>Showing <strong style={{ color: '#fff' }}>{filteredMaterials.length}</strong> resources</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#71717a' }}>
            Loading materials...
          </div>
        ) : (
          <>
            {/* Materials Grid */}
            {filteredMaterials.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredMaterials.map((material) => (
                  <MaterialCard key={material._id} material={material} accentColor={accentColor}
                    isBookmarked={bookmarkedIds.has(material._id)}
                    onToggleBookmark={() => toggleBookmark(material._id)}
                    showBookmark={!!user}
                  />
                ))}
              </div>
            ) : (
              <EmptyState onClear={() => {
                setSearchQuery(''); setSelectedType(''); setSelectedBranch(''); setSelectedYear(''); setSelectedSemester('');
              }} />
            )}
          </>
        )}
      </div>
    </div>
  );
}


function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{
        display: 'block',
        marginBottom: '0.4rem',
        color: '#a1a1aa',
        fontSize: '12px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.02em'
      }}>
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: '0.6rem',
          background: '#09090b', 
          border: '1px solid #27272a',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#e4e4e7',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {options.map((option, index) => (
          <option key={index} value={index === 0 ? '' : option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function MaterialCard({ material, accentColor, isBookmarked, onToggleBookmark, showBookmark }) {
  const [hover, setHover] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  const getFileIcon = (type) => {
    const icons = { 'PDF': '📄', 'DOCX': '📝', 'PPTX': '📊', 'TXT': '📃' };
    return icons[type] || '📎';
  };

  const handleShare = () => {
    const url = `${window.location.origin}/materials/${material._id}/files`;
    if (navigator.share) {
      navigator.share({ title: material.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setShareMsg('Link copied!');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: 'rgba(9, 9, 11, 0.75)',
        border: hover ? `1px solid ${accentColor}` : '1px solid rgba(39, 39, 42, 0.6)',
        borderRadius: '8px',
        padding: '1.5rem',
        transition: 'border-color 0.2s ease',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '180px',
        backdropFilter: 'blur(8px)',
      }}
    >
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
      <div>
        {/* Top Row: Icon + Branch Tag */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#18181b',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            border: '1px solid #27272a'
          }}>
            {getFileIcon(material.fileType)}
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            background: '#18181b',
            color: '#a1a1aa',
            border: '1px solid #27272a',
            borderRadius: '4px',
            textTransform: 'uppercase'
          }}>
            {material.branch}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '0.5rem',
          lineHeight: 1.4
        }}>
          {material.title}
        </h3>

        {/* Metadata Row */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '12px', color: '#a1a1aa', background: '#18181b', padding: '2px 6px', borderRadius: '4px' }}>
            {material.subject}
          </span>
          <span style={{ fontSize: '12px', color: '#a1a1aa', background: '#18181b', padding: '2px 6px', borderRadius: '4px' }}>
            {material.semester}
          </span>
        </div>

        {/* Download Counter + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '11px', color: '#71717a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            ⬇ {material.downloadCount || 0} downloads
          </span>
          <div style={{ flex: 1 }} />
          {showBookmark && (
            <button onClick={(e) => { e.stopPropagation(); onToggleBookmark(); }} title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '2px' }}>
              {isBookmarked ? '🔖' : '📌'}
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); handleShare(); }} title="Share"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '2px', position: 'relative' }}>
            🔗
            {shareMsg && <span style={{ position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', color: '#10b981', whiteSpace: 'nowrap', background: '#18181b', padding: '2px 6px', borderRadius: '4px' }}>{shareMsg}</span>}
          </button>
        </div>
      </div>

      {/* Footer / Actions */}
      <div>
        {Array.isArray(material.files) && material.files.length > 0 ? (
          <Link
            to={`/materials/${material._id}/files`}
            state={{ material }}
            style={{
              display: 'block',
              padding: '0.6rem',
              background: '#ffffff',
              color: '#000000',
              textAlign: 'center',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            View {material.files.length} Files
          </Link>
        ) : (
          <div style={{
            display: 'block',
            padding: '0.6rem',
            background: '#18181b',
            color: '#71717a',
            textAlign: 'center',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            border: '1px solid #27272a',
          }}>
            Coming Soon
          </div>
        )}

        {/* Simple File List Component (Hidden from view but passed) */}
        <div style={{ display: 'none' }}>
           <FileList files={material.files || []} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      border: '1px dashed #27272a',
      borderRadius: '8px',
      color: '#71717a'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📂</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
        No materials found
      </h3>
      <p style={{ fontSize: '14px', marginBottom: '1.5rem' }}>
        Try adjusting your filters to find what you're looking for.
      </p>
      <GradientButton
        onClick={onClear}
        variant="variant"
        className="px-4 py-2 min-w-0 text-sm"
      >
        Clear Filters 
      </GradientButton>
    </div>
  );
}