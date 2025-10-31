import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get site settings
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        success: true,
        data: {
          siteName_lo: 'NAMNGAM',
          siteName_th: 'NAMNGAM',
          siteName_zh: 'NAMNGAM',
          siteName_en: 'NAMNGAM',
          defaultMetaDesc_lo: '',
          defaultMetaDesc_th: '',
          defaultMetaDesc_zh: '',
          defaultMetaDesc_en: '',
          email: '',
          phone: '',
          address_lo: '',
          address_th: '',
          address_zh: '',
          address_en: '',
          facebookPage: '',
          lineId: '',
          whatsapp: '',
          logo: '',
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update site settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Get existing settings
    const existing = await prisma.siteSettings.findFirst();

    let settings;
    if (existing) {
      // Update existing
      settings = await prisma.siteSettings.update({
        where: { id: existing.id },
        data: body,
      });
    } else {
      // Create new
      settings = await prisma.siteSettings.create({
        data: body,
      });
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
