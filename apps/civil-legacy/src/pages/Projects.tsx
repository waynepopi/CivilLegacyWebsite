import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2 } from 'lucide-react';
import { SectionHeader } from './Home';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Badge } from"@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from"@/components/ui/carousel";
import { Helmet } from 'react-helmet-async';
import { getProjects, Project } from '@/services/projectService';

const BLUE = '#0077B6';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="pt-24  min-h-screen px-6 lg:px-12 text-left">
    <Helmet>
      <title>Projects | Civil Legacy Consultancy</title>
      <meta name="description" content="View our comprehensive structural and civil engineering projects across Zimbabwe." />
    </Helmet>
    <div className="max-w-[1600px] mx-auto py-32">
      <SectionHeader
        title="Our Projects"
        subtitle="Comprehensive structural and civil engineering projects across Zimbabwe."
        light
        eyebrow="Portfolio"
      />
      
      {/* Featured Projects Carousel */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-[#0077B6]" size={48} />
        </div>
      ) : projects.length > 0 ? (
        <>
          <Carousel className="w-full max-w-6xl mx-auto mb-32">
            <CarouselContent>
              {projects.slice(0, 5).map((proj, i) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3 p-4">
              <Card className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 h-full flex flex-col hover:border-[#0077B6]/50 transition-all duration-500 rounded-[2rem] overflow-hidden text-left">
                <CardHeader className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-black/20 dark:border-white/20 text-gray-600 dark:text-gray-400">
                      {String(proj.sector)}
                    </Badge>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{String(proj.status)}</span>
                  </div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter">
                    {String(proj.title)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex-grow">
                   <p className="text-gray-600 dark:text-gray-400 font-light text-sm italic mb-4 line-clamp-3">"{String(proj.scope)}"</p>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0077B6]">
                      <MapPin size={12} /> {String(proj.loc)}
                   </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10  hover:bg-[#0077B6] -left-12" />
          <CarouselNext className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10  hover:bg-[#0077B6] -right-12" />
        </div>
      </Carousel>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((proj, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-[#0077B6]/30 transition-all duration-500 rounded-[2rem] h-full text-left">
              <CardHeader className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="secondary" className="bg-[#0077B6]/10 text-[#0077B6] border-none text-[8px] uppercase tracking-widest">
                    {String(proj.sector)}
                  </Badge>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{String(proj.date)}</span>
                </div>
                <CardTitle className="text-xl font-black uppercase tracking-tighter">
                  {String(proj.title)}
                </CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] mt-1" style={{ color: BLUE }}>
                  {String(proj.loc)}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="space-y-4">
                  <div className="p-4 bg-black/5 dark:bg-black/40 rounded-xl border border-black/5 dark:border-white/5">
                    <p className="text-gray-600 dark:text-gray-400 text-xs font-light leading-relaxed line-clamp-2">
                       {String(proj.scope)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                       Capacity: {String(proj.stands)}
                    </div>
                    <Badge variant="outline" className={`text-[8px] uppercase tracking-widest ${proj.status === 'Completed' ? 'border-green-500/50 text-green-500' : 'border-[#0077B6]/50 text-[#0077B6]'}`}>
                       {String(proj.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-500">
          No projects available at the moment.
        </div>
      )}
    </div>
  </div>
  );
};

export default Projects;
