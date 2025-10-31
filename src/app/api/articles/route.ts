import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

// GET - List articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published') !== 'false';
    const featured = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (published) {
      where.isPublished = true;
    }
    
    if (featured) {
      where.isFeatured = true;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: [
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Articles fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST - Create article
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title_lo, title_th, title_zh, title_en,
      content_lo, content_th, content_zh, content_en,
      excerpt_lo, excerpt_th, excerpt_zh, excerpt_en,
      featuredImage,
      metaTitle_lo, metaTitle_th, metaTitle_zh, metaTitle_en,
      metaDesc_lo, metaDesc_th, metaDesc_zh, metaDesc_en,
      isPublished,
      isFeatured,
      tags,
    } = body;

    // Validate required fields
    if (!title_lo || !title_th || !title_zh || !title_en) {
      return NextResponse.json(
        { success: false, error: 'All language titles are required' },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = slugify(title_en || title_lo);
    
    // Check slug uniqueness
    const existing = await prisma.article.findUnique({
      where: { slug },
    });

    let finalSlug = slug;
    if (existing) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        slug: finalSlug,
        title_lo,
        title_th,
        title_zh,
        title_en,
        content_lo: content_lo || '',
        content_th: content_th || '',
        content_zh: content_zh || '',
        content_en: content_en || '',
        excerpt_lo: excerpt_lo || '',
        excerpt_th: excerpt_th || '',
        excerpt_zh: excerpt_zh || '',
        excerpt_en: excerpt_en || '',
        featuredImage,
        metaTitle_lo,
        metaTitle_th,
        metaTitle_zh,
        metaTitle_en,
        metaDesc_lo,
        metaDesc_th,
        metaDesc_zh,
        metaDesc_en,
        isPublished: isPublished ?? false,
        isFeatured: isFeatured ?? false,
        publishedAt: isPublished ? new Date() : null,
        createdById: user.id,
      },
      include: {
        createdBy: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Article create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
