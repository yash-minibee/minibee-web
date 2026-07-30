import { motion } from 'framer-motion'
import { ArrowUpRight, FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

const PROJECTS = [
  { id: 1, title: 'E-Commerce Platform', category: 'Web Development' },
  { id: 2, title: 'Real Estate Chatbot', category: 'WhatsApp API' },
  { id: 3, title: 'SaaS Dashboard', category: 'React Application' },
  { id: 4, title: 'Corporate Portal', category: 'UI/UX Design' },
]

export default function Portfolio() {
  return (
    <div className="pt-32 pb-24">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            Our <span className="text-gradient-orange">Portfolio</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#a1a1aa] text-lg"
          >
            A showcase of premium digital experiences and automated WhatsApp solutions we've built for our clients.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
            >
              <Link to={`/portfolio`} className="block card-glass group overflow-hidden h-[400px] flex flex-col relative">
                <div className="absolute inset-0 bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors" />
                <div className="flex-1 border-b border-white/[0.04] p-8 flex items-center justify-center relative bg-gradient-to-br from-orange-500/5 to-purple-500/5">
                   <div className="absolute inset-0 bg-mesh opacity-20" />
                   <div className="w-32 h-32 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-2xl flex items-center justify-center relative z-10 group-hover:scale-105 transition-transform duration-500">
                     <FolderOpen size={32} className="text-white/20" />
                   </div>
                </div>
                <div className="p-6 md:p-8 flex items-center justify-between relative z-10 bg-[#0a0a0c]/80 backdrop-blur-md">
                  <div>
                    <span className="badge badge-white mb-3">{project.category}</span>
                    <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white transition-all text-[#71717a] shadow-lg">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
