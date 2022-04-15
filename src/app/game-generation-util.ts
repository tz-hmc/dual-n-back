const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const positionIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const RETRIES = 10;

const generateElementsFromNum = (number: number) => {
  let arr = new Array<any>();
  for (var i = 0; i < number; i++) {
    arr.push(i);
  }
  return arr;
};

// pick random turn without replacement
const getRandomTurn = (elements: Array<any>, nback: number) => {
  let i = Math.floor(Math.random() * (elements.length - nback));
  return elements[i];
}

// pick turn without replacement
const pick = (elements: Array<any>, element: number) => {
  const idx = elements.indexOf(element);
  if (idx >= 0) {
    elements.splice(idx, 1);
  }
}

const pickMatchWithGenerator = (turnElements: Array<number>, count: number, turns: number, nBack: number,
  generated: Array<any>, matchPositions: Array<any>,
  generator: () => any, valueKey: string,
  matchKey: string) => {
  let value = generator();
  let pickedTurn = getRandomTurn(turnElements, nBack);
  let nForwardTurn = pickedTurn + nBack;
  let nBackwardTurn = pickedTurn - nBack;
  let currentElement = {...generated[pickedTurn], [valueKey]: value};
  let nForwardElement = generated[nForwardTurn];
  let nBackwardElement = generated[nBackwardTurn];
  // see if match already exists from prev chosen elements, in that case we don't need to do anything
  if(!!nForwardElement && !!nBackwardElement &&
      nForwardElement[valueKey] === value && nBackwardElement[valueKey] === value
      && count >= 2) {
    count -= 2;
    generated[pickedTurn] = currentElement;
    pick(turnElements, pickedTurn);
    matchPositions[pickedTurn] = {...matchPositions[pickedTurn], [matchKey]: true};
    matchPositions[nForwardTurn] = {...matchPositions[nForwardTurn], [matchKey]: true};
  }
  else if(!!nForwardElement && nForwardElement[valueKey] === value) {
    count -= 1;
    generated[pickedTurn] = currentElement;
    pick(turnElements, pickedTurn);
    matchPositions[nForwardTurn] = {...matchPositions[nForwardTurn], [matchKey]: true};
  }
  else if(!!nBackwardElement && nBackwardElement[valueKey] === value) {
    count -= 1;
    generated[pickedTurn] = currentElement;
    pick(turnElements, pickedTurn);
    matchPositions[pickedTurn] = {...matchPositions[pickedTurn], [matchKey]: true};
  }
  // no match so far, create a match
  // whenever we pick an element, current or back/forward, need to check if it creates other matches
  else if(nBackwardTurn >= 0 && !nBackwardElement?.[valueKey]) {
    const nBackBackwardTurn = nBackwardTurn - nBack;
    const nBackBackwardElement = generated[nBackBackwardTurn];
    if(currentElement[valueKey] === nBackBackwardElement?.[valueKey] && count >= 2) {
      count -= 2;
      generated[pickedTurn] = currentElement;
      generated[nBackwardTurn] = {...generated[nBackwardTurn], [valueKey]: currentElement[valueKey]};
      pick(turnElements, pickedTurn);
      pick(turnElements, nBackwardTurn);
      matchPositions[pickedTurn] = {...matchPositions[pickedTurn], [matchKey]: true};
      matchPositions[nBackwardTurn] = {...matchPositions[nBackwardTurn], [matchKey]: true};
    }
    else if (currentElement[valueKey] !== nBackBackwardElement?.[valueKey]) {
      count -= 1;
      generated[pickedTurn] = currentElement;
      generated[nBackwardTurn] = {...generated[nBackwardTurn], [valueKey]: currentElement[valueKey]};
      pick(turnElements, pickedTurn);
      pick(turnElements, nBackwardTurn);
      matchPositions[pickedTurn] = {...matchPositions[pickedTurn], [matchKey]: true};
    }
  }
  else if(nForwardTurn < turns && !nForwardElement?.[valueKey]) {
    const nForForwardTurn = nForwardTurn + nBack;
    const nForForwardElement = generated[nForForwardTurn];
    if(currentElement[valueKey] === nForForwardElement?.[valueKey] && count >= 2) {
      count -= 2;
      generated[pickedTurn] = currentElement;
      generated[nForwardTurn] = {...generated[nForwardTurn], [valueKey]: currentElement[valueKey]};
      pick(turnElements, nForwardTurn);
      pick(turnElements, pickedTurn);
      matchPositions[nForwardTurn] = {...matchPositions[nForwardTurn], [matchKey]: true};
      matchPositions[nForForwardTurn] = {...matchPositions[nForForwardTurn], [matchKey]: true};
    }
    else if (currentElement[valueKey] !== nForForwardElement?.[valueKey]) {
      count -= 1;
      generated[pickedTurn] = currentElement;
      generated[nForwardTurn] = {...generated[nForwardTurn], [valueKey]: currentElement[valueKey]};
      pick(turnElements, nForwardTurn);
      pick(turnElements, pickedTurn);
      matchPositions[nForwardTurn] = {...matchPositions[nForwardTurn], [matchKey]: true};
    }
  }
  else {} // this turn can't be used to create a match
  return count;
}

const pickUnmatchWithGenerator = (pickedTurn: number, nBack: number,
  generated: Array<any>, matchPositions: Array<any>,
  generator: () => any, valueKey: string,
  matchKey: string) => {
  let nForwardTurn = pickedTurn + nBack;
  let nBackwardTurn = pickedTurn - nBack;
  let nForwardElement = generated[nForwardTurn];
  let nBackwardElement = generated[nBackwardTurn];

  let retries = RETRIES;
  let value = generator();
  let currentElement = {...generated[pickedTurn], [valueKey]: value};
  let invalid = (!!nForwardElement && nForwardElement[valueKey] === value) || (!!nBackwardElement && nBackwardElement[valueKey] === value);
  // Try to avoid any matches
  while(invalid && retries > 0) {
    value = generator();
    currentElement = {...generated[pickedTurn], [valueKey]: value};
    invalid = (!!nForwardElement && nForwardElement[valueKey] === value) || (!!nBackwardElement && nBackwardElement[valueKey] === value);
    retries -= 1;
  }

  if(!invalid) {
    generated[pickedTurn] = currentElement;
    matchPositions[pickedTurn] = {...matchPositions[pickedTurn], [matchKey]: false};
  }
}

export const GivenNumberGenerate = (
  turns: number,
  nBack: number,
  audioMatchNumber: number,
  positionMatchNumber: number
) => {
  let gameStates: Array<{letter: string, position: number}> = [];
  let gameAnswers: Array<{audioMatch: boolean, positionMatch: boolean}> = [];
  // Generate letter matches
  let turnElements = generateElementsFromNum(turns);
  let count = audioMatchNumber;
  while (count > 0) {
    count = pickMatchWithGenerator(turnElements, count, turns, nBack, gameStates, gameAnswers,
      () => letters.charAt(Math.floor(Math.random() * letters.length)), "letter",
      "audioMatch");
  }
  // Generate position matches
  turnElements = generateElementsFromNum(turns);
  count = positionMatchNumber;
  while (count > 0) {
    count = pickMatchWithGenerator(turnElements, count, turns, nBack, gameStates, gameAnswers,
      () => positionIds[Math.floor(Math.random() * positionIds.length)], "position",
      "positionMatch");
  }
  // Fill in the rest
  for(var i = 0; i < turns; i += 1) {
    if(!gameStates[i]?.letter) {
      pickUnmatchWithGenerator(i, nBack, gameStates, gameAnswers,
        () => letters.charAt(Math.floor(Math.random() * letters.length)), "letter",
        "audioMatch");
    }
    if(!gameStates[i]?.position) {
      pickUnmatchWithGenerator(i, nBack, gameStates, gameAnswers,
        () => positionIds[Math.floor(Math.random() * positionIds.length)], "position",
        "positionMatch");
    }
    if(!gameAnswers[i]?.audioMatch) {
      gameAnswers[i] = {...gameAnswers[i], audioMatch: false};
    }
    if(!gameAnswers[i]?.positionMatch) {
      gameAnswers[i] = {...gameAnswers[i], positionMatch: false};
    }
  }
  console.log(gameStates);
  return { gameStates, gameAnswers };
};

const gradeRandomGenerate = (gameStates: Array<{letter: string, position: number}>, nback: number) => {
  let gameAnswers: Array<{audioMatch: boolean, positionMatch: boolean}> = [];
  gameStates.forEach((state, index) => {
    let nBackI = index - nback;
    if(nBackI >= 0) {
      gameAnswers.push({
        audioMatch: (state.letter === gameStates[nBackI].letter),
        positionMatch: (state.position === gameStates[nBackI].position),
      });
    }
    else {
      gameAnswers.push({
        audioMatch: false,
        positionMatch: false,
      });
    }
  });
  return gameAnswers;
}

export const RandomGenerate = (turns: number, nBack: number) => {
  let count = turns;
  let letter = null;
  let posId = 0;
  let gameStates: Array<{letter: string, position: number}> = [];
  while (count > 0) {
    letter = letters.charAt(Math.random() * letters.length);
    posId = positionIds[Math.floor(Math.random() * positionIds.length)];
    gameStates.push({letter: letter, position: posId});
    count -= 1;
  }
  return { gameStates, gameAnswers: gradeRandomGenerate(gameStates, nBack) };
};
