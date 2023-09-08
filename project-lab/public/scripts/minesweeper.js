const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']; // DEFINES THE NUMBERS
const iDevise = navigator.platform.match(/^iP/); // CHECKS IF DEVICE IS AN APPLE DEVICE
const feedback = document.querySelector('.feedback'); // DEFINES THE FEEDBACK ELEMENT

var Game = function (cols, rows, number_of_bombs, set, usetwemoji) { // DEFINES THE GAME
    this.number_of_cells = cols * rows; // DEFINES THE NUMBER OF CELLS: COLUMNS * ROWS
    this.map = document.getElementById('map'); // DEFINES THE MAP ELEMENT
    this.cols = Number(cols); // DEFINES THE NUMBER OF COLUMNS
    this.rows = Number(rows); // DEFINES THE NUMBER OF ROWS
    this.number_of_bombs = Number(number_of_bombs); // DEFINES THE NUMBER OF BOMBS
    this.rate = number_of_bombs / this.number_of_cells; // DEFINES THE RATE OF BOMBS
    this.emojiset = set; // DEFINES THE EMOJISET
    this.numbermoji = [this.emojiset[0]].concat(numbers); // DEFINES THE NUMBERMOJI
    this.usetwemoji = usetwemoji || false; // DEFINES IF TWEMOJI SHOULD BE USED
    this.init(); // INITIALIZES THE GAME
} // END OF GAME

Game.prototype.init = function () { // INITIALIZES THE GAME
    this.prepareEmoji(); // PREPARES THE EMOJIS
    if (this.number_of_cells > 2500) { alert('too big, go away, have less than 2500 cells'); return false } // CHECKS IF THE NUMBER OF CELLS IS TOO BIG
    if (this.number_of_cells <= this.number_of_bombs) { alert('more bombs than cells, can\'t do it'); return false } // CHECKS IF THE NUMBER OF BOMBS IS TOO BIG
    var that = this; // DEFINES THAT
    this.moveIt(true); // MOVES THE MAP
    this.map.innerHTML = ''; // CLEARS THE MAP
    var grid_data = this.bomb_array(); // DEFINES THE GRID DATA
    function getIndex(x, y) { // DEFINES THE GET INDEX FUNCTION
        if (x > that.cols || x <= 0) return -1; // CHECKS IF X IS OUT OF BOUNDS
        if (y > that.cols || y <= 0) return -1; // CHECKS IF Y IS OUT OF BOUNDS
        return that.cols * (y - 1) + x - 1; // RETURNS THE INDEX
    } // END OF GET INDEX FUNCTION
    var row = document.createElement('div'); // CREATES A NEW ROW
    row.setAttribute('role', 'row'); // SETS THE ROLE OF THE ROW
    grid_data.forEach(function (isBomb, i) { // LOOPS THROUGH THE GRID DATA
        var cell = document.createElement('span'); // CREATES A NEW CELL
        cell.setAttribute('role', 'gridcell'); // SETS THE ROLE OF THE CELL
        var mine = that.mine(isBomb); // DEFINES THE MINE
        var x = Math.floor((i + 1) % that.cols) || that.cols; // DEFINES X
        var y = Math.ceil((i + 1) / that.cols); // DEFINES Y
        var neighbors_cords = [[x, y - 1], [x, y + 1], [x - 1, y - 1], [x - 1, y], [x - 1, y + 1], [x + 1, y - 1], [x + 1, y], [x + 1, y + 1]]; // DEFINES THE NEIGHBORS CORDS
        if (!isBomb) { // CHECKS IF THE CELL IS NOT A BOMB
            var neighbors = neighbors_cords.map(function (xy) { return grid_data[getIndex(xy[0], xy[1])] }); // DEFINES THE NEIGHBORS
            mine.mine_count = neighbors.filter(function (neighbor_bomb) { return neighbor_bomb }).length; // DEFINES THE MINE COUNT
        }
        mine.classList.add('x' + x, 'y' + y); // ADDS THE X AND Y CLASSES TO THE MINE
        mine.neighbors = neighbors_cords.map(function (xy) { return `.x${xy[0]}.y${xy[1]}` }); // DEFINES THE NEIGHBORS
        cell.appendChild(mine); // APPENDS THE MINE TO THE CELL
        row.appendChild(cell); // APPENDS THE CELL TO THE ROW
        if (x === that.cols) { // CHECKS IF X IS THE LAST COLUMN
            that.map.appendChild(row); // APPENDS THE ROW TO THE MAP
            row = document.createElement('div'); // CREATES A NEW ROW
            row.setAttribute('role', 'row'); // SETS THE ROLE OF THE ROW
        } // END OF IF
    }) // END OF FOREACH
    this.resetMetadata(); // RESETS THE METADATA
    this.bindEvents(); // BINDS THE EVENTS
    this.updateBombsLeft(); // UPDATES THE BOMBS LEFT
} // END OF INIT

Game.prototype.bindEvents = function () { // BINDS THE EVENTS
    var that = this; // DEFINES THAT
    var cells = document.getElementsByClassName('cell'); // DEFINES THE CELLS
    Array.prototype.forEach.call(cells, function (target) { // LOOPS THROUGH THE CELLS
        target.addEventListener('click', function (evt) { // ADDS AN EVENT LISTENER TO THE CELL: CLICKING ON A CELL AND REVEALING CELL
            if (!target.isMasked || target.isFlagged) return; // CHECKS IF THE CELL IS MASKED OR FLAGGED
            if (document.getElementsByClassName('unmasked').length === 0) { // CHECKS IF THERE ARE NO UNMASKED CELLS
                that.startTimer(); // STARTS THE TIMER
                if (target.isBomb) { // CHECKS IF THE CELL IS A BOMB
                    that.restart(that.usetwemoji); // RESTARTS THE GAME
                    var targetClasses = target.className.replace('unmasked', ''); // DEFINES THE TARGET CLASSES
                    document.getElementsByClassName(targetClasses)[0].click(); // CLICKS THE TARGET
                    return; // RETURNS
                } // END OF IF
            } // END OF IF
            if (evt.view) that.moveIt(); // MOVES THE MAP
            target.reveal(); // REVEALS THE TARGET
            that.updateFeedback(target.getAttribute('aria-label')); // UPDATES THE FEEDBACK
            if (target.mine_count === 0 && !target.isBomb) { // CHECKS IF THE MINE COUNT IS 0 AND THE CELL IS NOT A BOMB
                that.revealNeighbors(target); // REVEALS THE NEIGHBORS
            } // END OF IF
            that.game(); // PLAYS THE GAME
        }); // END OF EVENT LISTENER
        target.addEventListener('contextmenu', function (evt) { // ADDS AN EVENT LISTENER TO THE CELL: RIGHT CLICKING ON A CELL AND FLAGGING/UNFLAGGING THE CELL
            var emoji; // DEFINES THE EMOJI
            evt.preventDefault(); // PREVENTS THE DEFAULT
            if (!target.isMasked) { return; } // CHECKS IF THE CELL IS MASKED
            if (target.isFlagged) { // CHECKS IF THE CELL IS FLAGGED
                target.setAttribute('aria-label', 'Field'); // SETS THE ARIA LABEL OF THE TARGET
                that.updateFeedback('Unflagged as potential bomb'); // UPDATES THE FEEDBACK
                emoji = that.emojiset[3].cloneNode(); // DEFINES THE EMOJI
                target.isFlagged = false; // SETS THE FLAGGED PROPERTY OF THE TARGET TO FALSE
            } else { // IF THE CELL IS NOT FLAGGED
                target.setAttribute('aria-label', 'Flagged as potential bomb'); // SETS THE ARIA LABEL OF THE TARGET
                that.updateFeedback('Flagged as potential bomb'); // UPDATES THE FEEDBACK
                emoji = that.emojiset[2].cloneNode(); // DEFINES THE EMOJI
                target.isFlagged = true; // SETS THE FLAGGED PROPERTY OF THE TARGET TO TRUE
            } // END OF IF
            target.childNodes[0].remove(); // REMOVES THE CHILD NODE OF THE TARGET
            target.appendChild(emoji); // APPENDS THE EMOJI TO THE TARGET
            that.updateBombsLeft(); // UPDATES THE BOMBS LEFT
        }); // END OF EVENT LISTENER
        if (iDevise) { // CHECKS IF THE DEVICE IS AN IOS DEVICE: SUPPORT FOR HOLDING (LONG PRESSING) ON A CELL TO FLAG IT
            target.addEventListener('touchstart', function (evt) { // ADDS AN EVENT LISTENER TO THE CELL: TOUCHING ON A CELL AND FLAGGING/UNFLAGGING THE CELL
                that.holding = setTimeout(function () { // SETS THE HOLDING PROPERTY OF THAT TO A TIMEOUT
                    target.dispatchEvent(new Event('contextmenu')) // DISPATCHES A NEW EVENT TO THE TARGET: CONTEXTMENU
                }, 500) // END OF SET TIMEOUT
            }); // END OF EVENT LISTENER
            target.addEventListener('touchend', function (evt) { // ADDS AN EVENT LISTENER TO THE CELL: STOP TOUCHING ON A CELL AND FLAGGING/UNFLAGGING THE CELL
                clearTimeout(that.holding); // CLEARS THE TIMEOUT
            }); // END OF EVENT LISTENER
        } // END OF IF
    }) // END OF FOREACH
    window.addEventListener('keydown', function (evt) { // ADDS AN EVENT LISTENER TO THE WINDOW: PRESSING A KEY
        if (evt.key == 'r' || evt.which == 'R'.charCodeAt()) { // CHECKS IF THE KEY IS R
            that.restart(that.usetwemoji) // RESTARTS THE GAME
        } // END OF IF
    }); // END OF EVENT LISTENER
} // END OF BIND EVENTS

Game.prototype.game = function () { // PLAYS THE GAME
    if (this.result) return; // CHECKS IF THERE IS A RESULT
    var cells = document.getElementsByClassName('cell'); // DEFINES THE CELLS
    var masked = Array.prototype.filter.call(cells, function (cell) { // DEFINES THE MASKED CELLS
        return cell.isMasked; // RETURNS THE MASKED CELLS
    }); // END OF FILTER
    var bombs = Array.prototype.filter.call(cells, function (cell) { // DEFINES THE BOMBS
        return cell.isBomb && !cell.isMasked; // RETURNS THE BOMBS
    }); // END OF FILTER
    if (bombs.length > 0) { // CHECKS IF THERE ARE BOMBS
        Array.prototype.forEach.call(masked, function (cell) { cell.reveal(); }) // REVEALS THE MASKED CELLS
        this.result = 'lost'; // SETS THE RESULT TO LOST
        this.showMessage(); // SHOWS THE MESSAGE
    } else if (masked.length === this.number_of_bombs) { // CHECKS IF THE NUMBER OF MASKED CELLS IS EQUAL TO THE NUMBER OF BOMBS
        Array.prototype.forEach.call(masked, function (cell) { cell.reveal(true); }) // REVEALS THE MASKED CELLS
        this.result = 'won'; // SETS THE RESULT TO WON
        this.showMessage(); // SHOWS THE MESSAGE
    } // END OF IF
} // END OF GAME

Game.prototype.restart = function (usetwemoji) { // RESTARTS THE GAME
    clearInterval(this.timer); // CLEARS THE INTERVAL
    this.result = false; // SETS THE RESULT TO FALSE
    this.timer = false; // SETS THE TIMER TO FALSE
    this.usetwemoji = usetwemoji; // SETS THE USETWEMOJI TO USETWEMOJI
    this.init(); // INITIALIZES THE GAME
}; // END OF RESTART

Game.prototype.resetMetadata = function () { // RESETS THE METADATA
    document.getElementById('timer').textContent = '0.00'; // SETS THE TEXT CONTENT OF THE TIMER TO 0.00
    document.querySelector('.wrapper').classList.remove('won', 'lost'); // REMOVES THE WON AND LOST CLASSES FROM THE WRAPPER
    document.querySelector('.result-emoji').textContent = ''; // SETS THE TEXT CONTENT OF THE RESULT EMOJI TO NOTHING
    // document.querySelector('.default-emoji').innerHTML = this.usetwemoji ? twemoji.parse('😀') : '😀'; // SETS THE INNER HTML OF THE DEFAULT EMOJI TO THE EMOJI
    document.querySelector('.default-emoji').innerHTML = "Good luck!"; // SETS THE INNER HTML OF THE DEFAULT EMOJI TO THE EMOJI
    document.querySelector('.js-settings').innerHTML = this.usetwemoji ? twemoji.parse('🔧') : '🔧'; // SETS THE INNER HTML OF THE SETTINGS TO THE EMOJI
} // END OF RESET METADATA

Game.prototype.startTimer = function () { // STARTS THE TIMER
    if (this.timer) return; // CHECKS IF THERE IS A TIMER
    this.startTime = new Date(); // SETS THE START TIME TO A NEW DATE
    this.timer = setInterval(function () { // SETS THE TIMER TO AN INTERVAL
        document.getElementById('timer').textContent = ((new Date() - game.startTime) / 1000).toFixed(2); // SETS THE TEXT CONTENT OF THE TIMER TO THE TIME
    }, 100); // END OF SET INTERVAL
} // END OF START TIMER

Game.prototype.mine = function (bomb) { // CREATES A MINE
    var that = this; // DEFINES THAT
    var base = document.createElement('button'); // CREATES A BUTTON
    base.type = 'button'; // SETS THE TYPE OF THE BUTTON TO BUTTON
    base.setAttribute('aria-label', 'Field'); // SETS THE ARIA LABEL OF THE BUTTON TO FIELD
    base.className = 'cell'; // SETS THE CLASS NAME OF THE BUTTON TO CELL 
    base.appendChild(this.emojiset[3].cloneNode()); // APPENDS THE EMOJI TO THE BUTTON
    base.isMasked = true; // SETS THE IS MASKED PROPERTY OF THE BUTTON TO TRUE
    if (bomb) base.isBomb = true; // CHECKS IF THERE IS A BOMB
    base.reveal = function (won) { // REVEALS THE MINE
        var emoji = base.isBomb ? (won ? that.emojiset[2] : that.emojiset[1]) : that.numbermoji[base.mine_count]; // DEFINES THE EMOJI
        var text = base.isBomb ? (won ? "Bomb discovered" : "Boom!") : (base.mine_count === 0 ? "Empty field" : base.mine_count + " bombs nearby"); // DEFINES THE TEXT
        this.childNodes[0].remove(); // REMOVES THE CHILD NODE
        this.setAttribute('aria-label', text); // SETS THE ARIA LABEL TO THE TEXT
        this.appendChild(emoji.cloneNode()); // APPENDS THE EMOJI
        this.isMasked = false; // SETS THE IS MASKED PROPERTY TO FALSE
        this.classList.add('unmasked'); // ADDS THE UNMASKED CLASS
    }; // END OF REVEAL
    return base; // RETURNS THE BASE
} // END OF MINE

Game.prototype.revealNeighbors = function (mine) { // REVEALS THE NEIGHBORS
    var neighbors = document.querySelectorAll(mine.neighbors); // DEFINES THE NEIGHBORS
    for (var i = 0; i < neighbors.length; i++) { // LOOPS THROUGH THE NEIGHBORS
        if (neighbors[i].isMasked && !neighbors[i].isFlagged) { // CHECKS IF THE NEIGHBOR IS MASKED AND NOT FLAGGED
            neighbors[i].reveal(); // REVEALS THE NEIGHBOR
            if (neighbors[i].mine_count === 0 && !neighbors[i].isBomb) { // CHECKS IF THE NEIGHBOR IS A MINE
                this.revealNeighbors(neighbors[i]); // REVEALS THE NEIGHBORS
            } // END OF IF
        } // END OF IF
    } // END OF FOR LOOP
} // END OF REVEAL NEIGHBORS

Game.prototype.prepareEmoji = function () { // PREPARES THE EMOJI
    var that = this; // DEFINES THAT
    function makeEmojiElement(emoji) { // MAKES THE EMOJI ELEMENT
        var ele; // DEFINES THE ELE
        if (that.usetwemoji) { // CHECKS IF THE USETWEMOJI IS TRUE
            if (emoji.src) { // CHECKS IF THERE IS A SRC
                ele = emoji; // SETS THE ELE TO THE EMOJI
            } else { // IF THERE IS NO SRC
                ele = document.createElement('img'); // CREATES AN IMAGE
                ele.className = 'emoji'; // SETS THE CLASS NAME OF THE IMAGE TO EMOJI
                ele.setAttribute('aria-hidden', 'true'); // SETS THE ARIA HIDDEN ATTRIBUTE TO TRUE
                ele.src = twemoji.parse(emoji).match(/src=\"(.+)\">/)[1]; // SETS THE SRC OF THE IMAGE TO THE EMOJI
            } // END OF IF
        } else { // IF THE USETWEMOJI IS FALSE
            ele = document.createTextNode(emoji.alt || emoji.data || emoji); // SETS THE ELE TO THE EMOJI
        } // END OF IF
        return ele; // RETURNS THE ELE
    } // END OF MAKE EMOJI ELEMENT
    this.emojiset = this.emojiset.map(makeEmojiElement); // MAPS THE EMOJISET
    this.numbermoji = this.numbermoji.map(makeEmojiElement); // MAPS THE NUMBERMOJI
} // END OF PREPARE EMOJI

Game.prototype.bomb_array = function () { // CREATES THE BOMB ARRAY
    var chance = Math.floor(this.rate * this.number_of_cells); // DEFINES THE CHANCE
    var arr = []; // DEFINES THE ARRAY
    for (var i = 0; i < chance; i++) { // LOOPS THROUGH THE CHANCE
        arr.push(true); // PUSHES TRUE TO THE ARRAY
    } // END OF FOR LOOP
    for (var n = 0; n < (this.number_of_cells - chance); n++) { // LOOPS THROUGH THE NUMBER OF CELLS
        arr.push(false); // PUSHES FALSE TO THE ARRAY
    } // END OF FOR LOOP
    return this.shuffle(arr); // RETURNS THE SHUFFLED ARRAY
} // END OF BOMB ARRAY

Game.prototype.shuffle = function (array) { // SHUFFLES THE ARRAY
    var currentIndex = array.length, temporaryValue, randomIndex; // DEFINES THE CURRENT INDEX, TEMPORARY VALUE AND RANDOM INDEX
    while (currentIndex !== 0) { // LOOPS WHILE THE CURRENT INDEX IS NOT 0
        randomIndex = Math.floor(Math.random() * currentIndex); // DEFINES THE RANDOM INDEX
        currentIndex -= 1; // DECREASES THE CURRENT INDEX
        temporaryValue = array[currentIndex]; // DEFINES THE TEMPORARY VALUE
        array[currentIndex] = array[randomIndex]; // SETS THE CURRENT INDEX TO THE RANDOM INDEX
        array[randomIndex] = temporaryValue; // SETS THE RANDOM INDEX TO THE TEMPORARY VALUE
    } // END OF WHILE LOOP
    return array; // RETURNS THE ARRAY
} // END OF SHUFFLE

Game.prototype.moveIt = function (zero) { // MOVES IT
    zero ? this.moves = 0 : this.moves++; // INCREASES THE MOVES
    document.getElementById('moves').textContent = this.moves; // SETS THE MOVES
} // END OF MOVE IT

Game.prototype.updateBombsLeft = function () { // UPDATES THE BOMBS LEFT
    var flagged = Array.prototype.filter.call(document.getElementsByClassName('cell'), function (target) { // DEFINES THE FLAGGED
        return target.isFlagged; // RETURNS THE TARGET IS FLAGGED
    }); // END OF FILTER
    document.getElementById('bombs-left').textContent = `${this.number_of_bombs - flagged.length}/${this.number_of_bombs}`; // SETS THE BOMBS LEFT
} // END OF UPDATE BOMBS LEFT

Game.prototype.updateFeedback = function (text) { // UPDATES THE FEEDBACK
    feedback.textContent = text; // SETS THE FEEDBACK TEXT
    if (this.feedbackToggle) feedback.textContent += "."; // IF THE FEEDBACK TOGGLE IS TRUE, ADD A PERIOD
    this.feedbackToggle = !this.feedbackToggle; // SETS THE FEEDBACK TOGGLE TO THE OPPOSITE
} // END OF UPDATE FEEDBACK

Game.prototype.showMessage = function () { // SHOWS THE MESSAGE
    clearInterval(this.timer); // CLEARS THE TIMER
    var seconds = ((new Date() - this.startTime) / 1000).toFixed(2); // DEFINES THE SECONDS
    var winner = this.result === 'won'; // DEFINES THE WINNER
    var TEXT_RESULT = winner ? 'Yay, you won!' : 'Boom! you lost.'; // DEFINES THE DISPLAYED MESSAGE
    this.updateFeedback(winner ? "Yay, you won!" : "Boom! You lost."); // UPDATES THE FEEDBACK
    document.querySelector('.wrapper').classList.add(this.result); // ADDS THE RESULT CLASS
    document.getElementById('timer').textContent = seconds; // SETS THE TIMER
    // document.getElementById('result').innerHTML = this.usetwemoji ? twemoji.parse(emoji) : emoji; // SETS THE RESULT
    document.getElementById('result').innerHTML = TEXT_RESULT; // SETS THE RESULT
} // END OF SHOW MESSAGE