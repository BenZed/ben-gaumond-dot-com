import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildApp } from './app.js';
import { resumeSchema } from '../src/resume.js';

await test('resume API returns validated content and unknown routes remain 404s', async () => {
  const app = buildApp();
  try {
    const response = await app.inject('/api/resume');
    assert.equal(response.statusCode, 200);
    const payload: unknown = response.json();
    assert.equal(resumeSchema.parse(payload).basics.name, 'Ben Gaumond');
    assert.equal((await app.inject('/api/missing')).statusCode, 404);
    assert.equal((await app.inject('/workbench/linkedin-import.json')).statusCode, 404);
  } finally {
    await app.close();
  }
});

await test('invalid resume dates and duplicate positions fail validation', async () => {
  const app = buildApp();
  try {
    const response = await app.inject('/api/resume');
    const payload: unknown = response.json();
    const data = resumeSchema.parse(payload);
    assert.equal(
      resumeSchema.safeParse({ ...data, experience: [...data.experience, ...data.experience] })
        .success,
      false,
    );
    assert.equal(
      resumeSchema.safeParse({
        ...data,
        experience: data.experience.map((role) => ({ ...role, end: '2000-01' })),
      }).success,
      false,
    );
  } finally {
    await app.close();
  }
});
