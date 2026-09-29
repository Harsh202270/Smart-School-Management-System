import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
// import { storage } from './services/storageService';
import { SchoolSettings} from './types/school';

// Public Website Components
import { Navbar } from './components/website/Navbar';
import { HeroSection } from './components/website/HeroSection';
import { AboutSection } from './components/website/AboutSection';
import { AcademicsSection } from './components/website/AcademicsSection';
import { FacilitiesSection } from './components/website/FacilitiesSection';
import { NoticeBoardSection } from './components/website/NoticeBoardSection';
import { EventsSection } from './components/website/EventsSection';
import { CampusGallerySection } from './components/website/CampusGallerySection';
import { ContactSection } from './components/website/ContactSection';
import { Footer } from './components/website/Footer';

// Portal & Login Components
import { LoginPage } from './components/login/LoginPage';
import { StudentPortal } from './components/student/StudentPortal';
import { TeacherPortal } from './components/teacher/TeacherPortal';
import { ManagementPortal } from './components/management/ManagementPortal';
import { SchoolAIAssistantModal } from './components/ai/SchoolAIAssistantModal';

import { Sparkles, Globe, Lock } from 'lucide-react';

function CampusFlowMain() {
  const { user, role, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'website' | 'login' | 'portal'>('website');
  const [activeWebsiteSection, setActiveWebsiteSection] = useState('hero');
  // const [settings, setSettings] = useState<SchoolSettings>(storage.getSettings());
  // const [loadingSettings, setLoadingSettings] = useState(true);
  // const [notices, setNotices] = useState(storage.getNotices());
  // const [events, setEvents] = useState(storage.getEvents());
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [showAiModal, setShowAiModal] = useState(false);

  // Sync settings and notices
  useEffect(() => {
    const fetchSchoolSettings = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/school-settings');

        if (!response.ok) {
          throw new Error('Failed to fetch school settings');
        }

        const result = await response.json();

        if (result.success) {
          setSettings(result.data);
        }
      } catch (error) {
        console.error('School settings API error:', error);
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSchoolSettings();

    // const unsubNotices = storage.subscribe('campusflow_notices', () => {
    //   setNotices(storage.getNotices());
    // });

    // const unsubEvents = storage.subscribe('campusflow_events', () => {
    //   setEvents(storage.getEvents());
    // });

    // return () => {
    //   unsubNotices();
    //   unsubEvents();
    // };
  }, []);

  // When user is authenticated, automatically switch to portal view
  useEffect(() => {
    if (isAuthenticated && role) {
      setCurrentView('portal');
    }
  }, [isAuthenticated, role]);

  const handleNavigateSection = (sectionId: string) => {
    setCurrentView('website');
    setActiveWebsiteSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loadingSettings || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading school information...</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950 ${currentView === 'portal' ? 'h-[100dvh] overflow-hidden flex flex-col' : 'min-h-screen flex flex-col'
        }`}
    >
      {/* Top Session Bar when in Portal mode */}
      {currentView === 'portal' && (
        <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 flex justify-between items-center border-b border-slate-800 shrink-0 z-30">
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Session: <strong className="text-white">{user?.name}</strong> ({user?.badgeTitle})</span>
            </span>
            <button
              onClick={() => setCurrentView('website')}
              className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1 hover:underline ml-2 shrink-0 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" /> Return to Website
            </button>
          </div>
        </div>
      )}

      {/* 1. PUBLIC SCHOOL WEBSITE */}
      {currentView === 'website' && (
        <>
          <Navbar
            settings={settings}
            activeSection={activeWebsiteSection}
            onNavigate={handleNavigateSection}
            onOpenLogin={() => setCurrentView('login')}
          />
          <main className="flex-1">
            <div id="hero">
              <HeroSection
                settings={settings}
                onNavigate={handleNavigateSection}
                onOpenLogin={() => setCurrentView('login')}
              />
            </div>
            <div id="about">
              <AboutSection settings={settings} />
            </div>
            <div id="academics">
              <AcademicsSection />
            </div>
            <div id="facilities">
              <FacilitiesSection />
            </div>
            <div id="notices">
              <NoticeBoardSection notices={notices} />
            </div>
            <div id="events">
              <EventsSection events={events} />
            </div>
            <div id="gallery">
              <CampusGallerySection />
            </div>
            <div id="contact">
              <ContactSection settings={settings} />
            </div>
          </main>
          <Footer
            settings={settings}
            onNavigate={handleNavigateSection}
            onOpenLogin={() => setCurrentView('login')}
          />
        </>
      )}

      {/* 2. DEDICATED LOGIN PAGE */}
      {currentView === 'login' && (
        <LoginPage
          settings={settings}
          onBackToWebsite={() => setCurrentView('website')}
          onLoginSuccess={(_role) => setCurrentView('portal')}
        />
      )}

      {/* 3. AUTHENTICATED PORTALS */}
      {currentView === 'portal' && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {role === 'student' && (
            <StudentPortal onBackToWebsite={() => setCurrentView('website')} />
          )}
          {role === 'teacher' && (
            <TeacherPortal onBackToWebsite={() => setCurrentView('website')} />
          )}
          {role === 'management' && (
            <ManagementPortal onBackToWebsite={() => setCurrentView('website')} />
          )}
          {!role && (
            <LoginPage
              settings={settings}
              onBackToWebsite={() => setCurrentView('website')}
              onLoginSuccess={() => setCurrentView('portal')}
            />
          )}
        </div>
      )}

      {/* Floating Action Button for Gemini Intelligence Suite (only on website & login, not obscuring portal) */}
      {currentView !== 'portal' && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-full shadow-xl border border-amber-500/40 hover:bg-slate-800 transition transform hover:-translate-y-0.5 group cursor-pointer"
            title="Open AI Operations Suite (Thinking, Search, Maps, Vision, Images)"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="hidden sm:inline">AI Operations Suite</span>
          </button>
        </div>
      )}

      {/* AI Assistant Modal */}
      <SchoolAIAssistantModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CampusFlowMain />
    </AuthProvider>
  );
}
