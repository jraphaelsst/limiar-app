/// <reference types="jest" />
import { requestAnotherIdea, takeAnotherIdeaRequest } from '@/state/another-idea';

test('a request is taken exactly once', () => {
  expect(takeAnotherIdeaRequest()).toBe(false);
  requestAnotherIdea();
  requestAnotherIdea();
  expect(takeAnotherIdeaRequest()).toBe(true);
  expect(takeAnotherIdeaRequest()).toBe(false);
});
