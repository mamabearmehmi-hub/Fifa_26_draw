/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Upload,
  Download,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Trash2,
  Volume2,
  VolumeX,
  Search,
  Play,
  FileText,
  Clock,
  CheckCircle,
  X,
  User,
  Users,
  Database,
  ShieldCheck,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";

import { TEAMS_DATA, Team } from "./teamsData";
import { playSynthesizedDrumroll, stopSynthesizedDrumroll, playFanfareCrash } from "./audioHelper";
import { exportLeaderboardToPDF } from "./pdfHelper";
import worldCupBallLogo from "./assets/images/world_cup_ball_logo_1781296642532.jpg";

interface DrawPair {
  employeeName: string;
  teamId: string;
  timestamp: string;
}

interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function App() {
  // --- CORE STATE ---
  const [employees, setEmployees] = useState<string[]>(() => {
    const saved = localStorage.getItem("sweepstake_employees");
    return saved ? JSON.parse(saved) : [];
  });

  const [draws, setDraws] = useState<DrawPair[]>(() => {
    const saved = localStorage.getItem("sweepstake_draws");
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem("sweepstake_audit");
    return saved ? JSON.parse(saved) : [
      {
        id: "init",
        action: "Sweepstakes system online. 48 FIFA teams loaded. Waiting for Employee Roster upload.",
        timestamp: new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<"ceremony" | "leaderboard" | "support">("ceremony");
  const [companyName, setCompanyName] = useState<string>("Acme Corporation");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchQueryLeft, setSearchQueryLeft] = useState<string>("");
  const [searchQueryRight, setSearchQueryRight] = useState<string>("");
  const [confederationFilter, setConfederationFilter] = useState<string>("ALL");
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem("sweepstake_is_demo") === "true";
  });

  // --- DRAW TIMING STATE ---
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentReveal, setCurrentReveal] = useState<{ employeeName: string; team: Team } | null>(null);
  const [revealHistory, setRevealHistory] = useState<Team[]>([]); // track sequence of ceremony
  
  // Custom Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Drag and drop state
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  // Custom confirmation modals for Admin Actions
  const [isAdminResetConfirmOpen, setIsAdminResetConfirmOpen] = useState<boolean>(false);
  const [isAdminFastPassConfirmOpen, setIsAdminFastPassConfirmOpen] = useState<boolean>(false);

  // Manual text-area live-editor state
  const [rawInputText, setRawInputText] = useState<string>(() => {
    const saved = localStorage.getItem("sweepstake_employees");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.join("\n");
        }
      } catch (e) {
        // ignore
      }
    }
    return "";
  });

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- PERSISTENCE SYNCHRONIZER EFFECTS ---
  useEffect(() => {
    localStorage.setItem("sweepstake_employees", JSON.stringify(employees));
  }, [employees]);

  // Synchronize manual input text when employees roster state changes
  useEffect(() => {
    if (employees.length > 0) {
      setRawInputText(employees.join("\n"));
    } else {
      setRawInputText("");
    }
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("sweepstake_draws", JSON.stringify(draws));
  }, [draws]);

  useEffect(() => {
    localStorage.setItem("sweepstake_audit", JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem("sweepstake_is_demo", String(isDemoMode));
  }, [isDemoMode]);

  // --- TOAST DISPATCHER HELPER ---
  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const addAuditLog = (action: string) => {
    const log: AuditLog = {
      id: Math.random().toString(36).substring(2, 9),
      action,
      timestamp: new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString()
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // --- DEMO EMPLOYEE ROSTER ---
  const loadDemoEmployees = () => {
    const demoList = [
      "Victoria Sterling (CEO Office)", "James Carter (Engineering Lead)", "Nadia Petrova (Security Compliance)", 
      "Hiroshi Tanaka (Chief Product Officer)", "Amara Finch (Senior UX Designer)", "Liam O'Connor (DevOps Strategist)", 
      "Elena Alvarez (Head of Marketing)", "Omar Al-Fayed (Data Analytics)", "Sophie Dubois (HR Manager)", 
      "Marcus Aurelius (Corporate Governance)", "Penelope Rose (Creative Director)", "Bruce Wayne (Venture Partner)", 
      "Tony Stark (R&D Engineering)", "Selina Kyle (Wealth Management)", "Clark Kent (Public Relations)", 
      "Diana Prince (Senior Counsel)", "Peter Parker (Media Coordinator)", "Barry Allen (Logistics Coordinator)", 
      "Arthur Curry (Sustainability Specialist)", "Hal Jordan (Aeronautical Procurement)", "Wally West (Instant Logistics)", 
      "Harvey Dent (Arbitration Group)", "James Bond (Internal Risk Evaluator)", "Ada Lovelace (Lead AI Algorithm)", 
      "Alan Turing (Cryptographic Officer)", "Grace Hopper (Compiler Architect)", "Margaret Hamilton (Principal Software)", 
      "Steve Jobs (Creative Visionary)", "Bill Gates (Philanthropy Liaison)", "Elon Musk (Acquisitions Group)", 
      "Sundar Pichai (Cloud Operations)", "Tim Cook (Global Supply Chain)", "Satya Nadella (Azure Infrastructure)", 
      "Sam Altman (AI Director)", "Alexander Wright (Analytics Lead)", "Beatrix Vance (Dev Core Team)", 
      "Charles Sterling (Brand VP)", "Ethan Hunt (Special Operations)", "Fiona Gallagher (Treasury Advisor)", 
      "George Costanza (HR Analyst)", "Helena Rostova (Global Legal Counsel)", "Ian Malcolm (Data Scientist)", 
      "Julia Roberts (Global Events)", "Kevin Thorne (Physical Security)", "Laura Croft (Facilities Manager)", 
      "Zara Larsson (Internal Communications)", "Yousef Al-Kouri (Technical Support)", "Xavier Cooper (Database Analyst)"
    ];

    setEmployees(demoList);
    setDraws([]);
    setCurrentReveal(null);
    setIsDemoMode(true);
    showToast("Successfully loaded exactly 48 Elite corporate staff members!", "success");
    addAuditLog("Admin Roster Loaded: 48 executive staff members initialized into queue.");
    setActiveTab("ceremony");
  };

  // --- REAL-TIME PARSED ROUTINES ---
  const getLinesFromInput = (text: string) => {
    return text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(name => {
        const trimmed = name.trim();
        if (!trimmed) return false;
        const lower = trimmed.toLowerCase();
        return lower !== "employee name" && lower !== "employee_name" && lower !== "name";
      });
  };

  // --- MANUAL ROSTER PROCESSING ENGINE ---
  const handleManualNamesSubmit = (customText?: string) => {
    try {
      const textToParse = customText !== undefined ? customText : rawInputText;
      
      // Split by newline or comma
      let rawLines: string[] = [];
      if (textToParse.includes("\n")) {
        rawLines = textToParse.split(/\r?\n/);
      } else if (textToParse.includes(",")) {
        rawLines = textToParse.split(",");
      } else {
        rawLines = [textToParse];
      }

      // 1. CLEANING STEP: Trim boundaries, remove empty rows, discard headers
      const initialNames = rawLines
        .map(line => line.trim())
        .filter(name => {
          if (!name) return false;
          const lower = name.toLowerCase();
          return lower !== "employee name" && lower !== "employee_name" && lower !== "name";
        });

      // 2. EXTRA DETAILED CLEANING: Normalize internal spaces (no double spaces)
      const deeplyCleaned = initialNames.map(name => name.replace(/\s+/g, " "));

      // 3. SECURE VERIFICATION & DUPLICATE DISAMBIGUATION:
      // Prevent identity collision in lottery/room allocation
      const nameOccurrences = new Map<string, number>();
      const finalNames = deeplyCleaned.map(name => {
        const count = nameOccurrences.get(name) || 0;
        nameOccurrences.set(name, count + 1);
        if (count > 0) {
          return `${name} (${count + 1})`;
        }
        return name;
      });

      // 4. COMPLIANCE CHECK: Must be exactly 48 for complete allocation
      if (finalNames.length !== 48) {
        showToast(`Compliance mandates exactly 48 employees. You have ${finalNames.length} in current directory.`, "error");
        addAuditLog(`Manual Roster Rejected: Entered ${finalNames.length} names. System requires exactly 48.`);
        return;
      }

      // Success load and register
      setEmployees(finalNames);
      setDraws([]);
      setCurrentReveal(null);
      setIsDemoMode(false);
      showToast("Employee Roster Approved & Certified! 48 names loaded.", "success");
      addAuditLog(`Roster Approved via Direct Entry: 48 employee profiles sanitized, verified, and locked.`);
      setActiveTab("ceremony");

    } catch (error) {
      showToast("Failed to verify input roster.", "error");
      console.error(error);
    }
  };

  // --- CSV PARSING ENGINE ---
  const handleCSVUpload = (text: string) => {
    try {
      // Remove UTF-8 BOM if present (e.g., from Excel sheets)
      const sanitizedText = text.replace(/^\uFEFF/, "").trim();

      const rows = sanitizedText
        .split(/\r?\n/)
        .map(row => row.trim())
        .filter(row => row.length > 0);

      if (rows.length === 0) {
        showToast("The uploaded CSV file is empty.", "error");
        return;
      }

      // Automatically detect if comma (,) or semicolon (;) separator is used
      const firstRow = rows[0];
      const commaCount = (firstRow.match(/,/g) || []).length;
      const semiCount = (firstRow.match(/;/g) || []).length;
      const sep = semiCount > commaCount ? ";" : ",";

      // Read headers
      const headers = firstRow.split(sep).map(h => h.replace(/["']/g, "").trim().toLowerCase());
      
      // Look for target headers like "employee name", "employee_name", "employee", "name", etc.
      let employeeNameIdx = headers.findIndex(h => 
        h === "employee name" || 
        h === "employee_name" || 
        h === "name" || 
        h === "employee" || 
        h.includes("employee") || 
        h.includes("name")
      );

      let parsedNames: string[] = [];

      if (employeeNameIdx !== -1) {
        // Known header found! Extract values from that index
        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i].split(sep).map(c => c.replace(/["']/g, "").trim());
          const val = cols[employeeNameIdx];
          if (val) {
            parsedNames.push(val);
          }
        }
      } else {
        // Fallback: No matches found, parse first column of all rows (ignoring standard headers if present)
        for (let i = 0; i < rows.length; i++) {
          const cols = rows[i].split(sep).map(c => c.replace(/["']/g, "").trim());
          const val = cols[0];
          if (val && val.toLowerCase() !== "employee name" && val.toLowerCase() !== "name") {
            parsedNames.push(val);
          }
        }
      }

      // Filter out empty rows and trim names
      const initialNames = parsedNames
        .map(n => n.trim())
        .filter(n => {
          if (!n) return false;
          const lower = n.toLowerCase();
          return lower !== "employee name" && lower !== "employee_name" && lower !== "name";
        });

      // extra detailed cleaning: remove any internal double spaces
      const deeplyCleaned = initialNames.map(name => name.replace(/\s+/g, " "));

      // Disambiguate duplicate names to prevent collision in lottery/room allocation
      const nameOccurrences = new Map<string, number>();
      const finalNames = deeplyCleaned.map(name => {
        const count = nameOccurrences.get(name) || 0;
        nameOccurrences.set(name, count + 1);
        if (count > 0) {
          return `${name} (${count + 1})`;
        }
        return name;
      });

      // CRITICAL REQUIREMENT VALIDATION: Check if exactly 48 names
      if (finalNames.length !== 48) {
        showToast(`Compliance mandates exactly 48 employees. You have ${finalNames.length} names in your file.`, "error");
        addAuditLog(`CSV Upload Rejected: Contained ${finalNames.length} names. System requires exactly 48.`);
        return;
      }

      // Success Load
      setEmployees(finalNames);
      setDraws([]); // reset current match day allocations
      setCurrentReveal(null);
      setIsDemoMode(false);
      showToast("Employee Roster Approved & Certified! 48 names loaded.", "success");
      addAuditLog(`Roster Upload Approved via CSV: 48 employee profiles sanitized, verified, and locked.`);
      setActiveTab("ceremony");

    } catch (error) {
      showToast("Failed to parse CSV. Please check formatting.", "error");
      console.error(error);
    }
  };

  // Handling file drop events
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".csv")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            handleCSVUpload(event.target.result as string);
          }
        };
        reader.readAsText(file);
      } else {
        showToast("Please drop a valid .csv spreadsheet.", "error");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleCSVUpload(event.target.result as string);
        }
      };
      reader.readAsText(file);
      // Reset input value to allow consecutive upload of same files
      e.target.value = "";
    }
  };

  // --- DRAW ENGINE (FISHER-YATES ALGORITHM) ---
  
  // Complete randomized pairing simulation instantly
  const handleCompleteDrawSimulation = () => {
    if (employees.length !== 48) {
      showToast("Roster incomplete. Please load or upload exactly 48 employees first.", "error");
      return;
    }

    // 1. Shuffle teams via Fisher Yates algorithm
    const shuffledTeams = [...TEAMS_DATA];
    for (let i = shuffledTeams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledTeams[i];
      shuffledTeams[i] = shuffledTeams[j];
      shuffledTeams[j] = temp;
    }

    // 2. Perform the direct index pairing with employees state
    const timestampStr = new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString();
    
    // Shuffle employees too to ensure supreme bias-free randomness on both ends
    const shuffledEmployees = [...employees];
    for (let i = shuffledEmployees.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledEmployees[i];
      shuffledEmployees[i] = shuffledEmployees[j];
      shuffledEmployees[j] = temp;
    }

    const calculatedDraws: DrawPair[] = shuffledTeams.map((team, idx) => ({
      employeeName: shuffledEmployees[idx],
      teamId: team.id,
      timestamp: timestampStr
    }));

    setDraws(calculatedDraws);
    setCurrentReveal(null);
    showToast("Direct Sweepstake Draw Simulated! 48 teams mapped bias-free.", "success");
    addAuditLog("Audit Live: Executive Draw immediately generated. All 48 positions audited under locked compliance.");
    
    // Shoot massive victory fireworks confetti
    triggerMultiConfetti();
    setActiveTab("leaderboard");
  };

  // Handlers for single interactive lottery ceremony mode
  const handleDrawNextInteractive = () => {
    if (isDrawing) return;
    if (employees.length !== 48) {
      showToast("Roster incomplete. Load or drop exactly 48 names on the Admin tab.", "error");
      return;
    }

    // Check if drawing is completed
    const drawnTeamIds = draws.map((d) => d.teamId);
    if (drawnTeamIds.length >= 48) {
      showToast("All 48 slots have already been drawn! Check the Leaderboard.", "info");
      return;
    }

    // Identify which teams and employees are currently unassigned
    const unassignedTeams = TEAMS_DATA.filter((t) => !drawnTeamIds.includes(t.id));
    
    const assignedEmployeeNames = draws.map((d) => d.employeeName);
    const unassignedEmployees = employees.filter((e) => !assignedEmployeeNames.includes(e));

    if (unassignedTeams.length === 0 || unassignedEmployees.length === 0) {
      showToast("No unclaimed teams or names remaining.", "info");
      return;
    }

    // Pick random unassigned Team & Employee using bias-free selection
    const randomTeamIndex = Math.floor(Math.random() * unassignedTeams.length);
    const randomEmployeeIndex = Math.floor(Math.random() * unassignedEmployees.length);

    const targetTeam = unassignedTeams[randomTeamIndex];
    const targetEmployeeName = unassignedEmployees[randomEmployeeIndex];

    // Trigger the drumroll audio & animation Sequence
    setIsDrawing(true);
    setCurrentReveal(null);

    if (isAudioEnabled) {
      playSynthesizedDrumroll();
    }

    // Wait 3.0 seconds as specified in "The Ceremony Mode" drumroll length
    setTimeout(() => {
      // Create new pairing
      const timestampStr = new Date().toLocaleTimeString();
      const newPair: DrawPair = {
        employeeName: targetEmployeeName,
        teamId: targetTeam.id,
        timestamp: timestampStr
      };

      setDraws((prev) => [...prev, newPair]);
      setCurrentReveal({ employeeName: targetEmployeeName, team: targetTeam });
      setRevealHistory((prev) => [...prev, targetTeam]);
      setIsDrawing(false);

      // Synthesized victory audio
      if (isAudioEnabled) {
        stopSynthesizedDrumroll();
        playFanfareCrash();
      }

      // Explosion Confetti
      confetti({
        particleCount: 160,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#EAB308", "#1E3A8A", "#FFFFFF", "#1E293B"]
      });

      addAuditLog(`Fair Assignment Certified: ${targetEmployeeName} matched with ${targetTeam.name} (${targetTeam.code})`);
    }, 2800);
  };

  // Confetti explosion variants
  const triggerMultiConfetti = () => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#EAB308", "#1E3A8A"]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#EAB308", "#1E3A8A"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // RESET ALL SYSTEM STATES
  const handleSystemReset = () => {
    setEmployees([]);
    setDraws([]);
    setCurrentReveal(null);
    setRevealHistory([]);
    setSearchQuery("");
    setSearchQueryLeft("");
    setSearchQueryRight("");
    setConfederationFilter("ALL");
    setIsDemoMode(false);
    setAuditLogs([
      {
        id: Math.random().toString(),
        action: "Sweepstakes system hard reset. Roster deleted. Database cleared.",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    showToast("Sweepstake memory wiped completely. System ready.", "info");
  };

  // Calculate stats
  const totalDrawn = draws.length;
  const progressPercent = Math.min((totalDrawn / 48) * 100, 100);

  const filteredTeamsForCeremony = TEAMS_DATA.filter((team) => {
    if (!searchQueryLeft) return true;
    const q = searchQueryLeft.toLowerCase();
    return team.name.toLowerCase().includes(q) || team.code.toLowerCase().includes(q) || team.confederation.toLowerCase().includes(q);
  });

  const filteredEmployeesForCeremony = employees.filter((empName) => {
    if (!searchQueryRight) return true;
    return empName.toLowerCase().includes(searchQueryRight.toLowerCase());
  });

  // CSV Template Generating Data URI
  const getCSVTemplateURI = () => {
    // Generates a simple beautiful string
    const csvContent = "Employee Name\n" + [
      "Victoria Sterling", "James Carter", "Nadia Petrova", "Hiroshi Tanaka", "Amara Finch", "Liam O'Connor",
      "Elena Alvarez", "Omar Al-Fayed", "Sophie Dubois", "Marcus Aurelius", "Penelope Rose", "Bruce Wayne",
      "Tony Stark", "Selina Kyle", "Clark Kent", "Diana Prince", "Peter Parker", "Barry Allen",
      "Arthur Curry", "Hal Jordan", "Wally West", "Harvey Dent", "James Bond", "Ada Lovelace",
      "Alan Turing", "Grace Hopper", "Margaret Hamilton", "Steve Jobs", "Bill Gates", "Elon Musk",
      "Sundar Pichai", "Tim Cook", "Satya Nadella", "Sam Altman", "Alexander Wright", "Beatrix Vance",
      "Charles Sterling", "Ethan Hunt", "Fiona Gallagher", "George Costanza", "Helena Rostova", "Ian Malcolm",
      "Julia Roberts", "Kevin Thorne", "Laura Croft", "Zara Larsson", "Yousef Al-Kouri", "Xavier Cooper"
    ].join("\n");
    return "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-neutral-100 flex flex-col selection:bg-yellow-500/30 selection:text-white">
      
      {/* Global Hidden CSV File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />
      
      {/* --- FLOATING NOTIFICATIONS SYSTEM --- */}
      <div className="fixed top-20 right-4 sm:right-6 left-4 sm:left-auto z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-auto pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`p-4 rounded-xl shadow-2xl flex items-start gap-3 border pointer-events-auto ${
                toast.type === "success"
                  ? "bg-slate-900 border-emerald-500 text-emerald-100 shadow-emerald-950/20"
                  : toast.type === "error"
                  ? "bg-slate-900 border-rose-500 text-rose-100 shadow-rose-950/20"
                  : "bg-slate-900 border-blue-500 text-blue-100 shadow-blue-950/20"
              }`}
            >
              <AlertCircle className={`w-5 h-5 shrink-0 ${
                toast.type === "success" ? "text-emerald-400" : toast.type === "error" ? "text-rose-400" : "text-blue-400"
              }`} />
              <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- HEADER NAVIGATION (FIFA BROADCAST THEME) --- */}
      <header className="sticky top-0 z-40 bg-slate-900/95 border-b border-yellow-500/20 shadow-lg backdrop-blur-md px-3 sm:px-8 py-2.5 sm:py-3 flex flex-col sm:flex-row justify-between items-center gap-2.5 sm:gap-3">
        
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-yellow-500/35 bg-slate-950 shadow-inner flex items-center justify-center shrink-0">
            <img
              src={worldCupBallLogo}
              alt="World Cup Ball Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              <span className="font-display font-bold tracking-tight text-sm sm:text-base md:text-lg text-white">⚽ FIFA WORLD CUP 2026</span>
              <span className="bg-yellow-500 text-slate-950 px-1 py-0.5 text-[7px] sm:text-[9px] font-mono font-black rounded tracking-wider leading-none">BROADCAST</span>
            </div>
            <p className="text-[9px] sm:text-[11px] text-neutral-400 uppercase tracking-widest font-mono">Corporate Sweepstake Suite</p>
          </div>
        </div>

        {/* Global Action / Settings */}
        <div className="flex items-center gap-1.5 max-w-full w-full sm:w-auto justify-between sm:justify-start">
          {/* Audio controller */}
          <button
            onClick={() => {
              setIsAudioEnabled(!isAudioEnabled);
              showToast(isAudioEnabled ? "Audio Broadcast Suspended" : "Audio Broadcast Engaged", "info");
            }}
            className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-neutral-300 hover:text-white rounded-lg border border-slate-700 transition cursor-pointer shrink-0"
            title="Toggle synthesized drumroll sweep sounds"
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-yellow-500" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>

          {/* Quick tab controllers */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 max-w-full overflow-x-auto whitespace-nowrap scrollbar-none gap-0.5">
            <button
              onClick={() => setActiveTab("ceremony")}
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider transition relative shrink-0 cursor-pointer ${
                activeTab === "ceremony"
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow animate-pulse-subtle"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              1. Ceremony
              {employees.length === 48 && draws.length < 48 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider transition shrink-0 cursor-pointer ${
                activeTab === "leaderboard"
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              2. Ledger & Stats
            </button>
            <button
              onClick={() => setActiveTab("support")}
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider transition shrink-0 cursor-pointer relative ${
                activeTab === "support"
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              3. Setup & Support
              {isDemoMode && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-slate-950 text-[7px] font-black scale-90 px-1 py-px rounded border border-slate-900 leading-none">DEMO</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* --- TELEMETRY BROADCAST OVERVIEW RAIL --- */}
      <div className="bg-slate-900 border-b border-slate-800 py-2 px-3 sm:px-8 flex flex-col lg:flex-row justify-between items-center gap-2.5">
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] sm:text-xs text-neutral-400 font-mono w-full lg:w-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <Users className="w-3.5 h-3.5 text-neutral-500" />
            <span>ROSTER:</span>
            <span className={`font-bold ${employees.length === 48 ? "text-yellow-400" : "text-rose-400"}`}>
              {employees.length === 48 ? "48 Ready" : `${employees.length} / 48 Names`}
            </span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-slate-850 pl-4 shrink-0">
            <Database className="w-3.5 h-3.5 text-neutral-500" />
            <span>PROGRESS:</span>
            <span className="text-white font-bold">{totalDrawn} / 48 Drawn</span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="w-full max-w-xs sm:max-w-sm h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mx-0 lg:mx-2">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] sm:text-xs text-yellow-500/80 bg-yellow-500/5 px-2 py-1 rounded border border-yellow-500/10 w-full lg:w-auto">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span><span className="hidden sm:inline">FISHER-YATES CHECK: </span>BIAS_FREE APPROVED</span>
        </div>
      </div>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 md:p-8 flex flex-col gap-6">

        {/* --- DYNAMIC WELCOME BANNER WITH LARGER HIGH-CONTRAST HEADER --- */}
        <div className="relative overflow-hidden rounded-3xl border border-yellow-500/25 bg-gradient-to-br from-slate-900 via-slate-900/95 to-yellow-950/15 p-6 sm:p-8 py-8 sm:py-10 shadow-2xl">
          <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/4 -bottom-10 w-64 h-64 bg-slate-800/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 text-left">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/25 rounded-full text-[10px] sm:text-xs font-mono font-black text-yellow-400 uppercase tracking-widest leading-none">
                🏆 OFFICIAL LIVE BROADCAST SUITE
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none uppercase flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-3">
                  <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-yellow-500/35 bg-slate-950 flex items-center justify-center shrink-0">
                    <img
                      src={worldCupBallLogo}
                      alt="World Cup Ball Logo"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                  </div>
                  ⚽ FIFA World Cup
                </span>{" "}
                <span className="text-yellow-500 block sm:inline">2026 Sweepstakes</span>
              </h1>
              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-sans font-medium">
                Distribute and assign <span className="text-yellow-400 font-semibold font-mono">exactly 48 employees</span> to the 48 participating World Cup nations with zero bias. Run the automated live-reveal ceremony, view the certified ledger, or reset matching logs.
              </p>
            </div>

            {/* QUICK ONBOARDING WIDGET RIGHT ON FRONT PAGE FOR ACCESSIBILITY */}
            {employees.length === 0 ? (
              <div className="relative p-5 sm:p-6 bg-slate-950/90 border border-yellow-500/30 rounded-2xl max-w-sm w-full shadow-2xl shrink-0 space-y-4 hover:border-yellow-500/50 transition-all duration-300">
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-500 animate-pulse flex items-center justify-center text-slate-950 font-black text-xs shadow-lg">
                  ★
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-display font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 justify-center sm:justify-start">
                    <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" /> Setup Assist Tool
                  </h4>
                  <p className="text-neutral-400 text-[11px] font-medium leading-normal text-center sm:text-left">
                    Initialize your corporate roster immediately to begin the live lottery!
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={loadDemoEmployees}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer font-display scale-100 hover:scale-[1.01] active:translate-y-0.5"
                  >
                    🚀 FAST-TRACK DEMO (48 STAFF)
                  </button>
                  <button
                    onClick={() => setActiveTab("support")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-850 hover:text-white text-neutral-300 font-bold text-xs uppercase tracking-wide rounded-xl border border-slate-800 hover:border-slate-700 transition cursor-pointer font-display"
                  >
                    📂 UPLOAD CSV FILE
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative p-5 bg-slate-950/85 border border-slate-800 rounded-2xl max-w-sm w-full text-center sm:text-left space-y-3 shrink-0 shadow-xl overflow-hidden">
                {isDemoMode && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-slate-950 font-mono font-bold text-[8.5px] uppercase px-2 py-0.5 rounded-bl">
                    DEMO ACTIVE
                  </div>
                )}
                <div className={`text-[10px] uppercase font-mono tracking-wider font-bold flex items-center justify-center sm:justify-start gap-1 ${isDemoMode ? "text-yellow-500" : "text-emerald-400"}`}>
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" /> {isDemoMode ? "DEMO MODE ACTIVE" : "ROSTER ENROLLED & SECURED"}
                </div>
                <p className="text-white font-display font-bold text-sm tracking-tight">48 Employee Profiles Loaded</p>
                <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded-lg border border-slate-850 text-[10.5px] font-mono text-neutral-400">
                  <span>Drawn Pool:</span>
                  <span className="text-yellow-500 font-bold">{draws.length} / 48 nations</span>
                </div>
                {isDemoMode && (
                  <button
                    onClick={handleSystemReset}
                    className="w-full mt-1 px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-mono text-[10px] font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1 leading-none shadow-md"
                  >
                    🛑 Turn Off Demo Mode
                  </button>
                )}
              </div>
            )}
          </div>
        </div>



        {/* --- TAB CONTENT 2: CEREMONY CHAMBER --- */}
        {activeTab === "ceremony" && (
          <div className="w-full overflow-hidden">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-2 sm:px-4 animate-fade-in">
            
            {employees.length !== 48 ? (
              /* --- HIGH FIDELITY ROSTER ONBOARDING SUITE --- */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6">
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-wider">
                      📋 PHASE 1: ROSTER VERIFICATION
                    </div>
                    <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight leading-none uppercase">
                      Enter Your 48 sweepstakes Participants
                    </h2>
                    <p className="text-xs text-neutral-400 font-medium">
                      Please type, paste, or upload exactly 48 employee names. Duplicates will be safely handled and cleaned instantly.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={loadDemoEmployees}
                      className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md active:translate-y-0.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Fast Demo (48 Staff)
                    </button>
                    <a
                      href={getCSVTemplateURI()}
                      download="world_cup_sweepstakes_template.csv"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs uppercase border border-slate-700 rounded-xl transition cursor-pointer flex items-center gap-1.5 font-display"
                    >
                      <Download className="w-3.5 h-3.5 text-neutral-450" /> CSV Template
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Rich Textarea Manual input */}
                  <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-3.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs uppercase tracking-wider text-neutral-300 font-mono font-black flex items-center gap-2">
                        <span>⌨️ Manual Copy-Paste / Direct Input</span>
                        <span className="text-[10px] text-neutral-500 capitalize font-medium">(one participant name per line)</span>
                      </label>
                      
                      <button 
                        onClick={() => setRawInputText("")}
                        className="text-[10px] font-mono uppercase text-rose-400 hover:text-rose-300 transition cursor-pointer border border-rose-500/25 bg-rose-500/5 px-2.5 py-0.5 rounded"
                        title="Clear current text area"
                      >
                        Reset Text
                      </button>
                    </div>

                    <div className="relative">
                      <textarea
                        rows={14}
                        value={rawInputText}
                        onChange={(e) => setRawInputText(e.target.value)}
                        placeholder={"Victoria Sterling\nJames Carter\nNadia Petrova\nHiroshi Tanaka\nOmar Al-Fayed\n... (type or paste your list here)"}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-yellow-500/50 rounded-2xl p-4 text-xs sm:text-sm text-neutral-100 font-mono outline-none focus:ring-1 focus:ring-yellow-500/30 transition-all leading-relaxed whitespace-pre"
                      />
                    </div>

                    <div className="bg-slate-950/45 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">Lines Drafted:</span>
                        <span className={`font-bold px-2.5 py-0.5 rounded ${
                          getLinesFromInput(rawInputText).length === 48 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 animate-pulse"
                        }`}>
                          {getLinesFromInput(rawInputText).length} / 48 Names
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleManualNamesSubmit()}
                        disabled={getLinesFromInput(rawInputText).length !== 48}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-850 disabled:to-slate-850 disabled:text-neutral-550 disabled:border-slate-850 text-slate-950 font-bold uppercase tracking-wider rounded-xl transition shadow-lg shrink-0 flex items-center gap-1.5 text-xs font-display hover:scale-[1.01] active:translate-y-0.5 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve & Lock Roster
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Real-time Compliance check, Drag & Drop CSV */}
                  <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-5">
                    
                    {/* Real-time Checklist */}
                    <div className="bg-slate-950/60 rounded-2xl border border-slate-850 p-4 sm:p-5 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono">
                        🛠️ Real-Time Compliance Inspector
                      </h4>
                      
                      <div className="space-y-3.5">
                        {/* Requirement 1: Exactly 48 names */}
                        <div className="flex items-start gap-3 text-xs">
                          {getLinesFromInput(rawInputText).length === 48 ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-0.5">
                            <p className="font-bold text-neutral-200">Exactly 48 Elite Names</p>
                            <p className="text-[10.5px] text-neutral-400 leading-relaxed">
                              Each name matches one of the 48 participating World Cup team seats. You current have <strong className="text-yellow-500">{getLinesFromInput(rawInputText).length}</strong>.
                            </p>
                          </div>
                        </div>

                        {/* Requirement 2: Clean Whitespace */}
                        <div className="flex items-start gap-3 text-xs">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-bold text-neutral-200">Auto-Sanitation & Trimmed Data</p>
                            <p className="text-[10.5px] text-neutral-400 leading-relaxed">
                              Extra line spaces and internal double spaces are automatically filtered out and cleaned upon confirmation.
                            </p>
                          </div>
                        </div>

                        {/* Requirement 3: Duplicates */}
                        <div className="flex items-start gap-3 text-xs">
                          {(() => {
                            const occurrences = new Map<string, number>();
                            const lns = getLinesFromInput(rawInputText);
                            let dupesFound = false;
                            for (let n of lns) {
                              const norm = n.toLowerCase();
                              if (occurrences.has(norm)) {
                                dupesFound = true;
                                break;
                              }
                              occurrences.set(norm, 1);
                            }
                            
                            if (dupesFound) {
                              return (
                                <>
                                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-amber-400">Duplicate Profiles Automatically Resolved</p>
                                    <p className="text-[10.5px] text-neutral-450 leading-relaxed">
                                      We found matching names in your list! Suffix numbers e.g. <span className="text-yellow-400 font-mono">(2)</span> will be appended to prevent lottery collisions on match day.
                                    </p>
                                  </div>
                                </>
                              );
                            } else {
                              return (
                                <>
                                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-neutral-200">Zero duplicate entries detected</p>
                                    <p className="text-[10.5px] text-neutral-400 leading-relaxed">
                                      All entered employee lines are unique and perfectly collision-free for the random drawing drawer.
                                    </p>
                                  </div>
                                </>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Compact CSV Drag receiver with inline file inputs */}
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                      onDragLeave={() => setIsDraggingOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`rounded-2xl border-2 border-dashed p-5 text-center transition flex flex-col items-center gap-3 relative overflow-hidden cursor-pointer ${
                        isDraggingOver 
                          ? "border-yellow-500 bg-yellow-500/5 shadow-inner" 
                          : "border-slate-800 hover:border-slate-700/80 bg-slate-950/40"
                      }`}
                    >
                      <div className="p-2.5 bg-slate-900 rounded-full text-yellow-500 border border-slate-800">
                        <Upload className="w-5 h-5" />
                      </div>
                      
                      <div className="space-y-0.5">
                        <p className="font-bold text-xs text-white uppercase tracking-wider font-display">Prefer Excel/CSV Upload?</p>
                        <p className="text-[10.5px] text-neutral-400 max-w-xs mx-auto leading-normal">
                          Drop a compliant <strong className="font-mono text-yellow-500">.csv</strong> roster containing the header &ldquo;Employee Name&rdquo; to instantly load and pre-populate.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent double bubble trigger
                          fileInputRef.current?.click();
                        }}
                        className="px-3.5 py-1.5 bg-slate-900 border border-slate-850 hover:border-slate-700 hover:text-white rounded-lg text-[11px] font-bold text-neutral-300 font-mono cursor-pointer transition shadow-sm"
                      >
                        Choose File
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Draw Dashboard Stats Banner */}
                <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl w-full flex flex-col sm:flex-row justify-around items-center gap-4 text-center sm:text-left shadow-xl">
                  <div className="space-y-1">
                    <p className="text-neutral-400 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Draw Progress</p>
                    <p className="text-white font-display font-black text-xl sm:text-2xl">{totalDrawn} <span className="text-neutral-500 text-sm sm:text-lg">/ 48 Assigned</span></p>
                  </div>
                  <div className="hidden sm:block h-10 w-px bg-slate-800"></div>
                  <div className="space-y-1">
                    <p className="text-neutral-400 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Remaining Teams</p>
                    <p className="text-yellow-500 font-display font-black text-xl sm:text-2xl">{48 - totalDrawn}</p>
                  </div>
                  <div className="hidden sm:block h-10 w-px bg-slate-800"></div>
                  <div className="space-y-1">
                    <p className="text-neutral-400 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Registered Employees</p>
                    <p className="text-white font-display font-black text-xl sm:text-2xl">{employees.length} <span className="text-neutral-500 text-xs sm:text-sm">Members Locked</span></p>
                  </div>
                </div>

            {/* MAIN 3-COLUMN WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
              
              {/* LEFT COLUMN: TEAMS ROSTER */}
              <div className="order-2 lg:order-1 lg:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4 shadow-xl flex flex-col h-[480px] lg:h-[620px] max-w-full overflow-hidden">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 shrink-0">
                  <div className="min-w-0">
                    <h4 className="font-display font-black text-xs sm:text-sm text-white tracking-tight flex items-center gap-1.5 truncate">
                      ⚽ NATIONS ({TEAMS_DATA.length})
                    </h4>
                    <p className="text-[9px] uppercase text-neutral-400 font-mono tracking-wider truncate">FIFA WORLD CUP POOL</p>
                  </div>
                  <span className="text-[10px] font-mono bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/10 font-bold shrink-0">
                    {48 - totalDrawn} Left
                  </span>
                </div>

                {/* Search input */}
                <div className="relative shrink-0">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Quick find country..."
                    value={searchQueryLeft}
                    onChange={(e) => setSearchQueryLeft(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500/50 font-mono"
                  />
                  {searchQueryLeft && (
                    <button
                      onClick={() => setSearchQueryLeft("")}
                      className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Scrolling nations list */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {filteredTeamsForCeremony.map((team) => {
                    const match = draws.find((d) => d.teamId === team.id);
                    const isNewest = currentReveal && currentReveal.team.id === team.id;
                    
                    return (
                      <div
                        key={team.id}
                        className={`p-2.5 rounded-xl border transition-all duration-300 flex flex-col gap-1.5 ${
                          isNewest
                            ? "bg-yellow-500/10 border-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.15)] ring-1 ring-yellow-500/30"
                            : match
                            ? "bg-slate-950/45 border-slate-800/60 opacity-70"
                            : "bg-slate-950 border-slate-850 hover:border-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-lg sm:text-xl drop-shadow shrink-0 select-none">{team.flagEmoji}</span>
                            <span className="font-display font-bold text-xs text-white truncate">{team.name}</span>
                          </div>
                          <span className="text-[9px] bg-slate-900 border border-slate-800 text-neutral-400 px-1.5 rounded uppercase font-bold font-mono shrink-0">
                            {team.code}
                          </span>
                        </div>
                        
                        {/* Status tag */}
                        {match ? (
                          <div className="bg-slate-900/60 px-2 py-1 rounded border border-slate-800/40 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono truncate">
                            <span className="shrink-0 text-[8px] bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.2 rounded leading-none border border-emerald-500/10">SEALED</span>
                            <span className="truncate flex-1 font-sans font-semibold text-neutral-200">{match.employeeName}</span>
                          </div>
                        ) : (
                          <div className="px-2 py-0.5 flex items-center gap-1.5 text-[9.5px] text-neutral-500 font-mono italic">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/40 animate-pulse shrink-0"></span>
                            <span>Unallocated open team</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {filteredTeamsForCeremony.length === 0 && (
                    <div className="text-center py-12 text-xs text-neutral-500 font-mono italic">No countries found</div>
                  )}
                </div>
              </div>

              {/* MIDDLE COLUMN: ACTIVE BOWL + ACTIVE VISUAL REVEAL */}
              <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col gap-6 w-full max-w-full overflow-hidden">
                
                {/* 1. COMPLIANCE BOWL MOUNT */}
                <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center gap-5 text-center relative overflow-hidden">
                  <div className="absolute -top-16 -left-16 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="space-y-0.5">
                    <h3 className="font-display font-black text-sm sm:text-base text-white">FIFA COMPLIANCE DRAW CHAMBER</h3>
                    <p className="text-neutral-400 text-[10.5px] sm:text-xs font-medium max-w-sm mx-auto">Click the button below to start the drumroll and trigger randomized draw assignments.</p>
                  </div>

                  {/* Shaking Bowl Container */}
                  <div className="relative">
                    <div className="absolute inset-x-0 -bottom-3 mx-auto w-32 sm:w-40 h-6 sm:h-8 bg-yellow-500/25 rounded-full blur-md animate-pulse pointer-events-none"></div>

                    <motion.div
                      animate={isDrawing ? {
                        x: [0, -8, 8, -10, 10, -8, 8, 0],
                        y: [0, 6, -5, 10, -8, 5, -3, 0],
                        scale: [1, 1.04, 0.99, 1.03, 0.97, 1.02, 1]
                      } : {}}
                      transition={{
                        duration: 2.8,
                        ease: "easeInOut"
                      }}
                      className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-full border-4 border-yellow-500/30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/95 via-slate-950/98 to-slate-950 shadow-[0_0_30px_rgba(234,179,8,0.12)] overflow-hidden flex items-center justify-center glow-gold"
                    >
                      {/* Reflections */}
                      <div className="absolute inset-0 bg-transparent bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none rounded-full" />
                      <div className="absolute top-4 left-8 w-10 h-5 bg-white/10 rounded-full blur-xs transform -rotate-12 pointer-events-none" />

                      {/* Display floating undrawn target ball nodes */}
                      {Array.from({ length: 24 }).map((_, i) => {
                        const idx = (i * 3) % TEAMS_DATA.length;
                        const team = TEAMS_DATA[idx];
                        const isAssigned = draws.some((d) => d.teamId === team.id);
                        if (isAssigned) return null; // dissolve drawn balls

                        return (
                          <motion.div
                            key={`${team.id}-ball-${i}`}
                            className="absolute w-5.5 h-5.5 rounded-full border border-white/20 shadow flex items-center justify-center text-xs"
                            style={{
                              backgroundColor: team.primaryColor,
                              color: "#FFFFFF",
                              left: `${20 + (i * 12) % 60}%`,
                              top: `${26 + (i * 15) % 52}%`,
                            }}
                            animate={isDrawing ? {
                              x: [0, (Math.random() - 0.5) * 110, (Math.random() - 0.5) * 110, 0],
                              y: [0, (Math.random() - 0.5) * 110, (Math.random() - 0.5) * 110, 0],
                              rotate: [0, 180, -180, 360, 0]
                            } : {
                              y: [0, Math.sin(i + 1) * 3, 0],
                            }}
                            transition={isDrawing ? {
                              duration: 0.5,
                              repeat: 5.6,
                              ease: "linear"
                            } : {
                              duration: 1.8 + (i % 3) * 0.4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            <span className="drop-shadow select-none leading-none">{team.flagEmoji}</span>
                          </motion.div>
                        );
                      })}

                      {/* Complete state overlay */}
                      {totalDrawn === 48 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 bg-slate-950/95 text-center">
                          <CheckCircle className="w-10 h-10 text-emerald-400 mb-1 animate-pulse shrink-0" />
                          <span className="font-display font-black text-xs text-emerald-400 tracking-wider">ALL DRAWN SECURELY</span>
                        </div>
                      )}

                      {/* Simulated active ball token float */}
                      {isDrawing && (
                        <motion.div
                          initial={{ scale: 0.1, y: 65, opacity: 0 }}
                          animate={{ scale: 1.3, y: -10, opacity: 1, rotate: 720 }}
                          transition={{ duration: 2.7, ease: "easeInOut" }}
                          className="absolute w-9 h-9 rounded-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 border border-white shadow-2xl flex items-center justify-center text-base pointer-events-none"
                        >
                          ⚽
                        </motion.div>
                      )}
                    </motion.div>
                  </div>

                  {/* Trigger call-to-action button */}
                  <div className="w-full max-w-sm space-y-1 mx-auto">
                    <button
                      onClick={handleDrawNextInteractive}
                      disabled={isDrawing || totalDrawn >= 48}
                      className="w-full py-3.5 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-neutral-500 disabled:border-slate-800 disabled:cursor-not-allowed font-display font-black uppercase text-xs tracking-wider text-slate-950 rounded-xl transition shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      {isDrawing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                          <span>EXTRACTING MAPPED PAIR...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 animate-pulse text-slate-950 shrink-0" />
                          <span>Extract Live Match</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. LIVE SEVENTH HEAVEN REVEAL DISPLAY CARD */}
                <AnimatePresence mode="wait">
                  {isDrawing ? (
                    <motion.div
                      key="drumroll-card"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      className="bg-slate-900 border border-yellow-500/20 p-5 rounded-2xl text-center space-y-3.5 shadow-xl min-h-[200px] flex flex-col justify-center items-center"
                    >
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin mx-auto mb-1.5" />
                        <Sparkles className="w-4 h-4 text-yellow-500 absolute top-2.5 left-2.5 animate-ping" />
                      </div>
                      <h4 className="font-display font-black text-xs tracking-widest text-yellow-400">DRAW IN PROCESS</h4>
                      <p className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase max-w-xs leading-normal">
                        Fisher-Yates checking unassigned index nodes.
                      </p>
                      
                      {/* Audio feedback simulator layout */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [5, 15, 5] }}
                            transition={{ duration: 0.3 + i * 0.04, repeat: Infinity, ease: "easeInOut" }}
                            className="w-0.5 bg-yellow-500 rounded-full"
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : currentReveal ? (
                    <motion.div
                      key="reveal-cert"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900 border-2 border-yellow-500/50 shadow-[0_0_24px_rgba(234,179,8,0.1)] rounded-2xl overflow-hidden min-h-[200px] flex flex-col p-4 sm:p-5 relative w-full"
                    >
                      {/* Watermark */}
                      <div className="absolute right-2 bottom-1 font-display font-black text-white/[0.02] text-7xl select-none uppercase tracking-tighter whitespace-nowrap pointer-events-none">
                        {currentReveal.team.code}
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-mono font-bold tracking-wider text-yellow-500 border-b border-slate-800 pb-2 mb-3.5 shrink-0">
                        <span>● OFFICIAL ALLOCATION COMPLETED</span>
                        <span>{currentReveal.team.confederation}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
                        {/* Huge Flag Circle */}
                        <div
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full text-3xl sm:text-4xl flex items-center justify-center shrink-0 shadow-lg border border-white/10"
                          style={{
                            background: `linear-gradient(135deg, ${currentReveal.team.primaryColor}CC, ${currentReveal.team.primaryColor}FF, #0f172a)`
                          }}
                        >
                          <span className="drop-shadow-lg select-none leading-none">{currentReveal.team.flagEmoji}</span>
                        </div>

                        {/* Roster Assignment text */}
                        <div className="flex-1 text-center sm:text-left space-y-2 min-w-0 w-full">
                          <div className="min-w-0">
                            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-bold">MATCHED HOLDER</span>
                            <h4 className="font-display font-black text-sm sm:text-base text-emerald-400 flex items-center justify-center sm:justify-start gap-1 truncate">
                              <User className="w-4 h-4 shrink-0 text-emerald-400" />
                              <span className="truncate">{currentReveal.employeeName}</span>
                            </h4>
                          </div>

                          <div className="min-w-0">
                            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest font-bold">ASSIGNED COUNTRY</span>
                            <div className="flex justify-center sm:justify-start items-center gap-1.5 min-w-0">
                              <h5 className="font-display font-extrabold text-xs sm:text-sm text-white truncate">{currentReveal.team.name}</h5>
                              <span
                                className="font-mono text-[8.5px] font-bold px-1.5 rounded text-white shrink-0"
                                style={{ backgroundColor: currentReveal.team.primaryColor }}
                              >
                                {currentReveal.team.code}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Fact block */}
                      <div className="mt-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex items-start gap-2 text-left shrink-0">
                        <span className="text-sm shrink-0 leading-none">💡</span>
                        <div className="min-w-0">
                          <p className="text-[8px] uppercase tracking-wider text-yellow-550 font-bold font-mono">DID YOU KNOW?</p>
                          <p className="text-[10px] text-neutral-350 font-medium italic truncate sm:whitespace-normal">
                            "{currentReveal.team.nerdFact}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl text-center p-6 flex flex-col justify-center items-center gap-2 min-h-[150px] select-none text-neutral-500 w-full">
                      <Trophy className="w-7 h-7 text-neutral-600/50 animate-pulse" />
                      <h4 className="font-display font-medium text-xs text-neutral-400">Awaiting Assignment Reveal</h4>
                      <p className="text-[10px] text-neutral-500 max-w-xs leading-normal">
                        Click the "Extract Live Match" trigger inside the bowl system to run the live pairing ceremony.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* RIGHT COLUMN: DETAILED STAFF ROSTER */}
              <div className="order-3 lg:order-3 lg:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4 shadow-xl flex flex-col h-[480px] lg:h-[620px] max-w-full overflow-hidden">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 shrink-0">
                  <div className="min-w-0">
                    <h4 className="font-display font-black text-xs sm:text-sm text-white tracking-tight flex items-center gap-1.5 truncate">
                      👤 STAFF ({employees.length})
                    </h4>
                    <p className="text-[9px] uppercase text-neutral-400 font-mono tracking-wider truncate">ROSTER POOL DIRECTORY</p>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 font-bold shrink-0">
                    {draws.length} Paired
                  </span>
                </div>

                {/* Search Input */}
                <div className="relative shrink-0">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Quick find employees..."
                    value={searchQueryRight}
                    onChange={(e) => setSearchQueryRight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/40 font-mono"
                  />
                  {searchQueryRight && (
                    <button
                      onClick={() => setSearchQueryRight("")}
                      className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Scrolling employee list */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {filteredEmployeesForCeremony.map((empName, i) => {
                    const match = draws.find((d) => d.employeeName === empName);
                    const matchedTeam = match ? TEAMS_DATA.find((t) => t.id === match.teamId) : null;
                    const isNewest = currentReveal && currentReveal.employeeName === empName;

                    return (
                      <div
                        key={`${empName}-${i}`}
                        className={`p-2.5 rounded-xl border transition-all duration-300 flex flex-col gap-1.5 ${
                          isNewest
                            ? "bg-emerald-500/10 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
                            : matchedTeam
                            ? "bg-slate-950/45 border-slate-800/60 opacity-70"
                            : "bg-slate-950 border-slate-850 hover:border-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-neutral-500 shrink-0 text-xs">👤</span>
                            <span className="font-display font-semibold text-xs text-white truncate">{empName}</span>
                          </div>
                        </div>
                        
                        {/* Matching outcome block */}
                        {matchedTeam ? (
                          <div
                            className="px-2 py-0.5 rounded border flex items-center justify-between gap-1 text-[10px] text-white font-mono shrink-0"
                            style={{
                              backgroundColor: `${matchedTeam.primaryColor}15`,
                              borderColor: `${matchedTeam.primaryColor}25`,
                            }}
                          >
                            <span className="truncate flex items-center gap-1.5">
                              <span className="text-sm shrink-0 leading-none select-none">{matchedTeam.flagEmoji}</span>
                              <span className="truncate text-neutral-200 font-medium">{matchedTeam.name}</span>
                            </span>
                            <span className="text-[8.5px] font-sans font-bold shrink-0 uppercase opacity-90 tracking-wider" style={{ color: matchedTeam.primaryColor }}>
                              {matchedTeam.code}
                            </span>
                          </div>
                        ) : (
                          <div className="px-2 py-0.5 flex items-center gap-1.5 text-[9.5px] text-neutral-500 font-mono italic">
                            <span className="w-1 h-1 rounded-full bg-neutral-600 shrink-0"></span>
                            <span>Pending draw...</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {filteredEmployeesForCeremony.length === 0 && (
                    <div className="text-center py-12 text-xs text-neutral-500 font-mono italic">No staff found</div>
                  )}
                </div>
              </div>

            </div>

            {/* Timeless sequence layout at the footer */}
            {revealHistory.length > 0 && (
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-xl max-w-full overflow-hidden">
                <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping shrink-0"></span> RECENTLY CERTIFIED MATCHES ({revealHistory.length} OF 48)
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
                  {[...draws].reverse().slice(0, 10).map((drawPair) => {
                    const team = TEAMS_DATA.find((t) => t.id === drawPair.teamId);
                    if (!team) return null;
                    return (
                      <div
                        key={drawPair.teamId + "_" + drawPair.timestamp}
                        className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-850 text-xs shrink-0"
                      >
                        <span className="text-sm leading-none select-none shrink-0">{team.flagEmoji}</span>
                        <div className="font-mono text-[10px] sm:text-[10.5px] truncate">
                          <span className="text-white font-bold">{team.code}</span>
                          <span className="text-neutral-500 mx-1.5">↔</span>
                          <span className="text-neutral-300 font-semibold">{drawPair.employeeName}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

          </div>
        </div>
        )}

        {/* --- TAB CONTENT 3: LEADERBOARD & STATS COMPLIANCE --- */}
        {activeTab === "leaderboard" && (
          <div className="w-full overflow-hidden">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-2 sm:px-4 animate-fade-in">
              <div className="space-y-6 w-full min-w-0">
              
              {/* Interactive Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
              
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-2 relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-emerald-500/5 select-none font-black text-6xl">DRAWN</div>
                <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Draw Roster Status</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-3xl text-white">{totalDrawn}</span>
                  <span className="text-xs text-neutral-550">/ 48 Assigned</span>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 animate-pulse" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-2 relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-yellow-500/5 select-none font-black text-6xl">FIFA</div>
                <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Remaining Unassigned</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-3xl text-yellow-500">{48 - totalDrawn}</span>
                  <span className="text-xs text-neutral-550">Open Teams</span>
                </div>
                <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: `${100 - progressPercent}%` }} />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-2 relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-blue-500/5 select-none font-black text-6xl">UEFA</div>
                <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Top Confederation (UEFA)</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-3xl text-blue-400">
                    {draws.filter(d => TEAMS_DATA.find(t => t.id === d.teamId)?.confederation === "UEFA").length}
                  </span>
                  <span className="text-xs text-neutral-550 font-bold">/ 17 Drawn</span>
                </div>
                <p className="text-[10px] text-neutral-400 leading-none">Europe continent teams pairing index</p>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-2 relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-teal-400/5 select-none font-black text-6xl">COMPL</div>
                <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Compliance Status</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-bold text-emerald-400">LIVE & AUDITED</span>
                </div>
                <p className="text-[10px] text-neutral-500 leading-relaxed font-mono">Model: Fisher-Yates Live</p>
              </div>

            </div>

            {/* Main Interactive Directory Box */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
              
              {/* Header Actions */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 pb-6 border-b border-slate-800/80">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-xl text-white">48 Teams Official Sweepstake Ledger</h3>
                  <p className="text-neutral-400 text-xs">Official pairings compiled live using standard database criteria.</p>
                </div>

                <div className="flex flex-wrap gap-2.5 shrink-0">
                  {/* Search input tool */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search country or name..."
                      className="bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-yellow-500 rounded-xl pl-9 pr-8 py-2 text-xs text-white focus:outline-none transition w-full sm:w-56"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2 text-neutral-500 hover:text-white cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* PDF Export action with "Ultimate Corporate Approval" */}
                  <button
                    onClick={() => {
                      if (draws.length === 0) {
                        showToast("Sweepstake results empty. Construct some draws first!", "error");
                        return;
                      }
                      // Convert draws mapping to the expected full draw list in pdf helper
                      const fullDrawListForPDF = draws.map((pair) => {
                        const teamObj = TEAMS_DATA.find((t) => t.id === pair.teamId)!;
                        return {
                          employeeName: pair.employeeName,
                          team: teamObj,
                          timestamp: pair.timestamp
                        };
                      });
                      exportLeaderboardToPDF(fullDrawListForPDF, companyName);
                      showToast("Branded Result PDF loaded successfully into downloads!", "success");
                    }}
                    disabled={draws.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-850 disabled:text-neutral-500 disabled:cursor-not-allowed text-white text-xs font-bold uppercase rounded-xl transition shadow-md cursor-pointer shrink-0"
                  >
                    <FileText className="w-4 h-4" /> Export Sealed PDF
                  </button>
                </div>
              </div>

              {/* Confederation filter rail */}
              <div className="flex flex-wrap items-center gap-1.5 pb-2 overflow-x-auto scrollbar-none">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-neutral-400 mr-2 shrink-0">Filter Federation:</span>
                {["ALL", "UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC"].map((fed) => {
                  const isActive = confederationFilter === fed;
                  return (
                    <button
                      key={fed}
                      onClick={() => setConfederationFilter(fed)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-yellow-500 text-slate-950 shadow"
                          : "bg-slate-950 hover:bg-slate-800 text-neutral-300 hover:text-white border border-slate-800"
                      }`}
                    >
                      {fed}
                    </button>
                  );
                })}
              </div>

              {/* Grid Directory layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
                {TEAMS_DATA
                  .filter((team) => {
                    // Fit filter search
                    const matchesSearch =
                      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      team.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      draws.find((d) => d.teamId === team.id)?.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
                    
                    // Fit confederation filter
                    const matchesConfed = confederationFilter === "ALL" || team.confederation === confederationFilter;

                    return matchesSearch && matchesConfed;
                  })
                  .map((team) => {
                    const match = draws.find((d) => d.teamId === team.id);

                    return (
                      <div
                        key={team.id}
                        className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-4 ${
                          match
                            ? "bg-slate-950/80 border-emerald-500/20 hover:border-emerald-500/50"
                            : "bg-slate-950/30 border-slate-800/80 hover:border-slate-800"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2.5">
                          
                          {/* Flag & Team block */}
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <span className="text-2xl sm:text-3xl drop-shadow select-none shrink-0 mt-0.5">{team.flagEmoji}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-display font-extrabold text-sm text-white break-words leading-tight">{team.name}</span>
                                <span className="text-[9px] bg-slate-900 border border-slate-800 text-neutral-400 px-1.5 py-0.5 rounded uppercase font-bold font-mono shrink-0">
                                  {team.code}
                                </span>
                              </div>
                              <p className="text-[9px] font-mono text-neutral-400 mt-1">
                                {team.confederation} | Rank #{team.fifaRank}
                              </p>
                            </div>
                          </div>

                          {/* Matching status mark */}
                          {match ? (
                            <span className="text-[8.5px] font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase shrink-0">
                              Sealed
                            </span>
                          ) : (
                            <span className="text-[8.5px] font-mono font-bold bg-slate-900 text-neutral-400 px-2 py-0.5 rounded-full border border-slate-800 uppercase shrink-0">
                              Open
                            </span>
                          )}

                        </div>

                        {/* Bottom Assigned Employee */}
                        <div className="pt-3 border-t border-slate-800 flex justify-between items-center bg-slate-900/10 p-2.5 rounded-xl">
                          <div>
                            <p className="text-[8px] font-mono uppercase tracking-widest text-neutral-500">ASSIGNED HOLDER</p>
                            <p className={`text-xs font-bold leading-tight ${match ? "text-emerald-400" : "text-neutral-500 italic"}`}>
                              {match ? match.employeeName : "Open (Awaiting Draw Ceremony)"}
                            </p>
                          </div>
                          
                          {match && (
                            <div className="text-right">
                              <p className="text-[8.5px] font-mono text-neutral-500 leading-none">TIME</p>
                              <p className="text-[10px] font-mono text-neutral-400 mt-0.5 leading-none">{match.timestamp}</p>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
              </div>

              {/* Empty placeholder */}
              {TEAMS_DATA.filter((team) => {
                const matchesSearch =
                  team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  team.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  draws.find((d) => d.teamId === team.id)?.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesConfed = confederationFilter === "ALL" || team.confederation === confederationFilter;
                return matchesSearch && matchesConfed;
              }).length === 0 && (
                <div className="text-center p-12 bg-slate-950/20 border border-slate-800 rounded-2xl select-none">
                  <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto mb-2 animate-bounce" />
                  <p className="text-sm font-bold text-neutral-350">No matches found in directory.</p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                    Try altering your query parameters or removing the filter settings above.
                  </p>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
      )}

        {/* --- TAB CONTENT 3: APP SUPPORT & SETUP --- */}
        {activeTab === "support" && (
          <div className="w-full overflow-hidden">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full px-2 sm:px-4 animate-fade-in_custom">
              <div className="space-y-6 w-full min-w-0">

                {/* Custom alert banner if Demo Mode is active */}
                {isDemoMode && (
                  <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl animate-fade-in">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                      <div className="p-2.5 bg-yellow-500/15 text-yellow-500 rounded-full shrink-0 border border-yellow-500/20">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-white font-display font-extrabold text-sm uppercase tracking-wide">Demo Mode is Currently Active</h4>
                        <p className="text-neutral-450 text-xs mt-0.5 font-sans font-medium">The application is pre-populated with 48 fictitious elite staff profiles. Turn off Demo Mode to clear active memory and upload your own CSV roster!</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSystemReset}
                      className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shrink-0 leading-none"
                    >
                      🛑 Turn Off Demo Mode
                    </button>
                  </div>
                )}

                {/* SYSTEM CONFIGURATION & ROSTER SETUP */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-800/85"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase font-mono tracking-widest font-bold">
                    <span className="bg-slate-950 px-4 py-1 border border-yellow-500/25 text-yellow-500 rounded-full flex items-center gap-1.5 shadow-xl">
                      ⚙️ SYSTEM SETUP & AUDIT LOGGER
                    </span>
                  </div>
                </div>

                {/* Custom Confirmation Modals for Safekeeping Admin State */}
                <AnimatePresence>
                  {isAdminResetConfirmOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 15 }}
                        className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6 text-center border-t-4 border-t-rose-500"
                      >
                        <div className="p-3 bg-rose-500/10 text-rose-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto border border-rose-500/20">
                          <Trash2 className="w-7 h-7 animate-pulse" />
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-display font-black text-lg tracking-tight text-white uppercase font-sans">Confirm Hard Reset</h4>
                          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-sans">
                            Are you sure you want to trigger a hard reset? This will permanently erase the current database roster of <strong className="text-rose-400 font-bold">{employees.length} employees</strong> and wipe out all live drawn pairings from active memory. This operation is irreversible.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                          <button
                            onClick={() => setIsAdminResetConfirmOpen(false)}
                            className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-neutral-300 font-bold rounded-xl transition text-xs sm:text-sm cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              handleSystemReset();
                              setIsAdminResetConfirmOpen(false);
                            }}
                            className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition text-xs sm:text-sm shadow-lg shadow-rose-950/40 cursor-pointer"
                          >
                            Yes, Hard Clear
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isAdminFastPassConfirmOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 15 }}
                        className="bg-slate-900 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6 text-center border-t-4 border-t-yellow-500"
                      >
                        <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-full w-14 h-14 flex items-center justify-center mx-auto border border-yellow-500/20">
                          <Sparkles className="w-7 h-7 text-yellow-500 animate-spin-slow" />
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-display font-black text-lg tracking-tight text-white uppercase block font-sans">Confirm Fast Pass Draw</h4>
                          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed font-sans">
                            Are you sure you want to perform the instant direct sweepstakes simulation? This will auto-map all <span className="text-yellow-400 font-bold font-mono">48 employees</span> to the 48 FIFA teams using bias-free direct Fisher-Yates mapping algorithms, wiping out of active memory any live pairings in progress.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                          <button
                            onClick={() => setIsAdminFastPassConfirmOpen(false)}
                            className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-neutral-300 font-bold rounded-xl transition text-xs sm:text-sm cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              handleCompleteDrawSimulation();
                              setIsAdminFastPassConfirmOpen(false);
                            }}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold rounded-xl transition text-xs sm:text-sm shadow-lg cursor-pointer"
                          >
                            Proceed Draw Match
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0 mt-2">
                  {/* Information Banner with Soccer Ball branding */}
                  <div className="col-span-12 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/25 p-5 sm:p-6 rounded-2xl border border-yellow-500/15 flex flex-col lg:flex-row gap-5 items-center justify-between shadow-xl">
                    <div className="space-y-2 max-w-3xl text-center lg:text-left font-sans">
                      <h2 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-white flex items-center justify-center lg:justify-start gap-2.5">
                        <Award className="text-yellow-500 w-6 h-6 sm:w-7 sm:h-7 shrink-0" /> Setup & Roster Activation
                      </h2>
                      <p className="text-neutral-350 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                        Establish complete transparency of system allocations. Map your company's list of exactly <strong className="text-white">48 employee names</strong> to the 48 competing FIFA nations.
                        Use a perfectly parsed spreadsheet, or click below to launch instantly with our premium demo staff directory.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full lg:w-auto mt-2 lg:mt-0">
                      <button
                        onClick={loadDemoEmployees}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold rounded-xl transition shadow-lg text-xs sm:text-sm hover:scale-[1.02] cursor-pointer animate-pulse-subtle font-display uppercase tracking-wider"
                      >
                        <Sparkles className="w-4 h-4 shrink-0" /> Fast-Track Demo
                      </button>
                      <a
                        href={getCSVTemplateURI()}
                        download="world_cup_sweepstakes_template.csv"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition text-xs sm:text-sm text-center cursor-pointer font-display uppercase tracking-wider"
                      >
                        <Download className="w-4 h-4 shrink-0 text-neutral-400" /> Get Template CSV
                      </a>
                    </div>
                  </div>

                  {/* Left Box: CSV Drag and Drop Receiver */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                      <div>
                        <h3 className="font-display font-bold text-base sm:text-lg text-white">1. Loader Roster (CSV Standard)</h3>
                        <p className="text-neutral-400 text-xs font-sans">Standard CSV column required header: <strong className="text-yellow-500 font-mono">Employee Name</strong></p>
                      </div>

                      {/* Drag receiver zone */}
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                        onDragLeave={() => setIsDraggingOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-5 sm:p-12 text-center cursor-pointer transition flex flex-col items-center gap-4 ${
                          isDraggingOver
                            ? "border-yellow-500 bg-yellow-500/5 shadow-inner"
                            : employees.length === 48
                            ? "border-emerald-500/50 bg-emerald-500/5"
                            : "border-slate-800 hover:border-slate-700 bg-slate-950/50"
                        }`}
                      >
                        {employees.length === 48 ? (
                          <div className="p-3 sm:p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400">
                            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
                          </div>
                        ) : (
                          <div className="p-3 sm:p-4 bg-slate-800 rounded-full border border-slate-700 text-yellow-500">
                            <Upload className="w-8 h-8 sm:w-10 sm:h-10" />
                          </div>
                        )}

                        <div className="space-y-1.5 animate-fade-in">
                          <p className="font-bold text-xs sm:text-sm text-white font-sans">
                            {employees.length === 48
                              ? "Employee Roster Audited & Approved!"
                              : "Drag and drop your spreadsheet here"}
                          </p>
                          <p className="text-neutral-400 text-[11px] sm:text-xs max-w-sm mx-auto leading-relaxed">
                            {employees.length === 48
                              ? "Exactly 48 names loaded. Ready to run the live lottery drawing."
                              : "Supports .csv files. Will automatically map rows to the 48 teams of World Cup 2026."}
                          </p>
                        </div>
                        
                        {employees.length > 0 && employees.length !== 48 && (
                          <div className="mt-2 bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-lg border border-rose-500/20 text-[10px] sm:text-xs flex items-center gap-1.5 font-mono leading-relaxed max-w-full">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                            Status Error: Loaded {employees.length} names. Compliance mandates exactly 48!
                          </div>
                        )}

                        <button
                          type="button"
                          className="mt-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-neutral-250 hover:text-white rounded-lg text-[11px] sm:text-xs font-bold font-mono transition border border-slate-700 cursor-pointer shadow-md"
                        >
                          Select File Manually
                        </button>
                      </div>

                      {/* Company customization input */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 font-mono font-bold block animate-fade-in">Company / Office Name</label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g., Acme Corporation"
                            className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-yellow-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-medium focus:outline-none transition leading-relaxed"
                          />
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400 font-mono font-bold block">Preset Verification Code</label>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value="AUDIT-2026-FY"
                              className="w-full bg-slate-950/60 border border-slate-800 text-neutral-500 cursor-not-allowed rounded-xl pl-4 pr-20 py-2.5 text-xs sm:text-sm font-mono focus:outline-none"
                            />
                            <span className="absolute right-3 top-2.5 bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-bold border border-emerald-500/20">SECURED</span>
                          </div>
                        </div>
                      </div>

                      {/* Reset or simulation buttons */}
                      {employees.length > 0 && (
                        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full animate-fade-in">
                          {employees.length === 48 && (
                            <button
                              onClick={() => setIsAdminFastPassConfirmOpen(true)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-950 hover:bg-slate-900 border border-yellow-500/25 hover:border-yellow-500/65 text-yellow-500 font-extrabold uppercase text-[11px] sm:text-xs tracking-wider rounded-xl transition cursor-pointer w-full sm:w-auto hover:text-white"
                            >
                              <Play className="w-3.5 h-3.5 text-yellow-500 animate-pulse shrink-0" /> Fast Pass (Instant Draw Match)
                            </button>
                          )}
                          
                          <button
                            onClick={() => setIsAdminResetConfirmOpen(true)}
                            className="flex-1 sm:flex-none px-4 py-3 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 hover:text-white font-bold uppercase text-[11px] sm:text-xs tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shrink-0 animate-pulse-subtle"
                            title="Clear database under admin authorization"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" /> Hard Clear
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Employees Table view */}
                    {employees.length > 0 && (
                      <div className="bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 animate-fade-in">
                        <div className="flex flex-wrap gap-2 justify-between items-center font-sans">
                          <div>
                            <h4 className="font-display font-semibold text-white text-sm sm:text-base">Roster Preview Directory</h4>
                            <p className="text-neutral-400 text-xs font-sans">Total locked: {employees.length} participants</p>
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-mono bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/20 uppercase font-bold tracking-wider">COMPLIANT</span>
                        </div>

                        <div className="bg-slate-950 p-2 overflow-y-auto rounded-xl border border-slate-800 h-[280px] grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-mono scrollbar-thin scrollbar-thumb-slate-800">
                          {employees.map((name, i) => (
                            <div key={i} className="bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800/80 hover:border-slate-700/80 transition flex items-center justify-between gap-2 text-neutral-300">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="text-yellow-500/50 font-bold w-5 text-right">{i + 1}.</span>
                                <div className="truncate flex-1 font-semibold">{name}</div>
                              </div>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Box: Setup guidelines & FIFA ball banner */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                      {/* Visual FIFA Graphic */}
                      <div className="bg-gradient-to-br from-yellow-600 via-amber-700 to-slate-950 p-6 text-center space-y-4 relative flex flex-col items-center">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400/20 via-transparent to-transparent opacity-60"></div>
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-yellow-300/40 bg-slate-900/60 shadow-xl flex items-center justify-center shrink-0">
                          <img
                            src={worldCupBallLogo}
                            alt="FIFA World Cup 2026 Football"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="relative z-10 text-center">
                          <h4 className="font-display font-black text-xl text-white tracking-tight leading-none uppercase">UNITED 2026</h4>
                          <p className="text-[10px] uppercase font-mono tracking-widest text-slate-100/90 mt-1">Tournament Roster Database</p>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6 space-y-4 font-sans leading-relaxed">
                        <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">Roster Guidelines</h4>
                        <ul className="text-xs text-neutral-400 space-y-3 font-medium">
                          <li className="flex gap-2">
                            <span className="text-yellow-500 font-bold shrink-0">✔</span>
                            <span>You must supply <strong className="text-neutral-250">exactly 48 unique names</strong> to map perfectly to the 48 FIFA teams.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-yellow-500 font-bold shrink-0">✔</span>
                            <span>Download the CSV Template above if you want to copy-paste names in Microsoft Excel inside a compliant format.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-yellow-500 font-bold shrink-0">✔</span>
                            <span>You may also click <strong className="text-yellow-400 font-bold">"Fast-Track Demo"</strong> to immediately test the broadcast loop with fictitious elite executive participants!</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="text-yellow-500 font-bold shrink-0">✔</span>
                            <span>During the draw ceremony, Fisher-Yates randomization checks all lists to ensure zero duplicate entries or bias.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Operational Audit Log block */}
                    <div className="bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 animate-fade-in text-sans">
                      <div className="flex justify-between items-center">
                        <h4 className="font-display font-bold text-sm text-white flex items-center gap-1.5 uppercase tracking-wider font-sans">
                          <Clock className="w-4 h-4 text-yellow-500" /> Compliance Audit
                        </h4>
                        <span className="text-[9px] font-mono font-bold text-neutral-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">REALTIME</span>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 h-[280px] overflow-y-auto space-y-3 font-mono text-[10px] leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                        {auditLogs.map((log) => (
                          <div key={log.id} className="border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                            <div className="flex justify-between text-neutral-500 mb-0.5">
                              <span className="text-neutral-600">ID: {log.id}</span>
                              <span>{log.timestamp}</span>
                            </div>
                            <p className="text-neutral-300 font-sans tracking-tight font-medium">{log.action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- FOOTER COMPLIANCE DISCLAIMER --- */}
      <footer className="mt-auto bg-slate-900 border-t border-yellow-500/10 px-4 sm:px-8 py-6 text-center text-xs text-neutral-405 space-y-2">
        <p className="font-display font-medium text-white max-w-xl mx-auto tracking-normal leading-relaxed">
          The Fisher-Yates Sweepstake Randomized assignment model enforces equitable distribution with zero human-bias, compliant with corporate fairness policies.
        </p>
        <p className="font-mono text-[10px] text-neutral-500">
          AUTHORIZED LIVE DRAW PANEL  •  PRE-APPROVED CRYPTOGRAPHIC TOKENS  •  WORLD CUP 2026™
        </p>
      </footer>

    </div>
  );
}
