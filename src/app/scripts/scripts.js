document.addEventListener('DOMContentLoaded', function() {
  const startNow = document.getElementById('startNowButton');
  const scoresTables = document.getElementById('scoreTables');
  const gameBase = document.getElementById('gameBase');
  const wordContainer = document.getElementById('wordContainer');
  const gameCountdown = document.getElementById('gameCountdown');
  const gameOver = document.getElementById('gameOver');
  const buttonRegiser = document.getElementById('btnRegister');
  const buttonReturn = document.getElementById('menu');
  gameBase.classList.add('hide');
  gameOver.classList.add('hide');
  buttonRegiser.classList.add('hide')
  buttonReturn.classList.add('hide');

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

              // Initialize count of word depending on the selected difficulty
              let numberOfWords = 0; 
              let countdownInterval;

              easyButton.addEventListener('click', function() {
                  numberOfWords = Math.floor(Math.random() * (7 - 5 + 1) + 5); 
                  fetchWords(numberOfWords);
                  initialGameDuration = 20; 
                  startCountdown();
                  startGameCountdown(initialGameDuration);
              });

              mediumButton.addEventListener('click', function() {
                  numberOfWords = Math.floor(Math.random() * (10 - 8 + 1) + 8); 
                  fetchWords(numberOfWords);
                  initialGameDuration = 17; 
                  startCountdown();
                  startGameCountdown(initialGameDuration);
              });

              hardButton.addEventListener('click', function() {
                  numberOfWords = Math.floor(Math.random() * (15 - 11 + 1) + 11); 
                  fetchWords(numberOfWords);
                  initialGameDuration = 14; 
                  startCountdown();
                  startGameCountdown(initialGameDuration);
              });

              // Countdown animation 
              function startCountdown() {
                  const title = document.querySelector('.glitch');
                  title.classList.add('hide');
                  difficultySelection.remove();
                  const counter = document.querySelector('.counter');
                  counter.classList.add('show');
                  runAnimation();
              }

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

              // Initialize matchScore for the match from the user (not depend from the difficulty).
              let matchScore = 0;
              const matchScoreElement = document.getElementById('matchScore');

              // Fetch words from the API
              function fetchWords(numberOfWords) {
                  console.log('Words:', numberOfWords);
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

              // Add 100 points to the user and reset countdown in game
              function updateScore() {
                  matchScore += 100;
                  matchScoreElement.textContent = `Score: ${matchScore}`;
                  console.log(`Score updated: ${matchScore}`); 
                  fetchWords(numberOfWords);
                  startGameCountdown(initialGameDuration);
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

              // Start game countdown
              function startGameCountdown(duration) {
                setTimeout(function() {
                  clearInterval(countdownInterval);
                  gameCountdown.classList.remove('hide');
                  gameCountdown.textContent = `Time left: ${duration}`;
                  
                  countdownInterval = setInterval(function() {
                      duration--;
                      gameCountdown.textContent = `Time left: ${duration}`;

                      if (duration <= 0) {
                          clearInterval(countdownInterval);
                          gameCountdown.textContent = 'Time\'s up!';
                          setTimeout(function() {
                            gameCountdown.classList.add('hide');
                            gameBase.classList.remove('show');
                            matchScoreElement.classList.add('hide');
                            gameOver.classList.remove('hide');
                            gameOver.classList.add('show');
                            buttonRegiser.classList.add('show');
                            buttonReturn.classList.add('show');
                        }, 1000);
                      }
                  }, 1000);
                },3000)
              }

          }, 200);
      }
  });

});
