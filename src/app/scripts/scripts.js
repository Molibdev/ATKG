document.addEventListener('DOMContentLoaded', function() {  

  //Define the elements from the id in the HTML to callback here.
  const startNow = document.getElementById('startNowButton');
  const scoresTables = document.getElementById('scoreTables');
  const gameBase = document.getElementById('gameBase');
  const wordContainer = document.getElementById('wordContainer');
  const gameCountdown = document.getElementById('gameCountdown');
  const gameOver = document.getElementById('gameOver');
  const buttonRegiser = document.getElementById('btnRegister');
  const buttonReturn = document.getElementById('menu');
  const title = document.querySelector('.glitch');
  const dataTable = document.getElementById('dataTable');
  const dataTable2 = document.getElementById('dataTable2');
  const dataTable3 = document.getElementById('dataTable3');

  let selectDifficulty = 0;
  let matchScore = 0;

  //Hide others components we dont gonna use in the beginning of the cycle.
  gameBase.classList.add('hide');
  gameOver.classList.add('hide');
  buttonRegiser.classList.add('hide')
  buttonReturn.classList.add('hide');

  //Score tables of the players
  scoresTables.addEventListener('click', function() {
      startNow.remove();
      scoresTables.remove();
      dataTable.style.display = 'table';
      dataTable2.style.display = 'table';
      dataTable3.style.display = 'table';
  });

  //Modals functions
        // Obtane all elements
        var modals = {
            register: document.getElementById("RecordRegister"),
            help: document.getElementById("help"),
            info: document.getElementById("info")
        };

        var btns = {
            register: document.getElementById("btnRegister"),
            help: document.getElementById("btnHelp"),
            info: document.getElementById("btnInfo")
        };

        var closeButtons = document.getElementsByClassName("close");

        // Function for open an specific modal
        function openModal(modal) {
            modal.style.display = "block";
        }

        // Function for close an specific modal
        function closeModal(modal) {
            modal.style.display = "none";
        }

        // Asign click events to modals buttons
        btns.register.onclick = function() {
            openModal(modals.register);
        }
        btns.help.onclick = function() {
            openModal(modals.help);
        }
        btns.info.onclick = function() {
            openModal(modals.info);
        }

        // Asign click events to modals close buttons
        for (var i = 0; i < closeButtons.length; i++) {
            closeButtons[i].onclick = function() {
                closeModal(this.parentElement.parentElement);
            }
        }

        // Close the modal when user click out the modal
        window.onclick = function(event) {
            if (event.target.className === "modal") {
                closeModal(event.target);
            }
        }


  //Game core functions
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
                  initialGameDuration = 25; 
                  selectDifficulty = 1;
                  console.log('difficulty selected', selectDifficulty);
                  startCountdown();
                  startGameCountdown(initialGameDuration);
              });

              mediumButton.addEventListener('click', function() {
                  numberOfWords = Math.floor(Math.random() * (10 - 8 + 1) + 8); 
                  fetchWords(numberOfWords);
                  initialGameDuration = 21; 
                  selectDifficulty = 2;
                  startCountdown();
                  startGameCountdown(initialGameDuration);
              });

              hardButton.addEventListener('click', function() {
                  numberOfWords = Math.floor(Math.random() * (15 - 11 + 1) + 11); 
                  fetchWords(numberOfWords);
                  initialGameDuration = 18; 
                  selectDifficulty = 3;
                  startCountdown();
                  startGameCountdown(initialGameDuration);
              });

              // Countdown game animation 
              function startCountdown() {
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

              //Display de the word in the HTML
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

              //Take the player keydown, use this function for make the green words too
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

              // Add 100 points to the user and reset countdown in game, and reset the countdown, take the score to the other game too.
              function updateScore() {
                  matchScore += 100;
                  matchScoreElement.textContent = `Score: ${matchScore}`;
                  console.log(`Score updated: ${matchScore}`); 
                  fetchWords(numberOfWords);
                  startGameCountdown(initialGameDuration);
                  console.log('Number of words:', numberOfWords);
              }

              //Check the paragraph if it's completed or not, if it's not dont finish and dont get points.
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
                })
              }

          }, 200);
      }
    });

    //User list fetch Users (back)
    async function fetchUsers() {
        try {
            const response = await fetch('http://localhost:3000/api/users');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            const easyUsersTableBody = document.getElementById('easy-users-table-body');
            const mediumUsersTableBody = document.getElementById('medium-users-table-body');
            const hardUsersTableBody = document.getElementById('hard-users-table-body');

            //Clean tables
            easyUsersTableBody.innerHTML = ''; 
            mediumUsersTableBody.innerHTML = '';
            hardUsersTableBody.innerHTML = '';

            data.data.forEach(user => {
                const row = document.createElement('tr');
                const userNameCell = document.createElement('td');
                const scoreCell = document.createElement('td');
    
                userNameCell.textContent = user.user;
                scoreCell.textContent = user.score;
    
                row.appendChild(userNameCell);
                row.appendChild(scoreCell);
    
                // Conditional for table difficulty
                if (user.difficulty === 1) {
                    easyUsersTableBody.appendChild(row);
                } else if (user.difficulty === 2) {
                    mediumUsersTableBody.appendChild(row);
                } else if (user.difficulty === 3) {
                    hardUsersTableBody.appendChild(row);
                }
            });
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }


    async function addUser() {
        const userName = document.getElementById('user-input').value;
    
        if (userName.trim() === '' || matchScore === 0 || selectDifficulty === 0) return;
    
        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: userName, score: matchScore, difficulty: selectDifficulty })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            document.getElementById('user-input').value = '';
            fetchUsers();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    document.getElementById('add-user-btn').addEventListener('click', addUser);

    fetchUsers();

});
