'use client';

import { Protected } from '@/components/protected';
import { LearningPath } from '@/components/learning-path';

export default function PathPage() {
  return (
    <Protected>
      {() => (
        <div className="w-full">
          <LearningPath variant="full" />
        </div>
      )}
    </Protected>
  );
}
