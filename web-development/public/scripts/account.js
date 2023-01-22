// CREATES A FUNCTION TO SHOW THE LOGIN FORM; HIDES THE REGISTER FORM IF IT IS VISIBLE
function show_login_form() {
    document.getElementById('signup-form').style.display = 'none'; // HIDES THE REGISTER FORM
    document.getElementById('login-form').style.display = 'block'; // SHOWS THE LOGIN FORM
}

// CREATES A FUNCTION TO SHOW THE REGISTER FORM; HIDES THE LOGIN FORM IF IT IS VISIBLE
function show_register_form() {
    document.getElementById('login-form').style.display = 'none'; // HIDES THE LOGIN FORM
    document.getElementById('signup-form').style.display = 'block'; // SHOWS THE REGISTER FORM
}

function show_register_confirm() {
    document.getElementById('signup-confirm').style.display = 'block'; // SHOWS THE REGISTER CONFIRM
}

function close_register_confirm() {
    document.getElementById('register-confirm').style.display = 'none'; // HIDES THE REGISTER CONFIRM
}

// CREATES A FUNCTION TO CLOSE THE LOGIN FORM
function close_login_form() {
    document.getElementById('login-form').style.display = 'none'; // HIDES THE LOGIN FORM
    document.getElementById('USERNAME_LOGIN').value = ""; // RESETS THE USERNAME
    document.getElementById('PASSWORD_LOGIN').value = ""; // RESETS THE PASSWORD
}

// CREATES A FUNCTION TO CLOSE THE REGISTER FORM
function close_register_form() {
    document.getElementById('signup-form').style.display = 'none'; // HIDES THE REGISTER FORM  
    document.getElementById('USERNAME_SIGNUP').value = ""; // RESETS THE USERNAME
    document.getElementById('PASSWORD_SIGNUP').value = ""; // RESETS THE PASSWORD
    document.getElementById('PASSWORD_CONFIRMATION').value = ""; // RESETS THE PASSWORD CONFIRMATION
}

// function show_shopping_cart(){
//     document.getElementById('cart').style.display = 'block'; // SHOWS THE SHOPPING CART
// }

// function close_shopping_cart(){
//     document.getElementById('cart').style.display = 'none'; // HIDES THE SHOPPING CART
// }

// CREATES A FUNCTION TO DO THE VISUAL UPDATE WHEN LOGGING OUT
function logout_visual_update() {
    document.getElementById("wsite-content_products").style.display = "none"; // HIDES THE PRODUCTS
    document.getElementById("products_button").style.display = "none"; // HIDES THE PRODUCTS BUTTON
    document.getElementById("products_button_mobile").style.display = "none"; // HIDES THE PRODUCTS BUTTON
    // document.getElementById("search_button").style.display = "none"; // HIDES THE SEARCH
    document.getElementById('footer-styled-hr').style.display = "none"; // HIDES THE FOOTER HR
    document.getElementById('manager_commands').style.display = "none"; // HIDES THE MANAGER COMMANDS
    document.getElementById('user_log_button').style.backgroundImage = "url('assets/interface_icons/fi-rr-sign-out.svg')"; // CHANGES THE USER LOG BUTTON ICON
    // document.getElementById('wsite-content_quote').style.display = "inherit"; // SHOW THE QUOTE
    // document.getElementById('styled_hr_quote').style.display = "inherit"; // SHOW THE QUOTE
    document.getElementById('search').style.display = "none"; // HIDES THE SEARCH
    // document.getElementById('wsite-content_our_story').style.display = "inherit"; // SHOW THE OUR STORY
    // document.getElementById("our_story_button").style.display = "inherit"; // SHOW THE OUR STORY BUTTON
    // document.getElementById('cart_button').style.display = "none"; // HIDES THE CART BUTTON
    // SCROLLS TO THE TOP OF THE PAGE
    document.body.scrollTop = 0; // FOR SAFARI
    document.documentElement.scrollTop = 0; // FOR CHROME, FIREFOX, IE AND OPERA
}

// CREATES A FUNCTION TO DO THE VISUAL UPDATE WHEN LOGGING IN
async function login_visual_update() {
    close_login_form(); // CLOSES THE LOGIN FORM
    close_register_form(); // CLOSES THE REGISTER FORM
    if (JSON.parse(localStorage.getItem("CURRENT_LOGGED_IN_USER"))["IS_ADMIN"]) {
        document.getElementById("manager_commands").style.display = "inherit"; // SHOWS THE MANAGER COMMANDS
    }
    document.getElementById("wsite-content_products").style.display = "inherit"; // SHOWS THE PRODUCTS
    document.getElementById("products_button").style.display = "inherit"; // SHOWS THE PRODUCTS BUTTON
    document.getElementById("products_button_mobile").style.display = "inherit"; // SHOWS THE PRODUCTS BUTTON
    // document.getElementById("search_button").style.display = "inherit"; // SHOW THE SEARCH
    document.getElementById('footer-styled-hr').style.display = "inherit"; // SHOWS THE FOOTER HR
    await update_products_area(); // CALLS THE UPDATE_PRODUCTS_AREA FUNCTION
    document.getElementById('user_log_button').style.backgroundImage = "url('assets/interface_icons/fi-rr-sign-in.svg')"; // CHANGES THE USER LOG BUTTON ICON
    // document.getElementById('wsite-content_quote').style.display = "none"; // HIDES THE QUOTE
    // document.getElementById('styled_hr_quote').style.display = "none"; // HIDES THE QUOTE
    document.getElementById('search').style.display = "inherit"; // SHOWS THE SEARCH
    // document.getElementById('wsite-content_our_story').style.display = "none"; // HIDES THE OUR STORY
    // document.getElementById("our_story_button").style.display = "none"; // HIDES THE OUR STORY BUTTON
    // document.getElementById('cart_button').style.display = "inherit"; // SHOWS THE CART BUTTON
    document.getElementById('wsite-content_products').scrollIntoView({ behavior: 'smooth' }); // SCROLLS TO THE PRODUCTS
}

// CREATES A FUNCTION TO AUTHENTICATE THE USER IF IT EXISTS OTHERWISE IT CREATES A NEW USER WITH THE GIVEN CREDENTIALS
async function authenticate() {
    if (document.getElementById('login-form').style.display == "block") { // IF THE LOGIN FORM IS VISIBLE, LOGS IN
        let NAME = document.getElementById('USERNAME_LOGIN').value; // GETS THE USERNAME
        let PASSWORD = document.getElementById('PASSWORD_LOGIN').value; // GETS THE PASSWORD
        const RESPONSE = await fetch(`/USER?NAME=${NAME}&PASSWORD=${PASSWORD}`, { // SENDS A GET REQUEST TO THE SERVER TO GET THE USER
            method: "GET", // SETS THE METHOD TO GET
            headers: { "Content-type": "application/json; charset=UTF-8" } // SETS THE HEADERS
        }); // SENDS A GET REQUEST TO THE SERVER TO GET THE USER
        switch (RESPONSE.status) { // CHECKS THE RESPONSE STATUS
            case 401:
                alert("UNAUTHORIZED: THE USERNAME OR THE PASSWORD ARE INCORRECT"); // IF THE USERNAME OR THE PASSWORD ARE INCORRECT
                break;
            case 404:
                alert("NOT FOUND: THE USERNAME IS NOT FOUND"); // IF THE USERNAME IS NOT FOUND
                break;
            case 400:
                alert("BAD REQUEST: NO USERNAME OR PASSWORD PROVIDED"); // IF THE USERNAME OR THE PASSWORD ARE EMPTY
                break;
            case 200: // IF THE USERNAME AND THE PASSWORD ARE CORRECT
                // close_login_form(); // CLOSES THE LOGIN FORM
                let USER = await RESPONSE.json(); // GETS THE USER
                localStorage.setItem("CURRENT_LOGGED_IN_USER", JSON.stringify(USER)); // SETS THE CURRENT LOGGED IN USER
                await login_visual_update(); // CALLS THE LOGIN_VISUAL_UPDATE FUNCTION
                await update_cart(); // UPDATES THE CART
                break;
            default: // IF THERE IS AN INTERNAL SERVER ERROR
                console.log("INTERNAL SERVER ERROR"); // IF THERE IS AN INTERNAL SERVER ERROR
                break;
        }
        document.getElementById('USERNAME_LOGIN').value = ""; // RESETS THE USERNAME
        document.getElementById('PASSWORD_LOGIN').value = ""; // RESETS THE PASSWORD
        return; // RETURNS
    } else if (document.getElementById('signup-form').style.display == "block") { // IF THE REGISTER FORM IS VISIBLE, REGISTERS A NEW USER
        let NAME = document.getElementById('USERNAME_SIGNUP').value; // GETS THE USERNAME
        let PASSWORD = document.getElementById('PASSWORD_SIGNUP').value; // GETS THE PASSWORD
        let PASSWORD_CONFIRMATION = document.getElementById('PASSWORD_CONFIRMATION').value; // GETS THE PASSWORD REPEAT FIELD
        let USER = {
            "NAME": NAME, // SETS THE USERNAME
            "PASSWORD": PASSWORD, // SETS THE PASSWORD
            "PASSWORD_CONFIRMATION": PASSWORD_CONFIRMATION // SETS THE PASSWORD REPEAT FIELD
        }; // CREATES A USER OBJECT
        const RESPONSE = await fetch(`/USER`, { // SENDS A POST REQUEST TO THE SERVER TO CREATE A NEW USER
            method: "POST", // SETS THE METHOD TO POST
            headers: { "Content-type": "application/json; charset=UTF-8" }, // SETS THE HEADERS
            body: JSON.stringify(USER) // SETS THE BODY
        });
        switch (RESPONSE.status) { // CHECKS THE RESPONSE STATUS
            case 422:
                alert("UNPROCESSABLE ENTITY: THE USERNAME IS LONGER THAN 3 CHARACTERS AND IF ITS NOT EMPTY, NULL OR WHITE SPACE, AND IF THE PASSWORD IS LONGER THAN 8 CHARACTERS AND IF ITS NOT EMPTY, NULL OR WHITE SPACE"); // IF THE USERNAME IS LONGER THAN 3 CHARACTERS AND IF ITS NOT EMPTY, NULL OR WHITE SPACE, AND IF THE PASSWORD IS LONGER THAN 8 CHARACTERS AND IF ITS NOT EMPTY, NULL OR WHITE SPACE
                break;
            case 401:
                alert("UNAUTHORIZED: THE PASSWORDS DON'T MATCH"); //IF THE PASSWORDS DON'T MATCH
                break;
            case 409:
                alert("CONFLICT: THE USERNAME IS ALREADY TAKEN"); // IF THE USERNAME IS ALREADY TAKEN
                break;
            case 400:
                alert("BAD REQUEST: NO USERNAME OR THE PASSWORD PROVIDED"); // IF THE USERNAME OR THE PASSWORD ARE EMPTY
                break;
            case 201: // IF THE USERNAME AND THE PASSWORD ARE CORRECT
                let USER = await RESPONSE.json(); // GETS THE USER
                localStorage.setItem("CURRENT_LOGGED_IN_USER", JSON.stringify(USER)); // SETS THE CURRENT LOGGED IN USER
                await login_visual_update(); // CALLS THE LOGIN_VISUAL_UPDATE FUNCTION
                await update_cart(); // UPDATES THE CART
                break;
            default: // IF THERE IS AN INTERNAL SERVER ERROR
                console.log("INTERNAL SERVER ERROR"); // IF THERE IS AN INTERNAL SERVER ERROR
                break;
        }
        document.getElementById('USERNAME_SIGNUP').value = ""; // RESETS THE USERNAME
        document.getElementById('PASSWORD_SIGNUP').value = ""; // RESETS THE PASSWORD
        document.getElementById('PASSWORD_CONFIRMATION').value = ""; // RESETS THE PASSWORD CONFIRMATION
        return; // RETURNS
    }
}

// UPDATE_PRODUCTS_AREA FUNCTION: USES THE API TO GET ALL CATEGORIES AND PRODUCTS, ORGANIZES THE PRODUCTS BY CATEGORIES, AND ALTERS THE INNER HTML OF THE DIV WITH THE ID "PRODUCTS" TO SHOW THE PRODUCTS.
async function update_products_area() {
    let CATEGORY_ARRAY = new Array(); // CREATES A NEW CATEGORIES ARRAY
    let PRODUCTS_ARRAY = new Array(); // CREATES A NEW PRODUCTS ARRAY
    await fetch(`/CATEGORY`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        }
    }).then(RESPONSE => RESPONSE.json()).then(CATEGORIES => {
        CATEGORY_ARRAY = CATEGORIES; // SETS THE CATEGORY_ARRAY TO THE CATEGORIES ARRAY
    }).catch(ERROR => {
        console.log(`[ERROR] ${ERROR}`); // LOGS THE ERROR
    });
    await fetch(`/PRODUCT`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        }
    }).then(RESPONSE => RESPONSE.json()).then(PRODUCTS => {
        PRODUCTS_ARRAY = PRODUCTS; // SETS THE PRODUCTS_ARRAY TO THE PRODUCTS ARRAY
    }).catch(ERROR => {
        console.log(`[ERROR] ${ERROR}`); // LOGS THE ERROR
    });
    document.getElementById("products").innerHTML = `<h1 class="wsite-content-title" style="text-align:center; padding-bottom: 2rem;">Products</h1>`; // CREATES A NEW PRODUCTS_HTML VARIABLE
    for (let i = 0; i < CATEGORY_ARRAY.length; i++) { // LOOPS THROUGH THE CATEGORIES
        if (i > 0) {
            document.getElementById("products").innerHTML += `<div class="wsite-spacer" style="height:25px;">`;
        }
        if (JSON.parse(localStorage.getItem("CURRENT_LOGGED_IN_USER"))["IS_ADMIN"]) {
            document.getElementById("products").innerHTML += `<a class="single_side_delete_button_variant2 drop_case_no_styling" id="delete-${CATEGORY_ARRAY[i].NAME}" onclick="delete_category(this.id.replace('delete-', '')); update_products_area();"></a><span id="${CATEGORY_ARRAY[i].NAME.toLowerCase()}" class="drop_case">${CATEGORY_ARRAY[i].NAME}</span><p><i>${CATEGORY_ARRAY[i].DESCRIPTION}</i></p></div>`; // ADDS THE CATEGORY NAME AND DESCRIPTION
        } else {
            document.getElementById("products").innerHTML += `<span id="${CATEGORY_ARRAY[i].NAME.toLowerCase()}" class="drop_case">${CATEGORY_ARRAY[i].NAME}</span><p><i>${CATEGORY_ARRAY[i].DESCRIPTION}</i></p></div>`; // ADDS THE CATEGORY NAME AND DESCRIPTION
        }
        for (let j = 0; j < PRODUCTS_ARRAY.length; j++) { // LOOPS THROUGH THE PRODUCTS
            if (PRODUCTS_ARRAY[j].CATEGORY == CATEGORY_ARRAY[i].NAME) { // CHECKS IF THE PRODUCT CATEGORY IS THE SAME AS THE CATEGORY
                if (JSON.parse(localStorage.getItem("CURRENT_LOGGED_IN_USER"))["IS_ADMIN"]) {
                    document.getElementById("products").innerHTML += `<div class="wsite-spacer" style="height:25px;"></div><div id="wsite-com-product-gen_${PRODUCTS_ARRAY[j].ID}"><div id="wsite-com-product-area"><div id="wsite-com-product-images"><div id="cloudzoom-wrap" style="top:0px; position:relative;"><a class="cloud-zoom" id="zoom1" data-position="inside" style="position: relative; display: block;"><img src="${PRODUCTS_ARRAY[j].IMAGE_URL}" class="wsite-com-product-images-main-image" style="display: block; max-width:410px; max-height:274px; line-height: 274px;" alt="${PRODUCTS_ARRAY[j].ID}"></a></div></div><div id="wsite-com-product-info"><div id="wsite-com-product-info-inner"><h3 class="drop_case_no_styling product-title">${PRODUCTS_ARRAY[j].NAME}</h3><a class="single_side_delete_button" id="delete-${PRODUCTS_ARRAY[j].ID}" onclick="delete_product(this.id.replace('delete-', '')); update_products_area();"></a><div id="wsite-com-product-price-area"><div id="wsite-com-product-price" class="wsite-com-product-price-container"><span class="wsite-com-product-price-amount">US\u0024${PRODUCTS_ARRAY[j].PRICE}</span></div></div><hr class="styled-hr"><div id="wsite-com-product-short-description"><div class="paragraph"><p><em>${PRODUCTS_ARRAY[j].DESCRIPTION}</em></p></div></div><hr class="styled-hr" style="margin-bottom: 0.5rem"><a id="add-${PRODUCTS_ARRAY[j].ID}" onclick="" class="wsite-button wsite-button-large wsite-button-highlight wsite-buy-button wsite-com-product-disabled" role="button" tabindex="-1"><span class="wsite-button-inner"><span id="wsite-com-product-buy-icon"></span><i>Not Available</i></span></a></div></div></div></div>`;
                } else {
                    document.getElementById("products").innerHTML += `<div class="wsite-spacer" style="height:25px;"></div><div id="wsite-com-product-gen_${PRODUCTS_ARRAY[j].ID}"><div id="wsite-com-product-area"><div id="wsite-com-product-images"><div id="cloudzoom-wrap" style="top:0px; position:relative;"><a class="cloud-zoom" id="zoom1" data-position="inside" style="position: relative; display: block;"><img src="${PRODUCTS_ARRAY[j].IMAGE_URL}" class="wsite-com-product-images-main-image" style="display: block; max-width:410px; max-height:274px; line-height: 274px;" alt="${PRODUCTS_ARRAY[j].ID}"></a></div></div><div id="wsite-com-product-info"><div id="wsite-com-product-info-inner"><h3 class="product-title">${PRODUCTS_ARRAY[j].NAME}</h3><div id="wsite-com-product-price-area"><div id="wsite-com-product-price" class="wsite-com-product-price-container"><span class="wsite-com-product-price-amount">US\u0024${PRODUCTS_ARRAY[j].PRICE}</span></div></div><hr class="styled-hr"><div id="wsite-com-product-short-description"><div class="paragraph"><p><em>${PRODUCTS_ARRAY[j].DESCRIPTION}</em></p></div></div><hr class="styled-hr" style="margin-bottom: 0.5rem"><a id="add-${PRODUCTS_ARRAY[j].ID}" onclick="" class="wsite-button wsite-button-large wsite-button-highlight wsite-buy-button wsite-com-product-disabled" role="button" tabindex="-1"><span class="wsite-button-inner"><span id="wsite-com-product-buy-icon"></span><i>Not Available</i></span></a></div></div></div></div>`;
                    // add_to_cart(this.id.replace('add-', '')); // ADDS THE PRODUCT TO THE CART
                }
            }
        }
    }
    document.getElementById("products").innerHTML += `</div>`; // CLOSES THE GENERAL DIV
}

// FUNCTION THAT DECIDES WHAT TO DO WHEN THE USER CLICKS ON THE LOGIN/LOGOUT BUTTON
function choose_account_action() {
    if (localStorage.getItem("CURRENT_LOGGED_IN_USER") == null) { // CHECKS IF THE USER IS LOGGED IN; IF NOT, IT SHOWS THE LOGIN FORM
        show_login_form(); // SHOWS THE LOGIN FORM
    } else { // IF THE USER IS LOGGED IN
        localStorage.removeItem("CURRENT_LOGGED_IN_USER"); // REMOVES THE CURRENT LOGGED IN USER
        logout_visual_update(); // UPDATES THE VISUALS TO LOGOUT
    }
}

// UPDATES THE BLOCKQUOTE SECTION OF THE WEBSITE
async function update_blockquote() {
    const RESPONSE = await fetch(`/QUOTE`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    });
    switch (RESPONSE.status) { // CHECKS THE RESPONSE
        case 200: // IF THE REQUEST IS SUCCESSFUL
            let QUOTE = await RESPONSE.json(); // GETS THE QUOTE
            document.getElementById("blockquote").innerHTML += `<span class="drop_case">A Little <a href="https://www.youtube.com/watch?v=i3WcATV_kgM" target="_self" style="color: #8e8e8e; cursor: default;">Thought</a></span><p style="margin-block-end: 0;"><i>${QUOTE.QUOTE}</i> <b>${QUOTE.AUTHOR}</b></p></div>`; // ADDS THE CATEGORY NAME AND DESCRIPTION
            break;
        default: // IF THERE IS AN INTERNAL SERVER ERROR
            console.log("INTERNAL SERVER ERROR"); // LOGS THE ERROR
            break;
    }
}

// UPDATES THE CART
async function update_cart() {
    const RESPONSE = await fetch(`/CART`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "TOKEN": JSON.parse(localStorage.getItem("CURRENT_LOGGED_IN_USER"))["TOKEN"] // WE NEED TO SEND THE TOKEN TO THE SERVER TO GET THE CART
        }
    });
    switch (RESPONSE.status) { // CHECKS THE RESPONSE
        case 401: // IF THE USER IS NOT LOGGED IN OR IS NOT AN ADMIN
            alert("UNAUTHORIZED"); // ALERTS THE USER
            break;
        case 404: // IF THE CART IS NOT FOUND 
            alert("NOT FOUND"); // ALERTS THE USER
            break;
        case 200: // IF THE REQUEST IS SUCCESSFUL
            localStorage.setItem("CURRENT_LOGGED_IN_USER_CART", JSON.stringify(await RESPONSE.json())); // SETS THE CART TO THE LOCAL STORAGE
            break;
        default: // IF THERE IS AN INTERNAL SERVER ERROR
            console.log("INTERNAL SERVER ERROR"); // LOGS THE ERROR
            break;
    }
}

// FUNCTION THAT RUNS WHEN THE USER CLICKS ON THE ADD TO CART BUTTON
async function add_to_cart(product_id) {
    // GET THE PRODUCT BY ID FROM THE PRODUCTS ARRAY
    let PRODUCT = null;
    for (let i = 0; i < PRODUCTS_ARRAY.length; i++) {
        if (PRODUCTS_ARRAY[i].ID == product_id) {
            PRODUCT = PRODUCTS_ARRAY[i];
            break;
        }
    }
    const RESPONSE = await fetch(`/CART`, { // SENDS A REQUEST TO THE SERVER
        method: "POST", // USES THE POST METHOD
        headers: { // SENDS THE HEADERS
            "Content-Type": "application/json; charset=utf-8", // SENDS THE CONTENT TYPE
            "TOKEN": JSON.parse(localStorage.getItem("CURRENT_LOGGED_IN_USER"))["TOKEN"] // WE NEED TO SEND THE TOKEN TO THE SERVER TO ADD THE PRODUCT TO THE CART
        },
        body: JSON.stringify({ // SENDS THE BODY
            "ID": PRODUCT.ID, // SENDS THE PRODUCT ID
            "NAME": PRODUCT.NAME, // SENDS THE PRODUCT NAME
            "PRICE": PRODUCT.PRICE // SENDS THE PRODUCT PRICE
        }) // SENDS THE BODY
    }); // SENDS A REQUEST TO THE SERVER
    switch (RESPONSE.status) { // CHECKS THE RESPONSE
        case 401: // IF THE USER IS NOT LOGGED IN OR IS NOT AN ADMIN
            alert("UNAUTHORIZED"); // ALERTS THE USER
            break;
        case 404: // IF THE CART IS NOT FOUND
            alert("NOT FOUND"); // ALERTS THE USER
            break;
        case 201: // IF THE REQUEST IS SUCCESSFUL
            alert("ADDED TO CART"); // ALERTS THE USER
            break;
        default: // IF THERE IS AN INTERNAL SERVER ERROR
            console.log("INTERNAL SERVER ERROR"); // LOGS THE ERROR
            break;
    }
    await update_cart(); // UPDATES THE CART
}

// FUNCTION THAT RUNS WHEN THE USER CLICKS ON THE REMOVE FROM CART BUTTON
async function remove_from_cart(product_id) {
    const RESPONSE = await fetch(`/CART`, { // SENDS A REQUEST TO THE SERVER
        method: "DELETE", // USES THE DELETE METHOD
        headers: { // SENDS THE HEADERS
            "Content-Type": "application/json; charset=utf-8", // SENDS THE CONTENT TYPE
            "TOKEN": JSON.parse(localStorage.getItem("CURRENT_LOGGED_IN_USER"))["TOKEN"] // WE NEED TO SEND THE TOKEN TO THE SERVER TO REMOVE THE PRODUCT FROM THE CART
        },
        body: JSON.stringify({ // SENDS THE BODY
            "ID": product_id // SENDS THE PRODUCT ID
        }) // SENDS THE BODY
    }); // SENDS A REQUEST TO THE SERVER
    switch (RESPONSE.status) { // CHECKS THE RESPONSE
        case 401: // IF THE USER IS NOT LOGGED IN OR IS NOT AN ADMIN
            alert("UNAUTHORIZED"); // ALERTS THE USER
            break;
        case 404: // IF THE CART IS NOT FOUND
            alert("NOT FOUND"); // ALERTS THE USER
            break;
        case 204: // IF THE REQUEST IS SUCCESSFUL
            alert("REMOVED FROM CART"); // ALERTS THE USER
            break;
        default: // IF THERE IS AN INTERNAL SERVER ERROR
            console.log("INTERNAL SERVER ERROR"); // LOGS THE ERROR
            break;
    }
    await update_cart(); // UPDATES THE CART
}

// CREATES AN EVENT THAT RUNS EVERY TIME THE WEBSITE REFRESHES AND CHECKS IF THE USER IS LOGGED IN
window.onload = async function () {
    if (localStorage.getItem("CURRENT_LOGGED_IN_USER") != null) { // CHECKS IF THE USER IS LOGGED IN
        await login_visual_update(); // UPDATES THE VISUALS TO LOGIN
        if (localStorage.getItem("CURRENT_LOGGED_IN_USER_CART") == null) { // CHECKS IF THE USER HAS A CART
            await update_cart(); // UPDATES THE CART
        }
    }
    await update_blockquote(); // UPDATES THE BLOCKQUOTE
}