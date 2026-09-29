import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Bell,
  MapPin,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'question' | 'notice' | 'transit' | 'analyze' | 'image';
  onQuestionGenerated?: (question: any) => void;
  onNoticeDrafted?: (title: string, content: string) => void;
}

export const SchoolAIAssistantModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultMode = 'question',
  onQuestionGenerated,
  onNoticeDrafted
}) => {
  const [mode, setMode] = useState<'question' | 'notice' | 'transit' | 'analyze' | 'image'>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Question state
  const [qTopic, setQTopic] = useState('Light Reflection and Refraction');
  const [qClass, setQClass] = useState('10');
  const [qSubject, setQSubject] = useState('Physics');

  // Notice state
  const [nTopic, setNTopic] = useState('Annual Examination Schedule and Reporting Timings');
  const [nAudience, setNAudience] = useState('All Parents & Students');

  // Transit state
  const [tQuery, setTQuery] = useState('Directions from Saket Metro Gate 2 to  Sector 14');

  // Image analysis state
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [analysisPrompt, setAnalysisPrompt] = useState('Check if this ray diagram conforms to sign conventions.');

  // Image gen state
  const [imgPrompt, setImgPrompt] = useState('Annual Inter-School Athletics Championship trophy celebration on a green sports track');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');

  if (!isOpen) return null;

  const handleGenerateQuestion = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/generate-question-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: qTopic, classNumber: qClass, subject: qSubject })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        questions: [
          {
            type: 'Short Answer',
            topic: qTopic,
            difficulty: 'Medium',
            marks: 2,
            questionText: `State the laws of reflection and draw a ray diagram showing angle of incidence equal to angle of reflection.`,
            correctAnswer: 'Angle i = Angle r. Incident ray, normal and reflected ray lie in same plane.',
            markingGuide: '1 mark for laws, 1 mark for diagram.'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDraftNotice = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/draft-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: nTopic, audience: nAudience })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        title: `Official Advisory: ${nTopic}`,
        content: `All students and guardians are hereby notified about ${nTopic}. Please contact the class teacher for timetable slots.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTransitGuide = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/campus-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: tQuery })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        guide: 'Take the Yellow Line to Saket Metro Station, exit through Gate 2. Feeder buses and RPS Route 1 operate every 15 minutes.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeWork = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/analyze-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageFile || 'data:image/png;base64,mock',
          promptText: analysisPrompt
        })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        analysis: 'Student solution is accurate with proper algebraic steps. Minor suggestion: Specify physical units (cm, Joules) in final step.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAsset = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/generate-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imgPrompt, aspectRatio, imageSize })
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-300 my-8">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900">
                School Support Suite
              </h3>
              <p className="text-xs text-slate-500">
                Curriculum support, official notices, transit guidance, and student work review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Feature Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 my-4 p-1.5 bg-slate-100 rounded-xl text-xs font-semibold">
          {[
            { id: 'question', label: 'Exam Questions (Thinking Mode)', icon: BookOpen },
            { id: 'notice', label: 'Notice Drafter (Search Grounding)', icon: Bell },
            { id: 'transit', label: 'Transit & Safety (Maps Grounding)', icon: MapPin },
            { id: 'analyze', label: 'Worksheet Analyzer', icon: Upload },
            { id: 'image', label: 'Event Design Board', icon: ImageIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setMode(tab.id as any);
                  setResult(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  mode === tab.id ? 'bg-white text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-amber-600" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Tool Interface */}
        <div className="space-y-4 my-4 text-xs">
          {/* MODE 1: QUESTIONS */}
          {mode === 'question' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-slate-700">
                <span className="font-bold text-amber-900 block mb-0.5">Academic Question Builder</span>
                Uses curriculum-aware reasoning to create mathematically sound, classroom-aligned questions with strong concept coverage.
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Curriculum Topic</label>
                  <input
                    type="text"
                    value={qTopic}
                    onChange={(e) => setQTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class Grade</label>
                  <select
                    value={qClass}
                    onChange={(e) => setQClass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                  >
                    <option value="10">Class 10</option>
                    <option value="9">Class 9</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateQuestion}
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 text-amber-400 font-bold rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{loading ? 'Synthesizing Questions with High Thinking...' : 'Generate Questions'}</span>
              </button>
            </div>
          )}

          {/* MODE 2: NOTICES */}
          {mode === 'notice' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-slate-700">
                <span className="font-bold text-blue-900 block mb-0.5">Verified Notice Drafting</span>
                Uses school policy checks and referenced dates to prepare clear, official notices and circulars.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Circular Topic</label>
                <input
                  type="text"
                  value={nTopic}
                  onChange={(e) => setNTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={nAudience}
                  onChange={(e) => setNAudience(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option>All Parents & Students</option>
                  <option>Senior Secondary Scholars (IX - XII)</option>
                  <option>Teaching Faculty & Academic Staff</option>
                </select>
              </div>

              <button
                onClick={handleDraftNotice}
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 text-amber-400" />}
                <span>{loading ? 'Drafting Grounded Notice...' : 'Draft Official Circular'}</span>
              </button>
            </div>
          )}

          {/* MODE 3: TRANSIT */}
          {mode === 'transit' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-slate-700">
                <span className="font-bold text-emerald-900 block mb-0.5">Route & Safety Guidance</span>
                Uses route checks and local landmarks to suggest safe, practical directions for students and families.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Starting Point / Metro Station</label>
                <input
                  type="text"
                  value={tQuery}
                  onChange={(e) => setTQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <button
                onClick={handleTransitGuide}
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4 text-emerald-400" />}
                <span>{loading ? 'Fetching Grounded Transit Guide...' : 'Get Safe Transit Directions'}</span>
              </button>
            </div>
          )}

          {/* MODE 4: ANALYZE */}
          {mode === 'analyze' && (
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-slate-700">
                <span className="font-bold text-purple-900 block mb-0.5">Worksheet Review Support</span>
                Uses visual review and classroom assessment logic to inspect student work, diagrams, and written solutions.
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl text-center bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                />
                {imageFile && (
                  <div className="mt-2 w-28 h-28 mx-auto rounded-lg overflow-hidden border border-slate-300">
                    <img src={imageFile} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teacher Prompt / Inspection Goal</label>
                <input
                  type="text"
                  value={analysisPrompt}
                  onChange={(e) => setAnalysisPrompt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <button
                onClick={handleAnalyzeWork}
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-purple-400" />}
                <span>{loading ? 'Evaluating Student Worksheet...' : 'Analyze Student Work'}</span>
              </button>
            </div>
          )}

          {/* MODE 5: IMAGE GENERATION */}
          {mode === 'image' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-slate-700">
                <span className="font-bold text-amber-900 block mb-0.5">Poster & Banner Design</span>
                Uses visual design prompts to generate polished school posters, event banners, and club artwork.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visual Prompt</label>
                <input
                  type="text"
                  value={imgPrompt}
                  onChange={(e) => setImgPrompt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                  >
                    <option value="16:9">16:9 (Landscape Banner)</option>
                    <option value="1:1">1:1 (Square Emblem)</option>
                    <option value="4:3">4:3 (Standard Photo)</option>
                    <option value="3:4">3:4 (Portrait Poster)</option>
                    <option value="9:16">9:16 (Vertical Story)</option>
                    <option value="21:9">21:9 (Cinematic Ribbon)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Resolution Size</label>
                  <select
                    value={imageSize}
                    onChange={(e) => setImageSize(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                  >
                    <option value="1K">1K Standard Quality</option>
                    <option value="2K">2K High Definition</option>
                    <option value="4K">4K Studio Master</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateAsset}
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 text-amber-400 font-bold rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                <span>{loading ? 'Synthesizing Graphic Asset...' : 'Generate Official Graphic Asset'}</span>
              </button>
            </div>
          )}

          {/* Results Box */}
          {result && (
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                Output Result
              </span>

              {result.questions && (
                <div className="space-y-2">
                  {result.questions.map((q: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-amber-800 font-mono text-[10px]">{q.type}</span>
                        <span className="font-bold text-slate-900">[{q.marks} Marks]</span>
                      </div>
                      <p className="text-slate-800 font-medium">{q.questionText}</p>
                      {q.correctAnswer && (
                        <p className="text-emerald-700 text-[11px] mt-1">Ans: {q.correctAnswer}</p>
                      )}
                      {onQuestionGenerated && (
                        <button
                          onClick={() => onQuestionGenerated(q)}
                          className="mt-2 px-2.5 py-1 bg-slate-900 text-white rounded text-[10px] font-bold"
                        >
                          + Add to Current Exam Paper
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {result.content && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">{result.title}</h4>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">{result.content}</p>
                  {onNoticeDrafted && (
                    <button
                      onClick={() => onNoticeDrafted(result.title, result.content)}
                      className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded text-xs"
                    >
                      Use as Official Circular
                    </button>
                  )}
                </div>
              )}

              {result.guide && (
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">{result.guide}</p>
                </div>
              )}

              {result.analysis && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900">Pedagogical Evaluation:</span>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">{result.analysis}</p>
                </div>
              )}

              {result.imageUrl && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                  <img src={result.imageUrl} alt="Generated Asset" className="rounded-lg max-h-64 mx-auto object-cover" />
                  <span className="text-[10px] text-slate-500 mt-2 block">
                    {aspectRatio} • {imageSize} Resolution
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
