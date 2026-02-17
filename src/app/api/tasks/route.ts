import { NextResponse } from 'next/server';
// Adjust the import path to match your actual Task model location
import Task from '../../../models/Task';
import dbConnect from '../../../lib/dbConnect';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, description, dueDate, priority } = body;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority
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
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const tasks = await Task.findAll({
      limit,
      offset
    });
    
    return NextResponse.json({
      total: tasks.count,
      tasks: tasks.rows
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
