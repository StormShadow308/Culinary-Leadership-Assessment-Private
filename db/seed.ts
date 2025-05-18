import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { v4 as uuidv4 } from 'uuid';

/* Mock data */
import assessmentData from './__mocks__/assessment-data.json';
import correctAnswersData from './__mocks__/correct-answers-data.json';
import questionsData from './__mocks__/questions-data.json';
/* Schema */
import {
  assessments,
  attempts,
  cohorts,
  correctAnswers,
  options,
  organization,
  participants,
  questions,
} from './schema';

// Load environment variables
dotenv.config();

// Categories from questions data
const CATEGORIES = [
  'Communication & Active Listening',
  'Decision-Making & Problem-Solving',
  'Resilience and Adaptability',
  'Self-Awareness & Emotional Intelligence',
  'Team Dynamics & Collaboration',
];

// Generate report data for an attempt
const generateReportData = () => {
  // Generate random scores for each category
  const categoryResults = CATEGORIES.map(category => {
    const total = 8;
    // Generate a random number skewed towards 1
    const skewedRandom = Math.max(Math.random(), Math.random());
    // Scale it to the range [0, total] and floor it
    let score = Math.floor(skewedRandom * (total + 1));
    // Ensure the score doesn't exceed the total
    score = Math.min(total, score);
    return {
      score,
      total,
      category,
      percentage: (score / total) * 100,
    };
  });

  // Calculate total score and percentage
  const totalPossible = categoryResults.reduce((sum, cat) => sum + cat.total, 0);
  const totalScore = categoryResults.reduce((sum, cat) => sum + cat.score, 0);
  const overallPercentage = Math.ceil((totalScore / totalPossible) * 100);

  return {
    totalScore,
    totalPossible,
    categoryResults,
    overallPercentage,
  };
};

// Create cohorts with participants and attempts
const generateCohortData = (organizationId: string, assessmentId: string, numCohorts = 3) => {
  const cohortData = [];

  for (let i = 0; i < numCohorts; i++) {
    const cohortId = uuidv4();
    // Create cohort
    cohortData.push({
      cohort: {
        id: cohortId,
        organizationId,
        name: faker.company.name() + ' Cohort',
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
      },
      participants: [],
    });

    // Generate 15-20 participants per cohort
    const numParticipants = faker.number.int({ min: 15, max: 20 });

    for (let j = 0; j < numParticipants; j++) {
      const participantId = uuidv4();
      const stayOutOptions = ['Stay', 'Out'];

      // Create participant
      cohortData[i].participants.push({
        participant: {
          id: participantId,
          email: faker.internet.email({ provider: 'example.com' }),
          fullName: faker.person.fullName(),
          cohortId,
          organizationId,
          stayOut: stayOutOptions[Math.floor(Math.random() * stayOutOptions.length)],
          createdAt: faker.date.past(),
          lastActiveAt: faker.date.recent(),
        },
        attempt: {
          id: uuidv4(),
          participantId,
          assessmentId,
          startedAt: faker.date.recent(),
          completedAt: faker.date.recent(),
          emailSentAt: faker.date.recent(),
          reportData: generateReportData(),
          status: 'completed',
          type: 'pre_assessment',
          lastQuestionSeen: 20,
          welcomeEmailSent: true,
          resultsEmailSent: true,
        },
      });
    }
  }

  return cohortData;
};

const main = async () => {
  // Check if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not defined');
    process.exit(1);
  }

  console.log('🌱 Seeding database...');

  const db = drizzle(process.env.DATABASE_URL!);

  try {
    // Delete existing data in reverse order of dependencies
    console.log('🗑️ Deleting existing data...');
    await db.delete(attempts);
    await db.delete(participants);
    await db.delete(cohorts);
    await db.delete(organization);
    await db.delete(correctAnswers);
    await db.delete(options);
    await db.delete(questions);
    await db.delete(assessments);
    console.log('✅ Successfully deleted existing data');

    // Reset the questions sequence
    await db.execute(sql`ALTER SEQUENCE questions_id_seq RESTART WITH 1`);
    console.log('✅ Reset questions sequence');

    // Create the assessment first
    console.log('📋 Creating assessment...');
    const [assessmentResult] = await db
      .insert(assessments)
      .values(assessmentData)
      .returning({ id: assessments.id });
    const assessmentId = assessmentResult.id;
    console.log(`✅ Assessment created with ID: ${assessmentId}`);

    // Insert questions
    console.log('❓ Inserting questions and options...');
    for (const questionData of questionsData) {
      // Insert question with the assessment ID
      const [questionResult] = await db
        .insert(questions)
        // @ts-expect-error - TypeScript doesn't recognize the `assessmentId` field
        .values({
          text: questionData.text,
          orderNumber: questionData.orderNumber,
          category: questionData.category,
          assessmentId,
        })
        .returning({ id: questions.id });

      const questionId = questionResult.id;

      // Insert options for this question
      for (const optionData of questionData.options) {
        await db.insert(options).values({
          id: optionData.id,
          questionId: questionId,
          text: optionData.text,
        });
      }
    }
    console.log('✅ Successfully inserted questions and options');

    // Insert correct answers
    console.log('🎯 Inserting correct answers...');
    await db.insert(correctAnswers).values(correctAnswersData);
    console.log('✅ Successfully inserted correct answers');

    // Create organization
    console.log('🏢 Creating organization...');
    const orgId = 'org_' + uuidv4();
    await db.execute(
      sql`INSERT INTO organization (id, name, slug, created_at) VALUES (${orgId}, 'Test Organization', 'test-org', NOW())`
    );
    console.log(`✅ Organization created with ID: ${orgId}`);

    // Generate cohorts, participants, and attempts
    console.log('👥 Creating cohorts, participants, and attempts...');
    const cohortData = generateCohortData(orgId, assessmentId);

    // Insert cohorts
    for (const cohortItem of cohortData) {
      await db.insert(cohorts).values(cohortItem.cohort);
      console.log(`✅ Created cohort: ${cohortItem.cohort.name}`);

      // Insert participants and attempts for this cohort
      for (const participantItem of cohortItem.participants) {
        await db.insert(participants).values(participantItem.participant);
        await db.insert(attempts).values(participantItem.attempt);
      }
      console.log(
        `✅ Created ${cohortItem.participants.length} participants with attempts for cohort ${cohortItem.cohort.name}`
      );
    }

    console.log('✅ Successfully created all cohorts, participants, and attempts');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1); // Exit if seeding fails
  } finally {
    console.log('🏁 Seeding finished.');
  }
};

main();
