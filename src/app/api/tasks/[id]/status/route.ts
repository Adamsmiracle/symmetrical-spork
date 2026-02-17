import { NextResponse } from 'next/server';
import Task from '../../../../../models/Task';
import dbConnect from '../../../../../lib/dbConnect';
import { validateRequest } from '../../../../../middleware/validation';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validate input
  const validation = validateRequest([
    { param: 'status', type: 'body', required: true, enum: ['pending', 'completed'] }
  ]);

  const validationResult = await validation(request);
  if (validationResult) {
    return validationResult;
  }

  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;
    
    const task = await Task.findByPk(id);
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    task.status = status;
    await task.save();
    
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
