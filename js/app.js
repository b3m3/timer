document.addEventListener('DOMContentLoaded', () => {
  const timer = () => {
    const circle = document.querySelector('.circle');
    const inputsRange = document.querySelectorAll('input');
    const buttons = document.querySelectorAll('button');
    const signal = document.querySelector('.signal');

    const min = document.querySelector('.counter-min');
    const sec = document.querySelector('.counter-sec');

    let interval;
    let clicks = 0;

    let seconds = 0;
    let pixels = 0;
    let total = 0;

    const addSVGTimer = (value = 0) => {
      circle.innerHTML = `
      <svg width="200" height="200">
        <circle transform="rotate(-90)" r="80" cx="-100" cy="100" />
        <circle transform="rotate(-90)" style="stroke-dasharray:${value}px 502px;" r="80" cx="-100" cy="100" />
      </svg>
      `;
    };

    addSVGTimer();

    const timeAction = (minAction, secAction) => {
      min.textContent = minAction;
      sec.textContent = secAction;
    };

    const addZero = elem => {
      elem.textContent = +elem.textContent < 10 ? '0' + (+elem.textContent) : +elem.textContent;
    };

    const statusStartBtn = (from, to) => {
      const spans = buttons[1].querySelectorAll('span');
      spans[from].classList.add('hidden');
      spans[to].classList.remove('hidden');
    };

    inputsRange.forEach(range => {
      range.addEventListener('input', () => {
        timeAction(inputsRange[0].value, inputsRange[1].value);
        addZero(min);
        addZero(sec);

        if (range.value > 0) {
          buttons.forEach(btn => btn.classList.remove('ban'));
        } 
        
        if (inputsRange[0].value < 1 && inputsRange[1].value < 1) {
          buttons.forEach(btn => btn.classList.add('ban'));
        }
      });
    });

    const startCountdown = () => {
      sec.textContent--;
      addZero(sec);
      
      pixels = 502 / seconds;
      total += +pixels.toFixed(5);
      addSVGTimer(+total.toFixed(5));

      if (+min.textContent > 0) {
        if (sec.textContent < '00') {
          timeAction(+min.textContent - 1, 59);
          addZero(min);       
        }
      }

      if (+min.textContent === 0 && +sec.textContent === 0){
        signal.play();
        buttons[1].classList.add('ban');
        clearInterval(interval);
        circle.classList.add('active');
      }
    };

    const countdownActions = () => {
      clicks++;
      
      if (clicks % 2 === 1) {
        statusStartBtn(0, 1);
        interval = setInterval(startCountdown, 1000);
        inputsRange.forEach(input => input.classList.add('ban'));
        seconds = (+min.textContent * 60 + (+sec.textContent));
        console.log(seconds);
      } else {
        pixels = 0;
        total = 0;
        statusStartBtn(1, 0);
        clearInterval(interval);
        inputsRange.forEach(input => input.classList.remove('ban'));
        seconds = (+min.textContent * 60 + (+sec.textContent));
      }
    };

    const stopTimer = () => {
      clicks = 0;
      seconds = 0;
      pixels = 0;
      total = 0;
      timeAction('00', '00');

      buttons.forEach(btn => btn.classList.add('ban'));

      inputsRange.forEach(range => {
        range.value = 0;
        range.classList.remove('ban');
      });

      circle.classList.remove('active');
      statusStartBtn(1, 0);
      clearInterval(interval);
      signal.pause();
      addSVGTimer(0);
    };

    buttons.forEach(btn => btn.onclick = () => 
      btn.classList.contains('start') ? countdownActions() : stopTimer()
    );
  };

  timer();
});