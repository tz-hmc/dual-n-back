const letters = "abcdefghijklmnopqrstuvwxyz";
const positionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const RETRIES = 10;

// const randomGenerate = (turns: number) => {
//   let count = turns;
//   let letter = null;
//   let posId = 0;
//   let generated = [];
//   while (count > 0) {
//     letter = letters.charAt(Math.random() * letters.length);
//     posId = positionIds[Math.floor(Math.random() * positionIds.length)];
//     generated.push({letter: letter, position: posId});
//     count -= 1;
//   }
//   return generated;
// };

const generateElements = (enumerable: any) => {
  let arr = new Array<any>();
  for (var i = 0; i < enumerable.length; i++) {
    arr.push({ index: i, value: enumerable[i] });
  }
  return arr;
};

const generateElementsFromNum = (number: number) => {
  let arr = new Array<any>();
  for (var i = 0; i < number; i++) {
    arr.push(i);
  }
  return arr;
};

const pickFromElements = (elements: Array<any>, nback: number) => {
  let i = Math.floor(Math.random() * (elements.length - nback));
  let valueNAfter = elements.splice(i + nback, 1)[0];
  let value = elements.splice(i, 1)[0];
  // Also remove the NBefore element, it cant be used in the future either
  if (i - nback >= 0) elements.splice(i - nback, 1);
  return { value, valueNAfter };
};

// TODO: there are a lot of bugs with this, fix
export const givenNumberGenerate = (
  turns: number,
  nBack: number,
  audioMatchNumber: number,
  positionMatchNumber: number
) => {
  let gameStates: Array<{ letter: string; position: number }> = [];
  let gameAnswers: Array<{ audioMatch: boolean; positionMatch: boolean }> = [];
  let pickedIndices: Array<{ letterI: number; positionI: number }> = [];
  // generate random turn index and letter for audio, set its match nBack turns away
  let count = audioMatchNumber;
  let turnElements = generateElementsFromNum(turns - nBack);
  while (count > 0) {
    let letterI = Math.floor(Math.random() * letters.length);
    let { value, valueNAfter } = pickFromElements(turnElements, nBack);
    pickedIndices[value] = { letterI, positionI: -1 };
    pickedIndices[valueNAfter] = { letterI, positionI: -1 };
    gameAnswers[valueNAfter] = {
      ...gameAnswers[valueNAfter],
      audioMatch: true,
    };
    count -= 1;
  }
  // generate random turn index and position, set its match nBack turns away
  count = positionMatchNumber;
  turnElements = generateElementsFromNum(turns - nBack);
  while (count > 0) {
    let positionI = Math.floor(Math.random() * positionIds.length);
    let { value, valueNAfter } = pickFromElements(turnElements, nBack);
    pickedIndices[value] = {
      letterI: pickedIndices[value]?.letterI ?? -1,
      positionI,
    };
    pickedIndices[valueNAfter] = {
      letterI: pickedIndices[valueNAfter]?.letterI ?? -1,
      positionI,
    };
    gameAnswers[valueNAfter] = {
      ...gameAnswers[valueNAfter],
      positionMatch: true,
    };
    count -= 1;
  }
  // Generate game states, if there are missing indices, fill them in
  for (let i = 0; i < turns; i++) {
    // do not create any extra matches
    let val = pickedIndices[i];

    let invalidPositions = new Set();
    let invalidLetters = new Set();
    if (i + nBack < pickedIndices.length) {
      if (pickedIndices[i + nBack]?.positionI >= 0)
        invalidPositions.add(pickedIndices[i + nBack].positionI);
      if (pickedIndices[i + nBack]?.letterI >= 0)
        invalidLetters.add(pickedIndices[i + nBack].letterI);
    }
    if (i - nBack >= 0) {
      if (pickedIndices[i - nBack]?.positionI >= 0)
        invalidPositions.add(pickedIndices[i - nBack].positionI);
      if (pickedIndices[i - nBack]?.letterI >= 0)
        invalidLetters.add(pickedIndices[i - nBack].letterI);
    }

    let pickRetries = RETRIES;
    if (!val || val?.letterI < 0) {
      let letterI = Math.floor(Math.random() * letters.length);
      while (pickRetries > 0 && letterI in invalidLetters) {
        pickRetries -= 1;
        letterI = Math.floor(Math.random() * letters.length);
      }
      pickedIndices[i] = { ...pickedIndices[i], letterI };
    }
    pickRetries = RETRIES;
    if (!val || val?.positionI < 0) {
      let positionI = Math.floor(Math.random() * positionIds.length);
      while (pickRetries > 0 && positionI in invalidPositions) {
        pickRetries -= 1;
        positionI = Math.floor(Math.random() * positionIds.length);
      }
      pickedIndices[i] = { ...pickedIndices[i], positionI };
    }

    gameStates.push({
      letter: letters.charAt(pickedIndices[i].letterI),
      position: positionIds[pickedIndices[i].positionI],
    });
  }
  // set the game answers
  for (let i = 0; i < turns; i++) {
    if (!gameAnswers[i]?.audioMatch) {
      gameAnswers[i] = { ...gameAnswers[i], audioMatch: false };
    }
    if (!gameAnswers[i]?.positionMatch) {
      gameAnswers[i] = { ...gameAnswers[i], positionMatch: false };
    }
  }

  return { gameStates, gameAnswers };
};
