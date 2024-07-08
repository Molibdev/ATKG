document.addEventListener('DOMContentLoaded', function() {
  const startNow = document.getElementById('startNowButton');
  const scoresTables = document.getElementById('scoreTables');
  const gameBase = document.getElementById('gameBase');
  const wordContainer = document.getElementById('wordContainer');
  gameBase.classList.add('hide');

  scoresTables.addEventListener('click', function() {
      startNow.remove();
      scoresTables.remove();
      // Aquí implementa las funciones para las tablas de puntuación.
  });

  startNow.addEventListener('click', function() {
      startNow.remove();
      scoresTables.remove();

      const difficultySelection = document.getElementById('difficultySelection');
      if (difficultySelection) {
          setTimeout(function() {
              const h1 = document.createElement('h1');
              h1.textContent = 'Select difficulty';
              h1.style.color = 'white';
              h1.classList.add('c-container');
              difficultySelection.appendChild(h1);

              const btnContainer = document.createElement('div');
              btnContainer.classList.add('c-container');
              difficultySelection.appendChild(btnContainer);

              const easyButton = document.createElement('button');
              easyButton.textContent = 'Easy';
              easyButton.classList.add('ui-btn');
              btnContainer.appendChild(easyButton);

              const mediumButton = document.createElement('button');
              mediumButton.textContent = 'Medium';
              mediumButton.classList.add('ui-btn');
              btnContainer.appendChild(mediumButton);

              const hardButton = document.createElement('button');
              hardButton.textContent = 'Hard';
              hardButton.classList.add('ui-btn');
              btnContainer.appendChild(hardButton);

              //Initialize count of word depending of the selected difficulty
              let numberOfWords = 0; 

              easyButton.addEventListener('click', function() {
                  startCountdown();
                  numberOfWords = Math.floor(Math.random() * (7 - 5 + 1) + 5); 
                  fetchWords(numberOfWords);
              });

              mediumButton.addEventListener('click', function() {
                  startCountdown();
                  numberOfWords = Math.floor(Math.random() * (10 - 8 + 1) + 8); 
                  fetchWords(numberOfWords);
              });

              hardButton.addEventListener('click', function() {
                  startCountdown();
                  numberOfWords = Math.floor(Math.random() * (15 - 11 + 1) + 11); 
                  fetchWords(numberOfWords);
              });

              function startCountdown() {
                  const title = document.querySelector('.glitch');
                  title.classList.add('hide');
                  difficultySelection.remove();
                  const counter = document.querySelector('.counter');
                  counter.classList.add('show');
                  runAnimation();
              }

              //Initialize matchScore for the match from the user (not depend from the difficulty).
              let matchScore = 0;
              const matchScoreElement = document.getElementById('matchScore');

              // Fetch words from the API
              function fetchWords(numberOfWords) {
                console.log('Words:', numberOfWords)
                const apiUrl = `https://random-word-form.herokuapp.com/random/noun/a?count=${numberOfWords}`;
                const apiUrlBackup = `https://random-word-api.herokuapp.com/word?length=${numberOfWords}`;
                
                // Fetch words from the API
                fetch(apiUrl)
                  .then(response => {
                    if (!response.ok) {
                      throw new Error(`Error: ${response.status}`);
                    }
                    return response.json();
                  })
                  .then(data => {
                    displayWords(data);
                  })
                  .catch(error => {
                    console.error('Error fetching words from the primary API:', error);
                    fetch(apiUrlBackup)
                      .then(response => {
                        if (!response.ok) {
                          throw new Error(`Error: ${response.status}`);
                        }
                        return response.json();
                      })
                      .then(data => {
                        displayWords(data);
                      })
                      .catch(error => {
                        console.error('Error fetching words from the backup API:', error);
                        wordContainer.innerHTML = 'API error, please try another time';
                      });
                  });
              }

              function displayWords(words) {
                wordContainer.innerHTML = '';

                words.forEach(word => {
                  const wordElement = document.createElement('div');
                  wordElement.className = 'word';
                  
                  word.split('').forEach(letter => {
                    const letterElement = document.createElement('span');
                    letterElement.textContent = letter;
                    letterElement.className = 'letter';
                    wordElement.appendChild(letterElement);
                  });

                  wordContainer.appendChild(wordElement);
                });

                wordContainer.classList.add('show');
                document.addEventListener('keydown', handleKeydown);
              }

              function handleKeydown(event) {
                const key = event.key;
                const words = wordContainer.querySelectorAll('.word');
                let allWordsCompleted = true;
                
                for (let word of words) {
                  const letters = word.querySelectorAll('.letter');
                  let wordCompleted = true;
                  
                  for (let letter of letters) {
                    if (!letter.classList.contains('green')) {
                      if (letter.textContent === key) {
                        letter.classList.add('green');
                      } else {
                        wordCompleted = false;
                      }
                      break;
                    }
                  }
                  
                  if (!wordCompleted) {
                    allWordsCompleted = false;
                  }
                }

                if (allWordsCompleted) {
                  checkParagraphCompletion();
                }
              }

              function updateScore() {
                matchScore += 100;
                matchScoreElement.textContent = `Score: ${matchScore}`;
                console.log(`Score updated: ${matchScore}`); 
                fetchWords(numberOfWords);
                console.log('Number of words:', numberOfWords);
              }

              function checkParagraphCompletion() {
                const words = wordContainer.querySelectorAll('.word');
                let allGreen = true;

                words.forEach(word => {
                  const letters = word.querySelectorAll('.letter');
                  const wordAllGreen = Array.from(letters).every(letter => letter.classList.contains('green'));
                  if (!wordAllGreen) {
                    allGreen = false;
                  }
                });

                if (allGreen) {
                  console.log('All words are completed, updating score.'); 
                  updateScore();
                } else {
                  console.log('Not all words are completed.'); 
                }
              }

          }, 200);
      }
  });


  const nums = document.querySelectorAll('.nums span');
  const counter = document.querySelector('.counter');
  const finalMessageCountdown = document.querySelector('.final');

  function runAnimation() {
      nums.forEach((num, idx) => {
          const penultimate = nums.length - 1;
          num.addEventListener('animationend', (e) => {
              if (e.animationName === 'goIn' && idx !== penultimate) {
                  num.classList.remove('in');
                  num.classList.add('out');
              } else if (e.animationName === 'goOut' && num.nextElementSibling) {
                  num.nextElementSibling.classList.add('in');
              } else {
                  counter.classList.add('hide');
                  finalMessageCountdown.classList.add('show');
                  setTimeout(function() {
                      counter.remove();
                      finalMessageCountdown.remove();
                  }, 600);
                  setTimeout(function() {
                      gameBase.classList.add('show');
                  }, 800);
              }
          });
      });
  }

  let currentWordIndex = 0;
  let currentLetterIndex = 0;

  function handleKeydown(event) {
      const words = document.querySelectorAll('.word');
      if (currentWordIndex >= words.length) return;
      
      const currentWord = words[currentWordIndex];
      const letters = currentWord.querySelectorAll('.letter');

      if (currentLetterIndex < letters.length) {
          const currentLetterElement = letters[currentLetterIndex];
          
          if (event.key === currentLetterElement.textContent) {
              currentLetterElement.style.color = 'green';
              currentLetterIndex++;

              if (currentLetterIndex === letters.length) {
                  currentWordIndex++;
                  currentLetterIndex = 0;
              }
          }
      }
  }
});