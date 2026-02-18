// Domain types for Incident Inbox

export type IncidentStatus = 'new' | 'in_progress' | 'resolved' | 'closed';
export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  reporter: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  incidentId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface IncidentWithComments extends Incident {
  comments: Comment[];
}

// API Response types
export interface IncidentsResponse {
  incidents: Incident[];
  total: number;
}

export interface CreateCommentRequest {
  incidentId: string;
  author: string;
  content: string;
}

export interface UpdateIncidentRequest {
  status?: IncidentStatus;
  priority?: IncidentPriority;
}