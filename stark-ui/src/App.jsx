import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Power,
  Activity,
  Cpu,
  Database,
  Radio,
  Zap,
  Terminal,
  Crosshair,
  AlertTriangle,
  RotateCcw,
  Clock,
  Wifi,
  ChevronRight,
  Sliders
} from 'lucide-react';

export default function App() {
  // Telemetry mock states (hook your backend API fetchers to setCpuUsage / setRamUsage)
  const [cpuUsage, setCpuUsage] = useState(0);
  const [ramUsage, setRamUsage] = useState(0);
  // System & Command Interaction States
  const [systemStatus, setSystemStatus] = useState('NOMINAL'); // 'NOMINAL' | 'LOCKED' | 'SLEEP'
  const [activeAlert, setActiveAlert] = useState(null);
  const [timestamp, setTimestamp] = useState('');
  const [uptimeSeconds, setUptimeSeconds] = useState(84291);
  const [simulationActive, setSimulationActive] = useState(false);

  // Telemetry loop for the CPU and RAM usage
  useEffect(()=>{
    const fetchStatus = async() =>{
      try{
        const response = await fetch("http://192.168.15.133:5000/stats");
        const data = await response.json();
        setCpuUsage(data.CPU);
        setRamUsage(data.RAM);  
      }catch(error){
        console.error("JARVIS Link Disconnected:", error);
      }
    }
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return ()=> clearInterval(interval);
  },[])
  // Live HUD clock & simulated telemetry pulse
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(() => {
      updateTime();
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Optional telemetry fluctuation simulator (useful for testing UI reactions before backend is connected)
  useEffect(() => {
    if (!simulationActive) return;
    const simInterval = setInterval(() => {
      setCpuUsage((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.min(98, Math.max(12, prev + delta));
      });
      setRamUsage((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(95, Math.max(30, prev + delta));
      });
    }, 2000);

    return () => clearInterval(simInterval);
  }, [simulationActive]);

  // Format uptime into standard HH:MM:SS format
  const formatUptime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Override Command Handlers
  const handleLockSystem = async () => {
    setSystemStatus('LOCKED');
    setActiveAlert({
      type: 'danger',
      title: 'SECURITY OVERRIDE EXECUTED',
      message: 'ALL COMMAND CHANNELS RESTRICTED // BIOMETRIC LOCK ENGAGED',
      code: 'ERR_PROTOCOL_LOCKDOWN_77',
    });
    try{
      await fetch("http://192.168.15.133:5000/command/lock");

    }catch(error){
      console.error("Failed to send lock command:", error);
    }
  };

  const handleSleepSystem = async () => {
    setSystemStatus('SLEEP');
    setActiveAlert({
      type: 'warning',
      title: 'STANDBY PROTOCOL ENGAGED',
      message: 'CORE POWER SCALED TO 12% // PRIMARY SENSORS IDLE',
      code: 'SYS_STANDBY_SUSPEND_09',
    });
    try {
      await fetch("http://192.168.15.133:5000/command/sleep");
    } catch (error) {
      console.error("Failed to send sleep command:", error);
    }
  };

  const handleResetStatus = () => {
    setSystemStatus('NOMINAL');
    setActiveAlert(null);
  };

  return (
    <div className="relative min-h-screen bg-[#05070a] text-slate-100 font-['Share_Tech_Mono',monospace] selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Background Cyber Grid & HUD Vignette */}
      <div className="fixed inset-0 bg-hud-grid opacity-75 pointer-events-none" />
      <div className="fixed inset-0 bg-radial-vignette pointer-events-none" />
      <div className="fixed inset-0 scanlines opacity-40 pointer-events-none" />

      {/* Ambient Arc Core Glow */}
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      {systemStatus === 'LOCKED' && (
        <div className="fixed inset-0 bg-red-950/25 pointer-events-none transition-all duration-700 backdrop-grayscale-[20%]" />
      )}
      {systemStatus === 'SLEEP' && (
        <div className="fixed inset-0 bg-amber-950/20 pointer-events-none transition-all duration-700" />
      )}

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col min-h-screen justify-between gap-6">
        
        {/* ========================================================
            1. HEADER: JARVIS LINK ACTIVE & CONNECTION PULSE
           ======================================================== */}
        <header className="relative hud-corner-bracket bg-[#080d16]/90 backdrop-blur-md border border-cyan-500/30 px-4 sm:px-6 py-4 shadow-[0_0_20px_rgba(0,255,204,0.15)]">
          {/* Top Decorative Tech Accent Line */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#00ffcc] to-transparent opacity-75" />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left: Stark Mark & Link Active Indicator */}
            <div className="flex items-center gap-4">
              {/* Arc Reactor Mini Badge */}
              <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-black/60 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,255,204,0.25)] shrink-0 group">
                <div className="absolute inset-1 rounded border border-cyan-500/20 rotate-45" />
                <Crosshair className="w-6 h-6 text-[#00ffcc] animate-[spin_12s_linear_infinite]" />
                <div className="absolute w-2 h-2 rounded-full bg-[#00ffcc] shadow-[0_0_8px_#00ffcc]" />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] tracking-[0.25em] text-cyan-400/70 uppercase">
                    STARK IND. // OS_V4.28
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 font-mono">
                    MK-85
                  </span>
                </div>

                {/* Primary Header Requirement */}
                <div className="flex items-center gap-3 mt-0.5">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wider text-slate-100 font-['Orbitron',sans-serif] uppercase text-glow-cyan flex items-center gap-2">
                    JARVIS LINK ACTIVE
                  </h1>

                  {/* Glowing Pulse Indicator */}
                  <div className="relative flex items-center justify-center w-4 h-4" title="Quantum Link Connected">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffcc] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00ffcc] shadow-[0_0_10px_#00ffcc]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Auxiliary Telemetry & Status Badges */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-300 border-t md:border-t-0 border-cyan-500/20 pt-3 md:pt-0">
              {/* Status State */}
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded border border-cyan-500/20">
                <Radio className="w-3.5 h-3.5 text-[#00ffcc] animate-pulse" />
                <span className="text-slate-400">STATE:</span>
                <span
                  className={`font-bold font-['Orbitron',sans-serif] ${
                    systemStatus === 'LOCKED'
                      ? 'text-red-400 text-glow-red'
                      : systemStatus === 'SLEEP'
                      ? 'text-amber-400 text-glow-amber'
                      : 'text-[#00ffcc] text-glow-cyan'
                  }`}
                >
                  {systemStatus}
                </span>
              </div>

              {/* Quantum Latency */}
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded border border-cyan-500/20">
                <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">PING:</span>
                <span className="text-cyan-300 font-bold">14ms</span>
              </div>

              {/* HUD Clock */}
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded border border-cyan-500/20">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">SYS.TIME:</span>
                <span className="text-cyan-200 font-mono tracking-widest">
                  {timestamp || '12:00:00'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Override Active Banner / Notification if Triggered */}
        {activeAlert && (
          <div
            className={`relative px-4 py-3 rounded border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              activeAlert.type === 'danger'
                ? 'bg-red-950/80 border-red-500 text-red-100 shadow-[0_0_20px_rgba(255,42,95,0.4)]'
                : 'bg-amber-950/80 border-amber-500 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle
                className={`w-5 h-5 shrink-0 ${
                  activeAlert.type === 'danger' ? 'text-red-400 animate-bounce' : 'text-amber-400 animate-pulse'
                }`}
              />
              <div>
                <p className="font-['Orbitron',sans-serif] font-bold text-sm tracking-wide">
                  {activeAlert.title} [{activeAlert.code}]
                </p>
                <p className="text-xs opacity-90">{activeAlert.message}</p>
              </div>
            </div>

            <button
              onClick={handleResetStatus}
              className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold rounded bg-black/50 border border-white/20 hover:border-white/60 transition-colors uppercase self-end sm:self-center cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Override
            </button>
          </div>
        )}

        {/* ========================================================
            2. SYSTEM TELEMETRY SECTION (CPU & RAM GAUGES)
           ======================================================== */}
        <section className="relative">
          {/* Section Header with HUD Ticks & Simulation Tool */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b border-cyan-500/30 pb-2 gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00ffcc]" />
              <h2 className="text-sm sm:text-base font-bold font-['Orbitron',sans-serif] tracking-widest text-[#00ffcc] uppercase text-glow-cyan">
                // SYSTEM TELEMETRY
              </h2>
            </div>
            
            <div className="flex items-center gap-3 text-[11px] text-cyan-400/80">
              {/* Optional UI live simulation toggle */}
              <button
                type="button"
                onClick={() => setSimulationActive((prev) => !prev)}
                className={`px-2 py-0.5 rounded border transition-all flex items-center gap-1.5 cursor-pointer font-mono text-[10px] ${
                  simulationActive
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,255,204,0.3)]'
                    : 'bg-black/40 border-cyan-500/30 text-cyan-400/70 hover:border-cyan-400'
                }`}
                title="Toggle live mock data drift to test animations"
              >
                <Sliders className="w-3 h-3" />
                <span>{simulationActive ? 'SIMULATION: RUNNING' : 'SIMULATE DRIFT'}</span>
              </button>

              <div className="hidden md:flex items-center gap-3 text-cyan-400/50 uppercase">
                <span>FREQ: 1000 HZ</span>
                <span>•</span>
                <span>NODE: CORE-ALPHA</span>
              </div>
            </div>
          </div>

          {/* Telemetry Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ----------------- CPU USAGE CARD ----------------- */}
            <div className="relative hud-corner-bracket bg-[#080d16]/85 backdrop-blur-md border border-cyan-500/25 p-5 sm:p-6 rounded-sm shadow-[0_0_20px_rgba(0,255,204,0.08)] hover:border-cyan-500/50 transition-all duration-300 group">
              {/* Top Subheader */}
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-[#00ffcc]">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-['Orbitron',sans-serif] font-bold text-slate-100 text-sm tracking-wider uppercase">
                      CPU METRIC LOAD
                    </h3>
                    <p className="text-[10px] text-cyan-400/70 tracking-widest">
                      OCTA-CORE NEURAL ARRAY // T-3000
                    </p>
                  </div>
                </div>

                {/* Manual testing buttons [- / +] */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCpuUsage((c) => Math.max(0, c - 5))}
                    className="w-5 h-5 flex items-center justify-center rounded bg-black/50 border border-cyan-500/30 text-cyan-400 text-xs hover:border-cyan-400 cursor-pointer"
                    title="Decrease CPU (Mock)"
                  >
                    -
                  </button>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono">
                    4.82 GHz
                  </span>
                  <button
                    type="button"
                    onClick={() => setCpuUsage((c) => Math.min(100, c + 5))}
                    className="w-5 h-5 flex items-center justify-center rounded bg-black/50 border border-cyan-500/30 text-cyan-400 text-xs hover:border-cyan-400 cursor-pointer"
                    title="Increase CPU (Mock)"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Gauge & Metrics Area */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Circular HUD Arc Gauge */}
                <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center shrink-0">
                  {/* Subtle rotating calibration reticle */}
                  <svg
                    className="absolute inset-0 w-full h-full animate-[spin_40s_linear_infinite] opacity-30"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="47"
                      fill="none"
                      stroke="#00ffcc"
                      strokeWidth="0.75"
                      strokeDasharray="2 4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="39"
                      fill="none"
                      stroke="#00ffcc"
                      strokeWidth="0.5"
                      strokeDasharray="6 8"
                    />
                  </svg>

                  {/* Primary Arc Gauge */}
                  <svg className="w-36 h-36 sm:w-40 sm:h-40 -rotate-90 transform" viewBox="0 0 100 100">
                    {/* Background track circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#0a1a24"
                      strokeWidth="8"
                    />
                    {/* Progress Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#00ffcc"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * cpuUsage) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                      style={{
                        filter: 'drop-shadow(0 0 6px #00ffcc)',
                      }}
                    />
                  </svg>

                  {/* Digital Readout Center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] tracking-widest text-cyan-400/80 font-mono uppercase">
                      LOAD
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold font-['Orbitron',sans-serif] text-slate-50 text-glow-cyan tracking-tight">
                      {cpuUsage}%
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      OPTIMAL
                    </span>
                  </div>
                </div>

                {/* Sub-Telemetry Data & Visual Bars */}
                <div className="w-full space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-400">THREAD DISTRIBUTION</span>
                      <span className="text-cyan-300">{cpuUsage}% / 100%</span>
                    </div>

                    {/* Futuristic Segmented Bar Meter */}
                    <div className="grid grid-cols-10 gap-1 h-3.5 p-0.5 bg-black/60 border border-cyan-500/30 rounded-sm">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const filled = (i + 1) * 10 <= cpuUsage;
                        return (
                          <div
                            key={i}
                            className={`h-full rounded-[1px] transition-all duration-300 ${
                              filled
                                ? 'bg-[#00ffcc] shadow-[0_0_8px_#00ffcc]'
                                : 'bg-cyan-950/40 border border-cyan-900/30'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Technical Breakdown Matrix */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 rounded bg-black/40 border border-cyan-500/15">
                      <div className="text-[10px] text-slate-400 uppercase">CORE TEMP</div>
                      <div className="text-slate-200 font-bold font-mono text-sm">48.4°C</div>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-cyan-500/15">
                      <div className="text-[10px] text-slate-400 uppercase">VOLTAGE</div>
                      <div className="text-slate-200 font-bold font-mono text-sm">1.18 V</div>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-cyan-500/15">
                      <div className="text-[10px] text-slate-400 uppercase">INSTRUCTIONS</div>
                      <div className="text-slate-200 font-bold font-mono text-sm">4.12 B/s</div>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-cyan-500/15">
                      <div className="text-[10px] text-slate-400 uppercase">L3 CACHE</div>
                      <div className="text-slate-200 font-bold font-mono text-sm">32 MB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ----------------- RAM USAGE CARD ----------------- */}
            <div className="relative hud-corner-bracket bg-[#080d16]/85 backdrop-blur-md border border-cyan-500/25 p-5 sm:p-6 rounded-sm shadow-[0_0_20px_rgba(0,255,204,0.08)] hover:border-cyan-500/50 transition-all duration-300 group">
              {/* Top Subheader */}
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-[#00ffcc]">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-['Orbitron',sans-serif] font-bold text-slate-100 text-sm tracking-wider uppercase">
                      RAM ALLOCATION
                    </h3>
                    <p className="text-[10px] text-cyan-400/70 tracking-widest">
                      DDR5 QUANTUM SYNC // 6400 MT/s
                    </p>
                  </div>
                </div>

                {/* Manual testing buttons [- / +] */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setRamUsage((r) => Math.max(0, r - 5))}
                    className="w-5 h-5 flex items-center justify-center rounded bg-black/50 border border-cyan-500/30 text-cyan-400 text-xs hover:border-cyan-400 cursor-pointer"
                    title="Decrease RAM (Mock)"
                  >
                    -
                  </button>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 font-mono">
                    32.0 GB
                  </span>
                  <button
                    type="button"
                    onClick={() => setRamUsage((r) => Math.min(100, r + 5))}
                    className="w-5 h-5 flex items-center justify-center rounded bg-black/50 border border-cyan-500/30 text-cyan-400 text-xs hover:border-cyan-400 cursor-pointer"
                    title="Increase RAM (Mock)"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Gauge & Metrics Area */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Circular HUD Arc Gauge */}
                <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center shrink-0">
                  {/* Outer Tech Ring */}
                  <svg
                    className="absolute inset-0 w-full h-full -rotate-45 opacity-30"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="47"
                      fill="none"
                      stroke="#00ffcc"
                      strokeWidth="0.75"
                      strokeDasharray="4 6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#00ffcc"
                      strokeWidth="0.5"
                      strokeDasharray="1 3"
                    />
                  </svg>

                  {/* Primary Arc Gauge */}
                  <svg className="w-36 h-36 sm:w-40 sm:h-40 -rotate-90 transform" viewBox="0 0 100 100">
                    {/* Background track circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#0a1a24"
                      strokeWidth="8"
                    />
                    {/* Progress Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#00ffcc"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * ramUsage) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                      style={{
                        filter: 'drop-shadow(0 0 6px #00ffcc)',
                      }}
                    />
                  </svg>

                  {/* Digital Readout Center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] tracking-widest text-cyan-400/80 font-mono uppercase">
                      IN USE
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold font-['Orbitron',sans-serif] text-slate-50 text-glow-cyan tracking-tight">
                      {ramUsage}%
                    </span>
                    <span className="text-[10px] text-cyan-300 font-mono tracking-wider">
                      {(32 * (ramUsage / 100)).toFixed(1)} / 32 GB
                    </span>
                  </div>
                </div>

                {/* Sub-Telemetry Data & Visual Bars */}
                <div className="w-full space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono">
                      <span className="text-slate-400">HEAP UTILIZATION</span>
                      <span className="text-cyan-300">{ramUsage}% ALLOCATED</span>
                    </div>

                    {/* Futuristic Segmented Bar Meter */}
                    <div className="grid grid-cols-10 gap-1 h-3.5 p-0.5 bg-black/60 border border-cyan-500/30 rounded-sm">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const filled = (i + 1) * 10 <= ramUsage;
                        return (
                          <div
                            key={i}
                            className={`h-full rounded-[1px] transition-all duration-300 ${
                              filled
                                ? 'bg-[#00ffcc] shadow-[0_0_8px_#00ffcc]'
                                : 'bg-cyan-950/40 border border-cyan-900/30'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Technical Breakdown Matrix */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 rounded bg-black/40 border border-cyan-500/15">
                      <div className="text-[10px] text-slate-400 uppercase">ACTIVE HEAP</div>
                      <div className="text-slate-200 font-bold font-mono text-sm">
                        {(32 * (ramUsage / 100)).toFixed(1)} GB
                      </div>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-cyan-500/15">
                      <div className="text-[10px] text-slate-400 uppercase">CACHED BUFFER</div>
                      <div className="text-slate-200 font-bold font-mono text-sm">6.8 GB</div>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-cyan-500/15">
                      <div className="text-[10px] text-slate-400 uppercase">SWAP STORAGE</div>
                      <div className="text-slate-200 font-bold font-mono text-sm">1.2 GB</div>
                    </div>
                    <div className="p-2 rounded bg-black/40 border border-cyan-500/15">
                      <div className="text-[10px] text-slate-400 uppercase">BUS BANDWIDTH</div>
                      <div className="text-slate-200 font-bold font-mono text-sm">128 GB/s</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. OVERRIDE COMMANDS SECTION (FUTURISTIC BUTTONS)
           ======================================================== */}
        <section className="relative">
          {/* Section Header with HUD Line */}
          <div className="flex items-center justify-between mb-4 border-b border-cyan-500/30 pb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm sm:text-base font-bold font-['Orbitron',sans-serif] tracking-widest text-[#00ffcc] uppercase text-glow-cyan">
                // OVERRIDE COMMANDS
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-amber-400/80 uppercase font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>DIRECT EXECUTIVE AUTH ONLY</span>
            </div>
          </div>

          {/* Futuristic Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {/* ----------------- LOCK SYSTEM BUTTON ----------------- */}
            <button
              type="button"
              onClick={handleLockSystem}
              className="group relative hud-cut-corner-btn bg-[#0d070a]/90 border-2 border-red-500/40 hover:border-[#ff2a5f] p-5 sm:p-6 text-left transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,42,95,0.65)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden"
            >
              {/* Subtle hazard stripes hover overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,42,95,0.08)_25%,transparent_25%,transparent_50%,rgba(255,42,95,0.08)_50%,rgba(255,42,95,0.08)_75%,transparent_75%,transparent)] bg-[length:16px_16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Glowing Corner Accents */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500 group-hover:border-[#ff2a5f] transition-colors" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500 group-hover:border-[#ff2a5f] transition-colors" />

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-400 group-hover:text-red-200 group-hover:bg-red-900/80 group-hover:border-red-400 shadow-[0_0_12px_rgba(255,42,95,0.3)] transition-all shrink-0">
                    <ShieldAlert className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] tracking-widest text-red-400 font-mono uppercase">
                        CRITICAL PROTOCOL 01
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black font-['Orbitron',sans-serif] tracking-wider text-red-400 group-hover:text-[#ff2a5f] group-hover:text-glow-red uppercase transition-all duration-200">
                      LOCK SYSTEM
                    </h3>

                    <p className="mt-1 text-xs text-red-200/70 font-mono tracking-tight leading-relaxed">
                      Instant terminal lockdown. Engages cyber-perimeter barrier and revokes external tokens.
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-red-400/60 group-hover:text-red-300 group-hover:translate-x-1 transition-all shrink-0 mt-1 hidden sm:block" />
              </div>

              {/* Status Indicator Bar */}
              <div className="relative z-10 mt-4 pt-3 border-t border-red-950 flex items-center justify-between text-[11px] text-red-300/80 font-mono">
                <span>SECURITY CLEARANCE: LVL-4</span>
                <span className="group-hover:text-red-200 font-bold">[EXECUTE]</span>
              </div>
            </button>

            {/* ----------------- SLEEP SYSTEM BUTTON ----------------- */}
            <button
              type="button"
              onClick={handleSleepSystem}
              className="group relative hud-cut-corner-btn bg-[#0d0b07]/90 border-2 border-amber-500/40 hover:border-[#ffaa00] p-5 sm:p-6 text-left transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,170,0,0.6)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden"
            >
              {/* Subtle caution stripes hover overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,170,0,0.08)_25%,transparent_25%,transparent_50%,rgba(255,170,0,0.08)_50%,rgba(255,170,0,0.08)_75%,transparent_75%,transparent)] bg-[length:16px_16px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Glowing Corner Accents */}
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-500 group-hover:border-[#ffaa00] transition-colors" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-500 group-hover:border-[#ffaa00] transition-colors" />

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-400 group-hover:text-amber-200 group-hover:bg-amber-900/80 group-hover:border-amber-400 shadow-[0_0_12px_rgba(255,170,0,0.3)] transition-all shrink-0">
                    <Power className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] tracking-widest text-amber-400 font-mono uppercase">
                        STANDBY PROTOCOL 02
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black font-['Orbitron',sans-serif] tracking-wider text-amber-400 group-hover:text-[#ffaa00] group-hover:text-glow-amber uppercase transition-all duration-200">
                      SLEEP SYSTEM
                    </h3>

                    <p className="mt-1 text-xs text-amber-200/70 font-mono tracking-tight leading-relaxed">
                      De-energize main bus matrix into hyper-standby mode. Preserves state in non-volatile cache.
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-amber-400/60 group-hover:text-amber-300 group-hover:translate-x-1 transition-all shrink-0 mt-1 hidden sm:block" />
              </div>

              {/* Status Indicator Bar */}
              <div className="relative z-10 mt-4 pt-3 border-t border-amber-950 flex items-center justify-between text-[11px] text-amber-300/80 font-mono">
                <span>POWER DRAW: -88%</span>
                <span className="group-hover:text-amber-200 font-bold">[SUSPEND]</span>
              </div>
            </button>
          </div>
        </section>

        {/* ========================================================
            4. HUD TERMINAL LOG & DIAGNOSTICS FOOTER
           ======================================================== */}
        <footer className="relative bg-[#060a10]/80 backdrop-blur-sm border border-cyan-500/20 px-4 py-3 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 overflow-hidden">
            <Terminal className="w-4 h-4 text-[#00ffcc] shrink-0" />
            <span className="text-cyan-400/80 font-mono text-[11px] shrink-0">
              JARVIS_DIAG_STREAM:
            </span>
            <div className="font-mono text-[11px] text-slate-300 truncate">
              {systemStatus === 'LOCKED'
                ? '[CRITICAL] LOCKDOWN ACTIVE: ALL EXTERNAL INTERFACES REFUSING CONNECTIONS'
                : systemStatus === 'SLEEP'
                ? '[STANDBY] SYSTEM CORE IDLE: WAITING FOR WAKE-UP INTERRUPT'
                : `[STARK-NET] SENSORS SYNCHRONIZED // CPU ${cpuUsage}% // MEM ${ramUsage}% // CORE THERMAL PASS`}
            </div>
          </div>

          <div className="flex items-center gap-4 text-[10px] text-cyan-400/60 uppercase shrink-0 font-mono">
            <span>UPTIME: {formatUptime(uptimeSeconds)}</span>
            <span>•</span>
            <span>ENCRYPTION: 4096-BIT STARK-CYPHER</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
