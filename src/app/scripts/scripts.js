document.addEventListener('DOMContentLoaded', function() {
  const startNow = document.getElementById('startNowButton');
  const scores = document.getElementById('scoreTables');
  const gameBase = document.getElementById('gameBase');
  const wordContainer = document.getElementById('wordContainer');
  gameBase.classList.add('hide');

  scores.addEventListener('click', function() {
      startNow.remove();
      scores.remove();
      // Aquí implementa las funciones para las tablas de puntuación.
  });

  startNow.addEventListener('click', function() {
      startNow.remove();
      scores.remove();

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

              easyButton.addEventListener('click', function() {
                  startCountdown();
                  fetchWords(5, 7);
              });

              mediumButton.addEventListener('click', function() {
                  startCountdown();
                  fetchWords(10, 14);
              });

              hardButton.addEventListener('click', function() {
                  startCountdown();
                  fetchWords(15, 20);
              });

              function startCountdown() {
                  const title = document.querySelector('.glitch');
                  title.classList.add('hide');
                  difficultySelection.remove();
                  const counter = document.querySelector('.counter');
                  counter.classList.add('show');
                  runAnimation();
              }

              function fetchWords(min, max) {
                  const numberOfWords = Math.floor(Math.random() * (max - min + 1) + min);
                  const apiUrl = `https://random-word-api.herokuapp.com/word?number=${numberOfWords}`;
                  fetch(apiUrl)
                  .then(response => response.json())
                  .then(data => {
                      const words = data;
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
                  })
                  .catch(error => console.error('Error fetching words from the API:', error));
              }
          }, 200);
      }
  });

  const nums = document.querySelectorAll('.nums span');
  const counter = document.querySelector('.counter');
  const finalMessage = document.querySelector('.final');

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
                  finalMessage.classList.add('show');
                  setTimeout(function() {
                      counter.remove();
                      finalMessage.remove();
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