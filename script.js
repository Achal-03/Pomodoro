document.addEventListener('DOMContentLoaded', function() {
    
    const modeButtons = document.querySelectorAll('.mode-btn');
    const timerDisplay = document.querySelector('.timer-display');
    const startBtn = document.querySelector('.start-btn');
    const pauseBtn = document.querySelector('.pause-btn');
    const stopBtn = document.querySelector('.stop-btn');
    const resetBtn = document.querySelector('.reset-btn');
    const alertSound = document.getElementById('alert-sound');

    let timerInterval;
    let isRunning = false;
    let isPaused = false;
    let minutes = 25;
    let seconds = 0;
    let currentMode = 'pomodoro';

    function updateDisplay() {
        const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
        const displaySeconds = seconds < 10 ? '0' + seconds : seconds;
        timerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
    }

    function updateMode(mode, time) {
        currentMode = mode;
        minutes = time;
        seconds = 0;
        updateDisplay();
        
        timerDisplay.className = 'timer-display';
        if (mode === 'short-break') {
            timerDisplay.classList.add('short-break');
        } else if (mode === 'long-break') {
            timerDisplay.classList.add('long-break');
        }
        
        resetTimerState();
        
        modeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.classList.contains(mode)) {
                btn.classList.add('active');
            }
        });
    }

    function startTimer() {
        if (isRunning) return;
        
        isRunning = true;
        isPaused = false;
        
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
        
        timerInterval = setInterval(() => {
            if (seconds > 0) {
                seconds--;
            } else if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else {
                clearInterval(timerInterval);
                alertSound.play();
                resetTimerState();
                return;
            }
            
            updateDisplay();
        }, 1000);
    }

    function pauseTimer() {
        if (!isRunning || isPaused) return;
        
        clearInterval(timerInterval);
        isPaused = true;
        isRunning = false;
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function stopTimer() {
        if (!isRunning && !isPaused) return;
        
        clearInterval(timerInterval);
        resetTimerState();
        
        updateMode(currentMode, parseInt(document.querySelector(`.mode-btn.${currentMode}`).dataset.time));
    }

    function resetTimerState() {
        clearInterval(timerInterval);
        isRunning = false;
        isPaused = false;
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
    }

    modeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.classList[1];
            const time = parseInt(this.dataset.time);
            updateMode(mode, time);
        });
    });

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    stopBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', function() {
        stopTimer();
        updateMode(currentMode, parseInt(document.querySelector(`.mode-btn.${currentMode}`).dataset.time));
    });

    updateDisplay();
});
