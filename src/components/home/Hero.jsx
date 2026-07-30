import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Zap, MessageCircle, BarChart3, Users, CheckCircle, TrendingUp, Smile, Paperclip, Mic, Send, ChevronLeft, ChevronRight } from 'lucide-react'
import { FaWhatsapp, FaFacebook, FaInstagram, FaSalesforce } from 'react-icons/fa'
import { SiMeta } from 'react-icons/si'



const FLOAT_ICONS = [
  { id: 'whatsapp', icon: FaWhatsapp, color: '#25D366', size: 36, delay: 0, position: { top: '-25px', right: '-40px' }, isMain: true },
  { id: 'minibee', icon: 'MINIBEE', color: '#f85a22', size: 28, delay: 0.2, position: { bottom: '40px', left: '-50px' } },
  { id: 'meta', icon: SiMeta, color: '#0468FF', size: 24, delay: 0.4, position: { top: '80px', left: '-40px' } },
  { id: 'instagram', icon: FaInstagram, color: '#E1306C', size: 24, delay: 0.6, position: { bottom: '120px', right: '-60px' } },
  { id: 'salesforce', icon: FaSalesforce, color: '#00A1E0', size: 20, delay: 0.8, position: { top: '-15px', left: '120px' } },
  { id: 'facebook', icon: FaFacebook, color: '#1877F2', size: 24, delay: 1.0, position: { bottom: '-20px', right: '80px' } },
]



export default function Hero() {
  const containerRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })
  const [messages, setMessages] = useState([
    { from: 'bot', text: '👋 Hi there! Welcome to the Minibee AI Automation Demo.' },
    { from: 'bot', text: '👇 Click "Start Demo" to see how our AI handles product catalogs and customer inquiries automatically!' }
  ])
  const [options, setOptions] = useState(["Start Demo"])
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [activeProductIndex, setActiveProductIndex] = useState(0)
  const [hasClickedStart, setHasClickedStart] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Custom JS to lock page scroll when hovering/scrolling inside the WhatsApp mockup
  useEffect(() => {
    const chatEl = chatRef.current;
    if (!chatEl) return;

    const handleWheel = (e) => {
      // Stop the scroll event from bubbling up to the main page
      e.stopPropagation();

      const isAtTop = chatEl.scrollTop <= 0;
      const isAtBottom = chatEl.scrollHeight - chatEl.scrollTop <= chatEl.clientHeight + 1;

      // If scrolling up at the very top, or scrolling down at the very bottom,
      // prevent the default browser behavior so the main page doesn't move.
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
      }
    };

    // Use passive: false so we can call e.preventDefault()
    chatEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => chatEl.removeEventListener('wheel', handleWheel);
  }, []);

  const handleOptionClick = (option) => {
    if (option === 'Start Demo') {
      setHasClickedStart(true)
    }
    setMessages(prev => [...prev, { from: 'customer', text: option }])
    setOptions([])
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      if (option === 'Start Demo') {
        setMessages(prev => [...prev, { from: 'bot', text: 'Awesome! 🚀 What type of products are you looking for today? Please select a category below:' }])
        setOptions(["Category A", "Category B", "Category C"])
      } else if (option.startsWith('Category')) {
        setActiveProductIndex(0)
        setMessages(prev => [
          ...prev, 
          { from: 'bot', text: `Great choice! Here are our top picks for ${option}:` },
          { 
            from: 'bot', 
            type: 'catalog',
            products: [
              {
                image: `https://fpoimg.com/400x350?text=${encodeURIComponent(option + " Product 1")}&text_color=303030&dims=false&bg_color=b0b0b0`,
                title: `${option} Product 1`,
                description: `This is a premium product from ${option}. High quality and top rated!`,
                price: '₹1,999'
              },
              {
                image: `https://fpoimg.com/400x350?text=${encodeURIComponent(option + " Product 2")}&text_color=303030&dims=false&bg_color=b0b0b0`,
                title: `${option} Product 2`,
                description: `Best selling product in ${option}. Great value for money.`,
                price: '₹2,499'
              },
              {
                image: `https://fpoimg.com/400x350?text=${encodeURIComponent(option + " Product 3")}&text_color=303030&dims=false&bg_color=b0b0b0`,
                title: `${option} Product 3`,
                description: `New arrival in ${option}. Experience the latest features.`,
                price: '₹999'
              }
            ]
          }
        ])
        setTimeout(() => setOptions(["Buy Now", "Talk to Sales", "Restart Demo"]), 1500)
      } else if (option === 'Buy Now') {
        setMessages(prev => [...prev, { from: 'bot', text: 'Excellent! 🎉 Our team is reviewing your request. I will shortly share a detailed quotation with you right here.' }])
        setTimeout(() => setOptions(["Restart Demo"]), 1500)
      } else if (option === 'Talk to Sales') {
        setMessages(prev => [...prev, { from: 'bot', text: 'Got it! 🧑‍💼 I\'m routing you to one of our product experts. They will reach out shortly.' }])
        setTimeout(() => setOptions(["Restart Demo"]), 1500)
      } else if (option === 'Restart Demo') {
        setMessages([
          { from: 'bot', text: '👋 Hi there! Welcome to the Minibee AI Automation Demo.' },
          { from: 'bot', text: '👇 Click "Start Demo" to see how our AI handles product catalogs and customer inquiries automatically!' }
        ])
        setOptions(["Start Demo"])
      }
    }, 1200)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    const text = inputValue.trim()
    setInputValue('')
    setMessages(prev => [...prev, { from: 'customer', text }])
    setOptions([])
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { from: 'bot', text: 'Thanks for your message! Since this is just a quick demo, I only respond to the quick reply buttons above. Book a demo to see my full AI capabilities! 🚀' }])
      setTimeout(() => setOptions(["Restart Demo"]), 1500)
    }, 1500)
  }

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    mouseX.set(x * 20)
    mouseY.set(y * 20)
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center pt-[72px] overflow-hidden "
    >
      {/* ── Animated Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 grid-pattern opacity-40" />
        {/* Radial gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-orange-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]" />
        {/* Animated orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-orange-400/8 rounded-full blur-[60px]"
        />
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-orange-500/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10 py-14">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ── Left: Content ── */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="badge badge-orange">
                <FaWhatsapp size={13} />
                Official Meta Business Partner
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight"
            >
              Transform{' '}
              <span className="text-gradient-orange">Customer</span>
              <br />
              Conversations
              <br />
              Into Growth.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 text-lg text-[#a1a1aa] leading-relaxed max-w-lg"
            >
              Official WhatsApp Business API, AI-powered chatbots, and world-class web applications — built to help your business grow faster, smarter, and at scale.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/contact" className="btn-primary">
                <Zap size={18} />
                Book Free Demo
                <ArrowRight size={16} />
              </Link>
              <Link to="/features" className="btn-secondary">
                Explore Features
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex items-center gap-4"
            >
              <div className="flex -space-x-2.5">
                {['#f85a22', '#7c3aed', '#0ea5e9', '#10b981', '#f59e0b'].map((color, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-[#09090b] flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {['A', 'P', 'R', 'S', 'K'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-[#71717a] mt-0.5">
                  <strong className="text-white">2K+</strong> businesses trust Minibee
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── Right: Dashboard / Chat Preview ── */}
          <motion.div
            style={{ x: springX, y: springY }}
            className="relative mt-12 lg:mt-0 lg:ml-auto w-full max-w-[320px] sm:max-w-[340px] mx-auto z-20"
          >
            {/* Main iPhone Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative border-[10px] sm:border-[12px] border-[#121212] rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/10 flex flex-col bg-[#0b141a] h-[580px] lg:h-[620px]"
            >
              {/* iPhone Notch */}
              <div className="absolute top-0 inset-x-0 h-5 sm:h-6 flex justify-center z-50">
                <div className="w-[110px] h-full bg-[#121212] rounded-b-2xl"></div>
              </div>

              {/* iPhone Status Bar */}
              <div className="bg-[#202c33] px-6 pt-1.5 pb-1 flex items-center justify-between relative z-30">
                <div className="text-[10px] font-semibold text-white/90">9:41</div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-white/90" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21L15.6 16.2C14.6 15.45 13.35 15 12 15C10.65 15 9.4 15.45 8.4 16.2L12 21ZM12 3C7.95 3 4.2 4.65 1.2 7.65L12 22.05L22.8 7.65C19.8 4.65 16.05 3 12 3Z"/></svg>
                  <svg className="w-3.5 h-3.5 text-white/90" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2H10V4H8.33C7.6 4 7 4.6 7 5.33V20.67C7 21.4 7.6 22 8.33 22H15.67C16.4 22 17 21.4 17 20.67V5.33C17 4.6 16.4 4 15.67 4Z"/></svg>
                </div>
              </div>

              {/* Full Screen Interactive WhatsApp Chat */}
              <div className="w-full flex-1 flex flex-col relative bg-[#0b141a] min-h-0 overflow-hidden">

                <div className="bg-[#0b141a] w-full flex flex-col flex-1 relative z-20 min-h-0 overflow-hidden">
                  <div className="bg-[#202c33] px-5 py-4 flex items-center gap-4 relative z-10 shadow-sm border-b border-white/[0.02]">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <FaWhatsapp size={22} className="text-[#25D366]" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#e9edef] leading-tight mb-0.5">Minibee Automation Demo</p>
                      <p className="text-xs text-[#8696a0]">Online · Interactive</p>
                    </div>
                  </div>
                  <div className="flex-1 relative min-h-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-cover bg-center z-0" />
                    <div className="absolute inset-0 bg-[#0b141a]/90 z-0" />
                    
                    <div 
                      ref={chatRef}
                      className="absolute inset-0 p-5 overflow-y-auto z-10 no-scrollbar overscroll-contain"
                    >
                      {/* Inner wrapper for bottom pinning */}
                      <div className="flex flex-col justify-end min-h-full pb-2">
                        <div className="space-y-2 flex flex-col w-full">
                        <AnimatePresence>
                          {messages.map((msg, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              className={`flex gap-2 w-full ${msg.from === 'customer' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[85%] rounded-lg text-[12px] leading-relaxed shadow-sm ${
                                  msg.from === 'customer'
                                    ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none px-3 py-1.5'
                                    : 'bg-[#202c33] text-[#e9edef] rounded-tl-none ' + (msg.type === 'catalog' ? 'p-1' : 'px-3 py-1.5')
                                }`}
                              >
                                {msg.type === 'catalog' ? (
                                  <div className="flex flex-col relative group">
                                    {/* Preload images to prevent flicker on next/prev */}
                                    <div className="hidden">
                                      {msg.products.map((p, idx) => (
                                        <img key={idx} src={p.image} alt="" />
                                      ))}
                                    </div>
                                    <div className="relative">
                                      <img src={msg.products[activeProductIndex].image} alt={msg.products[activeProductIndex].title} className="w-full h-32 object-cover rounded-md mb-2" />
                                      {msg.products.length > 1 && (
                                        <>
                                          <button 
                                            onClick={() => setActiveProductIndex(prev => prev === 0 ? msg.products.length - 1 : prev - 1)}
                                            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                                          >
                                            <ChevronLeft size={14} />
                                          </button>
                                          <button 
                                            onClick={() => setActiveProductIndex(prev => prev === msg.products.length - 1 ? 0 : prev + 1)}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                                          >
                                            <ChevronRight size={14} />
                                          </button>
                                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                                            {msg.products.map((_, dotIdx) => (
                                              <div key={dotIdx} className={`w-1.5 h-1.5 rounded-full ${dotIdx === activeProductIndex ? 'bg-white' : 'bg-white/40'}`} />
                                            ))}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                    <div className="px-2 pb-1">
                                      <p className="font-bold text-[13px] text-white">{msg.products[activeProductIndex].title}</p>
                                      <p className="text-[#8696a0] text-[11px] leading-tight mt-0.5 min-h-[30px]">{msg.products[activeProductIndex].description}</p>
                                      <p className="text-[#00a884] font-semibold mt-1.5">{msg.products[activeProductIndex].price}</p>
                                    </div>
                                    <div className="border-t border-white/[0.05] mt-1 pt-1.5 pb-0.5 px-2 text-center text-[#53bdeb] font-semibold cursor-pointer hover:bg-white/5 transition-colors rounded-b-lg">
                                      View Product
                                    </div>
                                  </div>
                                ) : (
                                  msg.text
                                )}
                                <div className={`text-[9px] mt-0.5 flex items-center gap-1 ${msg.from === 'customer' ? 'text-[#8696a0] justify-end' : 'text-[#8696a0]'} ${msg.type === 'catalog' ? 'px-2 pb-1 justify-end' : ''}`}>
                                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {msg.from === 'customer' && <span className="text-[#53bdeb] font-bold text-[10px]">✓✓</span>}
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {isTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="flex justify-start w-full"
                            >
                              <div className="bg-[#202c33] px-3 py-2.5 rounded-lg rounded-tl-none flex gap-1 items-center shadow-sm">
                                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-[#8696a0]" />
                                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[#8696a0]" />
                                <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[#8696a0]" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {options.length > 0 && !isTyping && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-wrap gap-2.5 mt-4 justify-end w-full"
                        >
                          {options.map((opt, i) => {
                            const isBookDemo = opt === 'Start Demo';
                            const isHighlighting = !hasClickedStart && options.includes('Start Demo') && !isTyping;
                            
                            return (
                              <div key={i} className="relative">
                                {isBookDemo && isHighlighting && (
                                  <motion.div
                                    animate={{ opacity: [0, 1, 0], y: [2, -2, 2] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-black font-extrabold text-xs whitespace-nowrap bg-white px-2.5 py-1 rounded-md shadow-[0_4px_12px_rgba(255,255,255,0.3)] pointer-events-none flex flex-col items-center z-50 uppercase tracking-wide"
                                  >
                                    Click!
                                    <div className="absolute -bottom-1 w-2.5 h-2.5 bg-white rotate-45"></div>
                                  </motion.div>
                                )}
                                <motion.button
                                  onClick={() => handleOptionClick(opt)}
                                  animate={isHighlighting && !isBookDemo ? {
                                    filter: ['blur(0px)', 'blur(4px)', 'blur(0px)'],
                                    opacity: [1, 0.4, 1]
                                  } : { filter: 'blur(0px)', opacity: 1 }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                  className={`bg-[#005c4b]/95 hover:bg-[#005c4b] border border-[#005c4b]/50 text-white text-xs font-semibold py-2.5 px-5 rounded-full text-center shadow-xl shadow-[#005c4b]/30 ${
                                    isBookDemo 
                                      ? 'ring-2 ring-white/60 scale-105 relative z-40' 
                                      : 'hover:scale-105 active:scale-95 transition-all relative z-10'
                                  }`}
                                >
                                  {opt}
                                </motion.button>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>
                  </div>
                  </div>

                  {/* WhatsApp Typing Bar */}
                  <form 
                    onSubmit={handleSendMessage} 
                    className="bg-[#202c33] px-2 sm:px-3 py-2 flex items-center gap-1.5 sm:gap-2 relative z-10 border-t border-white/[0.04]"
                  >
                    <button type="button" className="text-[#8696a0] hover:text-[#e9edef] transition-colors p-1 flex-shrink-0">
                      <Smile size={22} strokeWidth={1.5} />
                    </button>
                    <button type="button" className="text-[#8696a0] hover:text-[#e9edef] transition-colors p-1 flex-shrink-0">
                      <Paperclip size={20} strokeWidth={1.5} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message"
                        className="w-full bg-[#2a3942] rounded-full px-4 py-2 text-sm text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:ring-1 focus:ring-white/10"
                      />
                    </div>
                    <button type="submit" className="text-[#8696a0] hover:text-[#e9edef] transition-colors p-1 flex-shrink-0">
                      {inputValue.trim() ? (
                        <Send size={20} strokeWidth={1.5} className="text-[#25D366]" />
                      ) : (
                        <Mic size={22} strokeWidth={1.5} />
                      )}
                    </button>
                  </form>

                  {/* iPhone Home Indicator */}
                  <div className="bg-[#202c33] h-6 sm:h-8 w-full flex items-end justify-center pb-2.5 relative z-10 rounded-b-[2rem]">
                    <div className="w-[110px] sm:w-[130px] h-[5px] bg-white/40 rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Brand Icons */}
            {FLOAT_ICONS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.5, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
                transition={{ 
                  opacity: { delay: 0.8 + item.delay, duration: 0.5 },
                  scale: { delay: 0.8 + item.delay, duration: 0.5, ease: 'backOut' },
                  y: { delay: 1.3 + item.delay, duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }
                }}
                style={{
                  position: 'absolute',
                  ...item.position
                }}
                className={`glass hidden lg:flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${
                  item.isMain 
                    ? 'w-16 h-16 rounded-2xl border-2 border-white/[0.15]' 
                    : 'w-12 h-12 rounded-xl border border-white/[0.08]'
                }`}
              >
                <div 
                  className="absolute inset-0 rounded-inherit opacity-20" 
                  style={{ backgroundColor: item.color, borderRadius: 'inherit' }} 
                />
                {item.icon === 'MINIBEE' ? (
                  <img src="/Logo/Icon.png" alt="Minibee" className="w-6 h-6 object-contain z-10" />
                ) : (
                  <item.icon size={item.size} style={{ color: item.color }} className="z-10 relative" />
                )}
              </motion.div>
            ))}

            {/* Glow effect behind card */}
            <div className="absolute inset-0 -z-10 bg-orange-500/10 blur-[60px] rounded-full" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#a1a1aa] uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-orange-500 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
