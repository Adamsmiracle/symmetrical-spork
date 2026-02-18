import { NextResponse } from 'next/server';
import Task from '../../../models/Task';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, dueDate, priority } = body;
    
    // Manual validation
    const errors = [];
    
    if (!title || title.trim() === '') {
      errors.push({
        msg: 'title is required',
        param: 'title',
        location: 'body'
      });
    }
    
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      errors.push({
        msg: 'priority must be one of: low, medium, high',
        param: 'priority',
        location: 'body'
      });
    }
    
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }
    
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
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const priority = searchParams.get('priority');
    
    // Manual validation
    const errors = [];
    
    if (limit < 1) {
      errors.push({
        msg: 'limit must be at least 1',
        param: 'limit',
        location: 'query'
      });
    }
    
    if (offset < 0) {
      errors.push({
        msg: 'offset must be at least 0',
        param: 'offset',
        location: 'query'
      });
    }
    
    if (priority && !['low', 'medium', 'high'].includes(priority)) {
      errors.push({
        msg: 'priority must be one of: low, medium, high',
        param: 'priority',
        location: 'query'
      });
    }
    
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }
    
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
