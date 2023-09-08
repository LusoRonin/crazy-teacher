var Chess = function (fen) { // FEN (Forsyth–Edwards Notation) IS OPTIONAL
    var BLACK = 'b'; // DEFINES THE BLACK PIECES PREFIX
    var WHITE = 'w'; // DEFINES THE WHITE PIECES PREFIX
    var EMPTY = -1; // DEFINES THE EMPTY SQUARE
    var PAWN = 'p'; // DEFINES THE PAWN PIECE
    var KNIGHT = 'n'; // DEFINES THE KNIGHT PIECE
    var BISHOP = 'b'; // DEFINES THE BISHOP PIECE
    var ROOK = 'r'; // DEFINES THE ROOK PIECE
    var QUEEN = 'q'; // DEFINES THE QUEEN PIECE
    var KING = 'k'; // DEFINES THE KING PIECE
    var SYMBOLS = 'pnbrqkPNBRQK'; // DEFINES THE PIECES SYMBOLS (IN ORDER)
    var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'; // DEFINES THE DEFAULT POSITION
    var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*']; // DEFINES THE POSSIBLE RESULTS OF THE GAME (IN ORDER): WHITE WINS, BLACK WINS, DRAW, IN PROGRESS

    var PAWN_OFFSETS = { // DEFINES THE PAWN OFFSETS (FOR EACH SIDE)
        b: [16, 32, 17, 15], // BLACK PAWN OFFSETS
        w: [-16, -32, -17, -15] // WHITE PAWN OFFSETS
    }; // DEFINES THE PAWN OFFSETS (FOR EACH SIDE) (THE FIRST OFFSET IS THE SINGLE SQUARE MOVE, THE SECOND OFFSET IS THE DOUBLE SQUARE MOVE, THE THIRD OFFSET IS THE CAPTURE RIGHT MOVE, THE FOURTH OFFSET IS THE CAPTURE LEFT MOVE)

    var PIECE_OFFSETS = { // DEFINES THE PIECE OFFSETS (FOR EACH PIECE)
        n: [-18, -33, -31, -14, 18, 33, 31, 14], // KNIGHT OFFSETS
        b: [-17, -15, 17, 15], // BISHOP OFFSETS
        r: [-16, 1, 16, -1], // ROOK OFFSETS
        q: [-17, -16, -15, 1, 17, 16, 15, -1], // QUEEN OFFSETS
        k: [-17, -16, -15, 1, 17, 16, 15, -1] // KING OFFSETS
    }; // DEFINES THE PIECE OFFSETS (FOR EACH PIECE) (THE FIRST OFFSET IS THE TOP RIGHT MOVE, THE SECOND OFFSET IS THE TOP MOVE, THE THIRD OFFSET IS THE TOP LEFT MOVE, THE FOURTH OFFSET IS THE RIGHT MOVE, THE FIFTH OFFSET IS THE BOTTOM RIGHT MOVE, THE SIXTH OFFSET IS THE BOTTOM MOVE, THE SEVENTH OFFSET IS THE BOTTOM LEFT MOVE, THE EIGHTH OFFSET IS THE LEFT MOVE)

    var ATTACKS = [ // DEFINES THE ATTACKS (FOR EACH PIECE) (ATTACKS ARE THE SQUARES THAT A PIECE CAN ATTACK)
        20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0,
        0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
        0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
        0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
        0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
        24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0,
        0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0,
        0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0,
        0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0,
        0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0,
        20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20
    ]; // DEFINES THE ATTACKS (FOR EACH PIECE) (ATTACKS ARE THE SQUARES THAT A PIECE CAN ATTACK) 20 REPRESENTS THE SQUARES THAT A KNIGHT CAN ATTACK, 2 REPRESENTS THE SQUARES THAT A BISHOP CAN ATTACK, 53 REPRESENTS THE SQUARES THAT A ROOK CAN ATTACK, 56 REPRESENTS THE SQUARES THAT A QUEEN CAN ATTACK, 24 REPRESENTS THE SQUARES THAT A KING CAN ATTACK; 0 REPRESENTS THE SQUARES THAT A PIECE CANNOT ATTACK; THE ATTACKS ARE IN ORDER: WHITE KNIGHT, WHITE BISHOP, WHITE ROOK, WHITE QUEEN, WHITE KING, BLACK KNIGHT, BLACK BISHOP, BLACK ROOK, BLACK QUEEN, BLACK KING

    var RAYS = [ // DEFINES THE RAYS (FOR EACH PIECE) (RAYS ARE THE SQUARES THAT A PIECE CAN MOVE TO)
        17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0,
        0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0,
        0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0,
        0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0,
        0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0,
        0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0,
        0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0,
        0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0,
        0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0,
        -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17
    ]; // DEFINES THE RAYS (FOR EACH PIECE) (RAYS ARE THE SQUARES THAT A PIECE CAN MOVE TO) 17 REPRESENTS THE SQUARES THAT A KNIGHT CAN MOVE TO, 16 REPRESENTS THE SQUARES THAT A BISHOP CAN MOVE TO, 15 REPRESENTS THE SQUARES THAT A ROOK CAN MOVE TO, 1 REPRESENTS THE SQUARES THAT A QUEEN CAN MOVE TO, -1 REPRESENTS THE SQUARES THAT A KING CAN MOVE TO; 0 REPRESENTS THE SQUARES THAT A PIECE CANNOT MOVE TO; THE RAYS ARE IN ORDER: WHITE KNIGHT, WHITE BISHOP, WHITE ROOK, WHITE QUEEN, WHITE KING, BLACK KNIGHT, BLACK BISHOP, BLACK ROOK, BLACK QUEEN, BLACK KING

    var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 }; // DEFINES THE SHIFTS (FOR EACH PIECE) (SHIFTS ARE THE AMOUNT OF BITS THAT A PIECE'S ATTACKS AND RAYS ARE SHIFTED BY) 0 REPRESENTS THE SQUARES THAT A PAWN CAN ATTACK, 1 REPRESENTS THE SQUARES THAT A KNIGHT CAN ATTACK, 2 REPRESENTS THE SQUARES THAT A BISHOP CAN ATTACK, 3 REPRESENTS THE SQUARES THAT A ROOK CAN ATTACK, 4 REPRESENTS THE SQUARES THAT A QUEEN CAN ATTACK, 5 REPRESENTS THE SQUARES THAT A KING CAN ATTACK

    var FLAGS = { // DEFINES THE FLAGS (FOR EACH MOVE) (FLAGS ARE THE TYPES OF MOVES)
        NORMAL: 'n', // NORMAL MOVE
        CAPTURE: 'c', // CAPTURE MOVE
        BIG_PAWN: 'b', // BIG PAWN MOVE
        EP_CAPTURE: 'e', // EN PASSANT CAPTURE MOVE
        PROMOTION: 'p', // PROMOTION MOVE
        KSIDE_CASTLE: 'k', // KING-SIDE CASTLE MOVE
        QSIDE_CASTLE: 'q' // QUEEN-SIDE CASTLE MOVE
    };

    var BITS = { // DEFINES THE BITS (FOR EACH MOVE) (BITS ARE THE TYPES OF MOVES)
        NORMAL: 1, // NORMAL MOVE
        CAPTURE: 2, // CAPTURE MOVE
        BIG_PAWN: 4, // BIG PAWN MOVE
        EP_CAPTURE: 8, // EN PASSANT CAPTURE MOVE
        PROMOTION: 16, // PROMOTION MOVE
        KSIDE_CASTLE: 32, // KING-SIDE CASTLE MOVE
        QSIDE_CASTLE: 64 // QUEEN-SIDE CASTLE MOVE
    };

    // DEFINES THE SQUARES (FOR EACH SQUARE) (SQUARES ARE THE SQUARES ON THE BOARD)
    var RANK_1 = 7; // RANK 1 IS THE TOP RANK
    var RANK_2 = 6; // RANK 2 IS THE SECOND RANK FROM THE TOP
    var RANK_3 = 5; // RANK 3 IS THE THIRD RANK FROM THE TOP
    var RANK_4 = 4; // RANK 4 IS THE FOURTH RANK FROM THE TOP
    var RANK_5 = 3; // RANK 5 IS THE FIFTH RANK FROM THE TOP
    var RANK_6 = 2; // RANK 6 IS THE SIXTH RANK FROM THE TOP
    var RANK_7 = 1; // RANK 7 IS THE SEVENTH RANK FROM THE TOP
    var RANK_8 = 0; // RANK 8 IS THE BOTTOM RANK

    var SQUARES = { // DEFINES THE SQUARES (FOR EACH SQUARE) (SQUARES ARE THE SQUARES ON THE BOARD)
        a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
        a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
        a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
        a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
        a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
        a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
        a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
        a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
    }; // DEFINES THE SQUARES (FOR EACH SQUARE) (SQUARES ARE THE SQUARES ON THE BOARD) (THE SQUARES ARE IN ORDER FROM TOP TO BOTTOM, LEFT TO RIGHT)

    var ROOKS = { // DEFINES THE ROOKS (FOR EACH SQUARE) (ROOKS ARE THE SQUARES THAT A ROOK CAN MOVE TO)
        w: [{ square: SQUARES.a1, flag: BITS.QSIDE_CASTLE },
        { square: SQUARES.h1, flag: BITS.KSIDE_CASTLE }],
        b: [{ square: SQUARES.a8, flag: BITS.QSIDE_CASTLE },
        { square: SQUARES.h8, flag: BITS.KSIDE_CASTLE }]
    }; // DEFINES THE ROOKS (FOR EACH SQUARE) (ROOKS ARE THE SQUARES THAT A ROOK CAN MOVE TO); THE ROOKS ARE IN ORDER FROM LEFT TO RIGHT; THE ROOKS ARE IN ORDER FROM TOP TO BOTTOM

    var board = new Array(128); // DEFINES THE BOARD (THE BOARD IS AN ARRAY OF 128 SQUARES)
    var kings = { w: EMPTY, b: EMPTY }; // DEFINES THE KINGS (THE KINGS ARE THE SQUARES THAT THE KINGS ARE ON)
    var turn = WHITE; // DEFINES THE TURN (THE TURN IS THE COLOR OF THE PLAYER WHOSE TURN IT IS)
    var castling = { w: 0, b: 0 }; // DEFINES THE CASTLING (THE CASTLING IS THE CASTLING RIGHTS OF THE PLAYERS)
    var ep_square = EMPTY; // DEFINES THE EN PASSANT SQUARE (THE EN PASSANT SQUARE IS THE SQUARE THAT A PAWN CAN MOVE TO TO EN PASSANT)
    var half_moves = 0; // DEFINES THE HALF MOVES (THE HALF MOVES IS THE NUMBER OF HALF MOVES THAT HAVE BEEN MADE)
    var move_number = 1; // DEFINES THE MOVE NUMBER (THE MOVE NUMBER IS THE NUMBER OF MOVES THAT HAVE BEEN MADE)
    var history = []; // DEFINES THE HISTORY (THE HISTORY IS AN ARRAY OF ALL THE MOVES THAT HAVE BEEN MADE)
    var header = {}; // DEFINES THE HEADER (THE HEADER IS AN OBJECT THAT CONTAINS THE HEADER INFORMATION)

    if (typeof fen === 'undefined') { // IF THE FEN IS UNDEFINED
        load(DEFAULT_POSITION); // LOAD THE DEFAULT POSITION
    } else { // ELSE
        load(fen); // LOAD THE FEN
    } // LOAD THE FEN

    function clear() { // DEFINES THE CLEAR FUNCTION (THE CLEAR FUNCTION CLEARS THE BOARD)
        board = new Array(128); // THE BOARD IS AN ARRAY OF 128 SQUARES
        kings = { w: EMPTY, b: EMPTY }; // THE KINGS ARE THE SQUARES THAT THE KINGS ARE ON
        turn = WHITE; // THE TURN IS THE COLOR OF THE PLAYER WHOSE TURN IT IS   
        castling = { w: 0, b: 0 }; // THE CASTLING IS THE CASTLING RIGHTS OF THE PLAYERS
        ep_square = EMPTY; // THE EN PASSANT SQUARE IS THE SQUARE THAT A PAWN CAN MOVE TO TO EN PASSANT
        half_moves = 0; // THE HALF MOVES IS THE NUMBER OF HALF MOVES THAT HAVE BEEN MADE
        move_number = 1; // THE MOVE NUMBER IS THE NUMBER OF MOVES THAT HAVE BEEN MADE
        history = []; // THE HISTORY IS AN ARRAY OF ALL THE MOVES THAT HAVE BEEN MADE
        header = {}; // THE HEADER IS AN OBJECT THAT CONTAINS THE HEADER INFORMATION
        update_setup(generate_fen()); // UPDATE THE SETUP
    } // THE CLEAR FUNCTION CLEARS THE BOARD

    function reset() { // DEFINES THE RESET FUNCTION (THE RESET FUNCTION RESETS THE BOARD)
        load(DEFAULT_POSITION); // LOAD THE DEFAULT POSITION
    } // THE RESET FUNCTION RESETS THE BOARD

    function load(fen) { // DEFINES THE LOAD FUNCTION (THE LOAD FUNCTION LOADS A FEN)
        var tokens = fen.split(/\s+/); // THE TOKENS ARE THE FEN SPLIT BY SPACES
        var position = tokens[0]; // THE POSITION IS THE FIRST TOKEN
        var square = 0; // THE SQUARE IS 0
        if (!validate_fen(fen).valid) { // IF THE FEN IS NOT VALID
            return false; // RETURN FALSE
        } // IF THE FEN IS NOT VALID
        clear(); // CLEAR THE BOARD
        for (var i = 0; i < position.length; i++) { // FOR EACH CHARACTER IN THE POSITION
            var piece = position.charAt(i); // THE PIECE IS THE CHARACTER
            if (piece === '/') { // IF THE PIECE IS A SLASH
                square += 8; // ADD 8 TO THE SQUARE
            } else if (is_digit(piece)) { // ELSE IF THE PIECE IS A DIGIT
                square += parseInt(piece, 10); // ADD THE NUMBER TO THE SQUARE
            } else { // ELSE
                var color = (piece < 'a') ? WHITE : BLACK; // THE COLOR IS WHITE IF THE PIECE IS CAPITAL AND BLACK IF THE PIECE IS LOWERCASE
                put({ type: piece.toLowerCase(), color: color }, algebraic(square)); // PUT THE PIECE ON THE SQUARE
                square++; // ADD 1 TO THE SQUARE
            } // ELSE
        } // FOR EACH CHARACTER IN THE POSITION
        turn = tokens[1]; // THE TURN IS THE SECOND TOKEN
        if (tokens[2].indexOf('K') > -1) { // IF THE THIRD TOKEN CONTAINS A CAPITAL K
            castling.w |= BITS.KSIDE_CASTLE; // ADD THE KINGSIDE CASTLE BIT TO THE WHITE CASTLING RIGHTS
        } // IF THE THIRD TOKEN CONTAINS A CAPITAL K
        if (tokens[2].indexOf('Q') > -1) { // IF THE THIRD TOKEN CONTAINS A CAPITAL Q
            castling.w |= BITS.QSIDE_CASTLE; // ADD THE QUEENSIDE CASTLE BIT TO THE WHITE CASTLING RIGHTS
        } // IF THE THIRD TOKEN CONTAINS A CAPITAL Q
        if (tokens[2].indexOf('k') > -1) { // IF THE THIRD TOKEN CONTAINS A LOWERCASE K
            castling.b |= BITS.KSIDE_CASTLE; // ADD THE KINGSIDE CASTLE BIT TO THE BLACK CASTLING RIGHTS
        } // IF THE THIRD TOKEN CONTAINS A LOWERCASE K
        if (tokens[2].indexOf('q') > -1) { // IF THE THIRD TOKEN CONTAINS A LOWERCASE Q
            castling.b |= BITS.QSIDE_CASTLE; // ADD THE QUEENSIDE CASTLE BIT TO THE BLACK CASTLING RIGHTS
        } // IF THE THIRD TOKEN CONTAINS A LOWERCASE Q
        ep_square = (tokens[3] === '-') ? EMPTY : SQUARES[tokens[3]]; // THE EN PASSANT SQUARE IS THE FOURTH TOKEN
        half_moves = parseInt(tokens[4], 10); // THE HALF MOVES IS THE FIFTH TOKEN
        move_number = parseInt(tokens[5], 10); // THE MOVE NUMBER IS THE SIXTH TOKEN
        update_setup(generate_fen()); // UPDATE THE SETUP
        return true; // RETURN TRUE
    } // THE LOAD FUNCTION LOADS A FEN

    function validate_fen(fen) { // DEFINES THE VALIDATE FEN FUNCTION (THE VALIDATE FEN FUNCTION VALIDATES A FEN)
        var errors = { // THE ERRORS ARE THE ERRORS THAT CAN OCCUR
            0: 'No errors.', // NO ERRORS
            1: 'FEN string must contain six space-delimited fields.', // THE FEN STRING MUST CONTAIN SIX SPACE-DELIMITED FIELDS
            2: '6th field (move number) must be a positive integer.', // THE 6TH FIELD (MOVE NUMBER) MUST BE A POSITIVE INTEGER
            3: '5th field (half move counter) must be a non-negative integer.', // THE 5TH FIELD (HALF MOVE COUNTER) MUST BE A NON-NEGATIVE INTEGER
            4: '4th field (en-passant square) is invalid.', // THE 4TH FIELD (EN-PASSANT SQUARE) IS INVALID
            5: '3rd field (castling availability) is invalid.', // THE 3RD FIELD (CASTLING AVAILABILITY) IS INVALID
            6: '2nd field (side to move) is invalid.', // THE 2ND FIELD (SIDE TO MOVE) IS INVALID
            7: '1st field (piece positions) does not contain 8 \'/\'-delimited rows.', // THE 1ST FIELD (PIECE POSITIONS) DOES NOT CONTAIN 8 '/'-DELIMITED ROWS
            8: '1st field (piece positions) is invalid [consecutive numbers].', // THE 1ST FIELD (PIECE POSITIONS) IS INVALID [CONSECUTIVE NUMBERS]
            9: '1st field (piece positions) is invalid [invalid piece].', // THE 1ST FIELD (PIECE POSITIONS) IS INVALID [INVALID PIECE]
            10: '1st field (piece positions) is invalid [row too large].', // THE 1ST FIELD (PIECE POSITIONS) IS INVALID [ROW TOO LARGE]
            11: 'Illegal en-passant square', // ILLEGAL EN-PASSANT SQUARE
        }; // THE ERRORS ARE THE ERRORS THAT CAN OCCUR

        var tokens = fen.split(/\s+/); // THE TOKENS ARE THE FEN SPLIT BY SPACES
        if (tokens.length !== 6) { // IF THE TOKENS LENGTH IS NOT 6
            return { valid: false, error_number: 1, error: errors[1] }; // RETURN FALSE
        } // IF THE TOKENS LENGTH IS NOT 6

        if (isNaN(tokens[5]) || (parseInt(tokens[5], 10) <= 0)) { // IF THE 6TH TOKEN IS NOT A NUMBER OR IS LESS THAN OR EQUAL TO 0
            return { valid: false, error_number: 2, error: errors[2] }; // RETURN FALSE
        } // IF THE 6TH TOKEN IS NOT A NUMBER OR IS LESS THAN OR EQUAL TO 0

        if (isNaN(tokens[4]) || (parseInt(tokens[4], 10) < 0)) { // IF THE 5TH TOKEN IS NOT A NUMBER OR IS LESS THAN 0
            return { valid: false, error_number: 3, error: errors[3] }; // RETURN FALSE
        } // IF THE 5TH TOKEN IS NOT A NUMBER OR IS LESS THAN 0

        if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) { // IF THE 4TH TOKEN IS NOT A DASH OR A VALID EN-PASSANT SQUARE
            return { valid: false, error_number: 4, error: errors[4] }; // RETURN FALSE
        } // IF THE 4TH TOKEN IS NOT A DASH OR A VALID EN-PASSANT SQUARE

        if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) { // IF THE 3RD TOKEN IS NOT A VALID CASTLING AVAILABILITY
            return { valid: false, error_number: 5, error: errors[5] }; // RETURN FALSE
        } // IF THE 3RD TOKEN IS NOT A VALID CASTLING AVAILABILITY

        if (!/^(w|b)$/.test(tokens[1])) { // IF THE 2ND TOKEN IS NOT A VALID SIDE TO MOVE
            return { valid: false, error_number: 6, error: errors[6] }; // RETURN FALSE
        } // IF THE 2ND TOKEN IS NOT A VALID SIDE TO MOVE

        var rows = tokens[0].split('/'); // THE ROWS ARE THE FIRST TOKEN SPLIT BY SLASHES
        if (rows.length !== 8) { // IF THE ROWS LENGTH IS NOT 8
            return { valid: false, error_number: 7, error: errors[7] }; // RETURN FALSE
        } // IF THE ROWS LENGTH IS NOT 8

        for (var i = 0; i < rows.length; i++) { // FOR EACH ROW
            var sum_fields = 0; // THE SUM FIELDS IS 0
            var previous_was_number = false; // THE PREVIOUS WAS NUMBER IS FALSE
            for (var k = 0; k < rows[i].length; k++) { // FOR EACH FIELD
                if (!isNaN(rows[i][k])) { // IF THE FIELD IS A NUMBER
                    if (previous_was_number) { // IF THE PREVIOUS WAS NUMBER
                        return { valid: false, error_number: 8, error: errors[8] }; // RETURN FALSE
                    } // IF THE PREVIOUS WAS NUMBER
                    sum_fields += parseInt(rows[i][k], 10); // ADD THE FIELD TO THE SUM FIELDS
                    previous_was_number = true; // THE PREVIOUS WAS NUMBER IS TRUE
                } else { // IF THE FIELD IS NOT A NUMBER
                    if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) { // IF THE FIELD IS NOT A VALID PIECE
                        return { valid: false, error_number: 9, error: errors[9] }; // RETURN FALSE
                    } // IF THE FIELD IS NOT A VALID PIECE
                    sum_fields += 1; // ADD 1 TO THE SUM FIELDS
                    previous_was_number = false; // THE PREVIOUS WAS NUMBER IS FALSE
                } // IF THE FIELD IS NOT A NUMBER
            } // FOR EACH FIELD
            if (sum_fields !== 8) { // IF THE SUM FIELDS IS NOT 8
                return { valid: false, error_number: 10, error: errors[10] }; // RETURN FALSE
            } // IF THE SUM FIELDS IS NOT 8
        } // FOR EACH ROW
        if ((tokens[3][1] == '3' && tokens[1] == 'w') ||
            (tokens[3][1] == '6' && tokens[1] == 'b')) { // IF THE EN-PASSANT SQUARE IS ILLEGAL
            return { valid: false, error_number: 11, error: errors[11] }; // RETURN FALSE
        } // IF THE EN-PASSANT SQUARE IS ILLEGAL
        return { valid: true, error_number: 0, error: errors[0] }; // RETURN TRUE
    } // THE FEN IS VALID

    function generate_fen() { // GENERATE FEN
        var empty = 0; // THE EMPTY IS 0
        var fen = ''; // THE FEN IS EMPTY
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) { // FOR EACH SQUARE
            if (board[i] == null) { // IF THE SQUARE IS EMPTY
                empty++; // ADD 1 TO EMPTY
            } else { // IF THE SQUARE IS NOT EMPTY
                if (empty > 0) { // IF EMPTY IS GREATER THAN 0
                    fen += empty; // ADD EMPTY TO FEN
                    empty = 0; // EMPTY IS 0
                } // IF EMPTY IS GREATER THAN 0
                var color = board[i].color; // THE COLOR IS THE COLOR OF THE PIECE
                var piece = board[i].type; // THE PIECE IS THE TYPE OF THE PIECE
                fen += (color === WHITE) ? 
                    piece.toUpperCase() : piece.toLowerCase(); // ADD THE PIECE TO THE FEN
            } // IF THE SQUARE IS NOT EMPTY
            if ((i + 1) & 0x88) { // IF THE NEXT SQUARE IS OFF THE BOARD
                if (empty > 0) { // IF EMPTY IS GREATER THAN 0
                    fen += empty; // ADD EMPTY TO FEN
                } // IF EMPTY IS GREATER THAN 0
                if (i !== SQUARES.h1) { // IF THE SQUARE IS NOT THE LAST SQUARE
                    fen += '/'; // ADD A SLASH TO THE FEN
                } // IF THE SQUARE IS NOT THE LAST SQUARE
                empty = 0; // EMPTY IS 0
                i += 8; // ADD 8 TO I
            } // IF THE NEXT SQUARE IS OFF THE BOARD
        } // FOR EACH SQUARE
        var cflags = ''; // THE CASTLING FLAGS ARE EMPTY
        if (castling[WHITE] & BITS.KSIDE_CASTLE) { cflags += 'K'; } // IF WHITE CAN KINGSIDE CASTLE
        if (castling[WHITE] & BITS.QSIDE_CASTLE) { cflags += 'Q'; } // IF WHITE CAN QUEENSIDE CASTLE
        if (castling[BLACK] & BITS.KSIDE_CASTLE) { cflags += 'k'; } // IF BLACK CAN KINGSIDE CASTLE
        if (castling[BLACK] & BITS.QSIDE_CASTLE) { cflags += 'q'; } // IF BLACK CAN QUEENSIDE CASTLE
        cflags = cflags || '-'; // IF THE CASTLING FLAGS ARE EMPTY, SET THEM TO A DASH
        var epflags = (ep_square === EMPTY) ? '-' : algebraic(ep_square); // THE EN-PASSANT SQUARE IS THE EN-PASSANT SQUARE OR A DASH
        return [fen, turn, cflags, epflags, half_moves, move_number].join(' '); // RETURN THE FEN
    } // GENERATE FEN

    function set_header(args) { // SET HEADER
        for (var i = 0; i < args.length; i += 2) { // FOR EACH ARGUMENT
            if (typeof args[i] === 'string' && 
                typeof args[i + 1] === 'string') { // IF THE ARGUMENTS ARE STRINGS
                header[args[i]] = args[i + 1]; // SET THE HEADER
            } // IF THE ARGUMENTS ARE STRINGS
        } // FOR EACH ARGUMENT
        return header; // RETURN THE HEADER
    } // SET HEADER

    function update_setup(fen) { // UPDATE SETUP
        if (history.length > 0) return; // IF THE HISTORY IS NOT EMPTY, RETURN
        if (fen !== DEFAULT_POSITION) { // IF THE FEN IS NOT THE DEFAULT POSITION
            header['SetUp'] = '1'; // SET THE SETUP TO 1
            header['FEN'] = fen; // SET THE FEN TO THE FEN
        } else { // IF THE FEN IS THE DEFAULT POSITION
            delete header['SetUp']; // DELETE THE SETUP
            delete header['FEN']; // DELETE THE FEN
        } // IF THE FEN IS THE DEFAULT POSITION
    } // UPDATE SETUP

    function get(square) { // GET THE PIECE ON A SQUARE
        var piece = board[SQUARES[square]]; // THE PIECE IS THE PIECE ON THE SQUARE
        return (piece) ? { type: piece.type, color: piece.color } : null; // RETURN THE PIECE OR NULL
    } // GET

    function put(piece, square) { // PUT A PIECE ON A SQUARE
        if (!('type' in piece && 'color' in piece)) { // IF THE PIECE IS NOT VALID
            return false; // RETURN FALSE
        } // IF THE PIECE IS NOT VALID
        if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) { // IF THE PIECE IS NOT VALID
            return false; // RETURN FALSE
        } // IF THE PIECE IS NOT VALID
        if (!(square in SQUARES)) { // IF THE SQUARE IS NOT VALID
            return false; // RETURN FALSE
        } // IF THE SQUARE IS NOT VALID
        var sq = SQUARES[square]; // THE SQUARE IS THE SQUARE
        if (piece.type == KING &&
            !(kings[piece.color] == EMPTY || kings[piece.color] == sq)) { // IF THE PIECE IS A KING AND THE KING IS NOT EMPTY OR THE KING IS NOT THE SQUARE
            return false; // RETURN FALSE
        } // IF THE PIECE IS A KING AND THE KING IS NOT EMPTY OR THE KING IS NOT THE SQUARE
        board[sq] = { type: piece.type, color: piece.color }; // SET THE PIECE ON THE SQUARE
        if (piece.type === KING) { // IF THE PIECE IS A KING
            kings[piece.color] = sq; // SET THE KING TO THE SQUARE
        } // IF THE PIECE IS A KING
        update_setup(generate_fen()); // UPDATE THE SETUP
        return true; // RETURN TRUE
    } // PUT A PIECE ON A SQUARE

    function remove(square) { // REMOVE A PIECE FROM A SQUARE
        var piece = get(square); // THE PIECE IS THE PIECE ON THE SQUARE
        board[SQUARES[square]] = null; // REMOVE THE PIECE FROM THE SQUARE
        if (piece && piece.type === KING) { // IF THE PIECE IS A KING
            kings[piece.color] = EMPTY; // SET THE KING TO EMPTY
        } // IF THE PIECE IS A KING
        update_setup(generate_fen()); // UPDATE THE SETUP
        return piece; // RETURN THE PIECE
    } // REMOVE A PIECE FROM A SQUARE

    function build_move(board, from, to, flags, promotion) { // BUILD A MOVE
        var move = { // THE MOVE
            color: turn, // THE COLOR IS THE TURN
            from: from, // THE FROM SQUARE
            to: to, // THE TO SQUARE
            flags: flags, // THE FLAGS
            piece: board[from].type // THE PIECE IS THE PIECE ON THE FROM SQUARE
        }; // THE MOVE
        if (promotion) { // IF THERE IS A PROMOTION
            move.flags |= BITS.PROMOTION; // ADD THE PROMOTION FLAG
            move.promotion = promotion; // SET THE PROMOTION
        } // IF THERE IS A PROMOTION
        if (board[to]) { // IF THERE IS A PIECE ON THE TO SQUARE
            move.captured = board[to].type; // SET THE CAPTURED PIECE
        } else if (flags & BITS.EP_CAPTURE) { // IF THERE IS AN EN-PASSANT CAPTURE
            move.captured = PAWN; // SET THE CAPTURED PIECE TO PAWN
        } // IF THERE IS AN EN-PASSANT CAPTURE
        return move; // RETURN THE MOVE
    } // BUILD A MOVE

    function generate_moves(options) { // GENERATE MOVES FUNCTION: RETURNS A LIST OF LEGAL MOVES FROM THE CURRENT POSITION (THOSE THAT DON'T LEAVE THE KING IN CHECK), OR A LIST OF ALL MOVES IF THE LEGAL FLAG IS FALSE (THOSE ARE THE MOVES THAT PUT THE KING IN CHECK)
        function add_move(board, moves, from, to, flags) { // ADD A MOVE
            if (board[from].type === PAWN &&
                (rank(to) === RANK_8 || rank(to) === RANK_1)) { // IF THE PIECE IS A PAWN AND THE TO SQUARE IS THE 8TH OR 1ST RANK
                var pieces = [QUEEN, ROOK, BISHOP, KNIGHT]; // THE PIECES ARE QUEEN, ROOK, BISHOP, KNIGHT
                for (var i = 0, len = pieces.length; i < len; i++) { // FOR EACH PIECE
                    moves.push(build_move(board, from, to, flags, pieces[i])); // ADD THE MOVE
                } // FOR EACH PIECE
            } else { // IF THE PIECE IS NOT A PAWN OR THE TO SQUARE IS NOT THE 8TH OR 1ST RANK
                moves.push(build_move(board, from, to, flags)); // ADD THE MOVE
            } // IF THE PIECE IS NOT A PAWN OR THE TO SQUARE IS NOT THE 8TH OR 1ST RANK
        } // ADD A MOVE
        var moves = []; // THE MOVES
        var us = turn; // THE US IS THE TURN
        var them = swap_color(us); // THE THEM IS THE SWAP COLOR OF US
        var second_rank = { b: RANK_7, w: RANK_2 }; // THE SECOND RANK IS THE 7TH RANK FOR BLACK AND THE 2ND RANK FOR WHITE
        var first_sq = SQUARES.a8; // THE FIRST SQUARE IS A8
        var last_sq = SQUARES.h1; // THE LAST SQUARE IS H1
        var single_square = false; // SINGLE SQUARE IS FALSE
        var legal = (typeof options !== 'undefined' && 'legal' in options) ?
            options.legal : true; // LEGAL IS TRUE IF OPTIONS IS DEFINED AND LEGAL IS IN OPTIONS
        if (typeof options !== 'undefined' && 'square' in options) { // IF OPTIONS IS DEFINED AND SQUARE IS IN OPTIONS
            if (options.square in SQUARES) { // IF THE SQUARE IS IN SQUARES
                first_sq = last_sq = SQUARES[options.square]; // SET THE FIRST AND LAST SQUARE TO THE SQUARE
                single_square = true; // SINGLE SQUARE IS TRUE
            } else { // IF THE SQUARE IS NOT IN SQUARES
                return []; // RETURN AN EMPTY ARRAY
            } // IF THE SQUARE IS NOT IN SQUARES
        } // IF OPTIONS IS DEFINED AND SQUARE IS IN OPTIONS
        for (var i = first_sq; i <= last_sq; i++) { // FOR EACH SQUARE
            if (i & 0x88) { i += 7; continue; } // IF THE SQUARE IS NOT VALID
            var piece = board[i]; // THE PIECE IS THE PIECE ON THE SQUARE
            if (piece == null || piece.color !== us) { // IF THERE IS NO PIECE ON THE SQUARE OR THE PIECE IS NOT THE SAME COLOR AS US
                continue; // CONTINUE
            } // IF THERE IS NO PIECE ON THE SQUARE OR THE PIECE IS NOT THE SAME COLOR AS US
            if (piece.type === PAWN) { // IF THE PIECE IS A PAWN
                var square = i + PAWN_OFFSETS[us][0]; // THE SQUARE IS THE SQUARE PLUS THE PAWN OFFSET
                if (board[square] == null) { // IF THERE IS NO PIECE ON THE SQUARE
                    add_move(board, moves, i, square, BITS.NORMAL); // ADD THE MOVE
                    var square = i + PAWN_OFFSETS[us][1]; // THE SQUARE IS THE SQUARE PLUS THE PAWN OFFSET
                    if (second_rank[us] === rank(i) && board[square] == null) { // IF THE SECOND RANK IS THE SAME AS THE RANK OF THE SQUARE AND THERE IS NO PIECE ON THE SQUARE
                        add_move(board, moves, i, square, BITS.BIG_PAWN); // ADD THE MOVE
                    } // IF THE SECOND RANK IS THE SAME AS THE RANK OF THE SQUARE AND THERE IS NO PIECE ON THE SQUARE
                } // IF THERE IS NO PIECE ON THE SQUARE
                for (j = 2; j < 4; j++) { // FOR EACH PAWN OFFSET
                    var square = i + PAWN_OFFSETS[us][j]; // THE SQUARE IS THE SQUARE PLUS THE PAWN OFFSET
                    if (square & 0x88) continue; // IF THE SQUARE IS NOT VALID
                    if (board[square] != null &&
                        board[square].color === them) { // IF THERE IS A PIECE ON THE SQUARE AND THE PIECE IS THE SAME COLOR AS THEM
                        add_move(board, moves, i, square, BITS.CAPTURE); // ADD THE MOVE
                    } else if (square === ep_square) { // IF THE SQUARE IS THE EN-PASSANT SQUARE
                        add_move(board, moves, i, ep_square, BITS.EP_CAPTURE); // ADD THE MOVE
                    } // IF THE SQUARE IS THE EN-PASSANT SQUARE
                } // FOR EACH PAWN OFFSET
            } else { // IF THE PIECE IS NOT A PAWN
                for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) { // FOR EACH PIECE OFFSET
                    var offset = PIECE_OFFSETS[piece.type][j]; // THE OFFSET IS THE PIECE OFFSET
                    var square = i; // THE SQUARE IS THE SQUARE
                    while (true) { // WHILE TRUE
                        square += offset; // THE SQUARE IS THE SQUARE PLUS THE OFFSET
                        if (square & 0x88) break; // IF THE SQUARE IS NOT VALID
                        if (board[square] == null) { // IF THERE IS NO PIECE ON THE SQUARE
                            add_move(board, moves, i, square, BITS.NORMAL); // ADD THE MOVE
                        } else { // IF THERE IS A PIECE ON THE SQUARE
                            if (board[square].color === us) break; // IF THE PIECE IS THE SAME COLOR AS US
                            add_move(board, moves, i, square, BITS.CAPTURE); // ADD THE MOVE
                            break; // BREAK
                        } // IF THERE IS A PIECE ON THE SQUARE
                        if (piece.type === 'n' || piece.type === 'k') break; // IF THE PIECE IS A KNIGHT OR KING
                    } // WHILE TRUE
                } // FOR EACH PIECE OFFSET
            } // IF THE PIECE IS NOT A PAWN
        } // FOR EACH SQUARE
        if ((!single_square) || last_sq === kings[us]) { // IF NOT SINGLE SQUARE OR THE LAST SQUARE IS THE SAME AS THE KING
            if (castling[us] & BITS.KSIDE_CASTLE) { // IF THE CASTLING IS KINGSIDE
                var castling_from = kings[us]; // THE CASTLING FROM IS THE KING
                var castling_to = castling_from + 2; // THE CASTLING TO IS THE CASTLING FROM PLUS 2
                if (board[castling_from + 1] == null &&
                    board[castling_to] == null &&
                    !attacked(them, kings[us]) &&
                    !attacked(them, castling_from + 1) &&
                    !attacked(them, castling_to)) { // IF THERE IS NO PIECE ON THE CASTLING FROM PLUS 1 AND CASTLING TO AND THE KING IS NOT ATTACKED AND THE CASTLING FROM PLUS 1 AND CASTLING TO ARE NOT ATTACKED
                    add_move(board, moves, kings[us], castling_to,
                        BITS.KSIDE_CASTLE); // ADD THE MOVE
                } // IF THERE IS NO PIECE ON THE CASTLING FROM PLUS 1 AND CASTLING TO AND THE KING IS NOT ATTACKED AND THE CASTLING FROM PLUS 1 AND CASTLING TO ARE NOT ATTACKED
            } // IF THE CASTLING IS KINGSIDE
            if (castling[us] & BITS.QSIDE_CASTLE) { // IF THE CASTLING IS QUEENSIDE
                var castling_from = kings[us]; // THE CASTLING FROM IS THE KING
                var castling_to = castling_from - 2; // THE CASTLING TO IS THE CASTLING FROM MINUS 2
                if (board[castling_from - 1] == null &&
                    board[castling_from - 2] == null &&
                    board[castling_from - 3] == null &&
                    !attacked(them, kings[us]) &&
                    !attacked(them, castling_from - 1) &&
                    !attacked(them, castling_to)) { // IF THERE IS NO PIECE ON THE CASTLING FROM MINUS 1 AND CASTLING FROM MINUS 2 AND CASTLING FROM MINUS 3 AND THE KING IS NOT ATTACKED AND THE CASTLING FROM MINUS 1 AND CASTLING TO ARE NOT ATTACKED
                    add_move(board, moves, kings[us], castling_to,
                        BITS.QSIDE_CASTLE); // ADD THE MOVE
                } // END IF THERE IS NO PIECE ON THE CASTLING FROM MINUS 1 AND CASTLING FROM MINUS 2 AND CASTLING FROM MINUS 3 AND THE KING IS NOT ATTACKED AND THE CASTLING FROM MINUS 1 AND CASTLING TO ARE NOT ATTACKED
            } // IF THE CASTLING IS QUEENSIDE
        } // IF NOT SINGLE SQUARE OR THE LAST SQUARE IS THE SAME AS THE KING
        if (!legal) { // IF NOT LEGAL
            return moves; // RETURN THE MOVES
        } // IF NOT LEGAL
        var legal_moves = []; // THE LEGAL MOVES ARE AN EMPTY ARRAY
        for (var i = 0, len = moves.length; i < len; i++) { // FOR EACH MOVE
            make_move(moves[i]); // MAKE THE MOVE
            if (!king_attacked(us)) { // IF THE KING IS NOT ATTACKED
                legal_moves.push(moves[i]); // ADD THE MOVE TO THE LEGAL MOVES
            } // IF THE KING IS NOT ATTACKED
            undo_move(); // UNDO THE MOVE
        } // FOR EACH MOVE
        return legal_moves; // RETURN THE LEGAL MOVES
    } // END FUNCTION

    function move_to_san(move, sloppy) { // FUNCTION TO CONVERT A MOVE TO SAN NOTATION: MEANING IT CONVERTS THE MOVE TO A STRING, LIKE e4 OR Nf3, ETC.; SLOPPY IS A BOOLEAN THAT IS TRUE IF THE MOVE IS NOT LEGAL, FALSE IF IT IS LEGAL; MOVE IS THE MOVE TO CONVERT
        // ESSENTIALLY, THIS FUNCTION CONVERTS A MOVE TO A STRING (STANDARD ALGEBRAIC NOTATION)
        var output = ''; // THE OUTPUT IS AN EMPTY STRING
        if (move.flags & BITS.KSIDE_CASTLE) { // IF THE MOVE IS A KINGSIDE CASTLE
            output = 'O-O'; // THE OUTPUT IS O-O
        } else if (move.flags & BITS.QSIDE_CASTLE) { // IF THE MOVE IS A QUEENSIDE CASTLE
            output = 'O-O-O'; // THE OUTPUT IS O-O-O
        } else { // IF THE MOVE IS NOT A CASTLE
            var disambiguator = get_disambiguator(move, sloppy); // THE DISAMBIGUATOR IS THE DISAMBIGUATOR
            if (move.piece !== PAWN) { // IF THE PIECE IS NOT A PAWN
                output += move.piece.toUpperCase() + disambiguator; // THE OUTPUT IS THE PIECE PLUS THE DISAMBIGUATOR
            } // IF THE PIECE IS NOT A PAWN
            if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) { // IF THE MOVE IS A CAPTURE OR EN PASSANT CAPTURE
                if (move.piece === PAWN) { // IF THE PIECE IS A PAWN
                    output += algebraic(move.from)[0]; // THE OUTPUT IS THE ALGEBRAIC OF THE MOVE FROM
                } // IF THE PIECE IS A PAWN
                output += 'x'; // THE OUTPUT IS THE OUTPUT PLUS X
            } // IF THE MOVE IS A CAPTURE OR EN PASSANT CAPTURE
            output += algebraic(move.to); // THE OUTPUT IS THE OUTPUT PLUS THE ALGEBRAIC OF THE MOVE TO
            if (move.flags & BITS.PROMOTION) { // IF THE MOVE IS A PROMOTION
                output += '=' + move.promotion.toUpperCase(); // THE OUTPUT IS THE OUTPUT PLUS = AND THE PROMOTION
            } // IF THE MOVE IS A PROMOTION
        } // IF THE MOVE IS NOT A CASTLE
        make_move(move); // MAKE THE MOVE
        if (in_check()) { // IF IN CHECK
            if (in_checkmate()) { // IF IN CHECKMATE
                output += '#'; // THE OUTPUT IS THE OUTPUT PLUS #
            } else { // IF NOT IN CHECKMATE
                output += '+'; // THE OUTPUT IS THE OUTPUT PLUS +
            } // IF NOT IN CHECKMATE
        } // IF IN CHECK
        undo_move(); // UNDO THE MOVE
        return output; // RETURN THE OUTPUT
    } // END FUNCTION

    function stripped_san(move) { // FUNCTION TO STRIP SAN FROM A MOVE
        return move.replace(/=/, '').replace(/[+#]?[?!]*$/, ''); // RETURN THE MOVE WITH = REPLACED WITH NOTHING AND ANYTHING AFTER # OR ? OR ! REPLACED WITH NOTHING
    } // END FUNCTION

    function attacked(color, square) { // FUNCTION TO CHECK IF A SQUARE IS ATTACKED
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) { // FOR EACH SQUARE
            if (i & 0x88) { i += 7; continue; } // IF THE SQUARE IS OFF THE BOARD
            if (board[i] == null || board[i].color !== color) continue; // IF THE SQUARE IS EMPTY OR THE COLOR IS NOT THE COLOR
            var piece = board[i]; // THE PIECE IS THE BOARD AT I
            var difference = i - square; // THE DIFFERENCE IS I MINUS THE SQUARE
            var index = difference + 119; // THE INDEX IS THE DIFFERENCE PLUS 119
            if (ATTACKS[index] & (1 << SHIFTS[piece.type])) { // IF THE ATTACKS AT INDEX AND THE SHIFT OF THE PIECE TYPE IS NOT 0
                if (piece.type === PAWN) { // IF THE PIECE TYPE IS PAWN
                    if (difference > 0) { // IF THE DIFFERENCE IS GREATER THAN 0
                        if (piece.color === WHITE) return true; // IF THE PIECE COLOR IS WHITE RETURN TRUE
                    } else { // IF THE DIFFERENCE IS NOT GREATER THAN 0
                        if (piece.color === BLACK) return true; // IF THE PIECE COLOR IS BLACK RETURN TRUE
                    } // IF THE DIFFERENCE IS NOT GREATER THAN 0
                    continue; // CONTINUE
                } // IF THE PIECE TYPE IS PAWN
                if (piece.type === 'n' || piece.type === 'k') return true; // IF THE PIECE TYPE IS N OR K RETURN TRUE
                var offset = RAYS[index]; // THE OFFSET IS THE RAYS AT INDEX
                var j = i + offset; // J IS I PLUS THE OFFSET
                var blocked = false; // BLOCKED IS FALSE
                while (j !== square) { // WHILE J IS NOT THE SQUARE
                    if (board[j] != null) { blocked = true; break; } // IF THE BOARD AT J IS NOT NULL BLOCKED IS TRUE AND BREAK
                    j += offset; // J IS J PLUS THE OFFSET
                } // WHILE J IS NOT THE SQUARE
                if (!blocked) return true; // IF NOT BLOCKED RETURN TRUE
            } // IF THE ATTACKS AT INDEX AND THE SHIFT OF THE PIECE TYPE IS NOT 0
        } // FOR EACH SQUARE
        return false; // RETURN FALSE
    } // END FUNCTION

    function king_attacked(color) { // FUNCTION TO CHECK IF THE KING IS ATTACKED
        return attacked(swap_color(color), kings[color]); // RETURN IF THE COLOR SWAPPED IS ATTACKED
    } // END FUNCTION

    function in_check() { // FUNCTION TO CHECK IF IN CHECK
        return king_attacked(turn); // RETURN IF THE KING IS ATTACKED
    } // END FUNCTION

    function in_checkmate() { // FUNCTION TO CHECK IF IN CHECKMATE
        return in_check() && generate_moves().length === 0; // RETURN IF IN CHECK AND THE LENGTH OF THE GENERATED MOVES IS 0
    } // END FUNCTION

    function in_stalemate() { // FUNCTION TO CHECK IF IN STALEMATE
        return !in_check() && generate_moves().length === 0; // RETURN IF NOT IN CHECK AND THE LENGTH OF THE GENERATED MOVES IS 0
    } // END FUNCTION

    function insufficient_material() { // FUNCTION TO CHECK IF THERE IS INSUFFICIENT MATERIAL
        var pieces = {}; // PIECES IS AN EMPTY OBJECT
        var bishops = []; // BISHOPS IS AN EMPTY ARRAY
        var num_pieces = 0; // NUM PIECES IS 0
        var sq_color = 0; // SQ COLOR IS 0
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) { // FOR EACH SQUARE
            sq_color = (sq_color + 1) % 2; // SQ COLOR IS SQ COLOR PLUS 1 MOD 2
            if (i & 0x88) { i += 7; continue; } // IF THE SQUARE IS OFF THE BOARD
            var piece = board[i]; // THE PIECE IS THE BOARD AT I
            if (piece) { // IF THE PIECE IS NOT NULL
                pieces[piece.type] = (piece.type in pieces) ?
                    pieces[piece.type] + 1 : 1; // PIECES AT PIECE TYPE IS PIECES AT PIECE TYPE PLUS 1 OR 1
                if (piece.type === BISHOP) { // IF THE PIECE TYPE IS BISHOP
                    bishops.push(sq_color); // PUSH SQ COLOR TO BISHOPS
                } // IF THE PIECE TYPE IS BISHOP
                num_pieces++; // NUM PIECES IS NUM PIECES PLUS 1
            } // IF THE PIECE IS NOT NULL
        } // FOR EACH SQUARE
        if (num_pieces === 2) { return true; } // IF NUM PIECES IS 2 RETURN TRUE
        else if (num_pieces === 3 && (pieces[BISHOP] === 1 ||
            pieces[KNIGHT] === 1)) { return true; } // ELSE IF NUM PIECES IS 3 AND PIECES AT BISHOP IS 1 OR PIECES AT KNIGHT IS 1 RETURN TRUE
        else if (num_pieces === pieces[BISHOP] + 2) { // ELSE IF NUM PIECES IS PIECES AT BISHOP PLUS 2
            var sum = 0; // SUM IS 0
            var len = bishops.length; // LEN IS THE LENGTH OF BISHOPS
            for (var i = 0; i < len; i++) { // FOR EACH BISHOP
                sum += bishops[i]; // SUM IS SUM PLUS BISHOPS AT I
            } // FOR EACH BISHOP
            if (sum === 0 || sum === len) { return true; } // IF SUM IS 0 OR SUM IS LEN RETURN TRUE
        } // ELSE IF NUM PIECES IS PIECES AT BISHOP PLUS 2
        return false; // RETURN FALSE
    } // END FUNCTION

    function in_threefold_repetition() { // FUNCTION TO CHECK IF IN THREEFOLD REPETITION
        var moves = []; // MOVES IS AN EMPTY ARRAY
        var positions = {}; // POSITIONS IS AN EMPTY OBJECT
        var repetition = false; // REPETITION IS FALSE
        while (true) { // WHILE TRUE
            var move = undo_move(); // MOVE IS UNDO MOVE
            if (!move) break; // IF NOT MOVE BREAK
            moves.push(move); // PUSH MOVE TO MOVES
        } // WHILE TRUE
        while (true) { // WHILE TRUE
            var fen = generate_fen().split(' ').slice(0, 4).join(' '); // FEN IS THE FIRST 4 PARTS OF THE FEN
            positions[fen] = (fen in positions) ? positions[fen] + 1 : 1; // POSITIONS AT FEN IS POSITIONS AT FEN PLUS 1 OR 1
            if (positions[fen] >= 3) { // IF POSITIONS AT FEN IS GREATER THAN OR EQUAL TO 3
                repetition = true; // REPETITION IS TRUE
            } // IF POSITIONS AT FEN IS GREATER THAN OR EQUAL TO 3
            if (!moves.length) { // IF NOT MOVES LENGTH
                break; // BREAK
            } // IF NOT MOVES LENGTH
            make_move(moves.pop()); // MAKE MOVE IS MOVES POP
        } // WHILE TRUE
        return repetition; // RETURN REPETITION
    } // END FUNCTION

    function push(move) { // FUNCTION TO PUSH A MOVE
        history.push({ // PUSH TO HISTORY
            move: move, // MOVE
            kings: { b: kings.b, w: kings.w }, // KINGS
            turn: turn, // TURN
            castling: { b: castling.b, w: castling.w }, // CASTLING; MEANING IF THE KING OR ROOK HAS MOVED
            ep_square: ep_square, // EP SQUARE; MEANING IT IS THE SQUARE THAT CAN BE EN PASSANTED (EN PASSANT IS A MOVE IN CHESS WHERE A PAWN CAN CAPTURE AN ENEMY PAWN WHICH HAS ADVANCED TWO SQUARES FROM ITS STARTING POSITION AND IS LOCATED ADJACENT TO IT ON AN ADJACENT FILE)
            half_moves: half_moves, // HALF MOVES
            move_number: move_number // MOVE NUMBER
        }); // PUSH TO HISTORY
    } // END FUNCTION

    function make_move(move) { // FUNCTION TO MAKE A MOVE
        var us = turn; // US IS TURN (TURN IS THE COLOR OF THE PLAYER WHOSE TURN IT IS)
        var them = swap_color(us); // THEM IS SWAP COLOR OF US
        push(move); // PUSH MOVE
        board[move.to] = board[move.from]; // BOARD AT MOVE TO IS BOARD AT MOVE FROM
        board[move.from] = null; // BOARD AT MOVE FROM IS NULL
        if (move.flags & BITS.EP_CAPTURE) { // IF MOVE FLAGS AND BITS EP CAPTURE
            if (turn === BLACK) { // IF TURN IS BLACK
                board[move.to - 16] = null; // BOARD AT MOVE TO MINUS 16 IS NULL
            } else { // IF TURN IS BLACK
                board[move.to + 16] = null; // BOARD AT MOVE TO PLUS 16 IS NULL
            } // IF TURN IS BLACK
        } // IF MOVE FLAGS AND BITS EP CAPTURE
        if (move.flags & BITS.PROMOTION) { // IF MOVE FLAGS AND BITS PROMOTION
            board[move.to] = { type: move.promotion, color: us }; // BOARD AT MOVE TO IS TYPE MOVE PROMOTION AND COLOR US
        } // IF MOVE FLAGS AND BITS PROMOTION
        if (board[move.to].type === KING) { // IF BOARD AT MOVE TO TYPE IS KING
            kings[board[move.to].color] = move.to; // KINGS AT BOARD AT MOVE TO COLOR IS MOVE TO
            if (move.flags & BITS.KSIDE_CASTLE) { // IF MOVE FLAGS AND BITS KSIDE CASTLE
                var castling_to = move.to - 1; // CASTLING TO IS MOVE TO MINUS 1
                var castling_from = move.to + 1; // CASTLING FROM IS MOVE TO PLUS 1
                board[castling_to] = board[castling_from]; // BOARD AT CASTLING TO IS BOARD AT CASTLING FROM
                board[castling_from] = null; // BOARD AT CASTLING FROM IS NULL
            } else if (move.flags & BITS.QSIDE_CASTLE) { // ELSE IF MOVE FLAGS AND BITS QSIDE CASTLE
                var castling_to = move.to + 1; // CASTLING TO IS MOVE TO PLUS 1
                var castling_from = move.to - 2; // CASTLING FROM IS MOVE TO MINUS 2
                board[castling_to] = board[castling_from]; // BOARD AT CASTLING TO IS BOARD AT CASTLING FROM
                board[castling_from] = null; // BOARD AT CASTLING FROM IS NULL
            } // ELSE IF MOVE FLAGS AND BITS QSIDE CASTLE
            castling[us] = ''; // CASTLING AT US IS EMPTY STRING
        } // IF BOARD AT MOVE TO TYPE IS KING
        if (castling[us]) { // IF CASTLING AT US
            for (var i = 0, len = ROOKS[us].length; i < len; i++) { // FOR LOOP TO CHECK IF CASTLING AT US
                if (move.from === ROOKS[us][i].square &&
                    castling[us] & ROOKS[us][i].flag) { // IF MOVE FROM IS ROOKS AT US AT I SQUARE AND CASTLING AT US AND ROOKS AT US AT I FLAG
                    castling[us] ^= ROOKS[us][i].flag; // CASTLING AT US IS CASTLING AT US XOR ROOKS AT US AT I FLAG
                    break; // BREAK
                } // IF MOVE FROM IS ROOKS AT US AT I SQUARE AND
            } // FOR LOOP TO CHECK IF CASTLING AT US
        } // IF CASTLING AT US
        if (castling[them]) { // IF CASTLING AT THEM
            for (var i = 0, len = ROOKS[them].length; i < len; i++) { // FOR LOOP TO CHECK IF CASTLING AT THEM
                if (move.to === ROOKS[them][i].square &&
                    castling[them] & ROOKS[them][i].flag) { // IF MOVE TO IS ROOKS AT THEM AT I SQUARE AND CASTLING AT THEM AND ROOKS AT THEM AT I FLAG
                    castling[them] ^= ROOKS[them][i].flag; // CASTLING AT THEM IS CASTLING AT THEM XOR ROOKS AT THEM AT I FLAG
                    break; // BREAK
                } // IF MOVE TO IS ROOKS AT THEM AT I SQUARE AND
            } // FOR LOOP TO CHECK IF CASTLING AT THEM
        } // IF CASTLING AT THEM
        if (move.flags & BITS.BIG_PAWN) { // IF MOVE FLAGS AND BITS BIG PAWN
            if (turn === 'b') { // IF TURN IS B
                ep_square = move.to - 16; // EP SQUARE IS MOVE TO MINUS 16
            } else { // IF TURN IS B
                ep_square = move.to + 16; // EP SQUARE IS MOVE TO PLUS 16
            } // IF TURN IS B
        } else { // ELSE
            ep_square = EMPTY; // EP SQUARE IS EMPTY
        } // ELSE
        if (move.piece === PAWN) { // IF MOVE PIECE IS PAWN
            half_moves = 0; // HALF MOVES IS 0
        } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) { // ELSE IF MOVE FLAGS AND BITS CAPTURE OR BITS EP CAPTURE
            half_moves = 0; // HALF MOVES IS 0
        } else { // ELSE
            half_moves++; // HALF MOVES PLUS 1
        } // ELSE
        if (turn === BLACK) { // IF TURN IS BLACK
            move_number++; // MOVE NUMBER PLUS 1
        } // IF TURN IS BLACK
        turn = swap_color(turn); // TURN IS SWAP COLOR OF TURN
    } // MAKE MOVE FUNCTION

    function undo_move() { // UNDO MOVE FUNCTION: UNDOES A MOVE; RETURNS NULL IF MOVE HISTORY IS EMPTY; IT IS NOT MEANT TO BE CALLED ON THE INITIAL BOARD SETUP, ONLY AFTER AT LEAST ONE VALID MOVE HAS BEEN MADE; IT'S USED IN CONJUNCTION WITH MAKE_MOVE TO IMPLEMENT UNMAKE_MOVE; IT'S MAIN OBJECTIVE IS TO RESTORE ALL THE BOARD PROPERTIES TO THE PREVIOUS STATE; IT ALSO RESTORES THE EN PASSANT SQUARE, CASTLING RIGHTS, THE HALF MOVE CLOCK, THE FULL MOVE NUMBER, AND THE ENEMY KING POSITION; IT DOES NOT RESTORE THE BOARD ARRAY, SO MAKE SURE TO CALL MAKE_MOVE BEFORE TRYING TO UNDO A MOVE
        var old = history.pop(); // OLD IS HISTORY POP
        if (old == null) { return null; } // IF OLD IS NULL RETURN NULL
        var move = old.move; // MOVE IS OLD MOVE
        kings = old.kings; // KINGS IS OLD KINGS
        turn = old.turn; // TURN IS OLD TURN
        castling = old.castling; // CASTLING IS OLD CASTLING
        ep_square = old.ep_square; // EP SQUARE IS OLD EP SQUARE
        half_moves = old.half_moves; // HALF MOVES IS OLD HALF MOVES
        move_number = old.move_number; // MOVE NUMBER IS OLD MOVE NUMBER
        var us = turn; // US IS TURN
        var them = swap_color(turn); // THEM IS SWAP COLOR OF TURN
        board[move.from] = board[move.to]; // BOARD AT MOVE FROM IS BOARD AT MOVE TO
        board[move.from].type = move.piece; // BOARD AT MOVE FROM TYPE IS MOVE PIECE
        board[move.to] = null; // BOARD AT MOVE TO IS NULL
        if (move.flags & BITS.CAPTURE) { // IF MOVE FLAGS AND BITS CAPTURE
            board[move.to] = { type: move.captured, color: them }; // BOARD AT MOVE TO IS OBJECT WITH TYPE MOVE CAPTURED AND COLOR THEM
        } else if (move.flags & BITS.EP_CAPTURE) { // ELSE IF MOVE FLAGS AND BITS EP CAPTURE
            var index; // INDEX VARIABLE: IS THE INDEX OF THE PAWN
            if (us === BLACK) { // IF US IS BLACK
                index = move.to - 16; // INDEX IS MOVE TO MINUS 16
            } else { // ELSE
                index = move.to + 16; // INDEX IS MOVE TO PLUS 16
            } // ELSE
            board[index] = { type: PAWN, color: them }; // BOARD AT INDEX IS OBJECT WITH TYPE PAWN AND COLOR THEM
        } // ELSE IF MOVE FLAGS AND BITS EP CAPTURE
        if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) { // IF MOVE FLAGS AND BITS KSIDE CASTLE OR BITS QSIDE CASTLE
            var castling_to, castling_from; // CASTLING TO AND CASTLING FROM VARIABLES
            if (move.flags & BITS.KSIDE_CASTLE) { // IF MOVE FLAGS AND BITS KSIDE CASTLE
                castling_to = move.to + 1; // CASTLING TO IS MOVE TO PLUS 1
                castling_from = move.to - 1; // CASTLING FROM IS MOVE TO MINUS 1
            } else if (move.flags & BITS.QSIDE_CASTLE) { // ELSE IF MOVE FLAGS AND BITS QSIDE CASTLE
                castling_to = move.to - 2; // CASTLING TO IS MOVE TO MINUS 2
                castling_from = move.to + 1; // CASTLING FROM IS MOVE TO PLUS 1
            } // ELSE IF MOVE FLAGS AND BITS QSIDE CASTLE
            board[castling_to] = board[castling_from]; // BOARD AT CASTLING TO IS BOARD AT CASTLING FROM
            board[castling_from] = null; // BOARD AT CASTLING FROM IS NULL
        } // IF MOVE FLAGS AND BITS KSIDE CASTLE OR BITS QSIDE CASTLE
        return move; // RETURN MOVE
    } // UNDO MOVE FUNCTION

    function get_disambiguator(move, sloppy) { // GET DISAMBIGUATOR FUNCTION: RETURNS AN INTEGER [0, 4095] TO DISAMBIGUATE MOVES FROM ONE ANOTHER; IF TWO OR MORE PIECES OF THE SAME TYPE CAN MOVE TO THE SAME SQUARE, WE ADD A DISAMBIGUATOR TO THE SAN STRING; THIS FUNCTION GENERATES SUCH A DISAMBIGUATOR (IF NEEDED); SLOPPY FLAG IS USED TO OUTPUT THE LONG ALGEBRAIC NOTATION (EX: NBD2) WHEN THE DISAMBIGUATOR IS NEEDED BUT THE STANDARD ALGEBRAIC NOTATION (EX: NB1D2) WOULD NORMALLY BE USED; NOTE: THIS FUNCTION DOES NOT WORK CORRECTLY FOR PAWN MOVES.
        var moves = generate_moves({ legal: !sloppy }); // MOVES IS GENERATE MOVES WITH LEGAL NOT SLOPPY
        var from = move.from; // FROM IS MOVE FROM
        var to = move.to; // TO IS MOVE TO
        var piece = move.piece; // PIECE IS MOVE PIECE
        var ambiguities = 0; // AMBIGUITIES IS 0
        var same_rank = 0; // SAME RANK IS 0
        var same_file = 0; // SAME FILE IS 0
        for (var i = 0, len = moves.length; i < len; i++) { // FOR LOOP TO CHECK IF AMBIGUOUS
            var ambig_from = moves[i].from; // AMBIG FROM IS MOVES I FROM
            var ambig_to = moves[i].to; // AMBIG TO IS MOVES I TO
            var ambig_piece = moves[i].piece; // AMBIG PIECE IS MOVES I PIECE
            if (piece === ambig_piece && from !== ambig_from && to === ambig_to) { // IF PIECE IS AMBIG PIECE AND FROM IS NOT AMBIG FROM AND TO IS AMBIG TO
                ambiguities++; // AMBIGUITIES PLUS 1
                if (rank(from) === rank(ambig_from)) { // IF RANK FROM IS RANK AMBIG FROM
                    same_rank++; // SAME RANK PLUS 1
                } // IF RANK FROM IS RANK AMBIG FROM
                if (file(from) === file(ambig_from)) { // IF FILE FROM IS FILE AMBIG FROM
                    same_file++; // SAME FILE PLUS 1
                } // IF FILE FROM IS FILE AMBIG FROM
            } // IF PIECE IS AMBIG PIECE AND FROM IS NOT AMBIG FROM AND TO IS AMBIG TO
        } // FOR LOOP TO CHECK IF AMBIGUOUS
        if (ambiguities > 0) { // IF AMBIGUITIES IS GREATER THAN 0
            if (same_rank > 0 && same_file > 0) { // IF SAME RANK IS GREATER THAN 0 AND SAME FILE IS GREATER THAN 0
                return algebraic(from); // RETURN ALGEBRAIC FROM
            } else if (same_file > 0) { // ELSE IF SAME FILE IS GREATER THAN 0
                return algebraic(from).charAt(1); // RETURN ALGEBRAIC FROM CHAR AT 1
            } else { // ELSE
                return algebraic(from).charAt(0); // RETURN ALGEBRAIC FROM CHAR AT 0
            }
        } // IF AMBIGUITIES IS GREATER THAN 0
        return ''; // RETURN EMPTY STRING
    } // GET DISAMBIGUATOR FUNCTION

    function ascii() { // ASCII FUNCTION
        var s = '   +------------------------+\n'; // S IS STRING
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) { // FOR LOOP TO PRINT BOARD
            if (file(i) === 0) { // IF FILE I IS 0
                s += ' ' + '87654321'[rank(i)] + ' |'; // S IS STRING
            } // IF FILE I IS 0
            if (board[i] == null) { // IF BOARD I IS NULL
                s += ' . '; // S IS STRING
            } else { // ELSE
                var piece = board[i].type; // PIECE IS BOARD I TYPE
                var color = board[i].color; // COLOR IS BOARD I COLOR
                var symbol = (color === WHITE) ?
                    piece.toUpperCase() : piece.toLowerCase(); // SYMBOL IS COLOR IS WHITE ? PIECE TO UPPER CASE : PIECE TO LOWER CASE
                s += ' ' + symbol + ' '; // S IS STRING
            } // ELSE
            if ((i + 1) & 0x88) { // IF I PLUS 1 AND 0X88
                s += '|\n'; // S IS STRING
                i += 8; // I PLUS 8
            } // IF I PLUS 1 AND 0X88
        } // FOR LOOP TO PRINT BOARD
        s += '   +------------------------+\n'; // S IS STRING
        s += '     a  b  c  d  e  f  g  h\n'; // S IS STRING
        return s; // RETURN S
    } // ASCII FUNCTION

    function move_from_san(move, sloppy) { // MOVE FROM SAN FUNCTION
        var clean_move = stripped_san(move); // CLEAN MOVE IS STRIPPED SAN MOVE
        if (sloppy) { // IF SLOPPY
            var matches = clean_move.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/); // MATCHES IS CLEAN MOVE MATCH
            if (matches) { // IF MATCHES
                var piece = matches[1]; // PIECE IS MATCHES 1
                var from = matches[2]; // FROM IS MATCHES 2
                var to = matches[3]; // TO IS MATCHES 3
                var promotion = matches[4]; // PROMOTION IS MATCHES 4
            } // IF MATCHES
        } // IF SLOPPY
        var moves = generate_moves(); // MOVES IS GENERATE MOVES
        for (var i = 0, len = moves.length; i < len; i++) { // FOR LOOP TO CHECK IF MOVE IS VALID
            if ((clean_move === stripped_san(move_to_san(moves[i]))) ||
                (sloppy && clean_move === stripped_san(move_to_san(moves[i], true)))) { // IF CLEAN MOVE IS STRIPPED SAN MOVE TO SAN MOVES I OR SLOPPY AND CLEAN MOVE IS STRIPPED SAN MOVE TO SAN MOVES I TRUE
                return moves[i]; // RETURN MOVES I
            } else { // ELSE
                if (matches &&
                    (!piece || piece.toLowerCase() == moves[i].piece) &&
                    SQUARES[from] == moves[i].from &&
                    SQUARES[to] == moves[i].to &&
                    (!promotion || promotion.toLowerCase() == moves[i].promotion)) { // IF MATCHES AND NOT PIECE OR PIECE TO LOWER CASE IS MOVES I PIECE AND SQUARES FROM IS MOVES I FROM AND SQUARES TO IS MOVES I TO AND NOT PROMOTION OR PROMOTION TO LOWER CASE IS MOVES I PROMOTION
                    return moves[i]; // RETURN MOVES I
                } // IF MATCHES AND NOT PIECE OR PIECE TO LOWER CASE IS MOVES I PIECE AND SQUARES FROM IS MOVES I FROM AND SQUARES TO IS MOVES I TO AND NOT PROMOTION OR PROMOTION TO LOWER CASE IS MOVES I PROMOTION
            } // ELSE
        } // FOR LOOP TO CHECK IF MOVE IS VALID
        return null; // RETURN NULL
    } // MOVE FROM SAN FUNCTION

    function rank(i) { // RANK FUNCTION
        return i >> 4; // RETURN I SHIFT RIGHT 4
    } // RANK FUNCTION

    function file(i) { // FILE FUNCTION
        return i & 15; // RETURN I AND 15
    } // FILE FUNCTION

    function algebraic(i) { // ALGEBRAIC FUNCTION
        var f = file(i), r = rank(i); // F IS FILE I, R IS RANK I
        return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1); // RETURN SUBSTRING F, F PLUS 1 PLUS 87654321 SUBSTRING R, R PLUS 1
    } // ALGEBRAIC FUNCTION

    function swap_color(c) { // SWAP COLOR FUNCTION
        return c === WHITE ? BLACK : WHITE; // RETURN C IS WHITE ? BLACK : WHITE
    } // SWAP COLOR FUNCTION

    function is_digit(c) { // IS DIGIT FUNCTION
        return '0123456789'.indexOf(c) !== -1; // RETURN 0123456789 INDEX OF C IS NOT -1
    } // IS DIGIT FUNCTION

    function make_pretty(ugly_move) { // MAKE PRETTY FUNCTION: UGLY MOVE; MEANING IT IS NOT A LEGAL MOVE; THIS FUNCTION TRANSFORMS IT INTO A LEGAL MOVE BY ADDING SAN, TO, FROM, AND FLAGS; IT IS USED IN THE MOVE HISTORY
        var move = clone(ugly_move); // MOVE IS CLONE UGLY MOVE
        move.san = move_to_san(move, false); // MOVE SAN IS MOVE TO SAN MOVE FALSE
        move.to = algebraic(move.to); // MOVE TO IS ALGEBRAIC MOVE TO
        move.from = algebraic(move.from); // MOVE FROM IS ALGEBRAIC MOVE FROM
        var flags = ''; // FLAGS IS STRING
        for (var flag in BITS) { // FOR LOOP TO CHECK FLAGS
            if (BITS[flag] & move.flags) { // IF BITS FLAG AND MOVE FLAGS
                flags += FLAGS[flag]; // FLAGS IS FLAGS PLUS FLAGS FLAG
            } // IF BITS FLAG AND MOVE FLAGS
        } // FOR LOOP TO CHECK FLAGS
        move.flags = flags; // MOVE FLAGS IS FLAGS
        return move; // RETURN MOVE
    } // MAKE PRETTY FUNCTION
 
    function clone(obj) { // CLONE FUNCTION
        var dupe = (obj instanceof Array) ? [] : {}; // DUPE IS OBJ INSTANCE OF ARRAY ? [] : {}
        for (var property in obj) { // FOR LOOP TO CHECK PROPERTY
            if (typeof property === 'object') { // IF TYPEOF PROPERTY IS OBJECT
                dupe[property] = clone(obj[property]); // DUPE PROPERTY IS CLONE OBJ PROPERTY
            } else { // ELSE
                dupe[property] = obj[property]; // DUPE PROPERTY IS OBJ PROPERTY
            } // ELSE
        } // FOR LOOP TO CHECK PROPERTY
        return dupe; // RETURN DUPE
    } // CLONE FUNCTION

    function trim(str) { // TRIM FUNCTION
        return str.replace(/^\s+|\s+$/g, ''); // RETURN STR REPLACE REGEX
    } // TRIM FUNCTION

    function perft(depth) { // PERFT FUNCTION: IT IS USED TO TEST THE MOVE GENERATION AND MAKE SURE IT IS WORKING CORRECTLY; FOR EXAMPLE, IT CAN BE USED TO MAKE SURE THAT THE MOVE GENERATION IS PRODUCING THE CORRECT NUMBER OF MOVES AT EACH DEPTH.
        var moves = generate_moves({ legal: false }); // MOVES IS GENERATE MOVES LEGAL FALSE
        var nodes = 0; // NODES IS 0
        var color = turn; // COLOR IS TURN
        for (var i = 0, len = moves.length; i < len; i++) { // FOR LOOP TO CHECK MOVES
            make_move(moves[i]); // MAKE MOVE MOVES I
            if (!king_attacked(color)) { // IF NOT KING ATTACKED COLOR
                if (depth - 1 > 0) { // IF DEPTH - 1 IS GREATER THAN 0
                    var child_nodes = perft(depth - 1); // CHILD NODES IS PERFT DEPTH - 1
                    nodes += child_nodes; // NODES IS NODES PLUS CHILD NODES
                } else { // ELSE
                    nodes++; // NODES IS NODES PLUS 1
                } // ELSE
            } // IF NOT KING ATTACKED COLOR
            undo_move(); // UNDO MOVE
        } // FOR LOOP TO CHECK MOVES
        return nodes; // RETURN NODES
    } // PERFT FUNCTION

    return { // RETURN
        WHITE: WHITE, // WHITE
        BLACK: BLACK, // BLACK
        PAWN: PAWN, // PAWN
        KNIGHT: KNIGHT, // KNIGHT
        BISHOP: BISHOP, // BISHOP
        ROOK: ROOK, // ROOK
        QUEEN: QUEEN, // QUEEN
        KING: KING, // KING
        SQUARES: (function () { // SQUARES FUNCTION
            var keys = []; // KEYS IS ARRAY
            for (var i = SQUARES.a8; i <= SQUARES.h1; i++) { // FOR LOOP TO CHECK SQUARES
                if (i & 0x88) { i += 7; continue; } // IF I AND 0X88
                keys.push(algebraic(i)); // KEYS PUSH ALGEBRAIC I
            } // FOR LOOP TO CHECK SQUARES
            return keys; // RETURN KEYS
        })(), // SQUARES FUNCTION
        FLAGS: FLAGS, // FLAGS
        load: function (fen) { // LOAD FUNCTION
            return load(fen); // RETURN LOAD FEN
        }, // LOAD FUNCTION
        reset: function () { // RESET FUNCTION
            return reset(); // RETURN RESET
        }, // RESET FUNCTION
        moves: function (options) { // MOVES FUNCTION
            var ugly_moves = generate_moves(options); // UGLY MOVES IS GENERATE MOVES OPTIONS
            var moves = []; // MOVES IS ARRAY
            for (var i = 0, len = ugly_moves.length; i < len; i++) { // FOR LOOP TO CHECK UGLY MOVES
                if (typeof options !== 'undefined' && 'verbose' in options &&
                    options.verbose) { // IF TYPEOF OPTIONS IS NOT UNDEFINED AND VERBOSE IN OPTIONS AND OPTIONS VERBOSE
                    moves.push(make_pretty(ugly_moves[i])); // MOVES PUSH MAKE PRETTY UGLY MOVES I
                } else { // ELSE
                    moves.push(move_to_san(ugly_moves[i], false)); // MOVES PUSH MOVE TO SAN UGLY MOVES I FALSE
                } // ELSE
            } // FOR LOOP TO CHECK UGLY MOVES
            return moves; // RETURN MOVES
        }, // MOVES FUNCTION
        ugly_moves: function (options) { // UGLY MOVES FUNCTION
            var ugly_moves = generate_moves(options); // UGLY MOVES IS GENERATE MOVES OPTIONS
            return ugly_moves; // RETURN UGLY MOVES
        }, // UGLY MOVES FUNCTION
        in_check: function () { // IN CHECK FUNCTION
            return in_check(); // RETURN IN CHECK
        }, // IN CHECK FUNCTION
        in_checkmate: function () { // IN CHECKMATE FUNCTION
            return in_checkmate(); // RETURN IN CHECKMATE
        }, // IN CHECKMATE FUNCTION
        in_stalemate: function () { // IN STALEMATE FUNCTION
            return in_stalemate(); // RETURN IN STALEMATE
        }, // IN STALEMATE FUNCTION
        in_draw: function () { // IN DRAW FUNCTION
            return half_moves >= 100 ||
                in_stalemate() ||
                insufficient_material() ||
                in_threefold_repetition(); // RETURN HALF MOVES IS GREATER THAN 100 OR IN STALEMATE OR INSUFFICIENT MATERIAL OR IN THREEFOLD REPETITION
        }, // IN DRAW FUNCTION
        insufficient_material: function () { // INSUFFICIENT MATERIAL FUNCTION
            return insufficient_material(); // RETURN INSUFFICIENT MATERIAL
        }, // INSUFFICIENT MATERIAL FUNCTION
        in_threefold_repetition: function () { // IN THREEFOLD REPETITION FUNCTION
            return in_threefold_repetition(); // RETURN IN THREEFOLD REPETITION
        }, // IN THREEFOLD REPETITION FUNCTION
        game_over: function () { // GAME OVER FUNCTION
            return half_moves >= 100 ||
                in_checkmate() ||
                in_stalemate() ||
                insufficient_material() ||
                in_threefold_repetition(); // RETURN HALF MOVES IS GREATER THAN 100 OR IN CHECKMATE OR IN STALEMATE OR INSUFFICIENT MATERIAL OR IN THREEFOLD REPETITION
        }, // GAME OVER FUNCTION
        validate_fen: function (fen) { // VALIDATE FEN FUNCTION
            return validate_fen(fen); // RETURN VALIDATE FEN FEN
        }, // VALIDATE FEN FUNCTION
        fen: function () { // FEN FUNCTION
            return generate_fen(); // RETURN GENERATE FEN
        }, // FEN FUNCTION
        board: function () { // BOARD FUNCTION
            var output = [], 
                row = []; // OUTPUT AND ROW ARE ARRAY
            for (var i = SQUARES.a8; i <= SQUARES.h1; i++) { // FOR LOOP TO CHECK SQUARES
                if (board[i] == null) { // IF BOARD I IS NULL
                    row.push(null) // ROW PUSH NULL
                } else { // ELSE
                    row.push({ type: board[i].type, color: board[i].color }) // ROW PUSH TYPE BOARD I COLOR BOARD I COLOR
                } // ELSE
                if ((i + 1) & 0x88) { // IF I PLUS 1 AND 0X88
                    output.push(row); // OUTPUT PUSH ROW
                    row = [] // ROW IS ARRAY
                    i += 8; // I IS I PLUS 8
                } // IF I PLUS 1 AND 0X88
            } // FOR LOOP TO CHECK SQUARES
            return output; // RETURN OUTPUT
        }, // BOARD FUNCTION
        pgn: function (options) { // PGN FUNCTION: IT'S A FUNCTION RESPONSIBLE FOR GENERATING PGN (PORTABLE GAME NOTATION) FROM THE CURRENT POSITION
            var newline = (typeof options === 'object' &&
                typeof options.newline_char === 'string') ?
                options.newline_char : '\n'; // NEWLINE IS TYPEOF OPTIONS IS OBJECT AND TYPEOF OPTIONS NEWLINE CHAR IS STRING ELSE NEWLINE IS \N
            var max_width = (typeof options === 'object' &&
                typeof options.max_width === 'number') ?
                options.max_width : 0; // MAX WIDTH IS TYPEOF OPTIONS IS OBJECT AND TYPEOF OPTIONS MAX WIDTH IS NUMBER ELSE MAX WIDTH IS 0
            var result = []; // RESULT IS ARRAY
            var header_exists = false; // HEADER EXISTS IS FALSE
            for (var i in header) { // FOR LOOP TO CHECK HEADER
                result.push('[' + i + ' \"' + header[i] + '\"]' + newline); // RESULT PUSH I HEADER I NEWLINE
                header_exists = true; // HEADER EXISTS IS TRUE
            } // FOR LOOP TO CHECK HEADER
            if (header_exists && history.length) { // IF HEADER EXISTS AND HISTORY LENGTH
                result.push(newline); // RESULT PUSH NEWLINE
            } // IF HEADER EXISTS AND HISTORY LENGTH
            var reversed_history = []; // REVERSED HISTORY IS ARRAY
            while (history.length > 0) { // WHILE HISTORY LENGTH IS GREATER THAN 0
                reversed_history.push(undo_move()); // REVERSED HISTORY PUSH UNDO MOVE
            } // WHILE HISTORY LENGTH IS GREATER THAN 0
            var moves = []; // MOVES IS ARRAY
            var move_string = ''; // MOVE STRING IS STRING
            while (reversed_history.length > 0) { // WHILE REVERSED HISTORY LENGTH IS GREATER THAN 0
                var move = reversed_history.pop(); // MOVE IS REVERSED HISTORY POP
                if (!history.length && move.color === 'b') { // IF NOT HISTORY LENGTH AND MOVE COLOR IS B
                    move_string = move_number + '. ...'; // MOVE STRING IS MOVE NUMBER . ...
                } else if (move.color === 'w') { // ELSE IF MOVE COLOR IS W
                    if (move_string.length) { // IF MOVE STRING LENGTH
                        moves.push(move_string); // MOVES PUSH MOVE STRING
                    } // IF MOVE STRING LENGTH
                    move_string = move_number + '.'; // MOVE STRING IS MOVE NUMBER .
                } // ELSE IF MOVE COLOR IS W
                move_string = move_string + ' ' + move_to_san(move, false); // MOVE STRING IS MOVE STRING MOVE TO SAN MOVE FALSE
                make_move(move); // MAKE MOVE MOVE
            } // WHILE REVERSED HISTORY LENGTH IS GREATER THAN 0
            if (move_string.length) { // IF MOVE STRING LENGTH 
                moves.push(move_string); // MOVES PUSH MOVE STRING
            } // IF MOVE STRING LENGTH
            if (typeof header.Result !== 'undefined') { // IF TYPEOF HEADER RESULT IS UNDEFINED
                moves.push(header.Result); // MOVES PUSH HEADER RESULT
            } // IF TYPEOF HEADER RESULT IS UNDEFINED
            if (max_width === 0) { // IF MAX WIDTH IS 0
                return result.join('') + moves.join(' '); // RETURN RESULT JOIN '' MOVES JOIN ' '
            } // IF MAX WIDTH IS 0
            var current_width = 0; // CURRENT WIDTH IS 0
            for (var i = 0; i < moves.length; i++) { // FOR LOOP TO CHECK MOVES
                if (current_width + moves[i].length > max_width && i !== 0) { // IF CURRENT WIDTH PLUS MOVES I LENGTH IS GREATER THAN MAX WIDTH AND I IS NOT 0
                    if (result[result.length - 1] === ' ') { // IF RESULT RESULT LENGTH - 1 IS ' '
                        result.pop(); // RESULT POP
                    } // IF RESULT RESULT LENGTH - 1 IS ' '
                    result.push(newline); // RESULT PUSH NEWLINE
                    current_width = 0; // CURRENT WIDTH IS 0
                } else if (i !== 0) { // ELSE IF I IS NOT 0
                    result.push(' '); // RESULT PUSH ' '
                    current_width++; // CURRENT WIDTH IS CURRENT WIDTH PLUS 1
                } // ELSE IF I IS NOT 0
                result.push(moves[i]); // RESULT PUSH MOVES I
                current_width += moves[i].length; // CURRENT WIDTH IS CURRENT WIDTH PLUS MOVES I LENGTH
            } // FOR LOOP TO CHECK MOVES
            return result.join(''); // RETURN RESULT JOIN ''
        }, // PGN FUNCTION
        load_pgn: function (pgn, options) { // LOAD PGN FUNCTION: IT'S A FUNCTION RESPONSIBLE FOR LOADING A PGN (PORTABLE GAME NOTATION) FILE
            var sloppy = (typeof options !== 'undefined' && 'sloppy' in options) ?
                options.sloppy : false; // SLOPPY IS TYPEOF OPTIONS IS NOT UNDEFINED AND SLOPPY IN OPTIONS ELSE FALSE
            function mask(str) { // MASK FUNCTION
                return str.replace(/\\/g, '\\'); // RETURN STR REPLACE /\\/g, '\\'
            } // MASK FUNCTION
            function has_keys(object) { // HAS KEYS FUNCTION
                for (var key in object) { // FOR LOOP TO CHECK OBJECT
                    return true; // RETURN TRUE
                } // FOR LOOP TO CHECK OBJECT
                return false; // RETURN FALSE
            } // HAS KEYS FUNCTION
            function parse_pgn_header(header, options) { // PARSE PGN HEADER FUNCTION
                var newline_char = (typeof options === 'object' &&
                    typeof options.newline_char === 'string') ?
                    options.newline_char : '\r?\n'; // NEWLINE CHAR IS TYPEOF OPTIONS IS OBJECT AND TYPEOF OPTIONS NEWLINE CHAR IS STRING ELSE \R?\N
                var header_obj = {}; // HEADER OBJ IS OBJECT
                var headers = header.split(new RegExp(mask(newline_char))); // HEADERS IS HEADER SPLIT NEW REGEXP MASK NEWLINE CHAR
                var key = ''; // KEY IS ''
                var value = ''; // VALUE IS ''
                for (var i = 0; i < headers.length; i++) { // FOR LOOP TO CHECK HEADERS
                    key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1'); // KEY IS HEADERS I REPLACE /^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1'
                    value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\]$/, '$1'); // VALUE IS HEADERS I REPLACE /^\[[A-Za-z]+\s"(.*)"\]$/, '$1'
                    if (trim(key).length > 0) { // IF TRIM KEY LENGTH IS GREATER THAN 0
                        header_obj[key] = value; // HEADER OBJ KEY IS VALUE
                    } // IF TRIM KEY LENGTH IS GREATER THAN 0
                } // FOR LOOP TO CHECK HEADERS
                return header_obj; // RETURN HEADER OBJ
            } // PARSE PGN HEADER FUNCTION
            var newline_char = (typeof options === 'object' && 
                typeof options.newline_char === 'string') ?
                options.newline_char : '\r?\n'; // NEWLINE CHAR IS TYPEOF OPTIONS IS OBJECT AND TYPEOF OPTIONS NEWLINE CHAR IS STRING ELSE \R?\N
            var regex = new RegExp('^(\\[(.|' + mask(newline_char) + ')*\\])' +
                '(' + mask(newline_char) + ')*' +
                '1.(' + mask(newline_char) + '|.)*$', 'g'); // REGEX IS NEW REGEXP '^(\\[(.|' MASK NEWLINE CHAR ')*\\])' + '(' MASK NEWLINE CHAR ')*' + '1.(' MASK NEWLINE CHAR '|.)*$', 'g'
            var header_string = pgn.replace(regex, '$1'); // HEADER STRING IS PGN REPLACE REGEX, '$1'
            if (header_string[0] !== '[') { // IF HEADER STRING 0 IS NOT '['
                header_string = ''; // HEADER STRING IS ''
            } // IF HEADER STRING 0 IS NOT '['
            reset(); // RESET
            var headers = parse_pgn_header(header_string, options); // HEADERS IS PARSE PGN HEADER HEADER STRING OPTIONS
            for (var key in headers) { // FOR LOOP TO CHECK HEADERS
                set_header([key, headers[key]]); // SET HEADER KEY, HEADERS KEY
            } // FOR LOOP TO CHECK HEADERS
            if (headers['SetUp'] === '1') { // IF HEADERS SETUP IS '1'
                if (!(('FEN' in headers) && load(headers['FEN']))) { // IF FEN IN HEADERS AND LOAD HEADERS FEN
                    return false; // RETURN FALSE
                } // IF FEN IN HEADERS AND LOAD HEADERS FEN
            } // IF HEADERS SETUP IS '1'
            var ms = pgn.replace(header_string, '').replace(new RegExp(mask(newline_char), 'g'), ' '); // MS IS PGN REPLACE HEADER STRING, '' REPLACE NEW REGEXP MASK NEWLINE CHAR, ' '
            ms = ms.replace(/(\{[^}]+\})+?/g, ''); // MS IS MS REPLACE /(\{[^}]+\})+?/g, ''
            var rav_regex = /(\([^\(\)]+\))+?/g // RAV REGEX IS /(\([^\(\)]+\))+?/g
            while (rav_regex.test(ms)) { // WHILE RAV REGEX TEST MS
                ms = ms.replace(rav_regex, ''); // MS IS MS REPLACE RAV REGEX, ''
            } // WHILE RAV REGEX TEST MS
            ms = ms.replace(/\d+\.(\.\.)?/g, ''); // MS IS MS REPLACE /\d+\.(\.\.)?/g, ''
            ms = ms.replace(/\.\.\./g, ''); // MS IS MS REPLACE /\.\.\./g, ''
            ms = ms.replace(/\$\d+/g, ''); // MS IS MS REPLACE /\$\d+/g, ''
            var moves = trim(ms).split(new RegExp(/\s+/)); // MOVES IS TRIM MS SPLIT NEW REGEXP /\s+/
            moves = moves.join(',').replace(/,,+/g, ',').split(','); // MOVES IS MOVES JOIN ',' REPLACE /,,+/g, ',' SPLIT ','
            var move = ''; // MOVE IS ''
            for (var half_move = 0; half_move < moves.length - 1; half_move++) { // FOR LOOP TO CHECK MOVES
                move = move_from_san(moves[half_move], sloppy); // MOVE IS MOVE FROM SAN MOVES HALF MOVE SLOPPY
                if (move == null) { // IF MOVE IS NULL
                    return false; // RETURN FALSE
                } else { // ELSE
                    make_move(move); // MAKE MOVE MOVE
                } // ELSE
            } // FOR LOOP TO CHECK MOVES
            move = moves[moves.length - 1]; // MOVE IS MOVES MOVES LENGTH - 1
            if (POSSIBLE_RESULTS.indexOf(move) > -1) { // IF POSSIBLE RESULTS INDEX OF MOVE IS GREATER THAN -1
                if (has_keys(header) && typeof header.Result === 'undefined') { // IF HAS KEYS HEADER AND TYPEOF HEADER RESULT IS UNDEFINED
                    set_header(['Result', move]); // SET HEADER 'RESULT', MOVE
                } // IF HAS KEYS HEADER AND TYPEOF HEADER RESULT IS UNDEFINED
            } else { // ELSE
                move = move_from_san(move, sloppy); // MOVE IS MOVE FROM SAN MOVE SLOPPY
                if (move == null) { // IF MOVE IS NULL
                    return false; // RETURN FALSE
                } else { // ELSE
                    make_move(move); // MAKE MOVE MOVE
                } // ELSE
            } // ELSE
            return true; // RETURN TRUE
        }, // LOAD PGN FUNCTION
        header: function () { // HEADER FUNCTION
            return set_header(arguments); // RETURN SET HEADER ARGUMENTS
        }, // HEADER FUNCTION
        ascii: function () { // ASCII FUNCTION
            return ascii(); // RETURN ASCII
        }, // ASCII FUNCTION
        turn: function () { // TURN FUNCTION
            return turn; // RETURN TURN
        }, // TURN FUNCTION
        move: function (move, options) { // MOVE FUNCTION: IT'S A WRAPPER FOR MAKE_MOVE, IT WILL CHECK FOR LEGAL MOVES, AND UNDO ILLEGAL MOVES, IT RETURNS THE MOVE OBJECT IF THE MOVE WAS MADE, OTHERWISE NULL
            var sloppy = (typeof options !== 'undefined' && 'sloppy' in options) ?
                options.sloppy : false; // SLOPPY IS TYPEOF OPTIONS IS NOT UNDEFINED AND 'SLOPPY' IN OPTIONS ? OPTIONS SLOPPY : FALSE
            var move_obj = null; // MOVE OBJ IS NULL
            if (typeof move === 'string') { // IF TYPEOF MOVE IS STRING
                move_obj = move_from_san(move, sloppy); // MOVE OBJ IS MOVE FROM SAN MOVE SLOPPY
            } else if (typeof move === 'object') { // ELSE IF TYPEOF MOVE IS OBJECT
                var moves = generate_moves(); // MOVES IS GENERATE MOVES
                for (var i = 0, len = moves.length; i < len; i++) { // FOR LOOP TO CHECK MOVES
                    if (move.from === algebraic(moves[i].from) &&
                        move.to === algebraic(moves[i].to) &&
                        (!('promotion' in moves[i]) ||
                            move.promotion === moves[i].promotion)) { // IF MOVE FROM IS ALGEBRAIC MOVES I FROM AND MOVE TO IS ALGEBRAIC MOVES I TO AND NOT 'PROMOTION' IN MOVES I OR MOVE PROMOTION IS MOVES I PROMOTION
                        move_obj = moves[i]; // MOVE OBJ IS MOVES I
                        break; // BREAK
                    } // IF MOVE FROM IS ALGEBRAIC MOVES I FROM AND MOVE TO IS ALGEBRAIC MOVES I TO AND NOT 'PROMOTION' IN MOVES I OR MOVE PROMOTION IS MOVES I PROMOTION
                } // FOR LOOP TO CHECK MOVES
            } // ELSE IF TYPEOF MOVE IS OBJECT
            if (!move_obj) { // IF NOT MOVE OBJ
                return null; // RETURN NULL
            } // IF NOT MOVE OBJ
            var pretty_move = make_pretty(move_obj); // PRETTY MOVE IS MAKE PRETTY MOVE OBJ
            make_move(move_obj); // MAKE MOVE MOVE OBJ
            return pretty_move; // RETURN PRETTY MOVE
        }, // MOVE FUNCTION
        ugly_move: function (move_obj, options) { // UGLY MOVE FUNCTION
            var pretty_move = make_pretty(move_obj); // PRETTY MOVE IS MAKE PRETTY MOVE OBJ
            make_move(move_obj); // MAKE MOVE MOVE OBJ
            return pretty_move; // RETURN PRETTY MOVE
        }, // UGLY MOVE FUNCTION
        undo: function () { // UNDO FUNCTION
            var move = undo_move(); // MOVE IS UNDO MOVE
            return (move) ? make_pretty(move) : null; // RETURN MOVE ? MAKE PRETTY MOVE : NULL
        }, // UNDO FUNCTION
        clear: function () { // CLEAR FUNCTION
            return clear(); // RETURN CLEAR
        }, // CLEAR FUNCTION
        put: function (piece, square) { // PUT FUNCTION
            return put(piece, square); // RETURN PUT PIECE SQUARE
        }, // PUT FUNCTION
        get: function (square) { // GET FUNCTION
            return get(square); // RETURN GET SQUARE
        }, // GET FUNCTION
        remove: function (square) { // REMOVE FUNCTION
            return remove(square); // RETURN REMOVE SQUARE
        }, // REMOVE FUNCTION
        perft: function (depth) { // PERFT FUNCTION
            return perft(depth); // RETURN PERFT DEPTH
        }, // PERFT FUNCTION
        square_color: function (square) { // SQUARE COLOR FUNCTION
            if (square in SQUARES) { // IF SQUARE IN SQUARES
                var sq_0x88 = SQUARES[square]; // SQ 0X88 IS SQUARES SQUARE
                return ((rank(sq_0x88) + file(sq_0x88)) % 2 === 0) ? 'light' : 'dark'; // RETURN RANK SQ 0X88 + FILE SQ 0X88 % 2 === 0 ? 'LIGHT' : 'DARK'
            } // IF SQUARE IN SQUARES
            return null; // RETURN NULL
        }, // SQUARE COLOR FUNCTION
        history: function (options) { // HISTORY FUNCTION: IT CAN BE CALLED WITH AN OPTIONAL BOOLEAN ARGUMENT TO GET A SAN REPRESENTATION OF THE MOVE HISTORY; OTHERWISE, IT RETURNS AN ARRAY OF MOVE OBJECTS
            var reversed_history = []; // REVERSED HISTORY IS ARRAY
            var move_history = []; // MOVE HISTORY IS ARRAY
            var verbose = (typeof options !== 'undefined' && 'verbose' in options &&
                options.verbose); // VERBOSE IS TYPEOF OPTIONS IS NOT UNDEFINED AND 'VERBOSE' IN OPTIONS AND OPTIONS VERBOSE
            while (history.length > 0) { // WHILE HISTORY LENGTH IS GREATER THAN 0
                reversed_history.push(undo_move()); // PUSH UNDO MOVE TO REVERSED HISTORY
            } // WHILE HISTORY LENGTH IS GREATER THAN 0
            while (reversed_history.length > 0) { // WHILE REVERSED HISTORY LENGTH IS GREATER THAN 0
                var move = reversed_history.pop(); // MOVE IS REVERSED HISTORY POP
                if (verbose) { // IF VERBOSE
                    move_history.push(make_pretty(move)); // PUSH MAKE PRETTY MOVE TO MOVE HISTORY
                } else { // ELSE
                    move_history.push(move_to_san(move)); // PUSH MOVE TO SAN MOVE TO MOVE HISTORY
                } // ELSE
                make_move(move); // MAKE MOVE MOVE
            } // WHILE REVERSED HISTORY LENGTH IS GREATER THAN 0
            return move_history; // RETURN MOVE HISTORY
        } // HISTORY FUNCTION
    }; // RETURN OBJECT
}; // CHESS FUNCTION

if (typeof exports !== 'undefined') exports.Chess = Chess;
if (typeof define !== 'undefined') define(function () { return Chess; });