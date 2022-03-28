export type ResultRow = {
    audioTP: number;
    audioFP: number;
    positionTP: number;
    positionFP: number;
    audioTN: number; 
    audioFN: number;
    positionTN: number;
    positionFN: number;
    nBackLevel: number;
}

export type Result = {
    audioTP: number;
    audioFP: number;
    positionTP: number;
    positionFP: number;
    audioTN: number; 
    audioFN: number;
    positionTN: number;
    positionFN: number;
};

export const toResultRow = (result: Result, nBackLevel: number) => {
    return {...result, nBackLevel };
}

export const accuracy = (TP: number, TN: number, FN: number, FP: number) => (TP + TN)/(TP + TN + FN + FP);

export const gradePlayerInput = (playerInputs: Array<{audioMatch: boolean, positionMatch: boolean}>,
    gameAnswers: Array<{audioMatch: boolean, positionMatch: boolean}>): Result => {
    let audioTP = 0, audioFP = 0, positionTP = 0, positionFP = 0;
    let audioTN = 0, audioFN = 0, positionTN = 0, positionFN = 0;
    gameAnswers.forEach((ans, i) => {
        if(ans.audioMatch && playerInputs[i]?.audioMatch) {
            audioTP += 1;
        }
        if(!ans.audioMatch && !playerInputs[i]?.audioMatch) {
            audioTN += 1;
        }
        if(ans.audioMatch && !playerInputs[i]?.audioMatch) {
            audioFN += 1;
        }
        if(!ans.audioMatch && playerInputs[i]?.audioMatch) {
            audioFP += 1;
        }

        if(ans.positionMatch && playerInputs[i]?.positionMatch) {
            positionTP += 1;
        }
        if(!ans.positionMatch && !playerInputs[i]?.positionMatch) {
            positionTN += 1;
        }
        if(ans.positionMatch && !playerInputs[i]?.positionMatch) {
            positionFN += 1;
        }
        if(!ans.positionMatch && playerInputs[i]?.positionMatch) {
            positionFP += 1;
        }
    });
    return { audioTP, audioFP, positionTP, positionFP, audioTN, audioFN, positionTN, positionFN };
}