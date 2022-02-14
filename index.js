const inputList = document.querySelector('#inputList');
const startWord = document.querySelector('#startWord');
const endWord = document.querySelector('#endWord');
const inputStartWord = document.querySelector('#inputStartWord');
const inputEndWord = document.querySelector('#inputEndWord');
const inputNextWord = document.querySelector('#guessInput');
const popup = document.querySelector('#popupContainer');
const popupMessage = document.querySelector('#popupContainerMessage');

let numberOfInputs = 0;
let wordLength;
let nextWord;
let previousWord;
let changedLetters = 0;
let userInput;
let endWordVar;

const guessBtn = document.querySelector('#guessBtn');
const startWordBtn = document.querySelector('#startWordBtn');
const endWordBtn = document.querySelector('#endWordBtn');




/**
 * Steg 1: Använd API för att ta in lista med ord med .length 3 || 4 || 5.
 * 
 * Steg 2: mata in slumpmässigt ord som startord.
 *  skapa en span för det och lägg den i startWord
 * 
 * Steg 3: mata in slumpmässigt ord som slutord som matchar .length av startordet,
 *  skapa en span för det och lägg den i endWord
 * 
 * Steg 4: låt spelaren mata in inputs som har samma antal bokstäver,
 *  där högst 1 bokstav ändrats samt motsvarar ett riktigt ord från API-ordlistan
 * 
 * Steg 5: Spara ner spelarens inputs i en ny span.
 * 
 * Steg 6: Vid matchning av användarens ord och slutordet, displaya You Won! Play again?
 * 
 * Steg 7: Sätt ett max-antal för användarens inputs. 14 = loss displaya you lost, Play again?
 * 
 * Steg 8: restart funktion
 * 
 */
async function getStartWord() {
    try {
        let userInput = inputStartWord.value
        const wordData = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${userInput}`,

            {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        const wordObject = await wordData.json();

        if (!wordObject.title) {
            wordLength = userInput.length
            addStartWordEl(userInput)
            previousWord = userInput
            inputStartWord.value = "";


        } else {
            popupMessage.innerHTML = ("We don't use that word here.")
            showNotification();
        }
    } catch (err) {
        alert('Error connecting to API')
    }
};


async function getNextWord() {
    try {
        let userInput = inputNextWord.value
        const wordData = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${userInput}`,

            {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        const wordObject = await wordData.json();
        if (wordLength === userInput.length && !wordObject.title) {

            ruleCheck(userInput, previousWord);
            previousWord = userInput
            if (changedLetters > 1) {
                popupMessage.innerHTML = "You may only change one letter at a time."
                showNotification();
            } else {
                addNextWordEl(userInput);
                inputNextWord.value = "";


            }

        }
        else {
            if (wordLength != userInput.length) {
                popupMessage.innerHTML =
                    ("The words need to have the same amount of letters.")
                showNotification();
                return;
            } else {
                popupMessage.innerHTML =
                    ("We don't use that word here.")
                showNotification();
                return;
            }

        };
    } catch (err) {
        alert('Error connecting to API')

    }

};



async function getEndWord() {
    try {

        let userInput = inputEndWord.value
        const wordData = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${userInput}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const wordObject = await wordData.json();

        if (wordLength === userInput.length && !wordObject.title) {
            addEndWordEl()
            inputEndWord.value = "";
        }
        else {
            if (wordLength != userInput.length) {
                popupMessage.innerHTML =
                    ("The words need to have the same amount of letters.")
                showNotification();

                return;
            } else {
                popupMessage.innerHTML =
                    ("We don't use that word here.")
                showNotification();
                return;
            }

        }
    } catch (err) { alert('Error connecting to API') }

}

function addStartWordEl(userInput) {
    userInput = inputStartWord.value
    startWord.innerHTML = `${userInput}`
    inputStartWord.disabled = true;

}


function addEndWordEl(userInput) {
    userInput = inputEndWord.value
    endWord.innerHTML = `${userInput}`
    endWordVar = endWord.innerHTML
    inputEndWord.disabled = true;

}

function addNextWordEl(userInput) {
    userInput = inputNextWord.value
    let liEl = document.createElement("li");
    liEl.setAttribute("class", "input-list-item")
    liEl.textContent = `${userInput}`
    inputList.appendChild(liEl);

    ++numberOfInputs
    checkIfWon(userInput);
    checkIfLost(numberOfInputs);

};

function showNotification() {
    popup.classList.add('show');

    // removes notification after 1500ms
    setTimeout(() => {
        popup.classList.remove('show');

    }, 3500);
};
function checkIfLost(numberOfInputs) {
    console.log('before', numberOfInputs)
    if (numberOfInputs === 10) {
        popup.classList.add('show');
        popupMessage.innerHTML = `You Lost! <button id="resetGameBtn">Play again?</button>`
        const resetGameBtn = document.getElementById('resetGameBtn')
        resetGameBtn.addEventListener('click', resetGame);
        guessBtn.removeEventListener('click', getNextWord);
        startWordBtn.removeEventListener('click', getStartWord);
        endWordBtn.removeEventListener('click', getEndWord);

        inputStartWord.disabled = true;
        inputNextWord.disabled = true;
        inputEndWord.disabled = true;
    }
};

function checkIfWon(userInput) {
    if (userInput === endWordVar) {
        popup.classList.add('show');
        popupMessage.innerHTML = `You Won! <button id="resetGameBtn">Play again?</button>`
        const resetGameBtn = document.getElementById('resetGameBtn')
        resetGameBtn.addEventListener('click', resetGame);
        guessBtn.removeEventListener('click', getNextWord);
        startWordBtn.removeEventListener('click', getStartWord);
        endWordBtn.removeEventListener('click', getEndWord);
        inputStartWord.disabled = true;
        inputNextWord.disabled = true;
        inputEndWord.disabled = true;
    }
};

function ruleCheck(userInput, previousWord) {
    changedLetters = 0;

    for (let i = 0; i < userInput.length; i++) {

        if (userInput[i] !== previousWord[i]) {
            changedLetters++;

        }
    }
};

function resetGame() {

    numberOfInputs = 0;
    wordLength;
    nextWord;
    previousWord;
    changedLetters = 0;
    userInput;
    endWordVar;
    popup.classList.remove('show');
    inputList.innerHTML = "";
    inputStartWord.value = "";
    inputEndWord.value = "";
    inputNextWord.value = "";
    endWord.innerHTML = "";
    startWord.innerHTML = "";
    guessBtn.addEventListener('click', getNextWord);
    startWordBtn.addEventListener('click', getStartWord);
    endWordBtn.addEventListener('click', getEndWord);
    inputStartWord.disabled = false;
    inputNextWord.disabled = false;
    inputEndWord.disabled = false;

    inputStartWord.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            getStartWord();
        }
    });

    inputNextWord.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            getNextWord();
        }
    });

    inputEndWord.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            getEndWord();
        }
    });
}

guessBtn.addEventListener('click', getNextWord);
startWordBtn.addEventListener('click', getStartWord);
endWordBtn.addEventListener('click', getEndWord);

inputStartWord.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        getStartWord();
    }
});

inputNextWord.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        getNextWord();
    }
});

inputEndWord.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        getEndWord();
    }
});

