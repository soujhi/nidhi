import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { 
  Volume2, VolumeX, AlertCircle, Sparkles, Heart, RefreshCw, 
  CornerDownRight, Gift, Trophy, Star, ShieldAlert
} from 'lucide-react';

import GalaxyBackground from './components/GalaxyBackground';
import GhostCursor from './components/GhostCursor';
import OrbitImages from './components/OrbitImages';
import CircularGallery from './components/CircularGallery';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [showPrettyAlert, setShowPrettyAlert] = useState(false);
  const [glitchProgress, setGlitchProgress] = useState(0);
  const [glitchDone, setGlitchDone] = useState(false);
  
  // Custom states for typewriter letter and restart
  const [letterTriggered, setLetterTriggered] = useState(false);
  const [letterText, setLetterText] = useState("");
  
  // State for Nidhi Manual section
  const [selectedError, setSelectedError] = useState(0);

  // State for Nidhi traits tags
  const [activeTag, setActiveTag] = useState(null);
  
  const synthRef = useRef(null);
  const scrollRef = useRef(null);

  // Soujhenya's letter content - editable and formatted beautifully
  const fullLetter = `Hey Nidhiii,

I don't think I've ever properly told you this because we usually just insult each other instead.

You're one of those people who quietly became part of my life without asking for permission, and now I genuinely can't imagine it without you.

It still feels weird celebrating your birthday without you here. I hate that you're in Coimbatore and I'm here because birthdays are supposed to end with stupid photos and us laughing over something completely unrelated. Instead, I'm sitting here making an entire website because apparently that's easier than saying all this to your face.

Everyone says we're pretty much the same when it comes to handling stuff or anything, except that you slay better in all aspects. Maybe that's why being your friend has always felt so easy. You understand the things I don't even explain. You know when I'm okay and when I'm pretending to be okay. You make ordinary days feel like they'll be stories we'll laugh about years from now.

I know you're going to do amazing things. One day people will admire your work, your designs, your creativity. Maybe people will be using products that you made, and I'll just be sitting there acting all cool like, "Yeah, I knew her when she was still bullying me."

Also, thank you for being there and understanding me every single time when I think there's no one who can actually process and think the way I do and completely understand me without any judgement. You're that one friend I never wanna lose in this lifetime. I owe you one, I really do. I miss you sometimes, a lot actually. The random walks around our school with no aim, us gossiping and giving names to people, talking for two hours every single time we call and it somehow feeling like just ten minutes.

And the most important thing... I genuinely wanna get an internship in Bangalore with you and spend the life we've always imagined, away from home, even if it's just for a short while. Our 20s are probably the most important decade of our lives. We'll be starting our careers, switching places, maybe countries, and hopefully by the end of this decade we'll both get married and live completely different lives.

But the only thing that's not gonna change is us.

No matter how busy life gets, how many cities separate us, or how much we grow up, you're stuck with me. Through random calls, random checkups and random texts. No matter how many people I meet in my life, I know you'll always be the special one, the one I'll treasure the most. I'll always be there in every phase of your life, even if you're on the streets, bitch. I love you.

Happy 20, idiot.

— Soujhenya ❤️`;

  // Dynamic typewriter simulation for Section 10 (index 9)
  useEffect(() => {
    if (activeSection === 9 && !letterTriggered) {
      setLetterTriggered(true);
      let i = 0;
      const interval = setInterval(() => {
        setLetterText((prev) => prev + fullLetter.charAt(i));
        i++;
        if (i >= fullLetter.length) {
          clearInterval(interval);
        }
      }, 35); // Typing speed
      return () => clearInterval(interval);
    }
  }, [activeSection, letterTriggered]);

  // Web Audio API Synthesizer (Generates warm emotional piano-like tones in real-time)
  const toggleMusic = () => {
    if (!isPlaying) {
      // Initialize Audio Context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      synthRef.current = ctx;

      // Ambient chords: Cmaj9 - Am9 - Fmaj7 - G6/9
      const chords = [
        [60, 64, 67, 71, 74], // Cmaj9
        [57, 60, 64, 67, 71], // Am9
        [53, 57, 60, 64, 69], // Fmaj9
        [55, 59, 62, 66, 69]  // G6/9
      ];
      let chordIndex = 0;

      const playTone = (freq, time, duration) => {
        // Create Oscillator and gain nodes
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine'; // Soft tone
        osc.frequency.value = freq;

        // Custom filter for warm Rhodes feel
        filter.type = 'lowpass';
        filter.frequency.value = 600;

        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.04, time + 0.5); // Slow attack
        gainNode.gain.exponentialRampToValueAtTime(0.00001, time + duration); // Long decay

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + duration);
      };

      const playChord = () => {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        
        const now = ctx.currentTime;
        const currentChord = chords[chordIndex];
        
        // Play chord notes with subtle arpeggiation delay
        currentChord.forEach((midiNote, idx) => {
          const freq = Math.pow(2, (midiNote - 69) / 12) * 440;
          playTone(freq, now + idx * 0.12, 6.0);
        });

        chordIndex = (chordIndex + 1) % chords.length;
      };

      // Loop progression
      playChord();
      const interval = setInterval(playChord, 8000);
      synthRef.current.interval = interval;
      setIsPlaying(true);
      
      addToast("Ambient soundtrack initiated.", "sparkle");
    } else {
      if (synthRef.current) {
        clearInterval(synthRef.current.interval);
        synthRef.current.close();
      }
      setIsPlaying(false);
    }
  };

  // Toast notification helper
  const addToast = (message, type = 'default') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Listen to active section via intersection observers and scroll bottom
  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(sections).indexOf(entry.target);
            setActiveSection(idx);
          }
        });
      },
      { threshold: 0.15 } // Lower threshold for more reliable triggers
    );

    const handleScroll = () => {
      // Force last section when scrolled to bottom
      const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 80;
      if (isAtBottom) {
        setActiveSection(9);
      }
    };

    sections.forEach((sec) => observer.observe(sec));
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Listen to hotkey 'N' globally
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'n' || e.key === 'N') {
        addToast("Nidhi.exe has encountered an unexpected friend request.", "error");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Glitch loader effect simulation
  useEffect(() => {
    if (activeSection === 3 && !glitchDone) {
      const interval = setInterval(() => {
        setGlitchProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setGlitchDone(true), 800);
            addToast("Glitch correction active.", "default");
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [activeSection, glitchDone]);

  // Solo Slay images and labels for WebGL Circular Gallery
  const soloSlayItems = [
    { image: '/images/solo_slay_3.jpg', text: 'blue & red saree' },
    { image: '/images/solo_slay_1.jpg', text: 'magenta tee' },
    { image: '/images/solo_slay_2.jpg', text: 'floral saree' },
    { image: '/images/solo_slay_4.jpg', text: 'maroon saree' },
    { image: '/images/solo_slay_5.jpg', text: 'peach dress' },
    { image: '/images/solo_slay_6.jpg', text: 'kraft doors' },
    { image: '/images/solo_slay_7.jpg', text: 'grass at night' },
    { image: '/images/solo_slay_8.jpg', text: 'museum bench' },
    { image: '/images/solo_slay_9.jpg', text: 'festive look' },
    { image: '/images/solo_slay_10.jpg', text: 'give up mode' }
  ];

  const tags = [
    { text: 'calm', roast: 'Pretends to be a calm pond, is actually a vibrating cellular network of anxiety.' },
    { text: 'designer', roast: 'Exceptional eye. Will roast a layout if it has 1px incorrect padding.' },
    { text: 'stylish', roast: 'Always dressed like she is about to sign a multi-million dollar architecture deal.' },
    { text: 'stupid', roast: 'Literally studies high design but struggles to choose what to eat for lunch.' },
    { text: 'overthinks', roast: 'Has simulated 4,000 scenarios of how this birthday website would look.' },
    { text: 'pretends she doesn\'t care', roast: 'Plays cool but is secretly the most emotional person in the room.' },
    { text: 'actually cares too much', roast: 'Will listen to your 2 AM rants and give logic that makes too much sense.' },
    { text: 'my favourite', roast: 'The one idiot I can never get tired of roasting.' },
  ];

  // Orbit Images source configurations (paths pointing to public/images/)
  const orbitImages = [
    { src: '/images/childhood_1.jpg', caption: 'Outfit inspector', fullCaption: 'Circa 2007. Already looking like she\'s going to criticise someone\'s styling.' },
    { src: '/images/childhood_2.jpg', caption: 'cutie naughty', fullCaption: 'Clearly already showing everyone else how it\'s done.' },
    { src: '/images/childhood_3.jpg', caption: 'Pose check', fullCaption: 'Circa 2007. One year birthday celebrations. Checking if the cake matches her standards.' },
  ];

  // Evidence Gallery (Section 3) sources and captions
  const evidencePhotos = [
    { 
      src: '/images/together_1.jpg', 
      caption: "the first outing (the dayyy).",
      desc: "selfie in an auto-rickshaw looking extremely proud of ourselves. the start of everything." 
    },
    { 
      src: '/images/together_2.jpg', 
      caption: "trampoline chaos.",
      desc: "probably five seconds before we collided and started fighting over who caused it." 
    },
    { 
      src: '/images/together_3.jpg', 
      caption: "last day at school.",
      desc: "signing absolute nonsense on each other's shirts, crying, and looking impossible." 
    },
    { 
      src: '/images/together_4.jpg', 
      caption: "last sports day.",
      desc: "standing on the red track looking like active sports champions (we didn't win anything)." 
    },
    { 
      src: '/images/together_5.jpg', 
      caption: "celebrating you.",
      desc: "celebrating you right before coimbatore decided to steal you away from me." 
    },
    { 
      src: '/images/together_6.jpg', 
      caption: "mins before you told.",
      desc: "only two cuties in a frame." 
    },
    { 
      src: '/images/together_7.jpg', 
      caption: "our first trio pic.",
      desc: "trio mode activated. the beginning of the three-way brain cell division." 
    },
    { 
      src: '/images/together_8.jpg', 
      caption: "educational tour.",
      desc: "pretending to learn stuff on tour, but actually just taking selfies in grey school uniforms." 
    },
    { 
      src: '/images/together_9.jpg', 
      caption: "our best trip.",
      desc: "matching yellow t-shirts, sun in our eyes, and absolute core memories." 
    },
    { 
      src: '/images/together_10.jpg', 
      caption: "farewell.",
      desc: "everyone dressed up in party wear, looking mature, and acting like we won't cry ten minutes later." 
    },
    { 
      src: '/images/together_11.jpg', 
      caption: "the dayyy.",
      desc: "the day she told us she's taken." 
    },
    { 
      src: '/images/together_12.jpg', 
      caption: "a2b times.",
      desc: "one of the 450 times we went to A2B just to sit and gossip instead of eating actual meals." 
    },
    { 
      src: '/images/together_13.jpg', 
      caption: "meet rants.",
      desc: "ranting on Google Meet because Coimbatore stole you, discussing design, and losing sleep." 
    },
    { 
      src: '/images/together_14.jpg', 
      caption: "late swamiji sessions.",
      desc: "mirror selfie during our late night Swamiji design sessions where we did 5% work and 95% random styling talks." 
    },
    { 
      src: '/images/together_15.jpg', 
      caption: "ice cream during an educational tour.",
      desc: "curing school-induced stress with soft-serves." 
    },
  ];

  // Quick helper to scroll to target section
  const scrollTo = (index) => {
    const sections = document.querySelectorAll('section');
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-white select-none">
      
      {/* Immersive background galaxy */}
      <GalaxyBackground density={350} rotationSpeed={0.06} />

      {/* Floating custom interactive cursor */}
      <GhostCursor />

      {/* Left section navigation progress indicator */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {Array.from({ length: 10 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className="group flex items-center gap-3 focus:outline-none"
            aria-label={`Scroll to Section ${idx + 1}`}
          >
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              activeSection === idx 
                ? 'bg-gold-champagne scale-150 shadow-[0_0_8px_rgba(223,192,128,0.8)]' 
                : 'bg-white/20 group-hover:bg-white/50 scale-100'
            }`} />
            <span className="text-[10px] font-mono text-gold-champagne opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none uppercase tracking-widest">
              {['intro', 'beginnings', 'evidence', 'glitch', 'profile', 'manual', 'blame', 'stats', 'eggs', 'letter'][idx]}
            </span>
          </button>
        ))}
      </div>

      {/* Bottom right music controller */}
      <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3">
        <button
          onClick={toggleMusic}
          className="p-3 rounded-full glass-panel hover:border-gold-champagne/40 transition-all duration-300 text-gold-champagne hover:scale-105 active:scale-95"
          aria-label="Toggle Soundtrack"
        >
          {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Main scrolling containers */}
      <main className="w-full flex flex-col items-center">
        
        {/* SECTION 1: Landing */}
        <section className="min-h-screen w-full max-w-4xl px-6 flex flex-col justify-center items-start relative select-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            <div className="font-mono text-zinc-500 text-sm mb-4 tracking-widest uppercase">Soujhenya presents:</div>
            
            {/* Intro typography chain */}
            <div className="h-16 flex items-center">
              <span className="font-editorial text-2xl text-gold-champagne tracking-wide">
                <TypewriterSequence />
              </span>
            </div>

            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5, duration: 1.2 }}
              className="font-editorial text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 text-glow-gold"
            >
              HAPPY 20 IDIOT.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.5, duration: 1 }}
              className="max-w-xl text-zinc-400 font-light leading-relaxed text-base"
            >
              <div className="relative inline-block text-zinc-600 line-through decoration-gold-champagne/40 mr-2">
                I had an emotional speech ready...
              </div>
              <span className="font-handwritten text-gold-champagne text-lg">okay that's a lie.</span>
              <p className="mt-4">
                Twenty years of existing... and you are still somehow tolerating me.
              </p>
            </motion.div>

            {/* List counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5.5, duration: 1 }}
              className="mt-8 space-y-2 border-l border-gold-champagne/10 pl-6"
            >
              {[
                "20 years of existing.",
                "20 years of drama.",
                "20 years of making ordinary days unforgettable.",
                "20 years of pretending you're calm.",
                "20 years of slaying.",
                "20 years of being my favourite human."
              ].map((txt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 6.0 + index * 0.4 }}
                  className="text-xs font-mono text-zinc-500 hover:text-gold-champagne transition-colors duration-300"
                >
                  {txt}
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 9.0 }}
              onClick={() => scrollTo(1)}
              className="mt-12 group flex items-center gap-2 border border-gold-champagne/20 bg-gold-champagne/5 hover:bg-gold-champagne/15 hover:border-gold-champagne/50 px-6 py-2.5 rounded-full text-gold-champagne font-mono text-xs uppercase tracking-widest transition-all duration-300"
            >
              prove it.
              <CornerDownRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </section>

        {/* SECTION 2: Before We Became Us */}
        <section className="min-h-screen w-full max-w-4xl px-6 flex flex-col justify-center items-center py-20 relative select-none">
          <div className="w-full text-center mb-12">
            <span className="text-gold-champagne/60 font-mono text-xs uppercase tracking-widest">Chapter I</span>
            <h2 className="font-editorial text-4xl md:text-5xl font-light text-white tracking-wide mt-2">
              Before I knew you...
            </h2>
            <p className="text-zinc-400 text-sm mt-3 font-light max-w-md mx-auto">
              You were somewhere out there... probably already judging people's outfits, looking cooler than everyone, and being completely impossible.
            </p>
          </div>

          <div className="w-full">
            <OrbitImages images={orbitImages} />
          </div>

          <div className="w-full flex flex-col items-center mt-12 text-center">
            <p className="font-mono text-zinc-600 text-xs uppercase tracking-widest">Scroll to witness the crash</p>
            <div className="w-[1px] h-12 bg-gradient-to-b from-gold-champagne/20 to-transparent mt-3" />
          </div>
        </section>

        {/* SECTION 3: Evidence */}
        <section className="min-h-screen w-full max-w-5xl px-6 py-24 flex flex-col justify-center relative select-none">
          <div className="mb-16">
            <span className="text-gold-champagne/60 font-mono text-xs uppercase tracking-widest">Chapter II</span>
            <h2 className="font-editorial text-4xl md:text-5xl font-light tracking-wide mt-2">
              Evidence.
            </h2>
            <p className="text-zinc-400 text-sm mt-3 font-light max-w-sm">
              This is the friendship gallery. Not a photo gallery. Real, messy proof of us losing our brain cells in unison.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-24">
            {evidencePhotos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ type: 'spring', stiffness: 30, damping: 50 }}
                className={`relative bg-zinc-950 p-4 border border-white/5 rounded-lg shadow-2xl flex flex-col hover:-translate-y-2 hover:border-gold-champagne/30 transition-all duration-500 ${
                  index % 2 === 1 ? 'md:translate-y-16' : ''
                }`}
              >
                {/* Photo frame */}
                <div className="w-full aspect-[4/5] bg-zinc-900 overflow-hidden rounded relative">
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover grayscale contrast-[1.05] hover:grayscale-0 transition-all duration-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-950 border border-dashed border-white/10">
                          <Trophy class="w-8 h-8 text-gold-champagne/30 mb-2 animate-pulse-slow" />
                          <span class="text-[10px] font-mono text-zinc-500">${photo.src.split('/').pop()}</span>
                        </div>
                      `;
                    }}
                  />
                </div>

                {/* Captions */}
                <div className="pt-4 pb-2">
                  <p className="font-handwritten text-gold-champagne text-xl font-medium tracking-wide text-left">
                    "{photo.caption}"
                  </p>
                  <p className="text-zinc-500 font-mono text-[10px] uppercase mt-2 tracking-widest leading-relaxed text-left">
                    {photo.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Spacer for offset grids */}
          <div className="h-24 md:h-48" />
        </section>

        {/* SECTION 4: Comic Relief (Glitch Screen) */}
        <section className="min-h-screen w-full flex flex-col justify-center items-center bg-zinc-950/40 border-y border-white/5 px-6 relative select-none">
          <div className="absolute inset-0 bg-blue-950/5 pointer-events-none mix-blend-overlay" />
          
          <div className="w-full max-w-md font-mono text-left glass-panel border-red-500/20 p-8 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500/30 animate-pulse" />
            
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase mb-6">
              <AlertCircle className="w-4 h-4" />
              <span>System Glitch Detected</span>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-zinc-500">&gt; SEARCH_INDEX: local_memories/nidhi</p>
              <p className="text-zinc-400">&gt; Looking for one normal picture...</p>
              
              {/* Loader */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-zinc-500 text-[10px]">
                  <span>SCANNING DIRECTORY</span>
                  <span>{glitchProgress}%</span>
                </div>
                <div className="w-full h-3 bg-zinc-900 border border-white/10 rounded overflow-hidden p-[1px]">
                  <motion.div 
                    className="h-full bg-red-500/60 rounded"
                    style={{ width: `${glitchProgress}%` }}
                  />
                </div>
              </div>

              {glitchProgress >= 100 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3 pt-3 border-t border-white/10"
                >
                  <p className="text-red-400 font-bold uppercase">&gt; ERROR: NULL_SUBJECT_FOUND</p>
                  <p className="text-zinc-500 leading-relaxed">
                    Subject "Nidhi" does not possess standard parameters for "normal behavior". All indexes consist of chaos, extreme styling, and design critique.
                  </p>
                </motion.div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                disabled={glitchProgress < 100}
                onClick={() => scrollTo(4)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-wider rounded border transition-all ${
                  glitchProgress >= 100
                    ? 'border-gold-champagne/30 text-gold-champagne hover:bg-gold-champagne/10 hover:border-gold-champagne'
                    : 'border-white/5 text-zinc-600 cursor-not-allowed'
                }`}
              >
                Continue anyway.exe
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 5: This Idiot */}
        <section className="min-h-screen w-full max-w-4xl px-6 flex flex-col justify-center items-center relative py-20 select-none">
          <div className="w-full text-center mb-8">
            <span className="text-gold-champagne/60 font-mono text-xs uppercase tracking-widest font-semibold">Chapter III</span>
            <h2 className="font-editorial text-4xl md:text-5xl font-light text-white tracking-wide mt-2">
              This Idiot.
            </h2>
            <p className="text-zinc-400 text-sm mt-3 font-light">
              You know what is annoying? You make looking effortless look effortless.
            </p>
          </div>

          {/* Interactive Traits Profile Grid */}
          <div className="w-full max-w-3xl glass-panel p-6 rounded-2xl mb-8 border border-white/5 relative overflow-hidden text-left">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-glow-purple/20 rounded-full blur-3xl pointer-events-none" />
            <div className="mb-4">
              <span className="text-gold-champagne/60 font-mono text-xs uppercase tracking-widest block mb-1">Subject Profile // Nidhi, 20</span>
              <p className="text-zinc-400 text-xs leading-relaxed font-light">
                An absolute design perfectionist who will secretly judge the spacing of this text. Tolerates Soujhenya's extreme chaos on a daily basis. Click tags to see roasts.
              </p>
            </div>

            {/* Interactive Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTag(activeTag === idx ? null : idx)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-mono border transition-all duration-300 ${
                    activeTag === idx
                      ? 'bg-gold-champagne text-space-black border-gold-champagne shadow-lg font-semibold'
                      : 'bg-white/5 border-white/10 hover:border-gold-champagne/40 hover:bg-white/10 text-zinc-300'
                  }`}
                >
                  {tag.text}
                </button>
              ))}
            </div>

            {/* Dynamic Roast display box */}
            <div className="h-[60px] flex items-center">
              <AnimatePresence mode="wait">
                {activeTag !== null ? (
                  <motion.div
                    key={activeTag}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="w-full bg-white/5 border border-white/5 p-2.5 rounded-lg flex items-start gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 text-gold-champagne mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] font-mono text-gold-champagne/90 leading-normal">
                      {tags[activeTag].roast}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    className="w-full text-center border border-dashed border-white/10 p-2.5 rounded-lg text-zinc-500 text-[10px] font-mono"
                  >
                    click any tag above to reveal soujhenya's notes
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* WebGL 3D Circular Outfit Gallery */}
          <div className="w-full h-[450px] relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/20 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
            <CircularGallery
              items={soloSlayItems}
              bend={3.5}
              textColor="#dfc080"
              borderRadius={0.06}
              scrollEase={0.03}
            />
          </div>
        </section>

        {/* SECTION 5.5: Troubleshooting Guide (Funny Section) */}
        <section className="min-h-screen w-full max-w-4xl px-6 flex flex-col justify-center py-20 relative select-none">
          <div className="mb-12 text-left">
            <span className="text-gold-champagne/60 font-mono text-xs uppercase tracking-widest font-semibold">Troubleshooting</span>
            <h2 className="font-editorial text-4xl md:text-5xl font-light text-white tracking-wide mt-2">
              The Nidhi Manual
            </h2>
            <p className="text-zinc-400 text-sm mt-3 font-light">
              An interactive guide for debugging Nidhi.exe when she inevitably malfunctions.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Sidebar selector */}
            <div className="flex flex-col gap-3 md:w-1/3">
              {[
                { code: "ERROR: HUNGRY_404" },
                { code: "ERROR: FIGMA_PERF_101" },
                { code: "ERROR: OVERTHINK_200" },
                { code: "ERROR: COIMBATORE_MISSING" }
              ].map((err, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedError(idx)}
                  className={`p-4 rounded-xl text-left border transition-all duration-300 font-mono text-xs ${
                    selectedError === idx
                      ? 'bg-gold-champagne/10 border-gold-champagne text-gold-champagne shadow-lg'
                      : 'bg-white/5 border-white/10 hover:border-gold-champagne/30 text-zinc-400'
                  }`}
                >
                  {err.code}
                </button>
              ))}
            </div>

            {/* Display panel */}
            <div className="flex-1 glass-panel p-6 rounded-2xl border-white/10 flex flex-col justify-between min-h-[300px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gold-champagne/20" />
              
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Left side text info */}
                <div className="flex-1 text-left">
                  <span className="font-mono text-[10px] text-zinc-500 block mb-2 uppercase tracking-widest">Symptom</span>
                  <p className="text-white text-sm leading-relaxed mb-6 font-light">
                    {
                      [
                        "Sudden extreme sassiness, silent treatment, and rejecting all food recommendations.",
                        "Zooming into a layout at 3200% and complaining about a 1px border radius mismatch.",
                        "Formulating 46 different potential outcomes for a simple 5-word conversation.",
                        "Looking aesthetic while sighing at a window and ignoring everyone."
                      ][selectedError]
                    }
                  </p>

                  <div className="border-t border-white/5 pt-4">
                    <span className="font-mono text-[10px] text-gold-champagne/60 block mb-2 uppercase tracking-widest">Solution</span>
                    <p className="font-handwritten text-gold-champagne text-2.5xl leading-relaxed">
                      {
                        [
                          "Order French fries immediately. Do not ask for approval or options. Just execute.",
                          "Agree immediately. Tell her the other designer is colorblind and should be fired.",
                          "Send a stupid cat sticker and tell her she is being a complete idiot.",
                          "Send a photo of our old school yard or auto-rickshaw selfie to reboot."
                        ][selectedError]
                      }
                    </p>
                  </div>
                </div>

                {/* Right side image demonstration */}
                <div className="w-[180px] h-[220px] bg-zinc-950 border border-white/10 p-2 rounded shadow-2xl flex flex-col justify-between flex-shrink-0">
                  <div className="w-full h-[155px] bg-zinc-900 rounded overflow-hidden relative">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={selectedError}
                        src={
                          [
                            '/images/funny_4.jpg',
                            '/images/funny_3.jpg',
                            '/images/funny_1.jpg',
                            '/images/funny_2.jpg'
                          ][selectedError]
                        }
                        alt="Malfunction Demonstration"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover contrast-[1.05]"
                      />
                    </AnimatePresence>
                  </div>
                  <div className="h-[24px] flex items-center justify-center text-center">
                    <span className="font-handwritten text-gold-champagne text-xs truncate max-w-full">
                      {
                        [
                          "sleepy girl weekend just woke up vibes",
                          "hunting 1px padding error",
                          "terrace of our school (scary annual day night)",
                          "chilling in airport waiting"
                        ][selectedError]
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right mt-6 border-t border-white/5 pt-3 w-full">
                <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">Manual revision // v20.0</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: Things I Blame You For */}
        <section className="min-h-screen w-full max-w-4xl px-6 flex flex-col justify-center py-20 relative select-none">
          <div className="mb-12 text-left">
            <span className="text-gold-champagne/60 font-mono text-xs uppercase tracking-widest">Chapter IV</span>
            <h2 className="font-editorial text-4xl md:text-5xl font-light text-white tracking-wide mt-2">
              Things I Blame You For
            </h2>
            <p className="text-zinc-400 text-sm mt-2 font-light">
              A comprehensive and legally binding list of items that are completely your fault.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              { note: "Making Coimbatore steal you.", rotation: "-2deg", delay: 0.1 },
              { note: "Making me laugh at the worst possible timings.", rotation: "3deg", delay: 0.3 },
              { note: "Having completely impossible standards.", rotation: "-1.5deg", delay: 0.2 },
              { note: "Understanding me too easily.", rotation: "2deg", delay: 0.4 },
              { note: "Existing.", rotation: "-3deg", delay: 0.5 }
            ].map((blame, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, delay: blame.delay }}
                style={{ rotate: blame.rotation }}
                className="sticky-note p-6 rounded-xl flex flex-col justify-between aspect-square group hover:border-gold-champagne hover:scale-[1.03] transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] text-gold-champagne/50">FILE // BLAME_{idx + 1}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-champagne/40" />
                </div>
                
                <p className="font-handwritten text-white text-2xl tracking-wide leading-relaxed my-auto select-none">
                  {blame.note}
                </p>
                
                <div className="text-right">
                  <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">Signed, Soujhenya</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 7: Statistics */}
        <section className="min-h-screen w-full max-w-4xl px-6 flex flex-col justify-center py-20 relative select-none">
          <div className="mb-12 text-center">
            <span className="text-gold-champagne/60 font-mono text-xs uppercase tracking-widest">Metrics</span>
            <h2 className="font-editorial text-4xl md:text-5xl font-light text-white tracking-wide mt-2">
              Nidhi in Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { val: '20', label: 'Age', sub: 'Officially old' },
              { val: 'Infinite', label: 'Roasts received', sub: 'Well deserved' },
              { val: '100%', label: 'Outfit success rate', sub: 'No notes' },
              { val: '★★★★★', label: 'Designer Mode', sub: 'Figma royalty' },
              { val: '1', label: 'Favourite Idiot', sub: 'Soujhenya.' },
              { val: 'Debatable.', label: 'Good decisions', sub: 'Further audit required' }
            ].map((stat, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-xl text-center border-white/5 hover:border-gold-champagne/20 transition-colors duration-300 group">
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">{stat.label}</div>
                <div className="font-editorial text-3xl font-light text-gold-champagne tracking-wide text-glow-gold group-hover:scale-105 transition-transform duration-300">{stat.val}</div>
                <div className="font-mono text-[9px] text-zinc-600 mt-2 lowercase">{stat.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8: Hidden Easter Eggs */}
        <section className="min-h-screen w-full max-w-4xl px-6 flex flex-col justify-center items-center py-20 relative select-none">
          <div className="text-center mb-12">
            <Sparkles className="w-6 h-6 text-gold-champagne/50 mx-auto animate-spin-slow" />
            <h2 className="font-editorial text-4xl md:text-5xl font-light text-white tracking-wide mt-3">
              Universe Controls
            </h2>
            <p className="text-zinc-400 text-sm mt-3 font-light">
              Press key <span className="font-mono text-gold-champagne border border-gold-champagne/30 px-1.5 py-0.5 rounded bg-gold-champagne/5 text-xs">N</span> anywhere, or interact below to uncover secrets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            
            {/* Egg 1: Pretty Alert */}
            <div 
              onClick={() => {
                setShowPrettyAlert(true);
                addToast("Pretty warning loaded.", "default");
              }}
              className="glass-panel p-6 rounded-xl border-white/5 hover:border-gold-champagne/30 cursor-pointer text-center flex flex-col justify-between h-48 transition-all duration-300 hover:-translate-y-1"
            >
              <Star className="w-5 h-5 text-gold-champagne/50 mx-auto" />
              <div className="my-auto">
                <span className="font-mono text-xs text-zinc-300 tracking-wider">Inspect Portrait</span>
                <p className="text-[10px] text-zinc-500 mt-2 font-mono lowercase">Double click to unlock response</p>
              </div>
              <div className="text-[9px] font-mono text-gold-champagne/40">TRIGGER_01</div>
            </div>

            {/* Egg 2: Hug Box */}
            <div 
              onClick={() => addToast("Hug granted. (Hold this screen closer)", "sparkle")}
              className="glass-panel p-6 rounded-xl border-white/5 hover:border-gold-champagne/30 cursor-pointer text-center flex flex-col justify-between h-48 transition-all duration-300 hover:-translate-y-1"
            >
              <Gift className="w-5 h-5 text-gold-champagne/50 mx-auto" />
              <div className="my-auto">
                <span className="font-mono text-xs text-zinc-300 tracking-wider">Claim Reward</span>
                <p className="text-[10px] text-zinc-500 mt-2 font-mono lowercase">One free hug. Non-redeemable online.</p>
              </div>
              <div className="text-[9px] font-mono text-gold-champagne/40">TRIGGER_02</div>
            </div>

            {/* Egg 3: Inside joke */}
            <div 
              onClick={() => addToast("Excessive nostalgia detected. Wipe your eyes.", "sparkle")}
              className="glass-panel p-6 rounded-xl border-white/5 hover:border-gold-champagne/30 cursor-pointer text-center flex flex-col justify-between h-48 transition-all duration-300 hover:-translate-y-1"
            >
              <Heart className="w-5 h-5 text-gold-champagne/50 mx-auto" />
              <div className="my-auto">
                <span className="font-mono text-xs text-zinc-300 tracking-wider">Nostalgia Scan</span>
                <p className="text-[10px] text-zinc-500 mt-2 font-mono lowercase">Triggers localized memory leaks.</p>
              </div>
              <div className="text-[9px] font-mono text-gold-champagne/40">TRIGGER_03</div>
            </div>

          </div>

          {/* Interactive Popup for Inspect Portrait */}
          <AnimatePresence>
            {showPrettyAlert && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPrettyAlert(false)}
                className="fixed inset-0 bg-space-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-md"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-xs w-full glass-panel border-gold-champagne/30 p-6 rounded-xl text-center shadow-2xl"
                >
                  <Trophy className="w-8 h-8 text-gold-champagne mx-auto mb-4 animate-bounce" />
                  <p className="font-handwritten text-gold-champagne text-2xl tracking-wide leading-relaxed">
                    Yes.<br/>She is pretty.<br/>Stop clicking.
                  </p>
                  <button
                    onClick={() => setShowPrettyAlert(false)}
                    className="mt-6 w-full py-1.5 border border-white/10 hover:border-white/30 rounded text-[10px] font-mono uppercase tracking-widest text-zinc-400"
                  >
                    Close warning
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* SECTION 9: Letter & Final Screen */}
        <section className="min-h-screen w-full max-w-3xl px-6 flex flex-col justify-center items-start py-20 relative select-none">
          
          {/* Handwritten Letter block */}
          <div className="w-full glass-panel border-white/5 p-8 md:p-12 rounded-2xl relative shadow-2xl">
            <div className="absolute top-6 right-8 font-mono text-[9px] text-zinc-600 tracking-widest">
              DATE: 06.07.2026
            </div>
            
            {/* Displaying typed letter */}
            <div className="whitespace-pre-line font-handwritten text-gold-champagne/90 text-2xl md:text-3xl leading-relaxed tracking-wide text-left min-h-[400px]">
              {letterText}
              <span className="inline-block w-1.5 h-5 bg-gold-champagne ml-1 animate-pulse" />
            </div>
          </div>

          {/* Final screen segment */}
          {letterText.length >= fullLetter.length && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5 }}
              className="mt-16 w-full text-left"
            >
              <h2 className="font-editorial text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 text-glow-gold">
                Happy 20, idiot. ❤️
              </h2>
              
              <div className="font-mono text-zinc-400 text-xs border-l border-gold-champagne/20 pl-6 space-y-2 mb-12">
                <span className="text-[10px] text-gold-champagne/60 font-semibold block uppercase tracking-widest">PS:</span>
                <p>Get me that Bangalore internship.</p>
                <p>I'm not taking no for an answer.</p>
              </div>

              {/* Reset control */}
              <button
                onClick={() => {
                  setLetterText("");
                  setLetterTriggered(false);
                  scrollTo(0);
                  addToast("Rewinding the story...", "default");
                }}
                className="group flex items-center gap-2.5 border border-white/10 hover:border-gold-champagne bg-white/5 hover:bg-gold-champagne/10 px-6 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all duration-300"
              >
                Restart our story
                <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </motion.div>
          )}
        </section>

      </main>

      {/* Interactive Floating Toast Notification Queue */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-xs pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="glass-panel p-3 rounded-lg flex items-center gap-2.5 border-gold-champagne/30 text-xs font-mono select-none"
            >
              {toast.type === 'sparkle' ? (
                <Sparkles className="w-4 h-4 text-gold-champagne flex-shrink-0" />
              ) : (
                <CornerDownRight className="w-4 h-4 text-gold-champagne flex-shrink-0" />
              )}
              <span className="text-zinc-200">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

// Subcomponent: Typing sequence loop helper for landing screen
function TypewriterSequence() {
  const [text, setText] = useState("... you seriously became 20?");
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const sequences = [
      { text: "... you seriously became 20?", delay: 1500 },
      { text: "ew.", delay: 1000 },
      { text: "wait.", delay: 1000 },
      { text: "TWENTY??", delay: 1200 },
      { text: "", delay: 0 } // Ends and vanishes
    ];

    if (phase >= sequences.length) return;

    const timer = setTimeout(() => {
      setPhase((p) => p + 1);
      if (phase < sequences.length - 1) {
        setText(sequences[phase + 1].text);
      }
    }, sequences[phase].delay);

    return () => clearTimeout(timer);
  }, [phase]);

  return <span>{text}</span>;
}
