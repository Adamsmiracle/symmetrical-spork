import { NextResponse } from 'next/server';
import Task from '../../../../../models/Task';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;
    
    // Manual validation
    const errors = [];
    
    if (!status) {
      errors.push({
        msg: 'status is required',
        param: 'status',
        location: 'body'
      });
    }
    
    if (status && !['pending', 'completed'].includes(status)) {
      errors.push({
        msg: 'status must be one of: pending, completed',
        param: 'status',
        location: 'body'
      });
    }
    
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }
    
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
