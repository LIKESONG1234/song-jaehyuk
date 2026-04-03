import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Briefcase, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Cpu, 
  Settings, 
  ChevronRight,
  LogOut,
  Save,
  Plus,
  Trash2,
  Lock
} from "lucide-react";

interface Profile {
  name: string;
  birth: string;
  education: string;
  role: string;
  certifications: string[];
}

interface Competency {
  title: string;
  items: string[];
}

interface Project {
  title: string;
  period: string;
  role: string;
  achievements: string[];
}

interface Contact {
  phone: string;
  email: string;
  address: string;
}

interface PortfolioData {
  profile: Profile;
  competencies: Competency[];
  projects: Project[];
  values: string[];
  contact: Contact;
}

export default function App() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [editData, setEditData] = useState<PortfolioData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setEditData(d);
      })
      .catch((err) => {
        console.error("Failed to fetch portfolio:", err);
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "12345") {
      setIsAdmin(true);
      setLoginError("");
    } else {
      setLoginError("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleSave = async () => {
    if (!editData) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "12345", data: editData }),
      });
      if (res.ok) {
        setData(editData);
        alert("저장되었습니다.");
      } else {
        alert("저장에 실패했습니다.");
      }
    } catch (error) {
      alert("오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!data) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">Loading...</div>;

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" /> 관리자 패널
            </h1>
            <div className="flex gap-4">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {isSaving ? "저장 중..." : "저장하기"}
              </button>
              <button 
                onClick={() => setIsAdmin(false)}
                className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-300 transition-colors"
              >
                <LogOut className="w-4 h-4" /> 로그아웃
              </button>
            </div>
          </div>

          <div className="space-y-12">
            {/* Profile Edit */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><User className="w-5 h-5" /> 인적 사항</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">성명</label>
                  <input 
                    type="text" 
                    value={editData?.profile.name} 
                    onChange={(e) => setEditData(prev => prev ? {...prev, profile: {...prev.profile, name: e.target.value}} : null)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">생년월일</label>
                  <input 
                    type="text" 
                    value={editData?.profile.birth} 
                    onChange={(e) => setEditData(prev => prev ? {...prev, profile: {...prev.profile, birth: e.target.value}} : null)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-600 mb-1">학력</label>
                  <input 
                    type="text" 
                    value={editData?.profile.education} 
                    onChange={(e) => setEditData(prev => prev ? {...prev, profile: {...prev.profile, education: e.target.value}} : null)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-600 mb-1">핵심 직무</label>
                  <textarea 
                    value={editData?.profile.role} 
                    onChange={(e) => setEditData(prev => prev ? {...prev, profile: {...prev.profile, role: e.target.value}} : null)}
                    className="w-full p-2 border rounded h-20"
                  />
                </div>
              </div>
            </section>

            {/* Projects Edit */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2"><Briefcase className="w-5 h-5" /> 주요 프로젝트</h2>
                <button 
                  onClick={() => setEditData(prev => prev ? {...prev, projects: [...prev.projects, {title: "새 프로젝트", period: "", role: "", achievements: [""]}]} : null)}
                  className="text-violet-600 flex items-center gap-1 hover:underline"
                >
                  <Plus className="w-4 h-4" /> 추가
                </button>
              </div>
              <div className="space-y-6">
                {editData?.projects.map((project, idx) => (
                  <div key={idx} className="p-4 border rounded-lg relative group">
                    <button 
                      onClick={() => setEditData(prev => prev ? {...prev, projects: prev.projects.filter((_, i) => i !== idx)} : null)}
                      className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-600 mb-1">프로젝트명</label>
                        <input 
                          type="text" 
                          value={project.title} 
                          onChange={(e) => {
                            const newProjects = [...(editData?.projects || [])];
                            newProjects[idx].title = e.target.value;
                            setEditData(prev => prev ? {...prev, projects: newProjects} : null);
                          }}
                          className="w-full p-2 border rounded font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">기간</label>
                        <input 
                          type="text" 
                          value={project.period} 
                          onChange={(e) => {
                            const newProjects = [...(editData?.projects || [])];
                            newProjects[idx].period = e.target.value;
                            setEditData(prev => prev ? {...prev, projects: newProjects} : null);
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">역할</label>
                        <input 
                          type="text" 
                          value={project.role} 
                          onChange={(e) => {
                            const newProjects = [...(editData?.projects || [])];
                            newProjects[idx].role = e.target.value;
                            setEditData(prev => prev ? {...prev, projects: newProjects} : null);
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1">주요 성과</label>
                      {project.achievements.map((ach, achIdx) => (
                        <div key={achIdx} className="flex gap-2 mb-2">
                          <input 
                            type="text" 
                            value={ach} 
                            onChange={(e) => {
                              const newProjects = [...(editData?.projects || [])];
                              newProjects[idx].achievements[achIdx] = e.target.value;
                              setEditData(prev => prev ? {...prev, projects: newProjects} : null);
                            }}
                            className="flex-1 p-2 border rounded text-sm"
                          />
                          <button 
                            onClick={() => {
                              const newProjects = [...(editData?.projects || [])];
                              newProjects[idx].achievements = newProjects[idx].achievements.filter((_, i) => i !== achIdx);
                              setEditData(prev => prev ? {...prev, projects: newProjects} : null);
                            }}
                            className="text-red-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newProjects = [...(editData?.projects || [])];
                          newProjects[idx].achievements.push("");
                          setEditData(prev => prev ? {...prev, projects: newProjects} : null);
                        }}
                        className="text-xs text-violet-500 hover:underline mt-1"
                      >
                        + 성과 추가
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Edit */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Mail className="w-5 h-5" /> 연락처</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">전화번호</label>
                  <input 
                    type="text" 
                    value={editData?.contact.phone} 
                    onChange={(e) => setEditData(prev => prev ? {...prev, contact: {...prev.contact, phone: e.target.value}} : null)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">이메일</label>
                  <input 
                    type="text" 
                    value={editData?.contact.email} 
                    onChange={(e) => setEditData(prev => prev ? {...prev, contact: {...prev.contact, email: e.target.value}} : null)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">주소</label>
                  <input 
                    type="text" 
                    value={editData?.contact.address} 
                    onChange={(e) => setEditData(prev => prev ? {...prev, contact: {...prev.contact, address: e.target.value}} : null)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-violet-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-violet-600/20">
              SJ
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">SONG JAE HYEOK</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-violet-600 transition-colors">About</a>
            <a href="#competencies" className="hover:text-violet-600 transition-colors">Competencies</a>
            <a href="#projects" className="hover:text-violet-600 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-violet-600 transition-colors">Contact</a>
            <button 
              onClick={() => {
                const pass = prompt("관리자 비밀번호를 입력하세요.");
                if (pass === "12345") setIsAdmin(true);
              }}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 text-xs font-bold tracking-widest uppercase mb-6">
              <Cpu className="w-3 h-3" /> 5G Wireless Communication Expert
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
              5G 통신단말 RF 검증 및 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
                테스트 자동화 엔지니어
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              {data.profile.role}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-slate-200 pt-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-800">
                  <User className="w-5 h-5 text-violet-600" />
                  <span className="font-semibold">{data.profile.name}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-600">{data.profile.birth}</span>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
                  <span>{data.profile.education}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.profile.certifications.map((cert, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-700">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Competencies */}
      <section id="competencies" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Core Competencies</h2>
              <p className="text-slate-600 max-w-xl">
                5G NR 기술의 정밀한 검증과 효율적인 테스트 프로세스 구축을 위한 핵심 역량입니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.competencies.map((comp, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-violet-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-violet-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-600/20 transition-colors">
                  {i === 0 ? <ShieldCheck className="w-6 h-6 text-violet-600" /> : <Settings className="w-6 h-6 text-violet-600" />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">{comp.title}</h3>
                <ul className="space-y-4">
                  {comp.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                      <ChevronRight className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Project Experience</h2>
            <p className="text-slate-600">썬더소프트코리아 연구원 재직 중 수행한 주요 프로젝트 성과입니다.</p>
          </div>

          <div className="space-y-12">
            {data.projects.map((project, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-8 border-l-2 border-slate-200 hover:border-violet-600 transition-colors py-4"
              >
                <div className="absolute left-[-9px] top-6 w-4 h-4 rounded-full bg-white border-2 border-slate-200 group-hover:border-violet-600" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{project.title}</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-violet-600 font-medium">{project.role}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{project.period}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {project.achievements.map((ach, j) => (
                    <div key={j} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm">
                      <Award className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                      {ach}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-violet-600/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-16">업무 강점 및 직업관</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data.values.map((val, i) => {
              const [title, desc] = val.split(": ");
              return (
                <div key={i} className="space-y-4">
                  <h4 className="text-lg font-bold text-violet-600">{title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact */}
      <footer id="contact" className="py-24 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-8">Let's Connect</h2>
              <p className="text-slate-600 mb-12 max-w-md">
                5G 무선통신 검증 및 자동화 솔루션에 대한 전문적인 협업이 필요하시다면 언제든 연락 주세요.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
                    <Phone className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Phone</div>
                    <div className="text-slate-900 font-medium">{data.contact.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
                    <Mail className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Email</div>
                    <div className="text-slate-900 font-medium">{data.contact.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
                    <MapPin className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Location</div>
                    <div className="text-slate-900 font-medium">{data.contact.address}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 bg-violet-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-violet-600/20">
                <Cpu className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Song Jae Hyeok</h3>
              <p className="text-slate-600 text-sm mb-8">
                5G NR RF Verification & <br /> Test Automation Engineer
              </p>
              <div className="text-xs text-slate-500">
                © 2026 Song Jae Hyeok. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
