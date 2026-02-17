import { NextResponse } from 'next/server';
import Task from '../../../../../models/Task';
import dbConnect from '../../../../../lib/dbConnect';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();
    const { status } = body;
    
    if (!['pending', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending or completed' },
        { status: 400 }
      );
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
