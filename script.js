let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';
        let gameActive = true;
        let gameMode = 'pvp'; 
        let scores = { X: 0, O: 0, draw: 0 };

        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6] 
        ];

        function setGameMode(mode) {
            gameMode = mode;
            const buttons = document.querySelectorAll('.mode-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            
            if (mode === 'pvp') {
                buttons[0].classList.add('active');
                document.getElementById('player2Label').textContent = 'Player O';
            } else {
                buttons[1].classList.add('active');
                document.getElementById('player2Label').textContent = 'AI (O)';
            }
            
            resetGame();
        }

        function makeMove(index) {
            if (board[index] !== '' || !gameActive) return;

            board[index] = currentPlayer;
            document.querySelectorAll('.cell')[index].textContent = currentPlayer;
            document.querySelectorAll('.cell')[index].style.color = currentPlayer === 'X' ? '#ff6b6b' : '#4834d4';

            if (checkWinner()) {
                gameActive = false;
                highlightWinner();
                document.getElementById('gameResult').textContent = `${currentPlayer === 'X' ? 'Player X' : (gameMode === 'ai' ? 'AI' : 'Player O')} Wins!`;
                scores[currentPlayer]++;
                updateScoreboard();
                return;
            }

            if (board.every(cell => cell !== '')) {
                gameActive = false;
                document.getElementById('gameResult').textContent = "It's a Draw!";
                scores.draw++;
                updateScoreboard();
                return;
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateCurrentPlayerDisplay();

           
            if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
                setTimeout(() => {
                    makeAIMove();
                }, 500);
            }
        }

        function makeAIMove() {
         
            let move = getBestMove();
            
            board[move] = 'O';
            document.querySelectorAll('.cell')[move].textContent = 'O';
            document.querySelectorAll('.cell')[move].style.color = '#4834d4';

            if (checkWinner()) {
                gameActive = false;
                highlightWinner();
                document.getElementById('gameResult').textContent = 'AI Wins!';
                scores.O++;
                updateScoreboard();
                return;
            }

            if (board.every(cell => cell !== '')) {
                gameActive = false;
                document.getElementById('gameResult').textContent = "It's a Draw!";
                scores.draw++;
                updateScoreboard();
                return;
            }

            currentPlayer = 'X';
            updateCurrentPlayerDisplay();
        }

        function getBestMove() {
            
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    if (checkWinner()) {
                        board[i] = '';
                        return i;
                    }
                    board[i] = '';
                }
            }

            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    if (checkWinner()) {
                        board[i] = '';
                        return i;
                    }
                    board[i] = '';
                }
            }

            
            if (board[4] === '') return 4;

            
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(i => board[i] === '');
            if (availableCorners.length > 0) {
                return availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }

            
            const available = board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
            return available[Math.floor(Math.random() * available.length)];
        }

        function checkWinner() {
            return winConditions.some(condition => {
                const [a, b, c] = condition;
                return board[a] && board[a] === board[b] && board[a] === board[c];
            });
        }

        function highlightWinner() {
            winConditions.forEach(condition => {
                const [a, b, c] = condition;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    document.querySelectorAll('.cell')[a].classList.add('winner');
                    document.querySelectorAll('.cell')[b].classList.add('winner');
                    document.querySelectorAll('.cell')[c].classList.add('winner');
                }
            });
        }

        function updateCurrentPlayerDisplay() {
            const display = document.getElementById('currentPlayer');
            if (gameMode === 'ai') {
                display.textContent = currentPlayer === 'X' ? "Your Turn" : "AI is thinking...";
            } else {
                display.textContent = `Player ${currentPlayer}'s Turn`;
            }
        }

        function updateScoreboard() {
            document.getElementById('scoreX').textContent = scores.X;
            document.getElementById('scoreO').textContent = scores.O;
            document.getElementById('scoreDraw').textContent = scores.draw;
        }

        function resetGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;
            
            document.querySelectorAll('.cell').forEach(cell => {
                cell.textContent = '';
                cell.classList.remove('winner');
            });
            
            document.getElementById('gameResult').textContent = '';
            updateCurrentPlayerDisplay();
        }

       
        updateCurrentPlayerDisplay();