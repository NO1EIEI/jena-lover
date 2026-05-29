import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  createQuizState,
  selectAnswer,
  advanceQuiz,
  createProposalState,
  softenProposal,
  getRunawayPosition,
} from "../src/proposal-state.mjs";

describe("quiz flow", () => {
  it("records selected answers and advances until the quiz completes", () => {
    let state = createQuizState(2);

    state = selectAnswer(state, "spring-a");
    assert.equal(state.answers[0], "spring-a");

    state = advanceQuiz(state);
    assert.equal(state.index, 1);
    assert.equal(state.completed, false);

    state = selectAnswer(state, "summer-c");
    state = advanceQuiz(state);
    assert.equal(state.index, 1);
    assert.equal(state.completed, true);
    assert.deepEqual(state.answers, ["spring-a", "summer-c"]);
  });

  it("does not advance when the current question has no answer", () => {
    const state = advanceQuiz(createQuizState(3));

    assert.equal(state.index, 0);
    assert.equal(state.completed, false);
  });
});

describe("proposal flow", () => {
  it("softens the proposal after a successful maybe click", () => {
    const state = softenProposal(createProposalState());

    assert.equal(state.mood, "softened");
    assert.equal(state.showMaybe, false);
    assert.equal(state.acceptEmphasis, true);
  });

  it("keeps the runaway button inside the visible area", () => {
    const position = getRunawayPosition({
      viewportWidth: 360,
      viewportHeight: 640,
      buttonWidth: 140,
      buttonHeight: 52,
      seed: 0.73,
    });

    assert.equal(position.x >= 16, true);
    assert.equal(position.y >= 16, true);
    assert.equal(position.x <= 204, true);
    assert.equal(position.y <= 572, true);
  });
});
