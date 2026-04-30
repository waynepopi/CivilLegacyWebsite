import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET = 'site-assets';

async function uploadFile(filePath, destPath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return null;
  }
  
  const fileData = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  let contentType = 'image/jpeg';
  if (ext === '.png') contentType = 'image/png';
  if (ext === '.webp') contentType = 'image/webp';

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(destPath, fileData, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error(`Error uploading ${destPath}:`, error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(destPath);
  console.log(`Uploaded ${destPath}: ${publicUrlData.publicUrl}`);
  return publicUrlData.publicUrl;
}

async function main() {
  const publicDir = path.join(__dirname, '../public');

  // 1. Upload Scroll Images
  const scrollFiles = [
    'scroll/scroll-1.jpg',
    'scroll/scroll-2.jpg',
    'scroll/scroll-3.jpg',
    'scroll/scroll-4.jpg',
    'scroll/scroll-5.jpg',
  ];

  for (const [index, relPath] of scrollFiles.entries()) {
    const localPath = path.join(publicDir, relPath);
    const destPath = relPath; // e.g. scroll/scroll-1.jpg
    const url = await uploadFile(localPath, destPath);
    
    if (url) {
      // Update DB
      await supabase.from('scrolling_images')
        .update({ image_url: url })
        .eq('order_index', index);
    }
  }

  // 2. Upload Team Images
  const teamFiles = [
    'team/byron-muzovaka.png',
    'team/wayne-m-popi.jpg'
  ];

  for (const relPath of teamFiles) {
    const localPath = path.join(publicDir, relPath);
    const destPath = relPath;
    const url = await uploadFile(localPath, destPath);
    
    if (url) {
      // Update DB (we know the relative path matches the current DB URL roughly)
      await supabase.from('team_members')
        .update({ image_url: url })
        .eq('image_url', '/' + relPath);
    }
  }

  console.log("Upload and DB update complete.");
}

main().catch(console.error);
