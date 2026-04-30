-- Migration to create service_categories and services tables

-- 1. Create service_categories table
CREATE TABLE IF NOT EXISTS public.service_categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    icon_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.service_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    details TEXT[] DEFAULT '{}',
    price NUMERIC,
    icon_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to service_categories" 
ON public.service_categories FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public read access to services" 
ON public.services FOR SELECT 
TO public 
USING (true);

-- (Admin write access would typically be governed by role checks or a separate authenticated admin policy)
-- For now, we only allow public reads via RLS, while Service Role keys bypass RLS for inserts/updates.

-- 3. Insert Seed Data
INSERT INTO public.service_categories (id, title, summary, icon_name)
VALUES 
    ('construction', 'Construction', 'Implementation of heavy-duty urban and industrial infrastructure at scale.', 'HardHat'),
    ('consultancy', 'Consultancy', 'Precision-driven strategic engineering advisory and detailed technical design.', 'Ruler'),
    ('project-management', 'Project Management', 'End-to-end execution, supervision, and full lifecycle management of civil projects.', 'Briefcase')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.services (id, category_id, title, summary, details, price, icon_name)
VALUES 
    ('roadworks', 'construction', 'Roadworks', 'Urban and rural road construction including sub-base preparation, surfacing and kerbing.', ARRAY['Sub-base & Base Course', 'Asphalt Surfacing', 'Kerb & Channel', 'Line Marking'], 15000, 'Layers'),
    ('sewer-reticulation', 'construction', 'Sewer Reticulation', 'Full installation of gravity sewer networks, manholes and pump stations.', ARRAY['Gravity Sewer Mains', 'Manhole Construction', 'Pump Station Installation', 'CCTV Inspection'], 15000, 'Waves'),
    ('reservoir-construction', 'construction', 'Reservoir Construction', 'Design and construction of reinforced concrete water storage reservoirs.', ARRAY['RC Tank Design', 'Foundation Works', 'Waterproofing', 'Commissioning'], 15000, 'Droplets'),
    ('structural-works', 'construction', 'Structural Works', 'Heavy structural construction for commercial, industrial and institutional buildings.', ARRAY['Reinforced Concrete Frames', 'Masonry & Blockwork', 'Steel Fabrication', 'Formwork & Shuttering'], 15000, 'Building2'),
    ('waste-stabilisation-ponds', 'construction', 'Waste Stabilisation Ponds', 'Construction of engineered waste-water treatment ponds for municipal and industrial use.', ARRAY['Earthworks & Lining', 'Inlet/Outlet Structures', 'Effluent Monitoring', 'Commissioning'], 15000, 'Factory'),
    ('highway-construction', 'construction', 'Highway Construction', 'Large-scale highway and arterial road implementation with full civil works.', ARRAY['Earthworks & Grading', 'Asphalt Laying', 'Drainage Structures', 'Traffic Management'], 15000, 'HardHat'),
    
    ('feasibility-studies', 'consultancy', 'Feasibility Studies', 'Comprehensive technical and economic feasibility assessments for proposed projects.', ARRAY['Site Investigation', 'Economic Analysis', 'Risk Assessment', 'Recommendation Report'], 15000, 'FileSearch'),
    ('hydraulic-modeling', 'consultancy', 'Hydraulic Modeling', 'Advanced computational hydraulic analysis for water supply and drainage systems.', ARRAY['Network Simulation', 'Flood Routing', 'Pressure Zone Analysis', 'Calibration & Reporting'], 15000, 'Waves'),
    ('detailed-design', 'consultancy', 'Detailed Design', 'Full engineering drawings and specifications ready for tender and construction.', ARRAY['CAD / BIM Drawings', 'Structural Calculations', 'Specifications', 'Bill of Quantities'], 15000, 'PenTool'),
    ('contract-administration', 'consultancy', 'Contract Administration', 'Professional oversight of construction contracts from award through to final account.', ARRAY['Tender Evaluation', 'Progress Certification', 'Variation Management', 'Final Account Settlement'], 15000, 'FileText'),
    ('structural-analysis', 'consultancy', 'Structural Analysis', 'Finite element and hand-calculation structural analysis to BS/SANS/EN standards.', ARRAY['Load Analysis', 'FEA Modelling', 'Peer Review', 'Certification'], 15000, 'FlaskConical'),
    ('bridge-design', 'consultancy', 'Bridge Design', 'Advanced structural design for urban and rural bridge and culvert infrastructure.', ARRAY['Structural Analysis', 'Load Testing', 'Material Specification', 'Construction Drawings'], 15000, 'GitBranch'),

    ('project-planning', 'project-management', 'Project Planning', 'Detailed programme development with resource-loaded schedules and milestone tracking.', ARRAY['Work Breakdown Structure', 'Gantt Scheduling', 'Resource Allocation', 'Baseline Programme'], NULL, 'ClipboardCheck'),
    ('risk-mitigation', 'project-management', 'Risk Mitigation', 'Systematic identification, analysis and management of project risks throughout the lifecycle.', ARRAY['Risk Register', 'Qualitative Assessment', 'Mitigation Strategies', 'Monthly Monitoring'], NULL, 'Shield'),
    ('quality-assurance', 'project-management', 'Quality Assurance', 'Independent QA and QC programmes ensuring construction meets specification and code.', ARRAY['Inspection Test Plans', 'Material Testing', 'Non-Conformance Reporting', 'Audit & Sign-Off'], NULL, 'Wrench'),
    ('cost-control', 'project-management', 'Cost Control', 'Budgeting, forecasting and earned-value management to keep projects financially on track.', ARRAY['Budget Establishment', 'Earned Value Analysis', 'Cash-Flow Forecasting', 'Monthly Cost Reports'], NULL, 'DollarSign'),
    ('site-supervision', 'project-management', 'Site Supervision', 'Resident engineer and clerk-of-works services ensuring day-to-day compliance on site.', ARRAY['Daily Site Diaries', 'Contractor Coordination', 'Progress Photography', 'Weekly Reports'], NULL, 'Eye'),
    ('performance-reporting', 'project-management', 'Performance Reporting', 'Executive and stakeholder dashboards providing full project transparency and accountability.', ARRAY['KPI Dashboards', 'Schedule Variance', 'Budget vs Actual', 'Stakeholder Reports'], NULL, 'BarChart2')
ON CONFLICT (id) DO UPDATE SET 
    price = EXCLUDED.price, 
    title = EXCLUDED.title, 
    details = EXCLUDED.details, 
    summary = EXCLUDED.summary, 
    icon_name = EXCLUDED.icon_name;
