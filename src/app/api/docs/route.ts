import { NextResponse } from 'next/server';

export async function GET() {
  const docs = {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.2.0',
      description: 'A lightweight personal task management API built with Next.js'
    },
    servers: [
      {
        url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
        description: 'API server'
      }
    ],
    paths: {
      '/api/tasks': {
        get: {
          summary: 'List all tasks',
          parameters: [
            {
              name: 'priority',
              in: 'query',
              schema: { type: 'string', enum: ['low', 'medium', 'high'] }
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 }
            },
            {
              name: 'offset',
              in: 'query',
              schema: { type: 'integer', default: 0 }
            }
          ],
          responses: {
            '200': {
              description: 'Successful response'
            }
          }
        },
        post: {
          summary: 'Create a new task',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    priority: { type: 'string', enum: ['low', 'medium', 'high'] }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Task created' },
            '400': { description: 'Invalid input' }
          }
        }
      },
      '/api/tasks/{id}/status': {
        patch: {
          summary: 'Update task status',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['pending', 'completed'] }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Status updated' },
            '404': { description: 'Task not found' }
          }
        }
      },
      '/api/tasks/{id}': {
        delete: {
          summary: 'Delete a task',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            '204': { description: 'Task deleted' },
            '404': { description: 'Task not found' }
          }
        }
      },
      '/api/health': {
        get: {
          summary: 'Health check',
          responses: {
            '200': { description: 'System healthy' },
            '503': { description: 'System unhealthy' }
          }
        }
      }
    }
  };
  
  return NextResponse.json(docs);
}
