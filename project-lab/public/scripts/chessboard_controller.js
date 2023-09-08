; (function () { // CREATE LOCAL SCOPE
  'use strict'; // STRICT MODE
  var COLUMNS = 'abcdefgh'.split(''); // ARRAY OF COLUMNS

  function validMove(move) { // VALIDATE MOVE
    if (typeof move !== 'string') return false; // IF MOVE IS NOT STRING RETURN FALSE
    var tmp = move.split('-'); // SPLIT MOVE BY DASH
    if (tmp.length !== 2) return false; // IF LENGTH IS NOT 2 RETURN FALSE
    return (validSquare(tmp[0]) === true && validSquare(tmp[1]) === true); // RETURN VALID SQUARE
  } // END FUNCTION

  function validSquare(square) { // VALIDATE SQUARE
    if (typeof square !== 'string') return false; // IF SQUARE IS NOT STRING RETURN FALSE
    return (square.search(/^[a-h][1-8]$/) !== -1); // RETURN SQUARE
  } // END FUNCTION

  function validPieceCode(code) { // VALIDATE PIECE CODE
    if (typeof code !== 'string') return false; // IF CODE IS NOT STRING RETURN FALSE
    return (code.search(/^[bw][KQRNBP]$/) !== -1); // RETURN CODE
  } // END FUNCTION

  function validFen(fen) { // VALIDATE FEN
    if (typeof fen !== 'string') return false; // IF FEN IS NOT STRING RETURN FALSE
    fen = fen.replace(/ .+$/, ''); // REPLACE FEN
    var chunks = fen.split('/'); // SPLIT FEN BY SLASH
    if (chunks.length !== 8) return false; // IF LENGTH IS NOT 8 RETURN FALSE
    for (var i = 0; i < 8; i++) { // LOOP THROUGH 8
      if (chunks[i] === '' ||
        chunks[i].length > 8 ||
        chunks[i].search(/[^kqrbnpKQRNBP1-8]/) !== -1) { // IF CHUNKS IS EMPTY OR LENGTH IS GREATER THAN 8 OR CHUNKS SEARCH IS NOT -1
        return false; // RETURN FALSE
      } // END IF
    } // END LOOP
    return true; // RETURN TRUE
  } // END FUNCTION

  function validPositionObject(pos) { // VALIDATE POSITION OBJECT
    if (typeof pos !== 'object') return false; // IF POS IS NOT OBJECT RETURN FALSE
    for (var i in pos) { // LOOP THROUGH POS
      if (pos.hasOwnProperty(i) !== true) continue; // IF POS DOES NOT HAVE PROPERTY CONTINUE
      if (validSquare(i) !== true || validPieceCode(pos[i]) !== true) { // IF VALID SQUARE IS NOT TRUE OR VALID PIECE CODE IS NOT TRUE
        return false; // RETURN FALSE
      } // END IF
    } // END LOOP
    return true; // RETURN TRUE
  } // END FUNCTION

  function fenToPieceCode(piece) { // FEN TO PIECE CODE
    if (piece.toLowerCase() === piece) { // IF PIECE LOWERCASE IS EQUAL TO PIECE
      return 'b' + piece.toUpperCase(); // RETURN B + PIECE UPPERCASE
    } // END IF
    return 'w' + piece.toUpperCase(); // RETURN W + PIECE UPPERCASE
  } // END FUNCTION

  function pieceCodeToFen(piece) { // PIECE CODE TO FEN
    var tmp = piece.split(''); // SPLIT PIECE
    if (tmp[0] === 'w') { // IF TMP 0 IS W
      return tmp[1].toUpperCase(); // RETURN TMP 1 UPPERCASE
    } // END IF
    return tmp[1].toLowerCase(); // RETURN TMP 1 LOWERCASE
  } // END FUNCTION

  function fenToObj(fen) { // FEN TO OBJECT
    if (validFen(fen) !== true) { // IF VALID FEN IS NOT TRUE
      return false; // RETURN FALSE
    } // END IF
    fen = fen.replace(/ .+$/, ''); // REPLACE FEN
    var rows = fen.split('/'); // SPLIT FEN BY SLASH
    var position = {}; // POSITION OBJECT
    var currentRow = 8; // CURRENT ROW 
    for (var i = 0; i < 8; i++) { // LOOP THROUGH 8
      var row = rows[i].split(''); // SPLIT ROW
      var colIndex = 0; // COLUMN INDEX
      for (var j = 0; j < row.length; j++) { // LOOP THROUGH ROW
        if (row[j].search(/[1-8]/) !== -1) { // IF ROW SEARCH IS NOT -1
          var emptySquares = parseInt(row[j], 10); // EMPTY SQUARES
          colIndex += emptySquares; // COLUMN INDEX PLUS EMPTY SQUARES
        } // END IF
        else { // ELSE
          var square = COLUMNS[colIndex] + currentRow; // SQUARE
          position[square] = fenToPieceCode(row[j]); // POSITION SQUARE
          colIndex++; // COLUMN INDEX PLUS 1
        } // END ELSE
      } // END LOOP
      currentRow--; // CURRENT ROW MINUS 1
    } // END LOOP
    return position; // RETURN POSITION
  } // END FUNCTION

  function objToFen(obj) { // OBJECT TO FEN
    if (validPositionObject(obj) !== true) { // IF VALID POSITION OBJECT IS NOT TRUE
      return false; // RETURN FALSE
    } // END IF
    var fen = ''; // FEN
    var currentRow = 8; // CURRENT ROW
    for (var i = 0; i < 8; i++) { // LOOP THROUGH 8
      for (var j = 0; j < 8; j++) { // LOOP THROUGH 8
        var square = COLUMNS[j] + currentRow; // SQUARE
        if (obj.hasOwnProperty(square) === true) { // IF OBJECT HAS PROPERTY SQUARE
          fen += pieceCodeToFen(obj[square]); // FEN PLUS PIECE CODE TO FEN
        } // END IF
        else { // ELSE
          fen += '1'; // FEN PLUS 1
        } // END ELSE
      } // END LOOP
      if (i !== 7) { // IF I IS NOT 7
        fen += '/'; // FEN PLUS SLASH
      } // END IF
      currentRow--; // CURRENT ROW MINUS 1
    } // END LOOP
    fen = fen.replace(/11111111/g, '8');
    fen = fen.replace(/1111111/g, '7'); 
    fen = fen.replace(/111111/g, '6'); 
    fen = fen.replace(/11111/g, '5');
    fen = fen.replace(/1111/g, '4');  
    fen = fen.replace(/111/g, '3');
    fen = fen.replace(/11/g, '2');
    return fen; // RETURN FEN
  } // END FUNCTION

  window['ChessBoard'] = window['ChessBoard'] || function (containerElOrId, cfg) { // CHESSBOARD
    'use strict'; // STRICT MODE
    cfg = cfg || {}; // CFG

    var MINIMUM_JQUERY_VERSION = '1.7.0', // MINIMUM JQUERY VERSION
      START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', // START FEN
      START_POSITION = fenToObj(START_FEN); // START POSITION

    var CSS = { // CSS
      alpha: 'alpha-d2270', // ALPHA
      black: 'black-3c85d', // BLACK
      board: 'board-b72b1', // BOARD
      chessboard: 'chessboard-63f37', // CHESSBOARD
      clearfix: 'clearfix-7da63', // CLEARFIX
      highlight1: 'highlight1-32417', // HIGHLIGHT1
      highlight2: 'highlight2-9c5d2', // HIGHLIGHT2
      notation: 'notation-322f9', // NOTATION
      numeric: 'numeric-fc462', // NUMERIC
      piece: 'piece-417db', // PIECE
      row: 'row-5277c', // ROW
      sparePieces: 'spare-pieces-7492f', // SPARE PIECES
      sparePiecesBottom: 'spare-pieces-bottom-ae20f', // SPARE PIECES BOTTOM
      sparePiecesTop: 'spare-pieces-top-4028b', // SPARE PIECES TOP
      square: 'square-55d63', // SQUARE
      white: 'white-1e1d7' // WHITE
    }; // END CSS

    var containerEl, // CONTAINER EL
      boardEl, // BOARD EL
      draggedPieceEl, // DRAGGED PIECE EL
      sparePiecesTopEl, // SPARE PIECES TOP EL
      sparePiecesBottomEl; // SPARE PIECES BOTTOM EL

    var widget = {}; // WIDGET

    var ANIMATION_HAPPENING = false, // ANIMATION HAPPENING
      BOARD_BORDER_SIZE = 2, // BOARD BORDER SIZE
      CURRENT_ORIENTATION = 'white', // CURRENT ORIENTATION
      CURRENT_POSITION = {}, // CURRENT POSITION
      SQUARE_SIZE, // SQUARE SIZE
      DRAGGED_PIECE, // DRAGGED PIECE
      DRAGGED_PIECE_LOCATION, // DRAGGED PIECE LOCATION
      DRAGGED_PIECE_SOURCE, // DRAGGED PIECE SOURCE
      DRAGGING_A_PIECE = false, // DRAGGING A PIECE
      SPARE_PIECE_ELS_IDS = {}, // SPARE PIECE ELS IDS
      SQUARE_ELS_IDS = {}, // SQUARE ELS IDS
      SQUARE_ELS_OFFSETS; // SQUARE ELS OFFSETS

    function createId() { // CREATE ID
      return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function (c) { // RETURN XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX
        var r = Math.random() * 16 | 0; // R: MATH.RANDOM TIMES 16
        return r.toString(16); // RETURN R TO STRING 16
      }); // END RETURN
    } // END FUNCTION

    function deepCopy(thing) { // DEEP COPY
      return JSON.parse(JSON.stringify(thing)); // RETURN JSON.PARSE(JSON.STRINGIFY(THING))
    } // END FUNCTION

    function parseSemVer(version) { // PARSE SEM VER
      var tmp = version.split('.'); // TMP
      return { // RETURN
        major: parseInt(tmp[0], 10), // MAJOR
        minor: parseInt(tmp[1], 10), // MINOR
        patch: parseInt(tmp[2], 10) // PATCH
      }; // END RETURN
    } // END FUNCTION

    function compareSemVer(version, minimum) { // COMPARE SEM VER
      version = parseSemVer(version); // VERSION
      minimum = parseSemVer(minimum); // MINIMUM
      var versionNum = (version.major * 10000 * 10000) +
        (version.minor * 10000) + version.patch; // VERSION NUM
      var minimumNum = (minimum.major * 10000 * 10000) +
        (minimum.minor * 10000) + minimum.patch; // MINIMUM NUM
      return (versionNum >= minimumNum); // RETURN VERSION NUM GREATER THAN OR EQUAL TO MINIMUM NUM
    } // END FUNCTION

    function error(code, msg, obj) { // ERROR
      if (cfg.hasOwnProperty('showErrors') !== true ||
        cfg.showErrors === false) { // IF CFG HAS OWN PROPERTY SHOW ERRORS NOT EQUAL TO TRUE OR CFG SHOW ERRORS EQUALS FALSE
        return; // RETURN
      } // END IF

      var errorText = 'ChessBoard Error ' + code + ': ' + msg; // ERROR TEXT

      if (cfg.showErrors === 'console' &&
        typeof console === 'object' &&
        typeof console.log === 'function') { // IF CFG SHOW ERRORS EQUALS CONSOLE AND TYPEOF CONSOLE EQUALS OBJECT AND TYPEOF CONSOLE.LOG EQUALS FUNCTION
        console.log(errorText); // CONSOLE.LOG ERROR TEXT
        if (arguments.length >= 2) { // IF ARGUMENTS.LENGTH GREATER THAN OR EQUAL TO 2
          console.log(obj); // CONSOLE.LOG OBJ
        } // END IF
        return; // RETURN
      } // END IF

      if (cfg.showErrors === 'alert') { // IF CFG SHOW ERRORS EQUALS ALERT
        if (obj) { // IF OBJ
          errorText += '\n\n' + JSON.stringify(obj); // ERROR TEXT PLUS EQUALS NEW LINE NEW LINE PLUS JSON.STRINGIFY(OBJ)
        } // END IF
        window.alert(errorText); // WINDOW ALERT ERROR TEXT
        return; // RETURN
      } // END IF

      if (typeof cfg.showErrors === 'function') { // IF TYPEOF CFG SHOW ERRORS EQUALS FUNCTION
        cfg.showErrors(code, msg, obj); // CFG SHOW ERRORS CODE, MSG, OBJ
      } // END IF
    } // END FUNCTION

    function checkDeps() { // CHECK DEPS

      if (typeof containerElOrId === 'string') { // IF TYPEOF CONTAINER EL OR ID EQUALS STRING

        if (containerElOrId === '') { // IF CONTAINER EL OR ID EQUALS EMPTY STRING
          window.alert('ChessBoard Error 1001: ' +
            'The first argument to ChessBoard() cannot be an empty string.' +
            '\n\nExiting...'); // WINDOW ALERT CHESSBOARD ERROR 1001: THE FIRST ARGUMENT TO CHESSBOARD() CANNOT BE AN EMPTY STRING. EXITING...
          return false; // RETURN FALSE
        } // END IF

        var el = document.getElementById(containerElOrId); // EL EQUALS DOCUMENT.GETELEMENTBYID(CONTAINER EL OR ID)
        if (!el) { // IF NOT EL
          window.alert('ChessBoard Error 1002: Element with id "' +
            containerElOrId + '" does not exist in the DOM.' +
            '\n\nExiting...'); // WINDOW ALERT CHESSBOARD ERROR 1002: ELEMENT WITH ID CONTAINER EL OR ID DOES NOT EXIST IN THE DOM. EXITING...
          return false; // RETURN FALSE
        } // END IF
        containerEl = $(el); // CONTAINER EL EQUALS JQUERY EL
      } // END IF
      else { // ELSE
        containerEl = $(containerElOrId); // CONTAINER EL EQUALS JQUERY CONTAINER EL OR ID
        if (containerEl.length !== 1) { // IF CONTAINER EL.LENGTH NOT EQUAL TO 1
          window.alert('ChessBoard Error 1003: The first argument to ' +
            'ChessBoard() must be an ID or a single DOM node.' +
            '\n\nExiting...'); // WINDOW ALERT CHESSBOARD ERROR 1003: THE FIRST ARGUMENT TO CHESSBOARD() MUST BE AN ID OR A SINGLE DOM NODE. EXITING...
          return false; // RETURN FALSE
        } // END IF
      } // END ELSE
      if (!window.JSON ||
        typeof JSON.stringify !== 'function' ||
        typeof JSON.parse !== 'function') { // IF NOT WINDOW.JSON OR TYPEOF JSON.STRINGIFY NOT EQUAL TO FUNCTION OR TYPEOF JSON.PARSE NOT EQUAL TO FUNCTION
        window.alert('ChessBoard Error 1004: JSON does not exist. ' +
          'Please include a JSON polyfill.\n\nExiting...'); // WINDOW ALERT CHESSBOARD ERROR 1004: JSON DOES NOT EXIST. PLEASE INCLUDE A JSON POLYFILL. EXITING...
        return false; // RETURN FALSE
      } // END IF
      if (!(typeof window.$ && $.fn && $.fn.jquery &&
        compareSemVer($.fn.jquery, MINIMUM_JQUERY_VERSION) === true)) { // IF NOT TYPEOF WINDOW.$ AND $.FN AND $.FN.JQUERY AND COMPARE SEM VER($.FN.JQUERY, MINIMUM JQUERY VERSION) EQUALS TRUE
        window.alert('ChessBoard Error 1005: Unable to find a valid version ' +
          'of jQuery. Please include jQuery ' + MINIMUM_JQUERY_VERSION + ' or ' +
          'higher on the page.\n\nExiting...'); // WINDOW ALERT CHESSBOARD ERROR 1005: UNABLE TO FIND A VALID VERSION OF JQUERY. PLEASE INCLUDE JQUERY MINIMUM JQUERY VERSION OR HIGHER ON THE PAGE. EXITING...
        return false; // RETURN FALSE
      } // END IF
      return true; // RETURN TRUE
    } // END FUNCTION

    function validAnimationSpeed(speed) { // VALID ANIMATION SPEED
      if (speed === 'fast' || speed === 'slow') { // IF SPEED EQUALS FAST OR SPEED EQUALS SLOW
        return true; // RETURN TRUE
      } // END IF
      if ((parseInt(speed, 10) + '') !== (speed + '')) { // IF ((PARSEINT(SPEED, 10) + '') NOT EQUAL TO (SPEED + ''))
        return false; // RETURN FALSE
      } // END IF
      return (speed >= 0); // RETURN SPEED GREATER THAN OR EQUAL TO 0
    } // END FUNCTION
    function expandConfig() { // EXPAND CONFIG
      if (typeof cfg === 'string' || validPositionObject(cfg) === true) { // IF TYPEOF CFG EQUALS STRING OR VALID POSITION OBJECT(CFG) EQUALS TRUE
        cfg = { // CFG
          position: cfg // POSITION EQUALS CFG
        }; // END CFG
      } // END IF
      if (cfg.orientation !== 'black') { // IF CFG ORIENTATION NOT EQUAL TO BLACK
        cfg.orientation = 'white'; // CFG ORIENTATION EQUALS WHITE
      } // END IF
      CURRENT_ORIENTATION = cfg.orientation; // CURRENT ORIENTATION EQUALS CFG ORIENTATION
      if (cfg.showNotation !== false) { // IF CFG SHOW NOTATION NOT EQUAL TO FALSE
        cfg.showNotation = true; // CFG SHOW NOTATION EQUALS TRUE
      } // END IF
      if (cfg.draggable !== true) { // IF CFG DRAGGABLE NOT EQUAL TO TRUE
        cfg.draggable = false; // CFG DRAGGABLE EQUALS FALSE
      } // END IF
      if (cfg.dropOffBoard !== 'trash') { // IF CFG DROP OFF BOARD NOT EQUAL TO TRASH
        cfg.dropOffBoard = 'snapback'; // CFG DROP OFF BOARD EQUALS SNAPBACK
      } // END IF
      if (cfg.sparePieces !== true) { // IF CFG SPARE PIECES NOT EQUAL TO TRUE
        cfg.sparePieces = false; // CFG SPARE PIECES EQUALS FALSE
      } // END IF
      if (cfg.sparePieces === true) { // IF CFG SPARE PIECES EQUALS TRUE
        cfg.draggable = true; // CFG DRAGGABLE EQUALS TRUE
      } // END IF
      if (cfg.hasOwnProperty('pieceTheme') !== true ||
        (typeof cfg.pieceTheme !== 'string' &&
          typeof cfg.pieceTheme !== 'function')) { // IF CFG HAS OWN PROPERTY PIECE THEME NOT EQUAL TO TRUE OR (TYPEOF CFG PIECE THEME NOT EQUAL TO STRING AND TYPEOF CFG PIECE THEME NOT EQUAL TO FUNCTION)
        cfg.pieceTheme = 'assets/chess-pieces/{piece}.png'; // CFG PIECE THEME EQUALS ASSETS/CHESS-PIECES/{PIECE}.PNG
      } // END IF
      if (cfg.hasOwnProperty('appearSpeed') !== true ||
        validAnimationSpeed(cfg.appearSpeed) !== true) { // IF CFG HAS OWN PROPERTY APPEAR SPEED NOT EQUAL TO TRUE OR VALID ANIMATION SPEED(CFG.APPEAR SPEED) NOT EQUAL TO TRUE
        cfg.appearSpeed = 200; // CFG APPEAR SPEED EQUALS 200
      } // END IF
      if (cfg.hasOwnProperty('moveSpeed') !== true ||
        validAnimationSpeed(cfg.moveSpeed) !== true) { // IF CFG HAS OWN PROPERTY MOVE SPEED NOT EQUAL TO TRUE OR VALID ANIMATION SPEED(CFG.MOVE SPEED) NOT EQUAL TO TRUE
        cfg.moveSpeed = 200; // CFG MOVE SPEED EQUALS 200
      } // END IF
      if (cfg.hasOwnProperty('snapbackSpeed') !== true ||
        validAnimationSpeed(cfg.snapbackSpeed) !== true) { // IF CFG HAS OWN PROPERTY SNAPBACK SPEED NOT EQUAL TO TRUE OR VALID ANIMATION SPEED(CFG.SNAPBACK SPEED) NOT EQUAL TO TRUE
        cfg.snapbackSpeed = 50; // CFG SNAPBACK SPEED EQUALS 50
      } // END IF
      if (cfg.hasOwnProperty('snapSpeed') !== true ||
        validAnimationSpeed(cfg.snapSpeed) !== true) { // IF CFG HAS OWN PROPERTY SNAP SPEED NOT EQUAL TO TRUE OR VALID ANIMATION SPEED(CFG.SNAP SPEED) NOT EQUAL TO TRUE
        cfg.snapSpeed = 25; // CFG SNAP SPEED EQUALS 25
      } // END IF
      if (cfg.hasOwnProperty('trashSpeed') !== true ||
        validAnimationSpeed(cfg.trashSpeed) !== true) { // IF CFG HAS OWN PROPERTY TRASH SPEED NOT EQUAL TO TRUE OR VALID ANIMATION SPEED(CFG.TRASH SPEED) NOT EQUAL TO TRUE
        cfg.trashSpeed = 100; // CFG TRASH SPEED EQUALS 100
      } // END IF
      if (cfg.hasOwnProperty('position') === true) { // IF CFG HAS OWN PROPERTY POSITION EQUALS TRUE
        if (cfg.position === 'start') { // IF CFG POSITION EQUALS START
          CURRENT_POSITION = deepCopy(START_POSITION); // CURRENT POSITION EQUALS DEEP COPY(START POSITION)
        } // END IF
        else if (validFen(cfg.position) === true) { // ELSE IF VALID FEN(CFG POSITION) EQUALS TRUE
          CURRENT_POSITION = fenToObj(cfg.position); // CURRENT POSITION EQUALS FEN TO OBJ(CFG POSITION)
        } // END IF
        else if (validPositionObject(cfg.position) === true) { // ELSE IF VALID POSITION OBJECT(CFG POSITION) EQUALS TRUE
          CURRENT_POSITION = deepCopy(cfg.position); // CURRENT POSITION EQUALS DEEP COPY(CFG POSITION)
        } // END IF
        else { // ELSE
          error(7263, 'Invalid value passed to config.position.', cfg.position); // ERROR(7263, 'INVALID VALUE PASSED TO CONFIG.POSITION.', CFG.POSITION)
        } // END ELSE
      } // END IF
      return true; // RETURN TRUE
    } // END FUNCTION

    function calculateSquareSize() { // CALCULATE SQUARE SIZE
      var containerWidth = parseInt(containerEl.css('width'), 10); // CONTAINER WIDTH EQUALS PARSEINT(CONTAINER EL.CSS('WIDTH'), 10)
      if (!containerWidth || containerWidth <= 0) { // IF NOT CONTAINER WIDTH OR CONTAINER WIDTH LESS THAN OR EQUAL TO 0
        return 0; // RETURN 0
      } // END IF
      var boardWidth = containerWidth - 1; // BOARD WIDTH EQUALS CONTAINER WIDTH - 1
      while (boardWidth % 8 !== 0 && boardWidth > 0) { // WHILE BOARD WIDTH MOD 8 NOT EQUAL TO 0 AND BOARD WIDTH GREATER THAN 0
        boardWidth--; // BOARD WIDTH--
      } // END WHILE
      return (boardWidth / 8); // RETURN (BOARD WIDTH / 8)
    } // END FUNCTION

    function createElIds() {

      for (var i = 0; i < COLUMNS.length; i++) {
        for (var j = 1; j <= 8; j++) {
          var square = COLUMNS[i] + j;
          SQUARE_ELS_IDS[square] = square + '-' + createId();
        }
      }

      var pieces = 'KQRBNP'.split('');
      for (var i = 0; i < pieces.length; i++) {
        var whitePiece = 'w' + pieces[i];
        var blackPiece = 'b' + pieces[i];
        SPARE_PIECE_ELS_IDS[whitePiece] = whitePiece + '-' + createId();
        SPARE_PIECE_ELS_IDS[blackPiece] = blackPiece + '-' + createId();
      }
    }

    function buildBoardContainer() {
      var html = '<div class="' + CSS.chessboard + '">';

      if (cfg.sparePieces === true) {
        html += '<div class="' + CSS.sparePieces + ' ' +
          CSS.sparePiecesTop + '"></div>';
      }

      html += '<div class="' + CSS.board + '"></div>';

      if (cfg.sparePieces === true) {
        html += '<div class="' + CSS.sparePieces + ' ' +
          CSS.sparePiecesBottom + '"></div>';
      }

      html += '</div>';

      return html;
    }

    function buildBoard(orientation) {
      if (orientation !== 'black') {
        orientation = 'white';
      }

      var html = '';

      var alpha = deepCopy(COLUMNS);
      var row = 8;
      if (orientation === 'black') {
        alpha.reverse();
        row = 1;
      }

      var squareColor = 'white';
      for (var i = 0; i < 8; i++) {
        html += '<div class="' + CSS.row + '">';
        for (var j = 0; j < 8; j++) {
          var square = alpha[j] + row;

          html += '<div class="' + CSS.square + ' ' + CSS[squareColor] + ' ' +
            'square-' + square + '" ' +
            'style="width: ' + SQUARE_SIZE + 'px; height: ' + SQUARE_SIZE + 'px" ' +
            'id="' + SQUARE_ELS_IDS[square] + '" ' +
            'data-square="' + square + '">';

          if (cfg.showNotation === true) {

            if ((orientation === 'white' && row === 1) ||
              (orientation === 'black' && row === 8)) {
              html += '<div class="' + CSS.notation + ' ' + CSS.alpha + '">' +
                alpha[j] + '</div>';
            }

            if (j === 0) {
              html += '<div class="' + CSS.notation + ' ' + CSS.numeric + '">' +
                row + '</div>';
            }
          }

          html += '</div>';

          squareColor = (squareColor === 'white' ? 'black' : 'white');
        }
        html += '<div class="' + CSS.clearfix + '"></div></div>';

        squareColor = (squareColor === 'white' ? 'black' : 'white');

        if (orientation === 'white') {
          row--;
        }
        else {
          row++;
        }
      }

      return html;
    }

    function buildPieceImgSrc(piece) {
      if (typeof cfg.pieceTheme === 'function') {
        return cfg.pieceTheme(piece);
      }

      if (typeof cfg.pieceTheme === 'string') {
        return cfg.pieceTheme.replace(/{piece}/g, piece);
      }

      error(8272, 'Unable to build image source for cfg.pieceTheme.');
      return '';
    }

    function buildPiece(piece, hidden, id) {
      var html = '<img src="' + buildPieceImgSrc(piece) + '" ';
      if (id && typeof id === 'string') {
        html += 'id="' + id + '" ';
      }
      html += 'alt="" ' +
        'class="' + CSS.piece + '" ' +
        'data-piece="' + piece + '" ' +
        'style="width: ' + SQUARE_SIZE + 'px;' +
        'height: ' + SQUARE_SIZE + 'px;';
      if (hidden === true) {
        html += 'display:none;';
      }
      html += '" />';

      return html;
    }

    function buildSparePieces(color) {
      var pieces = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'];
      if (color === 'black') {
        pieces = ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
      }

      var html = '';
      for (var i = 0; i < pieces.length; i++) {
        html += buildPiece(pieces[i], false, SPARE_PIECE_ELS_IDS[pieces[i]]);
      }

      return html;
    }

    function animateSquareToSquare(src, dest, piece, completeFn) {

      var srcSquareEl = $('#' + SQUARE_ELS_IDS[src]);
      var srcSquarePosition = srcSquareEl.offset();
      var destSquareEl = $('#' + SQUARE_ELS_IDS[dest]);
      var destSquarePosition = destSquareEl.offset();

      var animatedPieceId = createId();
      $('body').append(buildPiece(piece, true, animatedPieceId));
      var animatedPieceEl = $('#' + animatedPieceId);
      animatedPieceEl.css({
        display: '',
        position: 'absolute',
        top: srcSquarePosition.top,
        left: srcSquarePosition.left
      });

      srcSquareEl.find('.' + CSS.piece).remove();

      var complete = function () {

        destSquareEl.append(buildPiece(piece));

        animatedPieceEl.remove();

        if (typeof completeFn === 'function') {
          completeFn();
        }
      };

      var opts = {
        duration: cfg.moveSpeed,
        complete: complete
      };
      animatedPieceEl.animate(destSquarePosition, opts);
    }

    function animateSparePieceToSquare(piece, dest, completeFn) {
      var srcOffset = $('#' + SPARE_PIECE_ELS_IDS[piece]).offset();
      var destSquareEl = $('#' + SQUARE_ELS_IDS[dest]);
      var destOffset = destSquareEl.offset();

      var pieceId = createId();
      $('body').append(buildPiece(piece, true, pieceId));
      var animatedPieceEl = $('#' + pieceId);
      animatedPieceEl.css({
        display: '',
        position: 'absolute',
        left: srcOffset.left,
        top: srcOffset.top
      });

      var complete = function () {

        destSquareEl.find('.' + CSS.piece).remove();
        destSquareEl.append(buildPiece(piece));

        animatedPieceEl.remove();

        if (typeof completeFn === 'function') {
          completeFn();
        }
      };

      var opts = {
        duration: cfg.moveSpeed,
        complete: complete
      };
      animatedPieceEl.animate(destOffset, opts);
    }

    function doAnimations(a, oldPos, newPos) {
      ANIMATION_HAPPENING = true;

      var numFinished = 0;
      function onFinish() {
        numFinished++;

        if (numFinished !== a.length) return;

        drawPositionInstant();
        ANIMATION_HAPPENING = false;

        if (cfg.hasOwnProperty('onMoveEnd') === true &&
          typeof cfg.onMoveEnd === 'function') {
          cfg.onMoveEnd(deepCopy(oldPos), deepCopy(newPos));
        }
      }

      for (var i = 0; i < a.length; i++) {

        if (a[i].type === 'clear') {
          $('#' + SQUARE_ELS_IDS[a[i].square] + ' .' + CSS.piece)
            .fadeOut(cfg.trashSpeed, onFinish);
        }

        if (a[i].type === 'add' && cfg.sparePieces !== true) {
          $('#' + SQUARE_ELS_IDS[a[i].square])
            .append(buildPiece(a[i].piece, true))
            .find('.' + CSS.piece)
            .fadeIn(cfg.appearSpeed, onFinish);
        }

        if (a[i].type === 'add' && cfg.sparePieces === true) {
          animateSparePieceToSquare(a[i].piece, a[i].square, onFinish);
        }

        if (a[i].type === 'move') {
          animateSquareToSquare(a[i].source, a[i].destination, a[i].piece,
            onFinish);
        }
      }
    }

    function squareDistance(s1, s2) {
      s1 = s1.split('');
      var s1x = COLUMNS.indexOf(s1[0]) + 1;
      var s1y = parseInt(s1[1], 10);

      s2 = s2.split('');
      var s2x = COLUMNS.indexOf(s2[0]) + 1;
      var s2y = parseInt(s2[1], 10);

      var xDelta = Math.abs(s1x - s2x);
      var yDelta = Math.abs(s1y - s2y);

      if (xDelta >= yDelta) return xDelta;
      return yDelta;
    }

    function createRadius(square) {
      var squares = [];

      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          var s = COLUMNS[i] + (j + 1);

          if (square === s) continue;

          squares.push({
            square: s,
            distance: squareDistance(square, s)
          });
        }
      }

      squares.sort(function (a, b) {
        return a.distance - b.distance;
      });

      var squares2 = [];
      for (var i = 0; i < squares.length; i++) {
        squares2.push(squares[i].square);
      }

      return squares2;
    }

    function findClosestPiece(position, piece, square) {

      var closestSquares = createRadius(square);

      for (var i = 0; i < closestSquares.length; i++) {
        var s = closestSquares[i];

        if (position.hasOwnProperty(s) === true && position[s] === piece) {
          return s;
        }
      }

      return false;
    }

    function calculateAnimations(pos1, pos2) {

      pos1 = deepCopy(pos1);
      pos2 = deepCopy(pos2);

      var animations = [];
      var squaresMovedTo = {};

      for (var i in pos2) {
        if (pos2.hasOwnProperty(i) !== true) continue;

        if (pos1.hasOwnProperty(i) === true && pos1[i] === pos2[i]) {
          delete pos1[i];
          delete pos2[i];
        }
      }

      for (var i in pos2) {
        if (pos2.hasOwnProperty(i) !== true) continue;

        var closestPiece = findClosestPiece(pos1, pos2[i], i);
        if (closestPiece !== false) {
          animations.push({
            type: 'move',
            source: closestPiece,
            destination: i,
            piece: pos2[i]
          });

          delete pos1[closestPiece];
          delete pos2[i];
          squaresMovedTo[i] = true;
        }
      }

      for (var i in pos2) {
        if (pos2.hasOwnProperty(i) !== true) continue;

        animations.push({
          type: 'add',
          square: i,
          piece: pos2[i]
        })

        delete pos2[i];
      }

      for (var i in pos1) {
        if (pos1.hasOwnProperty(i) !== true) continue;

        if (squaresMovedTo.hasOwnProperty(i) === true) continue;

        animations.push({
          type: 'clear',
          square: i,
          piece: pos1[i]
        });

        delete pos1[i];
      }

      return animations;
    }

    function drawPositionInstant() {

      boardEl.find('.' + CSS.piece).remove();

      for (var i in CURRENT_POSITION) {
        if (CURRENT_POSITION.hasOwnProperty(i) !== true) continue;

        $('#' + SQUARE_ELS_IDS[i]).append(buildPiece(CURRENT_POSITION[i]));
      }
    }

    function drawBoard() {
      boardEl.html(buildBoard(CURRENT_ORIENTATION));
      drawPositionInstant();

      if (cfg.sparePieces === true) {
        if (CURRENT_ORIENTATION === 'white') {
          sparePiecesTopEl.html(buildSparePieces('black'));
          sparePiecesBottomEl.html(buildSparePieces('white'));
        }
        else {
          sparePiecesTopEl.html(buildSparePieces('white'));
          sparePiecesBottomEl.html(buildSparePieces('black'));
        }
      }
    }

    function calculatePositionFromMoves(position, moves) {
      position = deepCopy(position);

      for (var i in moves) {
        if (moves.hasOwnProperty(i) !== true) continue;

        if (position.hasOwnProperty(i) !== true) continue;

        var piece = position[i];
        delete position[i];
        position[moves[i]] = piece;
      }

      return position;
    }

    function setCurrentPosition(position) {
      var oldPos = deepCopy(CURRENT_POSITION);
      var newPos = deepCopy(position);
      var oldFen = objToFen(oldPos);
      var newFen = objToFen(newPos);

      if (oldFen === newFen) return;

      if (cfg.hasOwnProperty('onChange') === true &&
        typeof cfg.onChange === 'function') {
        cfg.onChange(oldPos, newPos);
      }

      CURRENT_POSITION = position;
    }

    function isXYOnSquare(x, y) {
      for (var i in SQUARE_ELS_OFFSETS) {
        if (SQUARE_ELS_OFFSETS.hasOwnProperty(i) !== true) continue;

        var s = SQUARE_ELS_OFFSETS[i];
        if (x >= s.left && x < s.left + SQUARE_SIZE &&
          y >= s.top && y < s.top + SQUARE_SIZE) {
          return i;
        }
      }

      return 'offboard';
    }

    function captureSquareOffsets() {
      SQUARE_ELS_OFFSETS = {};

      for (var i in SQUARE_ELS_IDS) {
        if (SQUARE_ELS_IDS.hasOwnProperty(i) !== true) continue;

        SQUARE_ELS_OFFSETS[i] = $('#' + SQUARE_ELS_IDS[i]).offset();
      }
    }

    function removeSquareHighlights() {
      boardEl.find('.' + CSS.square)
        .removeClass(CSS.highlight1 + ' ' + CSS.highlight2);
    }

    function snapbackDraggedPiece() {

      if (DRAGGED_PIECE_SOURCE === 'spare') {
        trashDraggedPiece();
        return;
      }

      removeSquareHighlights();

      function complete() {
        drawPositionInstant();
        draggedPieceEl.css('display', 'none');

        if (cfg.hasOwnProperty('onSnapbackEnd') === true &&
          typeof cfg.onSnapbackEnd === 'function') {
          cfg.onSnapbackEnd(DRAGGED_PIECE, DRAGGED_PIECE_SOURCE,
            deepCopy(CURRENT_POSITION), CURRENT_ORIENTATION);
        }
      }

      var sourceSquarePosition =
        $('#' + SQUARE_ELS_IDS[DRAGGED_PIECE_SOURCE]).offset();

      var opts = {
        duration: cfg.snapbackSpeed,
        complete: complete
      };
      draggedPieceEl.animate(sourceSquarePosition, opts);

      DRAGGING_A_PIECE = false;
    }

    function trashDraggedPiece() {
      removeSquareHighlights();

      var newPosition = deepCopy(CURRENT_POSITION);
      delete newPosition[DRAGGED_PIECE_SOURCE];
      setCurrentPosition(newPosition);

      drawPositionInstant();

      draggedPieceEl.fadeOut(cfg.trashSpeed);

      DRAGGING_A_PIECE = false;
    }

    function dropDraggedPieceOnSquare(square) {
      removeSquareHighlights();

      var newPosition = deepCopy(CURRENT_POSITION);
      delete newPosition[DRAGGED_PIECE_SOURCE];
      newPosition[square] = DRAGGED_PIECE;
      setCurrentPosition(newPosition);

      var targetSquarePosition = $('#' + SQUARE_ELS_IDS[square]).offset();

      var complete = function () {
        drawPositionInstant();
        draggedPieceEl.css('display', 'none');

        if (cfg.hasOwnProperty('onSnapEnd') === true &&
          typeof cfg.onSnapEnd === 'function') {
          cfg.onSnapEnd(DRAGGED_PIECE_SOURCE, square, DRAGGED_PIECE);
        }
      };

      var opts = {
        duration: cfg.snapSpeed,
        complete: complete
      };
      draggedPieceEl.animate(targetSquarePosition, opts);

      DRAGGING_A_PIECE = false;
    }

    function beginDraggingPiece(source, piece, x, y) {

      if (typeof cfg.onDragStart === 'function' &&
        cfg.onDragStart(source, piece,
          deepCopy(CURRENT_POSITION), CURRENT_ORIENTATION) === false) {
        return;
      }

      DRAGGING_A_PIECE = true;
      DRAGGED_PIECE = piece;
      DRAGGED_PIECE_SOURCE = source;

      if (source === 'spare') {
        DRAGGED_PIECE_LOCATION = 'offboard';
      }
      else {
        DRAGGED_PIECE_LOCATION = source;
      }

      captureSquareOffsets();

      draggedPieceEl.attr('src', buildPieceImgSrc(piece))
        .css({
          display: '',
          position: 'absolute',
          left: x - (SQUARE_SIZE / 2),
          top: y - (SQUARE_SIZE / 2)
        });

      if (source !== 'spare') {

        $('#' + SQUARE_ELS_IDS[source]).addClass(CSS.highlight1)
          .find('.' + CSS.piece).css('display', 'none');
      }
    }

    function updateDraggedPiece(x, y) {

      draggedPieceEl.css({
        left: x - (SQUARE_SIZE / 2),
        top: y - (SQUARE_SIZE / 2)
      });

      var location = isXYOnSquare(x, y);

      if (location === DRAGGED_PIECE_LOCATION) return;

      if (validSquare(DRAGGED_PIECE_LOCATION) === true) {
        $('#' + SQUARE_ELS_IDS[DRAGGED_PIECE_LOCATION])
          .removeClass(CSS.highlight2);
      }

      if (validSquare(location) === true) {
        $('#' + SQUARE_ELS_IDS[location]).addClass(CSS.highlight2);
      }

      if (typeof cfg.onDragMove === 'function') {
        cfg.onDragMove(location, DRAGGED_PIECE_LOCATION,
          DRAGGED_PIECE_SOURCE, DRAGGED_PIECE,
          deepCopy(CURRENT_POSITION), CURRENT_ORIENTATION);
      }

      DRAGGED_PIECE_LOCATION = location;
    }

    function stopDraggedPiece(location) {

      var action = 'drop';
      if (location === 'offboard' && cfg.dropOffBoard === 'snapback') {
        action = 'snapback';
      }
      if (location === 'offboard' && cfg.dropOffBoard === 'trash') {
        action = 'trash';
      }

      if (cfg.hasOwnProperty('onDrop') === true &&
        typeof cfg.onDrop === 'function') {
        var newPosition = deepCopy(CURRENT_POSITION);

        if (DRAGGED_PIECE_SOURCE === 'spare' && validSquare(location) === true) {

          newPosition[location] = DRAGGED_PIECE;
        }

        if (validSquare(DRAGGED_PIECE_SOURCE) === true && location === 'offboard') {

          delete newPosition[DRAGGED_PIECE_SOURCE];
        }

        if (validSquare(DRAGGED_PIECE_SOURCE) === true &&
          validSquare(location) === true) {

          delete newPosition[DRAGGED_PIECE_SOURCE];
          newPosition[location] = DRAGGED_PIECE;
        }

        var oldPosition = deepCopy(CURRENT_POSITION);

        var result = cfg.onDrop(DRAGGED_PIECE_SOURCE, location, DRAGGED_PIECE,
          newPosition, oldPosition, CURRENT_ORIENTATION);
        if (result === 'snapback' || result === 'trash') {
          action = result;
        }
      }

      if (action === 'snapback') {
        snapbackDraggedPiece();
      }
      else if (action === 'trash') {
        trashDraggedPiece();
      }
      else if (action === 'drop') {
        dropDraggedPieceOnSquare(location);
      }
    }

    widget.clear = function (useAnimation) {
      widget.position({}, useAnimation);
    };

    widget.destroy = function () {

      containerEl.html('');
      draggedPieceEl.remove();

      containerEl.unbind();
    };

    widget.fen = function () {
      return widget.position('fen');
    };

    widget.flip = function () {
      widget.orientation('flip');
    };

    widget.move = function () {

      if (arguments.length === 0) return;

      var useAnimation = true;

      var moves = {};
      for (var i = 0; i < arguments.length; i++) {

        if (arguments[i] === false) {
          useAnimation = false;
          continue;
        }

        if (validMove(arguments[i]) !== true) {
          error(2826, 'Invalid move passed to the move method.', arguments[i]);
          continue;
        }

        var tmp = arguments[i].split('-');
        moves[tmp[0]] = tmp[1];
      }

      var newPos = calculatePositionFromMoves(CURRENT_POSITION, moves);

      widget.position(newPos, useAnimation);

      return newPos;
    };

    widget.orientation = function (arg) {

      if (arguments.length === 0) {
        return CURRENT_ORIENTATION;
      }

      if (arg === 'white' || arg === 'black') {
        CURRENT_ORIENTATION = arg;
        drawBoard();
        return;
      }

      if (arg === 'flip') {
        CURRENT_ORIENTATION = (CURRENT_ORIENTATION === 'white') ? 'black' : 'white';
        drawBoard();
        return;
      }

      error(5482, 'Invalid value passed to the orientation method.', arg);
    };

    widget.position = function (position, useAnimation) {

      if (arguments.length === 0) {
        return deepCopy(CURRENT_POSITION);
      }

      if (typeof position === 'string' && position.toLowerCase() === 'fen') {
        return objToFen(CURRENT_POSITION);
      }

      if (useAnimation !== false) {
        useAnimation = true;
      }

      if (typeof position === 'string' && position.toLowerCase() === 'start') {
        position = deepCopy(START_POSITION);
      }

      if (validFen(position) === true) {
        position = fenToObj(position);
      }

      if (validPositionObject(position) !== true) {
        error(6482, 'Invalid value passed to the position method.', position);
        return;
      }

      if (useAnimation === true) {

        doAnimations(calculateAnimations(CURRENT_POSITION, position),
          CURRENT_POSITION, position);

        setCurrentPosition(position);
      }

      else {
        setCurrentPosition(position);
        drawPositionInstant();
      }
    };

    widget.resize = function () {

      SQUARE_SIZE = calculateSquareSize();

      boardEl.css('width', (SQUARE_SIZE * 8) + 'px');

      draggedPieceEl.css({
        height: SQUARE_SIZE,
        width: SQUARE_SIZE
      });

      if (cfg.sparePieces === true) {
        containerEl.find('.' + CSS.sparePieces)
          .css('paddingLeft', (SQUARE_SIZE + BOARD_BORDER_SIZE) + 'px');
      }

      drawBoard();
    };

    widget.start = function (useAnimation) {
      widget.position('start', useAnimation);
    };

    function isTouchDevice() {
      return ('ontouchstart' in document.documentElement);
    }

    function isMSIE() {
      return (navigator && navigator.userAgent &&
        navigator.userAgent.search(/MSIE/) !== -1);
    }

    function stopDefault(e) {
      e.preventDefault();
    }

    function mousedownSquare(e) {

      if (cfg.draggable !== true) return;

      var square = $(this).attr('data-square');

      if (validSquare(square) !== true ||
        CURRENT_POSITION.hasOwnProperty(square) !== true) {
        return;
      }

      beginDraggingPiece(square, CURRENT_POSITION[square], e.pageX, e.pageY);
    }

    function touchstartSquare(e) {

      if (cfg.draggable !== true) return;

      var square = $(this).attr('data-square');

      if (validSquare(square) !== true ||
        CURRENT_POSITION.hasOwnProperty(square) !== true) {
        return;
      }

      e = e.originalEvent;
      beginDraggingPiece(square, CURRENT_POSITION[square],
        e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }

    function mousedownSparePiece(e) {

      if (cfg.sparePieces !== true) return;

      var piece = $(this).attr('data-piece');

      beginDraggingPiece('spare', piece, e.pageX, e.pageY);
    }

    function touchstartSparePiece(e) {

      if (cfg.sparePieces !== true) return;

      var piece = $(this).attr('data-piece');

      e = e.originalEvent;
      beginDraggingPiece('spare', piece,
        e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }

    function mousemoveWindow(e) {

      if (DRAGGING_A_PIECE !== true) return;

      updateDraggedPiece(e.pageX, e.pageY);
    }

    function touchmoveWindow(e) {

      if (DRAGGING_A_PIECE !== true) return;

      e.preventDefault();

      updateDraggedPiece(e.originalEvent.changedTouches[0].pageX,
        e.originalEvent.changedTouches[0].pageY);
    }

    function mouseupWindow(e) {

      if (DRAGGING_A_PIECE !== true) return;

      var location = isXYOnSquare(e.pageX, e.pageY);

      stopDraggedPiece(location);
    }

    function touchendWindow(e) {

      if (DRAGGING_A_PIECE !== true) return;

      var location = isXYOnSquare(e.originalEvent.changedTouches[0].pageX,
        e.originalEvent.changedTouches[0].pageY);

      stopDraggedPiece(location);
    }

    function mouseenterSquare(e) {

      if (DRAGGING_A_PIECE !== false) return;

      if (cfg.hasOwnProperty('onMouseoverSquare') !== true ||
        typeof cfg.onMouseoverSquare !== 'function') return;

      var square = $(e.currentTarget).attr('data-square');

      if (validSquare(square) !== true) return;

      var piece = false;
      if (CURRENT_POSITION.hasOwnProperty(square) === true) {
        piece = CURRENT_POSITION[square];
      }

      cfg.onMouseoverSquare(square, piece, deepCopy(CURRENT_POSITION),
        CURRENT_ORIENTATION);
    }

    function mouseleaveSquare(e) {

      if (DRAGGING_A_PIECE !== false) return;

      if (cfg.hasOwnProperty('onMouseoutSquare') !== true ||
        typeof cfg.onMouseoutSquare !== 'function') return;

      var square = $(e.currentTarget).attr('data-square');

      if (validSquare(square) !== true) return;

      var piece = false;
      if (CURRENT_POSITION.hasOwnProperty(square) === true) {
        piece = CURRENT_POSITION[square];
      }

      cfg.onMouseoutSquare(square, piece, deepCopy(CURRENT_POSITION),
        CURRENT_ORIENTATION);
    }

    function addEvents() {

      $('body').on('mousedown mousemove', '.' + CSS.piece, stopDefault);

      boardEl.on('mousedown', '.' + CSS.square, mousedownSquare);
      containerEl.on('mousedown', '.' + CSS.sparePieces + ' .' + CSS.piece,
        mousedownSparePiece);

      boardEl.on('mouseenter', '.' + CSS.square, mouseenterSquare);
      boardEl.on('mouseleave', '.' + CSS.square, mouseleaveSquare);

      if (isMSIE() === true) {

        document.ondragstart = function () { return false; };

        $('body').on('mousemove', mousemoveWindow);
        $('body').on('mouseup', mouseupWindow);
      }
      else {
        $(window).on('mousemove', mousemoveWindow);
        $(window).on('mouseup', mouseupWindow);
      }

      if (isTouchDevice() === true) {
        boardEl.on('touchstart', '.' + CSS.square, touchstartSquare);
        containerEl.on('touchstart', '.' + CSS.sparePieces + ' .' + CSS.piece,
          touchstartSparePiece);
        $(window).on('touchmove', touchmoveWindow);
        $(window).on('touchend', touchendWindow);
      }
    }

    function initDom() {

      containerEl.html(buildBoardContainer());
      boardEl = containerEl.find('.' + CSS.board);

      if (cfg.sparePieces === true) {
        sparePiecesTopEl = containerEl.find('.' + CSS.sparePiecesTop);
        sparePiecesBottomEl = containerEl.find('.' + CSS.sparePiecesBottom);
      }

      var draggedPieceId = createId();
      $('body').append(buildPiece('wP', true, draggedPieceId));
      draggedPieceEl = $('#' + draggedPieceId);

      BOARD_BORDER_SIZE = parseInt(boardEl.css('borderLeftWidth'), 10);

      widget.resize();
    }

    function init() {
      if (checkDeps() !== true ||
        expandConfig() !== true) return;

      createElIds();

      initDom();
      addEvents();
    }

    init();

    return widget;

  };

  window.ChessBoard.fenToObj = fenToObj;
  window.ChessBoard.objToFen = objToFen;

})();