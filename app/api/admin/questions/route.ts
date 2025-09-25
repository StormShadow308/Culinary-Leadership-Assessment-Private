import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/db';
import { questions, assessments } from '~/db/schema';
import { getCurrentUser } from '~/lib/user-sync';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all questions with assessment titles
    const questionsData = await db
      .select({
        id: questions.id,
        text: questions.text,
        category: questions.category,
        orderNumber: questions.orderNumber,
        assessmentId: questions.assessmentId,
        assessmentTitle: assessments.title,
      })
      .from(questions)
      .leftJoin(assessments, eq(questions.assessmentId, assessments.id))
      .orderBy(questions.orderNumber);

    return NextResponse.json({ questions: questionsData });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { text, category, orderNumber, assessmentId, options } = await request.json();

    if (!text || !category || !orderNumber || !assessmentId || !options || options.length < 2) {
      return NextResponse.json({ error: 'Text, category, order number, assessment ID, and at least 2 options are required' }, { status: 400 });
    }

    // Create new question using raw SQL
    const questionResult = await db.execute(sql`
      INSERT INTO questions (text, category, order_number, assessment_id)
      VALUES (${text}, ${category}, ${orderNumber}, ${assessmentId})
      RETURNING *
    `);

    const questionId = questionResult.rows[0].id;

    // Insert options
    for (const option of options) {
      await db.execute(sql`
        INSERT INTO options (question_id, text, order_number)
        VALUES (${questionId}, ${option.text}, ${option.orderNumber})
      `);
    }

    return NextResponse.json({ question: questionResult.rows[0] });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, text, category, orderNumber, assessmentId } = await request.json();

    if (!id || !text || !category || !orderNumber || !assessmentId) {
      return NextResponse.json({ error: 'ID, text, category, order number, and assessment ID are required' }, { status: 400 });
    }

    // Update question using raw SQL
    const result = await db.execute(sql`
      UPDATE questions 
      SET text = ${text}, category = ${category}, order_number = ${orderNumber}, assessment_id = ${assessmentId}
      WHERE id = ${id}
      RETURNING *
    `);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ question: result.rows[0] });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
