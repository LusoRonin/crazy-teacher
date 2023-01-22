// ADD_PRODUCT(): ADDS A NEW PRODUCT (PROMPTS FOR ID, NAME, DESCRIPTION, PRICE, CATEGORY, IMAGE URL) TO THE DATABASE; IF SUCH DOESN'T EXIST (USING THE API)
// CHECKS IF THEIRS A USER LOGGED IN, AND IF ITS ADMIN; OTHERWISE, IT WILL NOT ALLOW THE USER TO ADD THE PRODUCT
async function add_product() {
    // WE NEED TO GET THE ID, NAME, DESCRIPTION, PRICE, CATEGORY AND IMAGE URL OF THE PRODUCT
    const PRODUCT_NAME = prompt("PRODUCT NAME:"); // PROMPTS FOR THE NAME OF THE PRODUCT
    const PRODUCT_DESCRIPTION = prompt("PRODUCT DESCRIPTION:"); // PROMPTS FOR THE DESCRIPTION OF THE PRODUCT
    const PRODUCT_PRICE = prompt("PRODUCT PRICE:"); // PROMPTS FOR THE PRICE OF THE PRODUCT
    const CATEGORY_NAME = prompt("PRODUCT CATEGORY NAME:"); // PROMPTS FOR THE CATEGORY OF THE PRODUCT
    const PRODUCT_IMAGE_URL = prompt("PRODUCT IMAGE URL:"); // PROMPTS FOR THE IMAGE URL OF THE PRODUCT
    const CATEGORIES_RESPONSE = fetch("/CATEGORY", { // WE NEED TO SEND A REQUEST TO THE API TO GET THE CATEGORIES
        method: "GET", // WE NEED TO USE THE GET METHOD 
        headers: {
            "Content-type": "application/json; charset=UTF-8" // WE NEED TO SEND THE JSON DATA
        }
    }); // SENDS THE REQUEST
    switch ((await CATEGORIES_RESPONSE).status) { // CHECKS THE RESPONSE
        case 200: // IF THE REQUEST IS SUCCESSFUL
            const CATEGORIES = await (await CATEGORIES_RESPONSE).json(); // GETS THE CATEGORIES
            if (CATEGORIES.find(CATEGORY => CATEGORY["NAME"] === CATEGORY_NAME) === undefined) { // IF THE CATEGORY DOESN'T EXIST
                // ASKS THE USER IF THEY WANT TO ADD THE CATEGORY USING CONFIRM PROMPT
                if (confirm("CATEGORY DOESN'T EXIST. DO YOU WANT TO ADD THE CATEGORY?")) { // IF THE USER WANTS TO ADD THE CATEGORY
                    const CATEGORY_DESCRIPTION = prompt("CATEGORY DESCRIPTION:"); // PROMPTS FOR THE DESCRIPTION OF THE CATEGORY
                    const CATEGORY_RESPONSE = fetch("/CATEGORY", { // WE NEED TO SEND A REQUEST TO THE API
                        method: "POST", // WE NEED TO USE THE POST METHOD
                        headers: { // WE NEED TO SEND THE TOKEN IN THE HEADERS
                            "Content-type": "application/json; charset=UTF-8", // WE NEED TO SEND THE JSON DATA
                            "TOKEN": JSON.parse(localStorage.getItem("CURRENT_LOGGED_IN_USER"))["TOKEN"] // WE NEED TO SEND THE TOKEN
                        },
                        body: JSON.stringify({
                            "NAME": CATEGORY_NAME, // SENDS THE NAME
                            "DESCRIPTION": CATEGORY_DESCRIPTION // SENDS THE DESCRIPTION
                        }) // WE NEED TO SEND THE JSON DATA
                    }); // SENDS THE REQUEST
                    switch ((await CATEGORY_RESPONSE).status) { // CHECKS THE RESPONSE
                        case 401: // IF THE USER IS NOT LOGGED IN OR IS NOT AN ADMIN
                            alert("UNAUTHORIZED"); // ALERTS THE USER
                            break;
                        case 400: // IF THE REQUEST IS BAD REQUEST
                            alert("BAD REQUEST"); // ALERTS THE USER
                            break;
                        case 201: // IF THE REQUEST IS SUCCESSFUL
                            alert("CATEGORY ADDED"); // ALERTS THE USER
                            const PRODUCT_RESPONSE = fetch("/PRODUCT", { // WE NEED TO SEND A REQUEST TO THE API
                                method: "POST", // WE NEED TO USE THE POST METHOD
                                headers: { // WE NEED TO SEND THE TOKEN IN THE HEADERS
                                    "Content-type": "application/json; charset=UTF-8", // WE NEED TO SEND THE JSON DATA
                                    "TOKEN": JSON.parse(localStorage.getItem("CURRENT_LOGGED_IN_USER"))["TOKEN"] // WE NEED TO SEND THE TOKEN
                                },
                                body: JSON.stringify({
                                    "NAME": PRODUCT_NAME, // SENDS THE NAME
                                    "DESCRIPTION": PRODUCT_DESCRIPTION, // SENDS THE DESCRIPTION
                                    "PRICE": PRODUCT_PRICE, // SENDS THE PRICE
                                    "CATEGORY": CATEGORY_NAME, // SENDS THE CATEGORY
                                    "IMAGE_URL": PRODUCT_IMAGE_URL // SENDS THE IMAGE URL
                                }) // WE NEED TO SEND THE JSON DATA
                            }); // SENDS THE REQUEST
                            switch ((await PRODUCT_RESPONSE).status) { // CHECKS THE RESPONSE
                                case 401: // IF THE USER IS NOT LOGGED IN OR IS NOT AN ADMIN
                                    alert("UNAUTHORIZED"); // ALERTS THE USER
                                    break;
                                case 400: // IF THE REQUEST IS BAD REQUEST
                                    alert("BAD REQUEST"); // ALERTS THE USER
                                    break;
                                case 201: // IF THE REQUEST IS SUCCESSFUL
                                    alert("PRODUCT ADDED"); // ALERTS THE USER
                                    break;
                                default: // IF THERE IS AN INTERNAL SERVER ERROR
                                    console.log("INTERNAL SERVER ERROR"); // LOGS THE ERROR
                                    break;
                            }
                            break;
                        default: // IF THERE IS AN INTERNAL SERVER ERROR
                            console.log("INTERNAL SERVER ERROR"); // LOGS THE ERROR
                            break;
                    }
                } else { // IF THE USER DOESN'T WANT TO ADD THE CATEGORY
                    alert("PRODUCT NOT ADDED"); // ALERTS THE USER
                }
            }
            break;
        default: // IF THERE IS AN INTERNAL SERVER ERROR
            console.log("INTERNAL SERVER ERROR"); // LOGS THE ERROR
            break;
    }
}

// DELETE_CATEGORY(): DELETES A CATEGORY (PROMPTS FOR NAME) TO THE DATABASE; IF SUCH EXISTS (USING THE API)
// CHECKS IF THEIRS A USER LOGGED IN, AND IF ITS ADMIN; OTHERWISE, IT WILL NOT ALLOW THE USER TO DELETE A CATEGORY
async function delete_category(category_name = null) {
    // WE NEED TO GET THE NAME OF THE CATEGORY
    const NAME = category_name ? category_name : prompt("NAME:"); // PROMPTS FOR THE NAME OF THE CATEGORY
    const RESPONSE = fetch("/CATEGORY?NAME=" + NAME, { // WE NEED TO SEND A REQUEST TO THE API
        method: "DELETE", // WE NEED TO USE THE DELETE METHOD
        headers: { // WE NEED TO SEND THE TOKEN IN THE HEADERS
            "Content-type": "application/json; charset=UTF-8", // WE NEED TO SEND THE JSON DATA
            "TOKEN": JSON.parse(localStorage.getItem("CURRENT_LOGGED_IN_USER"))["TOKEN"] // WE NEED TO SEND THE TOKEN
        }
    }); // SENDS THE REQUEST
    switch ((await RESPONSE).status) { // CHECKS THE RESPONSE
        case 401: // IF THE USER IS NOT LOGGED IN OR IS NOT AN ADMIN
            alert("UNAUTHORIZED"); // ALERTS THE USER
            break;
        case 400: // IF THE REQUEST IS BAD REQUEST
            alert("BAD REQUEST"); // ALERTS THE USER
            break;
        case 204: // IF THE REQUEST IS SUCCESSFUL
            alert("CATEGORY DELETED"); // ALERTS THE USER
            break;
        default: // IF THERE IS AN INTERNAL SERVER ERROR
            console.log("INTERNAL SERVER ERROR"); // LOGS THE ERROR
            break;
    }
}

// DELETE_PRODUCT(PRODUCT_NAME): DELETES A PRODUCT (PROMPTS FOR NAME) TO THE DATABASE; IF SUCH EXISTS (USING THE API) DELETES IT
// CHECKS IF THEIRS A USER LOGGED IN, AND IF ITS ADMIN; OTHERWISE, IT WILL NOT ALLOW THE USER TO DELETE THE PRODUCT
async function delete_product(product_id = null) {
    if (product_id) { // IF THE PRODUCT ID IS PROVIDED
        const RESPONSE = fetch("/PRODUCT?ID=" + product_id, { // WE NEED TO SEND A REQUEST TO THE API
            method: "DELETE", // WE NEED TO USE THE DELETE METHOD
            headers: { // WE NEED TO SEND THE TOKEN IN THE HEADERS
                "Content-type": "application/json; charset=UTF-8", // WE NEED TO SEND THE JSON DATA
                "TOKEN": JSON.parse(localStorage.getItem("CURRENT_LOGGED_IN_USER"))["TOKEN"] // WE NEED TO SEND THE TOKEN
            }
        }); // SENDS THE REQUEST
        switch ((await RESPONSE).status) { // CHECKS THE RESPONSE
            case 401: // IF THE USER IS NOT LOGGED IN OR IS NOT AN ADMIN
                alert("UNAUTHORIZED"); // ALERTS THE USER
                break;
            case 400: // IF THE REQUEST IS BAD REQUEST
                alert("BAD REQUEST"); // ALERTS THE USER
                break;
            case 204: // IF THE REQUEST IS SUCCESSFUL
                alert("PRODUCT DELETED"); // ALERTS THE USER
                break;
            default: // IF THERE IS AN INTERNAL SERVER ERROR
                console.log("INTERNAL SERVER ERROR"); // LOGS THE ERROR
                break;
        }
    } else { // IF THE PRODUCT ID IS NOT PROVIDED (PROMPTS FOR THE PRODUCT NAME)
        const NAME = prompt("NAME:"); // PROMPTS FOR THE NAME OF THE PRODUCT
        const RESPONSE = fetch("/PRODUCT?NAME=" + NAME, { // WE NEED TO SEND A REQUEST TO THE API
            method: "DELETE", // WE NEED TO USE THE DELETE METHOD
            headers: { // WE NEED TO SEND THE TOKEN IN THE HEADERS
                "Content-type": "application/json; charset=UTF-8", // WE NEED TO SEND THE JSON DATA
                "TOKEN": JSON.parse(localStorage.getItem("CURRENT_LOGGED_IN_USER"))["TOKEN"] // WE NEED TO SEND THE TOKEN
            }
        }); // SENDS THE REQUEST
        switch ((await RESPONSE).status) { // CHECKS THE RESPONSE
            case 401: // IF THE USER IS NOT LOGGED IN OR IS NOT AN ADMIN
                alert("UNAUTHORIZED"); // ALERTS THE USER
                break;
            case 400: // IF THE REQUEST IS BAD REQUEST
                alert("BAD REQUEST"); // ALERTS THE USER
                break;
            case 204: // IF THE REQUEST IS SUCCESSFUL
                alert("PRODUCT DELETED"); // ALERTS THE USER
                break;
            default: // IF THERE IS AN INTERNAL SERVER ERROR
                console.log("INTERNAL SERVER ERROR"); // LOGS THE ERROR
                break;
        }
    }
}