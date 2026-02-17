import { NextResponse } from 'next/server';
import Task from '../../../models/Task';
import dbConnect from '../../../lib/dbConnect';
import { validateRequest } from '../../../../middleware/validation';

export async function POST(request: Request) {
  // Validate input
  const validation = validateRequest([
    { param: 'title', type: 'body', required: true },
    { param: 'description', type: 'body', required: false },
    { param: 'priority', type: 'body', required: false, enum: ['low', 'medium', 'high'] }
  ]);

  const validationResult = await validation(request);
  if (validationResult) {
    return validationResult;
  }

  try {
    await dbConnect();
    const body = await request.json();
    const { title, description, dueDate, priority } = body;
    
    const task = await Task.create({
      title: title.trim(),
      description: description?.trim(),
      dueDate,
      priority: priority || 'medium'
    });
    
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Validate query parameters
  const validation = validateRequest([
    { param: 'limit', type: 'query', required: false, min: 1 },
    { param: 'offset', type: 'query', required: false, min: 0 },
    { param: 'priority', type: 'query', required: false, enum: ['low', 'medium', 'high'] }
  ]);

  const validationResult = await validation(request);
  if (validationResult) {
    return validationResult;
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const priority = searchParams.get('priority');
    
    const tasks = await Task.findAll({
      limit,
      offset,
      priority
    });
    
    return NextResponse.json({
      total: tasks.count,
      tasks: tasks.rows,
      filters: {
        priority: priority || 'all'
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
