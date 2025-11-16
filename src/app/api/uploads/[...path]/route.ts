import { NextRequest, NextResponse } from 'next/server';
import { join, resolve, relative } from 'path';
import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/');
    
    // Security: Validate and sanitize the path
    if (!path || path.includes('..') || path.includes('\\') || path.startsWith('/')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }
    
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadsDir, path);
    
    // Security: Ensure the resolved path is within the uploads directory
    const resolvedPath = resolve(filePath);
    const resolvedUploadsDir = resolve(uploadsDir);
    const relativePath = relative(resolvedUploadsDir, resolvedPath);
    
    if (relativePath.startsWith('..') || relativePath.includes('..')) {
      return NextResponse.json({ error: 'Path traversal detected' }, { status: 403 });
    }
    
    // Security: Ensure file exists and is within uploads directory
    if (!existsSync(resolvedPath) || !resolvedPath.startsWith(resolvedUploadsDir)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Get file stats
    const fileStats = await stat(resolvedPath);
    
    // Determine content type
    const ext = path.split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'avif': 'image/avif',
    };
    
    const contentType = contentTypes[ext || ''] || 'application/octet-stream';
    
    // Read file
    const fileBuffer = await readFile(resolvedPath);
    
    // Create response with proper headers
    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('Content-Length', fileStats.size.toString());
    
    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    
    return response;
  } catch (error) {
    console.error('Image serving error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}