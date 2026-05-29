export function createQuizState(totalQuestions) {
  return {
    index: 0,
    totalQuestions,
    answers: Array(totalQuestions).fill(null),
    completed: false,
  };
}

export function selectAnswer(state, answerId) {
  const answers = [...state.answers];
  answers[state.index] = answerId;

  return {
    ...state,
    answers,
  };
}

export function advanceQuiz(state) {
  if (!state.answers[state.index]) {
    return state;
  }

  if (state.index >= state.totalQuestions - 1) {
    return {
      ...state,
      completed: true,
    };
  }

  return {
    ...state,
    index: state.index + 1,
  };
}

export function createProposalState() {
  return {
    mood: "hopeful",
    showMaybe: true,
    acceptEmphasis: false,
    accepted: false,
  };
}

export function softenProposal(state) {
  return {
    ...state,
    mood: "softened",
    showMaybe: false,
    acceptEmphasis: true,
  };
}

export function acceptProposal(state) {
  return {
    ...state,
    mood: "accepted",
    showMaybe: false,
    acceptEmphasis: true,
    accepted: true,
  };
}

export function getRunawayPosition({
  viewportWidth,
  viewportHeight,
  buttonWidth,
  buttonHeight,
  seed = Math.random(),
}) {
  const padding = 16;
  const maxX = Math.max(padding, viewportWidth - buttonWidth - padding);
  const maxY = Math.max(padding, viewportHeight - buttonHeight - padding);
  const normalizedSeed = Math.abs(Math.sin(seed * 10000));
  const secondarySeed = Math.abs(Math.cos((seed + 0.37) * 10000));

  return {
    x: Math.round(padding + (maxX - padding) * normalizedSeed),
    y: Math.round(padding + (maxY - padding) * secondarySeed),
  };
}
