// Role-based authorization utilities for NAMNGAM

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// User roles
export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER',
  GUEST = 'GUEST'
}

// Permission levels
export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_CONTENT = 'MANAGE_CONTENT',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS'
}

// Role permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.READ,
    Permission.WRITE,
    Permission.DELETE,
    Permission.MANAGE_USERS,
    Permission.MANAGE_CONTENT,
    Permission.MANAGE_SETTINGS
  ],
  [UserRole.EDITOR]: [
    Permission.READ,
    Permission.WRITE,
    Permission.MANAGE_CONTENT
  ],
  [UserRole.USER]: [
    Permission.READ
  ],
  [UserRole.GUEST]: [
    Permission.READ
  ]
};

// API route permissions mapping
export const API_PERMISSIONS: Record<string, Permission[]> = {
  // Admin routes
  '/api/admin': [Permission.MANAGE_SETTINGS],
  '/api/admin/activity': [Permission.MANAGE_SETTINGS],
  '/api/admin/health': [Permission.MANAGE_SETTINGS],
  
  // Content management
  '/api/articles': [Permission.READ, Permission.WRITE],
  '/api/articles/[id]': [Permission.READ, Permission.WRITE, Permission.DELETE],
  '/api/categories': [Permission.READ, Permission.WRITE],
  '/api/categories/[id]': [Permission.READ, Permission.WRITE, Permission.DELETE],
  '/api/products': [Permission.READ, Permission.WRITE],
  '/api/products/[id]': [Permission.READ, Permission.WRITE, Permission.DELETE],
  '/api/faqs': [Permission.READ, Permission.WRITE],
  '/api/faqs/[id]': [Permission.READ, Permission.WRITE, Permission.DELETE],
  
  // User management
  '/api/users': [Permission.MANAGE_USERS],
  '/api/users/[id]': [Permission.MANAGE_USERS],
  
  // Settings
  '/api/settings': [Permission.MANAGE_SETTINGS],
  '/api/about': [Permission.MANAGE_CONTENT],
  
  // Upload routes
  '/api/upload': [Permission.WRITE],
  '/api/upload/[id]': [Permission.DELETE],
  
  // Public routes (no authentication required)
  '/api/public': [],
  '/api/analytics': [Permission.READ],
  '/api/auth': []
};

// Get user role from session
export async function getUserRole(): Promise<UserRole> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return UserRole.GUEST;
    }
    
    // Check if user has admin role from database
    // This would typically involve a database query
    // For now, we'll use a simple check based on email
    const userEmail = session.user.email;
    
    if (userEmail && process.env.ADMIN_EMAILS?.includes(userEmail)) {
      return UserRole.ADMIN;
    }
    
    // Check if user has editor role
    if (userEmail && process.env.EDITOR_EMAILS?.includes(userEmail)) {
      return UserRole.EDITOR;
    }
    
    return UserRole.USER;
  } catch (error) {
    console.error('Error getting user role:', error);
    return UserRole.GUEST;
  }
}

// Check if user has permission
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
}

// Check if user can access API route
export async function canAccessRoute(
  routePath: string,
  requiredPermission?: Permission
): Promise<{ authorized: boolean; role: UserRole; reason?: string }> {
  const userRole = await getUserRole();
  
  // Get required permissions for the route
  const routePermissions = API_PERMISSIONS[routePath] || [];
  
  // If no specific permission required and route is public
  if (routePermissions.length === 0 && !requiredPermission) {
    return { authorized: true, role: userRole };
  }
  
  // Check if user has any of the required permissions
  const hasRequiredPermission = requiredPermission 
    ? hasPermission(userRole, requiredPermission)
    : routePermissions.some(permission => hasPermission(userRole, permission));
  
  if (!hasRequiredPermission) {
    return {
      authorized: false,
      role: userRole,
      reason: `Insufficient permissions. Required: ${requiredPermission || routePermissions.join(', ')}`
    };
  }
  
  return { authorized: true, role: userRole };
}

// Middleware function for API routes
export async function requireAuth(
  request: Request,
  requiredPermission?: Permission
): Promise<{ authorized: boolean; role: UserRole; reason?: string }> {
  const url = new URL(request.url);
  const routePath = url.pathname;
  
  // Handle dynamic routes (e.g., /api/articles/[id])
  let normalizedPath = routePath;
  
  // Normalize dynamic routes
  if (routePath.startsWith('/api/articles/') && routePath.split('/').length === 4) {
    normalizedPath = '/api/articles/[id]';
  } else if (routePath.startsWith('/api/categories/') && routePath.split('/').length === 4) {
    normalizedPath = '/api/categories/[id]';
  } else if (routePath.startsWith('/api/products/') && routePath.split('/').length === 4) {
    normalizedPath = '/api/products/[id]';
  } else if (routePath.startsWith('/api/faqs/') && routePath.split('/').length === 4) {
    normalizedPath = '/api/faqs/[id]';
  } else if (routePath.startsWith('/api/users/') && routePath.split('/').length === 4) {
    normalizedPath = '/api/users/[id]';
  } else if (routePath.startsWith('/api/upload/') && routePath.split('/').length === 4) {
    normalizedPath = '/api/upload/[id]';
  }
  
  return await canAccessRoute(normalizedPath, requiredPermission);
}

// Helper function to create unauthorized response
export function createUnauthorizedResponse(reason?: string): Response {
  return new Response(
    JSON.stringify({ 
      error: 'Unauthorized',
      message: reason || 'You do not have permission to access this resource'
    }),
    {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Helper function to create forbidden response
export function createForbiddenResponse(reason?: string): Response {
  return new Response(
    JSON.stringify({ 
      error: 'Forbidden',
      message: reason || 'You do not have sufficient permissions for this action'
    }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Higher-order function to wrap API handlers with authorization
export function withAuth(
  handler: (request: Request, context?: any) => Promise<Response>,
  requiredPermission?: Permission
) {
  return async (request: Request, context?: any): Promise<Response> => {
    const authResult = await requireAuth(request, requiredPermission);
    
    if (!authResult.authorized) {
      if (authResult.role === UserRole.GUEST) {
        return createUnauthorizedResponse(authResult.reason);
      }
      return createForbiddenResponse(authResult.reason);
    }
    
    // Add user role to request context for use in handler
    (request as any).userRole = authResult.role;
    
    return handler(request, context);
  };
}