var board, game = new Chess(); // CREATE A NEW CHESS GAME INSTANCE (WHICH RETURN A NEW BOARD, AND THE GAME ITSELF)

var minimaxRoot = function (depth, game, isMaximisingPlayer) { // MINIMAX ALGORITHM: MINIMAXROOT FUNCTION (DEPTH, GAME, ISMAXIMISINGPLAYER) IS THE ROOT OF THE MINIMAX TREE (THE FIRST NODE) AND WILL RETURN THE BEST MOVE FOR THE CURRENT PLAYER (THE MAXIMISING PLAYER)
    // DEPTH: THE DEPTH OF THE MINIMAX TREE (THE NUMBER OF MOVES TO LOOK AHEAD)
    // GAME: THE CURRENT GAME
    // ISMAXIMISINGPLAYER: A BOOLEAN THAT INDICATES IF THE CURRENT PLAYER IS THE MAXIMISING PLAYER (TRUE) OR THE MINIMISING PLAYER (FALSE)
    var newGameMoves = game.ugly_moves(); // GET ALL POSSIBLE MOVES FOR THE CURRENT GAME (ALSO KNOWN AS CHILDREN NODES; THE NODES THAT ARE DIRECTLY CONNECTED TO THE ROOT NODE; AND CALL THEM UGLY MOVES)
    var bestMove = -9999; // INITIALISE THE BEST MOVE TO -9999 (THE WORST POSSIBLE MOVE FOR THE CURRENT PLAYER)
    var bestMoveFound; // INITIALISE THE BEST MOVE FOUND TO NULL
    for (var i = 0; i < newGameMoves.length; i++) { // LOOP THROUGH ALL THE POSSIBLE MOVES
        var newGameMove = newGameMoves[i] // GET THE CURRENT MOVE
        game.ugly_move(newGameMove); // MAKE THE CURRENT MOVE
        var value = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer); // GET THE VALUE OF THE CURRENT MOVE (BY CALLING THE MINIMAX FUNCTION) (DEPTH - 1, GAME, -10000, 10000, !ISMAXIMISINGPLAYER) WHICH WILL RETURN THE BEST MOVE FOR THE OPPONENT
        game.undo(); // UNDO THE CURRENT MOVE (SO THAT THE GAME IS BACK TO ITS ORIGINAL STATE)
        if (value >= bestMove) { // IF THE VALUE OF THE CURRENT MOVE IS GREATER THAN OR EQUAL TO THE BEST MOVE
            bestMove = value; // SET THE BEST MOVE TO THE VALUE OF THE CURRENT MOVE
            bestMoveFound = newGameMove; // SET THE BEST MOVE FOUND TO THE CURRENT MOVE
        } // END IF
    } // END FOR
    return bestMoveFound; // RETURN THE BEST MOVE FOUND
}; // END MINIMAXROOT FUNCTION

/* Here is the explanation for the code above:
1. The minimaxRoot function takes three parameters, depth, game and isMaximisingPlayer. The depth parameter indicates the depth of the minimax tree to traverse. The game parameter is the current game being played. The isMaximisingPlayer parameter is a boolean that indicates if the current player is the maximising player (true) or the minimising player (false). The function will return the best move for the current player.
2. The function first gets all the possible moves for the current game using the ugly_moves function. These are also known as children nodes (nodes that are directly connected to the root node). These are called ugly moves because they are not ordered in any particular way.
3. The bestMove variable is initialised to -9999 and the bestMoveFound variable is initialised to null. These variables will be used to determine the best move for the current player.
4. The for loop will loop through all the possible moves for the current game.
5. In the for loop, the current move is made using the ugly_move function.
6. The minimax function is then called with the depth - 1, the current game, -10000, 10000 and !isMaximisingPlayer as parameters. The depth is reduced by 1 because a move has been made. The current game is passed as a parameter so that the minimax function can evaluate the current position. -10000 and 10000 are passed as parameters so that the minimax function knows the worst value that the minimising player can get and the best value that the maximising player can get. !isMaximisingPlayer is passed as a parameter so that the minimax function knows the best move for the opponent.
7. The current move is then undone using the undo function. This is necessary so that the game is back to its original state.
8. If the value returned by the minimax function is greater than or equal to the bestMove then the bestMove is set to the value returned by the minimax function and the bestMoveFound is set to the current move.
9. Once all the possible moves have been evaluated, the bestMoveFound is returned. This is the best move for the current player. */

var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) { // MINIMAX ALGORITHM: MINIMAX FUNCTION (DEPTH, GAME, ALPHA, BETA, ISMAXIMISINGPLAYER) WILL RETURN THE BEST MOVE FOR THE OPPONENT (THE MINIMISING PLAYER)
    // DEPTH: THE DEPTH OF THE MINIMAX TREE (THE NUMBER OF MOVES TO LOOK AHEAD)
    // GAME: THE CURRENT GAME
    // ALPHA: THE BEST VALUE THAT THE MAXIMISING PLAYER CURRENTLY CAN GUARANTEE AT THAT LEVEL OR ABOVE
    // BETA: THE BEST VALUE THAT THE MINIMISING PLAYER CURRENTLY CAN GUARANTEE AT THAT LEVEL OR ABOVE
    // ISMAXIMISINGPLAYER: A BOOLEAN THAT INDICATES IF THE CURRENT PLAYER IS THE MAXIMISING PLAYER (TRUE) OR THE MINIMISING PLAYER (FALSE)
    if (depth === 0) { // IF THE DEPTH IS 0 (THE LEAF NODES OF THE MINIMAX TREE)
        return -evaluateBoard(game.board()); // RETURN THE NEGATIVE OF THE EVALUATION OF THE BOARD (THE EVALUATION OF THE BOARD IS THE SUM OF THE VALUES OF ALL THE PIECES ON THE BOARD)
    } // END IF
    var newGameMoves = game.ugly_moves(); // GET ALL POSSIBLE MOVES FOR THE CURRENT GAME (ALSO KNOWN AS CHILDREN NODES; THE NODES THAT ARE DIRECTLY CONNECTED TO THE ROOT NODE; AND CALL THEM UGLY MOVES)
    if (isMaximisingPlayer) { // IF THE CURRENT PLAYER IS THE MAXIMISING PLAYER
        var bestMove = -9999; // INITIALISE THE BEST MOVE TO -9999 (THE WORST POSSIBLE MOVE FOR THE CURRENT PLAYER)
        for (var i = 0; i < newGameMoves.length; i++) { // LOOP THROUGH ALL THE POSSIBLE MOVES
            game.ugly_move(newGameMoves[i]); // MAKE THE CURRENT MOVE
            bestMove = Math.max(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer)); // GET THE BEST MOVE FOR THE OPPONENT (BY CALLING THE MINIMAX FUNCTION) (DEPTH - 1, GAME, ALPHA, BETA, !ISMAXIMISINGPLAYER) WHICH WILL RETURN THE BEST MOVE FOR THE OPPONENT (THE MINIMISING PLAYER)
            game.undo(); // UNDO THE CURRENT MOVE (SO THAT THE GAME IS BACK TO ITS ORIGINAL STATE)
            alpha = Math.max(alpha, bestMove); // SET ALPHA TO THE MAXIMUM OF ALPHA AND THE BEST MOVE
            if (beta <= alpha) { // IF BETA IS LESS THAN OR EQUAL TO ALPHA (THE MINIMISING PLAYER WILL NEVER ALLOW THIS TO HAPPEN)
                return bestMove; // RETURN THE BEST MOVE
            } // END IF
        } // END FOR
        return bestMove; // RETURN THE BEST MOVE
    } else { // IF THE CURRENT PLAYER IS THE MINIMISING PLAYER
        var bestMove = 9999; // INITIALISE THE BEST MOVE TO 9999 (THE WORST POSSIBLE MOVE FOR THE CURRENT PLAYER)
        for (var i = 0; i < newGameMoves.length; i++) { // LOOP THROUGH ALL THE POSSIBLE MOVES
            game.ugly_move(newGameMoves[i]); // MAKE THE CURRENT MOVE
            bestMove = Math.min(bestMove, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer)); // GET THE BEST MOVE FOR THE OPPONENT (BY CALLING THE MINIMAX FUNCTION) (DEPTH - 1, GAME, ALPHA, BETA, !ISMAXIMISINGPLAYER) WHICH WILL RETURN THE BEST MOVE FOR THE OPPONENT (THE MAXIMISING PLAYER)
            game.undo(); // UNDO THE CURRENT MOVE (SO THAT THE GAME IS BACK TO ITS ORIGINAL STATE)
            beta = Math.min(beta, bestMove); // SET BETA TO THE MINIMUM OF BETA AND THE BEST MOVE
            if (beta <= alpha) { // IF BETA IS LESS THAN OR EQUAL TO ALPHA (THE MAXIMISING PLAYER WILL NEVER ALLOW THIS TO HAPPEN)
                return bestMove; // RETURN THE BEST MOVE
            } // END IF
        } // END FOR
        return bestMove; // RETURN THE BEST MOVE
    } // END IF
}; // END MINIMAX FUNCTION

/* Here is the explanation for the code above:
1. The minimax function is a recursive function that will return the best move for the current player. The function takes five parameters: depth, game, alpha, beta, and isMaximisingPlayer.
2. The depth parameter is the depth of the minimax tree (the number of moves to look ahead).
3. The game parameter is the current game.
4. The alpha parameter is the best value that the maximising player currently can guarantee at that level or above.
5. The beta parameter is the best value that the minimising player currently can guarantee at that level or above.
6. The isMaximisingPlayer parameter is a boolean that indicates if the current player is the maximising player (true) or the minimising player (false).
7. If the depth is 0 (the leaf nodes of the minimax tree), then return the negative of the evaluation of the board (the evaluation of the board is the sum of the values of all the pieces on the board).
8. Get all possible moves for the current game (also known as children nodes; the nodes that are directly connected to the root node; and call them ugly moves).
9. If the current player is the maximising player, then initialise the best move to -9999 (the worst possible move for the current player).
10. Loop through all the possible moves.
11. Make the current move.
12. Get the best move for the opponent (by calling the minimax function) (depth - 1, game, alpha, beta, !isMaximisingPlayer) which will return the best move for the opponent (the minimising player).
13. Undo the current move (so that the game is back to its original state).
14. Set alpha to the maximum of alpha and the best move.
15. If beta is less than or equal to alpha (the minimising player will never allow this to happen), then return the best move.
16. If the current player is the minimising player, then initialise the best move to 9999 (the worst possible move for the current player).
17. Loop through all the possible moves.
18. Make the current move.
19. Get the best move for the opponent (by calling the minimax function) (depth - 1, game, alpha, beta, !isMaximisingPlayer) which will return the best move for the opponent (the maximising player).
20. Undo the current move (so that the game is back to its original state).
21. Set beta to the minimum of beta and the best move.
22. If beta is less than or equal to alpha (the maximising player will never allow this to happen), then return the best move.
23. Return the best move. */

var evaluateBoard = function (board) { // EVALUATE THE BOARD (THE EVALUATION OF THE BOARD IS THE SUM OF THE VALUES OF ALL THE PIECES ON THE BOARD)
    var totalEvaluation = 0; // INITIALISE THE TOTAL EVALUATION TO 0
    for (var i = 0; i < 8; i++) { // LOOP THROUGH ALL THE ROWS
        for (var j = 0; j < 8; j++) { // LOOP THROUGH ALL THE COLUMNS
            totalEvaluation = totalEvaluation + getPieceValue(board[i][j], i, j); // ADD THE VALUE OF THE CURRENT PIECE TO THE TOTAL EVALUATION
        } // END FOR
    } // END FOR
    return totalEvaluation; // RETURN THE TOTAL EVALUATION
}; // END EVALUATEBOARD FUNCTION

/* Here is the explanation for the code above:
1. The function takes the board as a parameter.
2. It loops through all the rows and columns of the board.
3. It adds the value of the piece on the current row and column to the total evaluation.
4. It returns the total evaluation. */

var reverseArray = function (array) { // REVERSE AN ARRAY
    return array.slice().reverse(); // RETURN THE REVERSED ARRAY
}; // END REVERSEARRAY FUNCTION

/* Here is the explanation for the code above:
1. First we create a function called reverseArray that takes an array as an argument.
2. Then we return the array with the slice method that returns a copy of the array starting from
the first element and ending at the last element (since we didn't provide any argument).
Then we use the reverse method to reverse the order of the elements in the array.
3. Finally we close the function and return the reversed array. */

// THE FOLLOWING FUNCTIONS ARE USED TO EVALUATE THE PIECES ON THE BOARD
var pawnEvalWhite =
    [ // THE EVALUATION OF THE PAWN FOR WHITE: THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
        [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
        [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
        [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
        [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
        [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
    ]; // END PAWNEVALWHITE

var pawnEvalBlack = reverseArray(pawnEvalWhite); // THE EVALUATION OF THE PAWN FOR BLACK: THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD (REVERSED)

var knightEval =
    [ // THE EVALUATION OF THE KNIGHT: THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
        [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
        [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
        [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
        [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
        [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
        [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
        [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
    ]; // END KNIGHTEVAL

var bishopEvalWhite = [ // THE EVALUATION OF THE BISHOP FOR WHITE: THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
    [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
    [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
    [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
    [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
    [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
]; // END BISHOPEVALWHITE

var bishopEvalBlack = reverseArray(bishopEvalWhite); // THE EVALUATION OF THE BISHOP FOR BLACK: THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD (REVERSED)

var rookEvalWhite = [ // THE EVALUATION OF THE ROOK FOR WHITE: THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
    [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
]; // END ROOKEVALWHITE

var rookEvalBlack = reverseArray(rookEvalWhite); // THE EVALUATION OF THE ROOK FOR BLACK: THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD (REVERSED)

var evalQueen = [ // THE EVALUATION OF THE QUEEN: THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
    [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
    [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
    [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
    [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
]; // END EVALQUEEN

var kingEvalWhite = [ // THE EVALUATION OF THE KING FOR WHITE: THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
    [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
    [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
    [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
    [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
]; // END KINGEVALWHITE

var kingEvalBlack = reverseArray(kingEvalWhite); // THE EVALUATION OF THE KING FOR BLACK: THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD (REVERSED)

var getPieceValue = function (piece, x, y) { // THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
    if (piece === null) { // IF THERE IS NO PIECE
        return 0; // RETURN 0
    } // END IF
    var getAbsoluteValue = function (piece, isWhite, x, y) { // FUNCTION TO GET THE ABSOLUTE VALUE OF THE PIECE BASED ON ITS TYPE AND POSITION
        if (piece.type === 'p') { // IF THE PIECE IS A PAWN
            return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]); // RETURN 10 + THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
        } else if (piece.type === 'r') { // IF THE PIECE IS A ROOK
            return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]); // RETURN 50 + THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
        } else if (piece.type === 'n') { // IF THE PIECE IS A KNIGHT
            return 30 + knightEval[y][x]; // RETURN 30 + THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
        } else if (piece.type === 'b') { // IF THE PIECE IS A BISHOP
            return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]); // RETURN 30 + THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
        } else if (piece.type === 'q') { // IF THE PIECE IS A QUEEN
            return 90 + evalQueen[y][x]; // RETURN 90 + THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
        } else if (piece.type === 'k') { // IF THE PIECE IS A KING
            return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]); // RETURN 900 + THE VALUE OF THE PIECE AT EACH SQUARE ON THE BOARD
        } // END IF
        throw "Unknown piece type: " + piece.type; // THROW AN ERROR IF THE PIECE IS UNKNOWN
    }; // END GETABSOLUTEVALUE
    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x, y); // GET THE ABSOLUTE VALUE OF THE PIECE BASED ON ITS TYPE AND POSITION
    return piece.color === 'w' ? absoluteValue : -absoluteValue; // RETURN THE ABSOLUTE VALUE OF THE PIECE BASED DEPENDING ON ITS COLOR (POSITIVE IF WHITE, NEGATIVE IF BLACK)
}; // END GETPIECEVALUE

/* Here is the explanation for the code above:
1. The function getPieceValue() returns the value of a piece at a specific position on the board.
2. The function getAbsoluteValue() returns the absolute value of a piece at a specific position on the board.
3. The next lines of code return the value of a piece at a specific position on the board depending on its type and position. */

var onDragStart = function (source, piece, position, orientation) { // FUNCTION TO PREVENT THE PLAYER FROM MOVING THE PIECES OF THE COMPUTER (BLACK) AND TO PREVENT THE PLAYER FROM MOVING THE PIECES WHEN THE GAME IS OVER
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) { // IF THE GAME IS OVER OR THE PIECE IS BLACK (COMPUTER)
        return false; // RETURN FALSE
    } // END IF
}; // END ONDRAGSTART

/* Here is the explanation for the code above:
1. The function onDragStart prevents the player from moving the pieces of the computer (black) and also prevent the player from moving the pieces when the game is over.
2. The function takes 4 parameters:
  - Source: the source square
  - Piece: the piece that is being dragged
  - Position: the current position of the chess board
  - Orientation: the current orientation of the chess board
3. If the game is over (checkmate or draw) or the piece is black (computer) then it returns false. */

var makeBestMove = function () { // FUNCTION TO MAKE THE BEST MOVE
    var bestMove = getBestMove(game); // GET THE BEST MOVE
    game.ugly_move(bestMove); // MAKE THE BEST MOVE
    board.position(game.fen()); // UPDATE THE BOARD
    if (game.game_over()) { // IF THE GAME IS OVER
        alert('GAME OVER!'); // ALERT THE PLAYER THAT THE GAME IS OVER
    } // END IF
}; // END MAKEBESTMOVE

/* Here is the explanation for the code above:
1. The makeBestMove function is called when the computer is to make a move.
2. The bestMove variable is assigned the return value of the getBestMove function.
3. The game object's ugly_move function is called and passed the bestMove variable as an argument.
4. The board object's position function is called and passed the game object's fen function as an argument.
5. If the game object's game_over function returns true, the user is alerted that the game is over. */

var getBestMove = function (game) { // FUNCTION TO GET THE BEST MOVE
    if (game.game_over()) { // IF THE GAME IS OVER
        alert('GAME OVER!'); // ALERT THE PLAYER THAT THE GAME IS OVER
    } // END IF
    return minimaxRoot(3, game, true); // RETURN THE BEST MOVE BASED ON THE MINIMAX ALGORITHM WITH A DEPTH OF 3
    // DIFICULTY LEVEL: FROM 1 TO 5 (4 IS THE BEST; 5 IS TOO PERFORMANCE INTENSIVE)
};

/* Here is the explanation for the code above:
1. The minimax algorithm is a decision-making algorithm that is used for finding the best move in a two-player, zero-sum game. Such games are called adversarial games.
2. In this algorithm, one player is called the maximizer, and the other player is a minimizer.
3. If we assign an evaluation score to the game board, then the players will try to maximize the score of the board when they are playing the game. The maximizer tries to get the highest score possible while the minimizer tries to do the opposite and get the lowest score possible.
4. The algorithm searches the tree of possible moves, and at each level, it alternates between maximizing and minimizing.
5. In the above code, we are using the minimaxRoot function to get the best move at the root node. The minimaxRoot function takes three arguments: depth, game, and isMaximisingPlayer.
6. The depth argument is the number of moves to look ahead while evaluating the game tree. The game argument is the chess.js game object, and isMaximisingPlayer is a boolean value that is true if the current player is the maximizer.
7. At the root node, the current player is the maximizer, and this is why we are passing true for isMaximisingPlayer. */

var onDrop = function (source, target) { // FUNCTION TO MAKE A MOVE WHEN A PIECE IS DROPPED
    var move = game.move({ // MAKE THE MOVE
        from: source, // FROM THE SOURCE
        to: target, // TO THE TARGET
        promotion: 'q' // PROMOTE THE PAWN TO A QUEEN IF IT REACHES THE END OF THE BOARD
    }); // END MOVE
    removeGreySquares(); // REMOVE THE GREY SQUARES
    if (move === null) { // IF THE MOVE IS NULL
        return 'snapback'; // SNAPBACK
    } // END IF
    window.setTimeout(makeBestMove, 250); // MAKE THE BEST MOVE AFTER 250 MILLISECONDS
}; // END ONDROP

/* Here is the explanation for the code above:
1. The onDrop function is called when a piece is dropped on the board.
2. The function checks if the move is legal.
3. If the move is illegal, it returns 'snapback'.
4. If the move is legal, it removes the grey squares.
5. It then waits 250 milliseconds and then makes the best move. */

var onSnapEnd = function () { // FUNCTION TO UPDATE THE BOARD AFTER A PIECE IS DROPPED
    board.position(game.fen()); // UPDATE THE BOARD
}; // END ONSNAPEND

/* Here is the explanation for the code above:
1. the onDragStart function is defined before the board is created
2. the onDrop function is also defined before the board is created
3. the onSnapEnd function is defined after the board is created
4. the board is created with the three functions defined above
5. the board is updated with the onSnapEnd function every time a piece is dropped */

var onMouseoverSquare = function (square, piece) { // FUNCTION TO HIGHLIGHT THE SQUARES THAT THE PIECE CAN MOVE TO WHEN THE MOUSE IS OVER THE PIECE
    var moves = game.moves({ // GET THE MOVES
        square: square, // FROM THE SQUARE
        verbose: true // VERBOSE
    }); // END MOVES
    if (moves.length === 0) return; // IF THERE ARE NO MOVES, RETURN
    greySquare(square); // GREY OUT THE SQUARE
    for (var i = 0; i < moves.length; i++) { // FOR EACH MOVE
        greySquare(moves[i].to); // GREY OUT THE SQUARE
    } // END FOR
}; // END ONMOUSEOVERSQUARE

/* Here is the explanation for the code above:
1. The function onMouseoverSquare() needs two parameters: square and piece. The square parameter is the square that the mouse is over and the piece parameter is the piece that is on the square. We will pass these parameters to the function when we call it later.
2. The function needs to get the moves from the square the mouse is over. We do this by using the game.moves() function. The game.moves() function needs to know the square the mouse is over and the verbose parameter needs to be true so we can get the moves as an array of objects.
3. If the length of the moves array is 0, that means there are no moves for that square and we can return. We need to do this so we don’t get an error when we try to access the moves.
4. If there are moves for that square, we need to highlight the square the mouse is over and all the squares the piece can move to. We do this by using the greySquare() function. We use a for loop to go through all the moves and highlight each square. We use the .to property of each move to get the square to highlight. */

var onMouseoutSquare = function (square, piece) { // FUNCTION TO REMOVE THE HIGHLIGHTS WHEN THE MOUSE IS NOT OVER THE PIECE
    removeGreySquares(); // REMOVE THE GREY SQUARES
}; // END ONMOUSEOUTSQUARE

/* Here is the explanation for the code above:
1. The onMouseoverSquare function is called when the mouse is over a square
2. The onMouseoverSquare function highlights the square that the mouse is over with a grey square
3. The onMouseoutSquare function is called when the mouse is not over the square
4. The onMouseoutSquare function removes the grey square */

var removeGreySquares = function () { // FUNCTION TO REMOVE THE GREY SQUARES
    $('#board .square-55d63').css('background', ''); // REMOVE THE GREY SQUARES
}; // END REMOVEGREYSQUARES

/* Here is the explanation for the code above:
1. We create a function called removeGreySquares.
2. We use jQuery to select the elements that have the class square-55d63 and we remove the background color.
3. We close the function. */

var greySquare = function (square) { // FUNCTION TO GREY OUT THE SQUARES
    var squareEl = $('#board .square-' + square); // GET THE SQUARE
    var background = '#a9a9a9'; // SET THE BACKGROUND COLOR TO GREY
    if (squareEl.hasClass('black-3c85d') === true) { // IF THE SQUARE IS BLACK
        background = '#696969'; // SET THE BACKGROUND COLOR TO DARK GREY
    } // END IF
    squareEl.css('background', background); // SET THE BACKGROUND COLOR OF THE SQUARE
}; // END GREYSQUARE

/* Here is the explanation for the code above:
1. The function takes in the square as a parameter.
2. It gets the square element by concatenating the square parameter with the class name of the square.
3. It sets the background color to grey.
4. If the square is black, it sets the background color to dark grey.
5. It sets the background color of the square. */

var cfg = { // CONFIGURATION OF THE BOARD
    draggable: true, // THE PIECES CAN BE DRAGGED
    position: 'start', // THE BOARD STARTS IN THE STARTING POSITION
    onDragStart: onDragStart, // THE PIECES CANNOT BE MOVED WHEN THE GAME IS OVER
    onDrop: onDrop, // THE PIECES CAN BE DROPPED
    onMouseoutSquare: onMouseoutSquare, // THE SQUARES ARE HIGHLIGHTED WHEN THE MOUSE IS OVER THE PIECE
    onMouseoverSquare: onMouseoverSquare, // THE SQUARES ARE NOT HIGHLIGHTED WHEN THE MOUSE IS NOT OVER THE PIECE
    onSnapEnd: onSnapEnd // THE BOARD IS UPDATED AFTER A PIECE IS DROPPED
}; // END CFG
board = ChessBoard('board', cfg); // CREATE THE BOARD

/* Here is the explanation for the code above:
1. The configuration is set in the cfg variable.
2. The ChessBoard function is called to create the board and it is assigned to the variable board.
3. The board is created with the configuration set in cfg. */