export declare namespace Api {
    interface PlayStatus {
        completed: boolean;
        started: boolean;
        paused: boolean;
    }

    interface QuestionHistory {
        token: string;
        answers: {
            _id?: string;
            type: string;
            answer: string;
            question: string;
        }[];
    }
}