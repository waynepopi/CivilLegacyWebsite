import React from 'react';
import { SectionHeader } from './Home';
import { CONFIG } from '@/config';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from"@/components/ui/card";
import { Helmet } from 'react-helmet-async';

const BLUE = '#0077B6';

const Team = () => (
  <div className="pt-24  min-h-screen  px-6 lg:px-12 text-left">
    <Helmet>
      <title>Our Team | Civil Legacy Consultancy</title>
      <meta name="description" content="Meet our multidisciplinary board of registered Professional Engineers." />
    </Helmet>
    <div className="max-w-[1600px] mx-auto py-32">
      <SectionHeader
        title="Expertise"
        subtitle="Our multidisciplinary board of registered Professional Engineers."
        light
        eyebrow="Our Expert Engineering Team"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
        {CONFIG.TEAM.map((member, i) => (
          <Card
            key={i}
            className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-[#0077B6]/50 transition-all duration-500 overflow-hidden group rounded-[2rem] h-full flex flex-col text-left"
          >
            <div className="relative aspect-square overflow-hidden transition-all duration-700">
              <img
                src={member.img}
                alt={String(member.name)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-3xl font-black uppercase tracking-tighter  mb-2">
                {String(member.name)}
              </CardTitle>
              <CardDescription className="font-bold text-xs uppercase tracking-widest" style={{ color: BLUE }}>
                {String(member.role)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-6 flex-grow">
              <div className="space-y-4">
                <div className="h-px bg-black/10 dark:bg-white/10 w-12" />
                <div className="space-y-1 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BLUE }} />
                    {String(member.creds)}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BLUE }} />
                    {String(member.id)}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <div className="flex gap-4">
                 {/* Social links could go here if needed */}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default Team;
