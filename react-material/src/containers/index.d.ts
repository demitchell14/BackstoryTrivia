export namespace Api {
    interface LoginResponse {
        token: string;
        email: string;
        name?: string;
        type?: string;
    }
    interface QuestionListResponse {
        filters: QuestionFilter[];
        questions: Question[];
    }
    
    interface QuestionInsertResponse {
        questionObj: Question;
    }
}

export interface QuestionFilter {
    filter: FilterType;
    value: string;
}

export interface Question {
    answer: string;
    category: string[];
    choices: Array<{
        answer: string;
        correct: boolean;
    }> | null;
    points: number;
    question: string;
    questionDetails: string|null;
    questionImage: string|null;
    timeLimit: number;
    type: QuestionType;
    _id: string;
    _creator: string;
}

export type QuestionType = "Open Ended"|"Multiple Choice";

export type FilterType = "category"|"limit";