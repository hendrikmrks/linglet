'use client';

import { Protected } from '@/components/protected';
import { LessonReader } from '@/components/lesson-reader';

export default function LessonPage() {
  return (
    <Protected>
      {() => <LessonReader />}
    </Protected>
  );
}
