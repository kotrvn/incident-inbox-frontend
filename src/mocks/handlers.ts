import { http, HttpResponse } from 'msw';
import { Incident, Comment, CreateCommentRequest, UpdateIncidentRequest } from '../types';
import { incidents as mockIncidents, comments as mockComments } from './data';

let incidents = [...mockIncidents];
let comments = [...mockComments];

export const handlers = [
  http.get('/api/incidents', ({ request }) => {
    const url = new URL(request.url);
    
    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status');
    const priority = url.searchParams.get('priority');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    let filteredIncidents = [...incidents];

    if (search) {
      filteredIncidents = filteredIncidents.filter(
        (inc) =>
          inc.id.toLowerCase().includes(search.toLowerCase()) ||
          inc.title.toLowerCase().includes(search.toLowerCase()) ||
          inc.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status && status !== '') {
      filteredIncidents = filteredIncidents.filter((inc) => inc.status === status);
    }

    if (priority && priority !== '') {
      filteredIncidents = filteredIncidents.filter((inc) => inc.priority === priority);
    }

    filteredIncidents.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Incident];
      let bValue: any = b[sortBy as keyof Incident];

      if (sortBy === 'reporter') {
        aValue = a.reporter.name;
        bValue = b.reporter.name;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    const totalCount = filteredIncidents.length;
    const totalPages = Math.ceil(totalCount / limit);
    const start = (page - 1) * limit;
    const paginatedIncidents = filteredIncidents.slice(start, start + limit);

    return HttpResponse.json({
      incidents: paginatedIncidents,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  }),

  http.get('/api/incidents/:id', ({ params }) => {
    const incident = incidents.find((i) => i.id === params.id);
    
    if (!incident) {
      return new HttpResponse(
        JSON.stringify({ message: 'Инцидент не найден' }),
        { status: 404 }
      );
    }

    const incidentComments = comments.filter((c) => c.incidentId === params.id);
    
    return HttpResponse.json({
      ...incident,
      comments: incidentComments,
    });
  }),

  http.patch('/api/incidents/:id', async ({ params, request }) => {
    const updates = (await request.json()) as UpdateIncidentRequest;
    const incidentIndex = incidents.findIndex((i) => i.id === params.id);
    
    if (incidentIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Инцидент не найден' }),
        { status: 404 }
      );
    }

    incidents[incidentIndex] = {
      ...incidents[incidentIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(incidents[incidentIndex]);
  }),

  http.get('/api/incidents/:incidentId/comments', ({ params }) => {
    const incidentComments = comments.filter((c) => c.incidentId === params.incidentId);
    return HttpResponse.json(incidentComments);
  }),

  http.post('/api/incidents/:incidentId/comments', async ({ params, request }) => {
    const { content, author } = (await request.json()) as CreateCommentRequest;
    
    const newComment: Comment = {
      id: `CMT-${String(comments.length + 1).padStart(3, '0')}`,
      incidentId: params.incidentId as string,
      author,
      content,
      createdAt: new Date().toISOString(),
    };

    comments.push(newComment);
    return HttpResponse.json(newComment);
  }),

  http.post('/api/incidents/bulk-update', async ({ request }) => {
    const { incidentIds, data } = (await request.json()) as {
      incidentIds: string[];
      data: UpdateIncidentRequest;
    };

    incidents = incidents.map((inc) => {
      if (incidentIds.includes(inc.id)) {
        return {
          ...inc,
          ...data,
          updatedAt: new Date().toISOString(),
        };
      }
      return inc;
    });

    return HttpResponse.json({ success: true, updatedCount: incidentIds.length });
  }),
];