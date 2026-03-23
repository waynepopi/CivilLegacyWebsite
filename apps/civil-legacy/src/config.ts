import { HardHat, Ruler, GraduationCap, Briefcase } from 'lucide-react';

export const CONFIG = {
  BRAND: {
    NAME_1: 'CIVIL',
    NAME_2: 'LEGACY',
    TAGLINE: 'Consultancy',
    REGISTRATION: 'ZIE 198098 | ECZ 151080',
  },
  CONTACT: {
    MAIN_LINE: '0718 246 433',
    SECONDARY_LINE: '+263 71 440 6037',
    WHATSAPP_NUM: '263718246433',
    EMAIL: 'info@civillegacy.com',
    OFFICES: [
      { name: 'Headquarters', location: '1066 Dam View Mall, Chipinge' },
      { name: 'Gweru Branch', location: '4248 Avian Way, Northlea' },
    ],
    EXTENSIONS: [
      { name: 'Tech Pamela', num: '0718 246 434' },
      { name: 'Bridget', num: '0718 246 435' },
      { name: 'Sharlom', num: '0718 246 439' },
      { name: 'Eng. Panashe', num: '0718 246 446' },
      { name: 'Tanya', num: '0718 246 463' },
      { name: 'Albert', num: '0718 246 468' },
      { name: 'Eng. Mutero', num: '0718 246 470' },
      { name: 'Planner Farai', num: '0718 246 473' },
      { name: 'Chiwawa', num: '0718 246 474' },
    ],
  },
  PROJECTS: [
    { title: 'Suncoast Project', loc: 'Masvingo', sector: 'Residential', scope: 'Road Design, Water Reticulation, Sewer Reticulation, Stormwater Drainage', stands: '3200 Stands', date: 'Oct 2022', status: 'Completed' },
    { title: 'The Nest of Kenilworth', loc: 'Chipinge', sector: 'Residential', scope: 'Water, Stormwater, Sewer, Road and Public Lighting Design', stands: '3800 Stands', date: 'Nov 2025', status: 'Underway' },
    { title: 'Victoria Range', loc: 'Masvingo', sector: 'Residential', scope: 'Water & Sewer Reticulation Designs', stands: '500 Stands', date: 'Dec 2023', status: 'Completed' },
    { title: 'Boronia Farm Subdivision', loc: 'Harare', sector: 'Residential', scope: 'Water Reticulation Design', stands: '200 Stands', date: 'Mar 2025', status: 'Underway' },
    { title: 'Flamboyant Project', loc: 'Masvingo', sector: 'Residential', scope: 'Water Reticulation Design', stands: '400 Stands', date: 'Jan 2023', status: 'Completed' },
    { title: 'Mutare Recovery Facility', loc: 'Mutare', sector: 'Industrial', scope: 'Full structural design & geotechnical guidance for Industrial Waste Processing Structure', stands: 'Industrial', date: 'Completed', status: 'Completed' },
    { title: 'Madziwa Structural Development', loc: 'Gweru', sector: 'Industrial', scope: 'Full structural design, detailing and documentation for reinforced concrete multi-level building', stands: 'Multi-Storey', date: 'Completed', status: 'Completed' },
    { title: 'Popi Residence', loc: 'Gweru', sector: 'Residential', scope: 'High-end modern residential structural design with reinforced concrete framing and cantilever elements', stands: 'Randolph Phase 1', date: 'Underway', status: 'Underway' },
    { title: 'Proposed Shops & Offices', loc: 'Rusape', sector: 'Commercial', scope: 'Commercial double-storey structural design and reinforcement detailing under BS 8110 standards', stands: 'Stand 2461', date: 'Approved', status: 'Approved' },
    { title: 'Waste Stabilisation Ponds', loc: 'Gweru', sector: 'Infrastructure', scope: 'Design of complete wastewater stabilisation pond system and abattoir effluent treatment', stands: 'Connemara Farm', date: 'Completed', status: 'Completed' },
    { title: 'Fuel Service Station', loc: 'Muzarabani', sector: 'Commercial', scope: 'Commercial structural design of canopy, steel framing and composite infrastructure', stands: 'Energy Park', date: 'Completed', status: 'Completed' },
    { title: '219m² Residential Unit', loc: 'Chipinge', sector: 'Residential', scope: 'Structural design for modern medium-density residential development including boundary walls', stands: 'Residential', date: 'Completed', status: 'Completed' },
    { title: 'Residential Unit (St Kelvin)', loc: 'Chipinge', sector: 'Residential', scope: 'Full structural design and construction documentation for high-end multi-bedroom dwelling', stands: 'High-End', date: 'Completed', status: 'Completed' },
    { title: 'Church Structure Foundation', loc: 'Chipinge', sector: 'Institutional', scope: 'Structural foundation design and reinforcement detailing for institutional development', stands: 'UCCZ Gaza', date: 'Completed', status: 'Completed' },
    { title: 'Structural Building Development', loc: 'Mt Selinda', sector: 'Institutional', scope: 'Comprehensive multi-storey reinforced concrete building structural design and certification', stands: 'Multi-Storey', date: 'Completed', status: 'Completed' },
  ],
  TEAM: [
    { name: 'Eng. Dereck M. Popi', role: 'Company Director', id: 'ZIE 198098 | ECZ 151080', creds: 'BSc (Hons), MBA, Pr Eng', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600' },
    { name: 'Simbarashe Musakwembewa', role: 'Structural Expert', id: 'ZIE 084408 | ECZ 150285', creds: 'BSc (Hons), Pr. Eng, MECZ', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' },
    { name: 'Eng. Byron Muzovaka', role: 'GeoTech Expert', id: 'ZIE 144395 | ECZ 100645', creds: 'BSc (Hons), ECZ, Pr. Eng', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600' },
    { name: 'Eng. Panashe Gora', role: 'Lead Engineer', id: 'ZIE 144446 | ECZ 100446', creds: 'BSc (Hons), ECZ, Pr. Eng', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600' },
    { name: 'Tawanda Mvarume', role: 'Civil & Water Engineer', id: 'ZIE 150410 | ECZ 120511', creds: 'BSc (Hons), Civil Design Specialist', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600' },
  ],
  SCROLL_IMAGES: [
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1504307651254-35680f3366d4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517089535819-3d8569aa83fa?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=800',
  ],
  SERVICES: [
    {
      id: 'construction',
      title: 'Construction',
      pillar: 'Construction',
      Icon: HardHat,
      summary: 'Implementation of heavy-duty urban and industrial infrastructure.',
      details: ['Roadworks', 'Sewer Reticulation', 'Reservoir Construction', 'Structural Works', 'Waste Stabilisation Ponds'],
      price: 1500, // Mock price for cart
    },
    {
      id: 'consultancy',
      title: 'Consultancy',
      pillar: 'Consultancy',
      Icon: Ruler,
      summary: 'Precision-driven strategic engineering and detailed design.',
      details: ['Feasibility Studies', 'Hydraulic Modeling', 'Detailed Design', 'Contract Administration', 'Structural Analysis'],
      price: 800, // Mock price for cart
    },
    {
      id: 'project-management',
      title: 'Project Management',
      pillar: 'Project Management',
      Icon: Briefcase,
      summary: 'End-to-end execution, supervision, and lifecycle management.',
      details: ['Project Planning', 'Risk Mitigation', 'Quality Assurance', 'Cost Control', 'Site Supervision'],
      price: 0, // Quote based
    },
    {
      id: 'bridge-design',
      title: 'Bridge Design',
      pillar: 'Consultancy',
      Icon: Ruler,
      summary: 'Advanced structural design for urban and rural bridge infrastructure.',
      details: ['Structural Analysis', 'Load Testing', 'Material Spec'],
      price: 1200,
    },
    {
      id: 'road-construction',
      title: 'Highway Construction',
      pillar: 'Construction',
      Icon: HardHat,
      summary: 'Large scale highway and arterial road implementation.',
      details: ['Asphalt Laying', 'Earthworks', 'Drainage'],
      price: 5000,
    },
  ],
} as const;

export type Page = 'home' | 'about' | 'services' | 'projects' | 'team' | 'contact' | 'training' | 'checkout' | 'mock-payment-gateway' | 'payment-success' | 'payment-error';
