export type Quadrant = 'A' | 'B' | 'C' | 'D'
export type ScreenType = 'narrative' | 'ultra-fast' | 'comparative'

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
  screenType?: ScreenType
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
