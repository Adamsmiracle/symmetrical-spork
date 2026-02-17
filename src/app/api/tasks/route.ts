import { NextResponse } from 'next/server';
import Task from '@/models/Task';
import dbConnect from '@/lib/dbConnect';

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

// Placeholder for GET
export async function GET() {
  return NextResponse.json(
    { error: 'Not implemented yet' },
    { status: 501 }
  );
}
