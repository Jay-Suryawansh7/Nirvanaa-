import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { 
  Scale, 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  Zap, 
  Shield, 
  FileText, 
  Users, 
  CheckCircle, 
  Gavel,
  Award
} from "lucide-react";

export default function Landing() {
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-[#d4a53a] selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 px-4 lg:px-6 h-16 flex items-center bg-white/80 backdrop-blur-md border-b shadow-sm transition-all duration-300">
        <Link className="flex items-center justify-center gap-2 group" to="/">
          <div className="bg-[#1e3a5f] p-1.5 rounded-lg group-hover:bg-[#d4a53a] transition-colors duration-300">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-[#1e3a5f] tracking-tight">Auchitya</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium text-slate-600 hover:text-[#1e3a5f] transition-colors" to="/login">
            Login
          </Link>
          <Link to="/register">
             <Button className="bg-[#1e3a5f] hover:bg-[#162a45] text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
               Get Started
             </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#24426a] to-[#1e3a5f] text-white">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#d4a53a] blur-[100px]" />
            <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-blue-400 blur-[120px]" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent" />
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div 
                className="flex flex-col justify-center space-y-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 w-fit backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-[#d4a53a]"></span>
                  <span className="text-sm font-medium text-slate-100">Revolutionizing Justice Delivery</span>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white leading-tight">
                    Justice Delayed is <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a53a] to-yellow-200">
                      Justice Denied.
                    </span>
                  </h1>
                  <p className="max-w-[600px] text-slate-200 md:text-xl leading-relaxed">
                    Auchitya reduces court adjournments by ensuring cases are ready before hearings. 
                    Identify risks, confirm attendance, and streamline the justice process with AI-driven insights.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto bg-[#d4a53a] hover:bg-[#b88d2f] text-[#1e3a5f] font-bold text-lg h-12 px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10 hover:text-white h-12 px-8 font-medium">
                      Learn More <BookOpen className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center gap-4 text-sm text-slate-300 pt-4">
                  <div className="flex -space-x-3">
                     {[1,2,3].map((i) => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1e3a5f] bg-slate-200 flex items-center justify-center text-[10px] text-black font-bold">U{i}</div>
                     ))}
                  </div>
                  <p>Trusted by 500+ legal professionals</p>
                </motion.div>
              </motion.div>

              {/* Hero Illustration */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
                className="hidden lg:flex justify-center items-center relative"
              >
                 <div className="relative w-[500px] h-[500px]">
                    <motion.div 
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl skew-y-3 z-10 flex items-center justify-center"
                    >
                       <div className="text-center p-8">
                          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-[#d4a53a] to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                            <Scale className="h-12 w-12 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">Automated Readiness</h3>
                          <div className="space-y-3 mt-6 text-left">
                             <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                                <CheckCircle className="text-green-400 h-5 w-5" />
                                <span className="text-slate-200">Documents Verified</span>
                             </div>
                             <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                                <CheckCircle className="text-green-400 h-5 w-5" />
                                <span className="text-slate-200">Parties Notified</span>
                             </div>
                             <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
                                <Zap className="text-[#d4a53a] h-5 w-5" />
                                <span className="text-slate-200">Readiness Score: 98%</span>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                    {/* Background elements behind card */}
                    <div className="absolute top-10 -right-10 w-full h-full border border-dashed border-white/20 rounded-2xl skew-y-3 -z-10" />
                    <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-[#d4a53a]/20 blur-xl" />
                 </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-10 bg-slate-50 border-b">
           <div className="container px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200/50">
                 {[
                   { label: "Cases Managed", value: "2,500+" },
                   { label: "Reduction in Adjournments", value: "65%" },
                   { label: "Court Hours Saved", value: "12k+" },
                   { label: "Active Courts", value: "14" },
                 ].map((stat, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, y: 10 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: idx * 0.1 }}
                     className="p-2"
                   >
                     <h3 className="text-3xl font-extrabold text-[#1e3a5f]">{stat.value}</h3>
                     <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">{stat.label}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
              <div className="inline-block px-3 py-1 rounded-full bg-[#1e3a5f]/5 text-[#1e3a5f] font-semibold text-sm">
                Why Choose Auchitya?
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-[#1e3a5f]">
                Streamlining Justice with Technology
              </h2>
              <p className="max-w-[700px] text-slate-600 md:text-lg">
                Our platform addresses the root causes of delays in the judicial system with powerful, intuitive tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  icon: Calendar, 
                  title: "Reduce Adjournments", 
                  desc: "Automated checks ensure all prerequisites are met before a hearing is scheduled.",
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                { 
                  icon: Zap, 
                  title: "Real-time Updates", 
                  desc: "Instant notifications for lawyers, parties, and judges about case status changes.",
                  color: "text-amber-600",
                  bg: "bg-amber-50"
                },
                { 
                  icon: Shield, 
                  title: "Secure & Reliable", 
                  desc: "Enterprise-grade security ensuring case data integrity and confidentiality.",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50"
                },
                { 
                  icon: FileText, 
                  title: "Smart Documents", 
                  desc: "AI-assisted document sorting, verification, and summarization.",
                  color: "text-purple-600",
                  bg: "bg-purple-50"
                }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className={`p-4 rounded-full ${feature.bg} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1e3a5f] mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="w-12 h-1 bg-[#d4a53a]/30 mt-6 rounded-full group-hover:w-24 group-hover:bg-[#d4a53a] transition-all duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-slate-50">
           <div className="container px-4 md:px-6">
              <div className="text-center mb-16 space-y-4">
                 <h2 className="text-3xl font-bold text-[#1e3a5f]">How It Works</h2>
                 <p className="text-slate-600">Three simple steps to a faster judicial process</p>
              </div>

              <div className="grid md:grid-cols-3 gap-12 relative px-4">
                 {/* Connecting Line (Desktop) */}
                 <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10" />

                 {[
                   { icon: FileText, title: "1. Upload & Verify", desc: "Lawyers upload documents. System auto-verifies completeness." },
                   { icon: Users, title: "2. Confirm Availability", desc: "All parties confirm their readiness and attendance digitally." },
                   { icon: Gavel, title: "3. Hearing Proceeds", desc: "Judge receives a 'Ready' signal. Hearing proceeds without delay." },
                 ].map((step, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      className="flex flex-col items-center text-center bg-white p-6 rounded-xl shadow-sm border border-slate-100 z-10"
                    >
                       <div className="w-16 h-16 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white mb-6 shadow-lg">
                          <step.icon className="h-7 w-7" />
                       </div>
                       <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
                       <p className="text-slate-600">{step.desc}</p>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-[#1e3a5f] text-white">
           <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold text-center mb-12">What Legal Experts Say</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                 {[
                   { 
                     quote: "Auchitya has completely transformed how I manage my court docket. The readiness checks save hours every week.",
                     author: "Hon. Justice R.K. Singh",
                     role: "District Court Judge"
                   },
                   { 
                     quote: "Finally, a system that respects everyone's time. Adjournments due to missing files are a thing of the past.",
                     author: "Adv. Priya Sharma",
                     role: "Senior Counsel"
                   }
                 ].map((t, i) => (
                   <motion.div 
                     key={i}
                     whileHover={{ scale: 1.02 }}
                     className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10"
                   >
                      <div className="flex gap-1 mb-4">
                         {[1,2,3,4,5].map(s => <Award key={s} className="h-5 w-5 text-[#d4a53a]" />)}
                      </div>
                      <p className="text-lg italic text-slate-200 mb-6">"{t.quote}"</p>
                      <div>
                         <div className="font-bold text-white">{t.author}</div>
                         <div className="text-[#d4a53a] text-sm">{t.role}</div>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#24426a] rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
               {/* Decorative circles */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d4a53a]/20 rounded-full translate-y-1/2 -translate-x-1/2" />
               
               <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                 <h2 className="text-3xl font-bold sm:text-4xl">Ready to Modernize Your Court?</h2>
                 <p className="text-slate-200 text-lg">
                   Join the growing network of courts and legal professionals using Auchitya to deliver timely justice.
                 </p>
                 <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <Link to="/register">
                      <Button size="lg" className="w-full sm:w-auto bg-[#d4a53a] hover:bg-[#b88d2f] text-[#1e3a5f] font-bold h-12 px-8">
                        Get Started Now
                      </Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10 h-12 px-8">
                        Contact Sales
                      </Button>
                    </Link>
                 </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container px-4 md:px-6 grid gap-8 md:grid-cols-4">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Scale className="h-6 w-6 text-[#d4a53a]" />
                 <span className="font-bold text-xl text-white">Auchitya</span>
              </div>
              <p className="text-sm">
                 Empowering the justice system with technology, one case at a time.
              </p>
           </div>
           
           <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                 <li><Link to="#" className="hover:text-[#d4a53a]">Features</Link></li>
                 <li><Link to="#" className="hover:text-[#d4a53a]">Pricing</Link></li>
                 <li><Link to="#" className="hover:text-[#d4a53a]">Security</Link></li>
              </ul>
           </div>

           <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                 <li><Link to="#" className="hover:text-[#d4a53a]">About Us</Link></li>
                 <li><Link to="#" className="hover:text-[#d4a53a]">Careers</Link></li>
                 <li><Link to="#" className="hover:text-[#d4a53a]">Contact</Link></li>
              </ul>
           </div>

           <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                 <li><Link to="#" className="hover:text-[#d4a53a]">Privacy Policy</Link></li>
                 <li><Link to="#" className="hover:text-[#d4a53a]">Terms of Service</Link></li>
              </ul>
           </div>
        </div>
        <div className="container px-4 md:px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
           © 2025 Auchitya Justice Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
