export type Quadrant = 'A' | 'B' | 'C' | 'D'

export interface Question {
  id: number
  context: string
  optionA: {
    text: string
    quadrant: Quadrant
  }
  optionB: {
    text: string
    quadrant: Quadrant
  }
  hasActivity?: boolean
  activityType?: 'music-mixer' | 'drawing-canvas' | 'puzzle' | 'cooking' | 'room-arranger' | 'packing' | 'morning-routine' | 'task-assigner'
  activityOption?: 'A' | 'B'
}

export interface Answer {
  questionId: number
  choice: 'A' | 'B'
  quadrant: Quadrant
}

export interface TestState {
  currentIndex: number
  shuffledQuestions: Question[]
  answers: Answer[]
  selectedOption: 'A' | 'B' | null
  showActivity: boolean
  activityCompleted: boolean
  testStarted: boolean
  testCompleted: boolean
}

export interface QuadrantResults {
  A: { selected: number; total: number }
  B: { selected: number; total: number }
  C: { selected: number; total: number }
  D: { selected: number; total: number }
}
