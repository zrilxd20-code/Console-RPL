import React, { useState, useEffect, useMemo } from 'react';
import { triggerConfetti } from './utils/confetti';
import { INITIAL_PROJECTS } from './data/initialProjects';
import Navbar from './components/Navbar';
import StatsHero from './components/StatsHero';
import FilterBar from './components/FilterBar';
import ProjectCard from './components/ProjectCard';
import ProjectDetailModal from './components/ProjectDetailModal';
import SubmitProjectModal from './components/SubmitProjectModal';
import GuideModal from './components/GuideModal';
import IdeaGeneratorModal from './components/IdeaGeneratorModal';
import Footer from './components/Footer';
import { PlusIcon, BookOpenIcon, SparklesIcon } from './components/Icons';
import { validateAndSanitizeProject } from './utils/security';
import { 
  fetchProjectsFromSupabase, 
  insertProjectToSupabase, 
  updateProjectInSupabase, 
  deleteProjectFromSupabase, 
  updateStarsInSupabase,
  isSupabaseConfigured 
} from './utils/supabase';

const STORAGE_KEY_PROJECTS = 'rpl10_showcase_clean_v3';
const STORAGE_KEY_STARS = 'rpl10_showcase_stars_v3';
const STORAGE_KEY_THEME = 'rpl10_showcase_theme';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  });

  // Projects State
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(validateAndSanitizeProject).filter(Boolean);
        }
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
    return INITIAL_PROJECTS;
  });

  // Cloud State
  const [isCloudConnected, setIsCloudConnected] = useState(isSupabaseConfigured());
  const [isLoadingCloud, setIsLoadingCloud] = useState(false);

  // Starred IDs
  const [starredIds, setStarredIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STARS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [sortBy, setSortBy] = useState('stars'); // 'stars', 'latest', 'title'

  // Modal States
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isIdeaOpen, setIsIdeaOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // Persist projects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error("Could not persist projects", e);
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        alert("Penyimpanan browser penuh. Sebagian gambar mungkin berukuran terlalu besar. Disarankan untuk mengekspor data JSON.");
      }
    }
  }, [projects]);

  // Sync with Supabase on initial load
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let isMounted = true;
    async function loadCloudData() {
      setIsLoadingCloud(true);
      try {
        const cloudProjects = await fetchProjectsFromSupabase();
        if (isMounted && Array.isArray(cloudProjects)) {
          if (cloudProjects.length > 0) {
            setProjects(cloudProjects);
          }
          setIsCloudConnected(true);
        }
      } catch (err) {
        console.warn("Could not sync from Supabase:", err);
      } finally {
        if (isMounted) setIsLoadingCloud(false);
      }
    }

    loadCloudData();
    return () => { isMounted = false; };
  }, []);

  // Persist stars
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STARS, JSON.stringify(starredIds));
    } catch (e) {}
  }, [starredIds]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toggle Star
  const handleToggleStar = async (projectId) => {
    const isAlreadyStarred = starredIds.includes(projectId);
    let newStars = 1;

    if (!isAlreadyStarred) {
      try {
        triggerConfetti({ particleCount: 25, spread: 45 });
      } catch (e) {}
      setStarredIds(prev => [...prev, projectId]);
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          newStars = (p.stars || 0) + 1;
          return { ...p, stars: newStars };
        }
        return p;
      }));
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(prev => ({ ...prev, stars: (prev.stars || 0) + 1 }));
      }
    } else {
      setStarredIds(prev => prev.filter(id => id !== projectId));
      setProjects(prev => prev.map(p => {
        if (p.id === projectId) {
          newStars = Math.max(0, (p.stars || 0) - 1);
          return { ...p, stars: newStars };
        }
        return p;
      }));
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(prev => ({ ...prev, stars: Math.max(0, (prev.stars || 0) - 1) }));
      }
    }

    if (isSupabaseConfigured()) {
      updateStarsInSupabase(projectId, newStars);
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  const handleSubmitProject = async (newProj) => {
    setProjects(prev => [newProj, ...prev]);
    try {
      triggerConfetti({ particleCount: 60, spread: 65 });
    } catch (e) {}

    if (isSupabaseConfigured()) {
      try {
        await insertProjectToSupabase(newProj);
      } catch (err) {
        console.warn("Could not sync new project to Supabase:", err);
      }
    }
  };

  const handleUpdateProject = async (updatedProj) => {
    setProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
    if (selectedProject && selectedProject.id === updatedProj.id) {
      setSelectedProject(updatedProj);
    }

    if (isSupabaseConfigured()) {
      try {
        await updateProjectInSupabase(updatedProj);
      } catch (err) {
        console.warn("Could not update project in Supabase:", err);
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(null);
    }

    if (isSupabaseConfigured()) {
      try {
        await deleteProjectFromSupabase(projectId);
      } catch (err) {
        console.warn("Could not delete project from Supabase:", err);
      }
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsSubmitOpen(true);
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `showcase-rpl10-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (importedList) => {
    const existingIds = new Set(projects.map(p => p.id));
    const merged = [...projects];
    importedList.forEach(item => {
      if (!existingIds.has(item.id)) {
        merged.push(item);
      }
    });
    setProjects(merged);
    try {
      triggerConfetti({ particleCount: 40, spread: 50 });
    } catch (e) {}
  };

  const handleResetDefault = () => {
    setProjects([]);
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
  };

  const handleUseIdea = (idea) => {
    setSelectedIdea(idea);
    setIsIdeaOpen(false);
    setIsSubmitOpen(true);
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: projects.length };
    projects.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [projects]);

  // Filter & sort
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesAuthor = p.author?.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        const matchesTech = p.techStack?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesAuthor && !matchesDesc && !matchesTech) return false;
      }

      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedClass !== 'all' && p.studentClass !== selectedClass) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [projects, searchQuery, selectedCategory, selectedClass, sortBy]);

  return (
    <div className="site-wrapper">
      
      {/* Top Navbar */}
      <Navbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenIdea={() => setIsIdeaOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        totalProjects={projects.length}
      />

      <main>
        {/* Clean Hero */}
        <StatsHero 
          projects={projects}
          onOpenSubmit={() => setIsSubmitOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenIdea={() => setIsIdeaOpen(true)}
          isCloudConnected={isCloudConnected}
        />

        {/* Directory Section */}
        <section id="katalog-section" className="container main-content-section">
          
          {/* Filter Bar */}
          <FilterBar 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            sortBy={sortBy}
            setSortBy={setSortBy}
            counts={categoryCounts}
          />

          {/* Project List / Empty State */}
          {projects.length === 0 ? (
            <div className="clean-empty-box">
              <div className="clean-empty-icon-wrap">
                🌐
              </div>
              <h2 className="clean-empty-heading">Belum Ada Proyek yang Didaftarkan</h2>
              <p className="clean-empty-sub">
                Galeri ini masih kosong dan siap menampung karya koding siswa kelas 10 RPL.
                Pastikan websitemu sudah di-hosting (misal di Vercel, Netlify, atau GitHub Pages), lalu daftarkan di sini!
              </p>
              
              <div className="clean-empty-actions">
                <button 
                  type="button" 
                  className="btn-empty-primary"
                  onClick={() => setIsSubmitOpen(true)}
                >
                  <PlusIcon size={16} />
                  <span>Daftarkan Proyek Pertama</span>
                </button>

                <button 
                  type="button" 
                  className="btn-empty-secondary"
                  onClick={() => setIsGuideOpen(true)}
                >
                  <BookOpenIcon size={16} />
                  <span>Panduan Cara Hosting</span>
                </button>

                <button 
                  type="button" 
                  className="btn-empty-ghost"
                  onClick={() => setIsIdeaOpen(true)}
                >
                  <SparklesIcon size={15} />
                  <span>Inspirasi Ide Koding</span>
                </button>
              </div>

              <div className="clean-empty-hints-row">
                <div className="hint-pill-item">
                  <span className="hint-dot"></span>
                  Bisa aplikasi React, Vite, HTML/CSS, Game Canvas, atau Portofolio.
                </div>
                <div className="hint-pill-item">
                  <span className="hint-dot"></span>
                  Cukup kirimkan link hasil hosting + screenshot karya.
                </div>
              </div>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="projects-clean-grid">
              {filteredProjects.map(proj => (
                <ProjectCard 
                  key={proj.id}
                  project={proj}
                  onSelect={handleSelectProject}
                  onEdit={handleEditProject}
                  onToggleStar={handleToggleStar}
                  isStarred={starredIds.includes(proj.id)}
                />
              ))}
            </div>
          ) : (
            <div className="clean-no-results">
              <h3>Tidak ada proyek yang sesuai pencarian</h3>
              <p>Coba gunakan kata kunci lain atau ubah filter kelas/kategori di atas.</p>
              <button 
                type="button" 
                className="btn-reset-simple"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedClass('all');
                }}
              >
                Reset Filter
              </button>
            </div>
          )}

        </section>
      </main>

      {/* Footer */}
      <Footer 
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenIdea={() => setIsIdeaOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
      />

      {/* Modals */}
      {selectedProject && (
        <ProjectDetailModal 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onToggleStar={handleToggleStar}
          isStarred={starredIds.includes(selectedProject.id)}
        />
      )}

      {isSubmitOpen && (
        <SubmitProjectModal 
          onClose={() => {
            setIsSubmitOpen(false);
            setSelectedIdea(null);
            setEditingProject(null);
          }}
          onSubmitProject={handleSubmitProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
          onResetDefault={handleResetDefault}
          initialIdea={selectedIdea}
          initialProject={editingProject}
        />
      )}

      {isGuideOpen && (
        <GuideModal 
          onClose={() => setIsGuideOpen(false)}
        />
      )}

      {isIdeaOpen && (
        <IdeaGeneratorModal 
          onClose={() => setIsIdeaOpen(false)}
          onUseIdea={handleUseIdea}
        />
      )}

    </div>
  );
}
