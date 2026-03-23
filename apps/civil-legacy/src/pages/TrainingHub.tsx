import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, ChevronRight } from 'lucide-react';
import { Hero, SectionHeader } from './Home';
import { Helmet } from 'react-helmet-async';

const TrainingHub = () => {
  const COURSES = [
    {
      title: 'Civil & Water Design',
      description: 'Master industry-standard software for infrastructure design. From Civil 3D alignments to WaterGEMS hydraulic modeling, gain the technical edge required for modern engineering projects.',
      features: ['Civil 3D Proficiency', 'WaterGEMS Modeling', 'AutoCAD Mastery', 'SewerGEMS Design'],
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Technical Documentation',
      description: 'Elevate your reporting standards. Learn to produce professional BOQs, technical specifications, and feasibility reports that meet international consultancy benchmarks.',
      features: ['BOQ Preparation', 'Technical Spec Writing', 'Feasibility Analytics', 'Contract Documentation'],
      image: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'ZIE Reports Mentorship',
      description: 'Strategic guidance for your Professional Interview. We provide structured mentorship on report compilation and presentation for ZIE/ECZ registration.',
      features: ['Report Structuring', 'Professional Review Prep', 'Competency Mapping', 'Mock Interviews'],
      image: 'https://images.unsplash.com/photo-1517089535819-3d8569aa83fa?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Live Interactive Sessions',
      description: 'Real-time technical workshops and peer-review seminars. Join our digital classroom to solve complex project scenarios under the direct supervision of registered Professional Engineers.',
      features: ['Live Q&A Sessions', 'Case Study Clinics', 'Software Troubleshooting', 'Technical Networking'],
      image: 'https://images.unsplash.com/photo-1590402421685-822c23913936?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <div className="bg-black">
      <Helmet>
        <title>Training Hub | Civil Legacy Consultancy</title>
        <meta name="description" content="Empowering the next generation of engineers through rigorous software mastery and technical documentation mentorship." />
      </Helmet>
      <Hero
        titleLine1="KNOWLEDGE"
        titleLine2="TRANSFER."
        subtitle="Empowering the next generation of engineers through rigorous software mastery and technical documentation mentorship."
        bgImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600"
        ctaLabel="Explore Courses"
        onCta={() => {
          const el = document.getElementById('courses');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <section id="courses" className="py-32 bg-black px-6 lg:px-12 text-left">
        <div className="max-w-[1600px] mx-auto">
          <SectionHeader
            title="Curriculum"
            subtitle="Industry-aligned training modules designed to bridge the gap between academic theory and professional practice."
            light
          />
          
          <div className="grid grid-cols-1 gap-32 mt-32">
            {COURSES.map((course, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-20 items-center`}
              >
                <div className="lg:w-1/2">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-[#0077B6]/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative aspect-video overflow-hidden rounded-[3rem] border border-white/10">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2 text-left">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-[12px] font-black text-[#0077B6] uppercase tracking-[0.4em]">Module 0{idx + 1}</span>
                    <div className="h-px w-12 bg-white/20" />
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
                    {course.title}
                  </h3>
                  <p className="text-xl text-gray-400 font-light leading-relaxed mb-12 max-w-xl">
                    {course.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-12">
                    {course.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0077B6]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#"
                    target="_blank"
                    className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-[#0077B6] hover:text-white transition-all duration-500 group"
                  >
                    Enroll Now
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification CTA */}
      <section className="py-32 bg-black border-y border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-center">
          <div className="bg-gradient-to-r from-white/5 to-transparent p-12 md:p-24 rounded-[4rem] border border-white/10 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-[#0077B6]/5 rounded-full blur-3xl -mr-48 -mt-48" />
             <GraduationCap size={64} className="mx-auto text-[#0077B6] mb-8" />
             <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8">Ready to Elevate Your Career?</h2>
             <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto mb-12">
               Join our cohort of engineering professionals and gain the practical skills that top-tier consultancies demand.
             </p>
             <a
               href="#"
               target="_blank"
               className="inline-flex items-center gap-4 px-12 py-6 bg-[#0077B6] text-white font-black uppercase tracking-[0.3em] text-xs rounded-xl hover:bg-white hover:text-black transition-all duration-500 shadow-2xl"
             >
               Apply for Cohort
               <ChevronRight size={18} />
             </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingHub;
