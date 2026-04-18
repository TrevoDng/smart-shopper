// src/types/enquiry.ts
export interface Enquiry {
  id: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
  // User information
  createdById: string;
  createdByName: string;
  createdByEmail: string;
  createdByRole: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
}

// src/types/suggestion.ts
export interface Suggestion {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'under_review' | 'forwarded';
  createdAt: string;
  forwardedAt?: string;
  forwardedBy?: string;
  forwardedNote?: string;
  // User information
  createdById: string;
  createdByName: string;
  createdByEmail: string;
  createdByRole: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
}