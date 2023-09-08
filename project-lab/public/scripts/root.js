"use strict";
var UserStatus;
(function (UserStatus) {
    UserStatus["LoggedIn"] = "Logged In";
    UserStatus["LoggingIn"] = "Logging In";
    UserStatus["LoggedOut"] = "Logged Out";
    UserStatus["LogInError"] = "Log In Error";
    UserStatus["VerifyingLogIn"] = "Verifying Log In";
    UserStatus["PartiallyLoggedIn"] = "Partially Logged In";
    UserStatus["SigningUp"] = "Signing Up";
})(UserStatus || (UserStatus = {}));
const defaultPosition = () => ({
    left: 0,
    x: 0
});
const N = {
    clamp: (min, value, max) => Math.min(Math.max(min, value), max),
    rand: (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
};
const T = {
    format: (date) => {
        const hours = T.formatHours(date.getHours()), minutes = date.getMinutes(), seconds = date.getSeconds();
        return `${hours}:${T.formatSegment(minutes)}`;
    },
    formatHours: (hours) => {
        return hours % 12 === 0 ? 12 : hours % 12;
    },
    formatSegment: (segment) => {
        return segment < 10 ? `0${segment}` : segment;
    }
};
var IsThisASignUp = false;
const CredentialsUtility = {
    // let USER = {
    //     "NAME": USERNAME, // SETS THE USERNAME
    //     "PIN": PIN, // SETS THE PIN
    // };
    // CHECKS IF THE USERNAME IS TAKEN
    check: async (USER) => {
        // return Credentials.find((credential) => credential.NAME === USER.NAME) !== undefined; // CHECKS IF THE USERNAME IS TAKEN
        const RESPONSE = await fetch(`/USER?NAME=${USER.NAME}`, { // SENDS A GET REQUEST TO THE SERVER TO GET THE USER
            method: "GET", // SETS THE METHOD TO GET
            headers: { "Content-type": "application/json; charset=UTF-8" } // SETS THE HEADERS
        }); // SENDS A GET REQUEST TO THE SERVER TO GET THE USER
        switch (RESPONSE.status) { // CHECKS THE RESPONSE STATUS
            case 404:
                // alert("NOT FOUND: THE USERNAME IS NOT FOUND"); // IF THE USERNAME IS NOT FOUND
                return [false, "User Not Found"]; // IF THE USERNAME IS NOT FOUND
            case 400:
                // alert("BAD REQUEST: NO USERNAME OR PASSWORD PROVIDED"); // IF THE USERNAME OR THE PASSWORD ARE EMPTY
                return [false, "Failed to Log In"]; // IF THE USERNAME OR THE PASSWORD ARE EMPTY
            case 200: // IF THE USERNAME AND THE PASSWORD ARE CORRECT
                // close_login_form(); // CLOSES THE LOGIN FORM
                let RECEIVED_USER = await RESPONSE.json(); // GETS THE USER
                return [true, RECEIVED_USER]; // GETS THE USER
            default: // IF THERE IS AN INTERNAL SERVER ERROR
                console.log("INTERNAL SERVER ERROR"); // IF THERE IS AN INTERNAL SERVER ERROR
                return [false, "Internal Server Error"]; // IF THERE IS AN INTERNAL SERVER ERROR
        }
    },
    // VERIFIES THE USERNAME AND PIN
    verify: async (USER) => {
        // return Credentials.find((credential) => credential.NAME === USER.NAME && credential.PIN === USER.PIN) !== undefined; // CHECKS IF THE USERNAME AND PIN MATCH
        const RESPONSE = await fetch(`/USER?NAME=${USER.NAME}&PIN=${USER.PIN}`, { // SENDS A GET REQUEST TO THE SERVER TO GET THE USER
            method: "GET", // SETS THE METHOD TO GET
            headers: { "Content-type": "application/json; charset=UTF-8" } // SETS THE HEADERS
        }); // SENDS A GET REQUEST TO THE SERVER TO GET THE USER
        switch (RESPONSE.status) { // CHECKS THE RESPONSE STATUS
            case 401:
                // alert("UNAUTHORIZED: THE USERNAME OR THE PASSWORD ARE INCORRECT"); // IF THE USERNAME OR THE PASSWORD ARE INCORRECT
                return [false, "Wrong Password"]; // IF THE USERNAME OR THE PASSWORD ARE INCORRECT
            case 404:
                // alert("NOT FOUND: THE USERNAME IS NOT FOUND"); // IF THE USERNAME IS NOT FOUND
                return [false, "User Not Found"]; // IF THE USERNAME IS NOT FOUND
            case 400:
                // alert("BAD REQUEST: NO USERNAME OR PASSWORD PROVIDED"); // IF THE USERNAME OR THE PASSWORD ARE EMPTY
                return [false, "Failed to Log In"]; // IF THE USERNAME OR THE PASSWORD ARE EMPTY
            case 200: // IF THE USERNAME AND THE PASSWORD ARE CORRECT
                // close_login_form(); // CLOSES THE LOGIN FORM
                let RECEIVED_USER = await RESPONSE.json(); // GETS THE USER
                return [true, RECEIVED_USER]; // GETS THE USER
            default: // IF THERE IS AN INTERNAL SERVER ERROR
                console.log("INTERNAL SERVER ERROR"); // IF THERE IS AN INTERNAL SERVER ERROR
                return [false, "Internal Server Error"]; // IF THERE IS AN INTERNAL SERVER ERROR
        }
    },
    // ADDS A NEW USER; IF A USER WITH THE SAME NAME ALREADY EXISTS, IT WILL BE OVERWRITTEN
    add: async (USER) => {
        // if (CredentialsUtility.check(USER)) {
        //     Credentials.splice(Credentials.findIndex((credential) => credential.NAME === USER.NAME), 1, USER);
        // }
        // else {
        //     Credentials.push(USER);
        // }
        const RESPONSE = await fetch(`/USER`, { // SENDS A POST REQUEST TO THE SERVER TO CREATE A NEW USER
            method: "POST", // SETS THE METHOD TO POST
            headers: { "Content-type": "application/json; charset=UTF-8" }, // SETS THE HEADERS
            body: JSON.stringify(USER) // SETS THE BODY
        });
        switch (RESPONSE.status) { // CHECKS THE RESPONSE STATUS
            case 422:
                // alert("UNPROCESSABLE ENTITY: THE NAME IS DIFERRENT FROM 5 CHARACTERS AND IF ITS NOT EMPTY, NULL OR WHITE SPACE (USING TRIM), AND IF THE PIN IS DIFERRENT FROM 4 CHARACTERS AND IF ITS NOT EMPTY, NULL OR WHITE SPACE (USING TRIM)"); // IF THE NAME IS DIFERRENT FROM 5 CHARACTERS AND IF ITS NOT EMPTY, NULL OR WHITE SPACE (USING TRIM), AND IF THE PIN IS DIFERRENT FROM 4 CHARACTERS AND IF ITS NOT EMPTY, NULL OR WHITE SPACE (USING TRIM)
                return [false, "Username or Pin Invalid"]; // IF THE NAME IS DIFERRENT FROM 5 CHARACTERS AND IF ITS NOT EMPTY, NULL OR WHITE SPACE (USING TRIM), AND IF THE PIN IS DIFERRENT FROM 4 CHARACTERS AND IF ITS NOT EMPTY, NULL OR WHITE SPACE (USING TRIM)
            case 409:
                // alert("CONFLICT: THE USERNAME IS ALREADY TAKEN"); // IF THE USERNAME IS ALREADY TAKEN
                return [false, "Username Already Taken"]; // IF THE USERNAME IS ALREADY TAKEN
            case 400:
                // alert("BAD REQUEST: NO USERNAME OR THE PASSWORD PROVIDED"); // IF THE USERNAME OR THE PASSWORD ARE EMPTY
                return [false, "Failed to Register"]; // IF THE USERNAME OR THE PASSWORD ARE EMPTY
            case 201: // IF THE USERNAME AND THE PASSWORD ARE CORRECT
                let RECEIVED_USER = await RESPONSE.json(); // GETS THE USER
                return [true, RECEIVED_USER]; // GETS THE USER
            default: // IF THERE IS AN INTERNAL SERVER ERROR
                console.log("INTERNAL SERVER ERROR"); // IF THERE IS AN INTERNAL SERVER ERROR
                return [false, "Internal Server Error"]; // IF THERE IS AN INTERNAL SERVER ERROR
        }
    }
};
const UsernameDigit = (props) => {
    const [hidden, setHiddenTo] = React.useState(false);
    React.useEffect(() => {
        if (props.value) {
            const timeout = setTimeout(() => {
                setHiddenTo(true);
            }, 500);
            return () => {
                setHiddenTo(false);
                clearTimeout(timeout);
            };
        }
    }, [props.value]);
    return (React.createElement("div", { className: classNames("app-username-digit", { focused: props.focused, hidden }) },
        React.createElement("span", { className: "app-username-digit-value" }, props.value || "")));
};
const PinDigit = (props) => {
    const [hidden, setHiddenTo] = React.useState(false);
    React.useEffect(() => {
        if (props.value) {
            const timeout = setTimeout(() => {
                setHiddenTo(true);
            }, 500);
            return () => {
                setHiddenTo(false);
                clearTimeout(timeout);
            };
        }
    }, [props.value]);
    return (React.createElement("div", { className: classNames("app-pin-digit", { focused: props.focused, hidden }) },
        React.createElement("span", { className: "app-pin-digit-value" }, props.value || "")));
};
var currentErrorMessage = "Invalid"; // THE CURRENT ERROR MESSAGE
const Username = () => {
    const { userStatus, setUserStatusTo } = React.useContext(AppContext);
    const [username, setUsernameTo] = React.useState("");
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (userStatus === UserStatus.LoggingIn || userStatus === UserStatus.LogInError) {
            ref.current.focus();
        }
        else {
            setUsernameTo("");
        }
    }, [userStatus]);
    React.useEffect(() => {
        if (username.length === 5) {
            const verify = async () => {
                try {
                    setUserStatusTo(UserStatus.VerifyingLogIn);
                    let USER = {
                        "NAME": username,
                        "PIN": null
                    };
                    if (IsThisASignUp === false) {
                        var RESPONSE = await CredentialsUtility.check(USER);
                        // RESPONSE IS A TUPLE OF [BOOLEAN, USER] IF BOOLEAN IS TRUE; OTHERWISE, IT IS A TUPLE OF [BOOLEAN, STRING], WHERE STRING IS THE ERROR MESSAGE
                        if (RESPONSE[0] === true) {
                            setUserStatusTo(UserStatus.PartiallyLoggedIn);
                            localStorage.setItem("CURRENT_LOGGED_IN_USER", JSON.stringify(RESPONSE[1])); // SETS THE CURRENT LOGGED IN USER
                        }
                        else {
                            localStorage.removeItem("CURRENT_LOGGED_IN_USER");
                            currentErrorMessage = RESPONSE[1];
                            setUserStatusTo(UserStatus.LogInError);
                        }
                    }
                    else {
                        var RESPONSE = await CredentialsUtility.check(USER);
                        // RESPONSE IS A TUPLE OF [BOOLEAN, USER] IF BOOLEAN IS TRUE; OTHERWISE, IT IS A TUPLE OF [BOOLEAN, STRING], WHERE STRING IS THE ERROR MESSAGE
                        if (RESPONSE[0] === false && RESPONSE[1] === "User Not Found") {
                            setUserStatusTo(UserStatus.PartiallyLoggedIn);
                            localStorage.setItem("CURRENT_LOGGED_IN_USER", JSON.stringify(USER)); // SETS THE CURRENT LOGGED IN USER
                        }
                        else {
                            localStorage.removeItem("CURRENT_LOGGED_IN_USER");
                            if (RESPONSE[1] !== "User Not Found") {
                                currentErrorMessage = "Username Already Taken";
                            } else {
                                currentErrorMessage = "Invalid.";
                            }
                            setUserStatusTo(UserStatus.LogInError);
                        }
                    }
                }
                catch (err) {
                    console.error(err);
                    setUserStatusTo(UserStatus.LogInError);
                    localStorage.removeItem("CURRENT_LOGGED_IN_USER");
                }
            };
            verify();
        }
        if (userStatus === UserStatus.LogInError) {
            setUserStatusTo(UserStatus.LoggingIn);
        }
    }, [username]);
    const handleOnClick = () => {
        ref.current.focus();
    };
    const handleOnCancel = () => {
        setUserStatusTo(UserStatus.LoggedOut);
        IsThisASignUp = false;
        localStorage.removeItem("CURRENT_LOGGED_IN_USER");
        document.getElementById("app").classList.add("no-sign-up");
        document.getElementById("app").classList.remove("sign-up");
    };
    const handleOnChange = (e) => {
        if (e.target.value.length <= 5) {
            setUsernameTo(e.target.value.toString());
        }
    };
    const handleOnSignUp = () => {
        IsThisASignUp = true;
        document.getElementById("app").classList.remove("no-sign-up");
        document.getElementById("app").classList.add("sign-up");
    };
    const getCancelText = () => {
        return (React.createElement("span", { id: "app-username-cancel-text", onClick: handleOnCancel }, "Cancel"));
    };
    const getErrorText = () => {
        if (userStatus === UserStatus.LogInError) {
            return (React.createElement("span", { id: "app-username-error-text" }, `${currentErrorMessage}`));
        }
    };
    const getSignUpText = () => {
        return (React.createElement("span", { id: "app-username-sign-up-text", onClick: handleOnSignUp }, "Don't have an account? Sign up."));
    };
    return (React.createElement("div", { id: "app-username-wrapper" },
        React.createElement("input", { disabled: userStatus !== UserStatus.LoggingIn && userStatus !== UserStatus.LogInError, id: "app-username-hidden-input", maxLength: 5, ref: ref, type: "string", value: username, onChange: handleOnChange, autoFocus: true }),
        React.createElement("div", { id: "app-username", onClick: handleOnClick },
            React.createElement(UsernameDigit, { focused: username.length === 0, value: username[0] }),
            React.createElement(UsernameDigit, { focused: username.length === 1, value: username[1] }),
            React.createElement(UsernameDigit, { focused: username.length === 2, value: username[2] }),
            React.createElement(UsernameDigit, { focused: username.length === 3, value: username[3] }),
            React.createElement(UsernameDigit, { focused: username.length === 4, value: username[4] })),
        React.createElement("h3", { id: "app-username-label" },
            "Enter Username ",
            getErrorText(),
            " ",
            getCancelText(),
            React.createElement("br", null),
            getSignUpText())));
};
const Pin = () => {
    const { userStatus, setUserStatusTo } = React.useContext(AppContext);
    const [pin, setPinTo] = React.useState("");
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (userStatus === UserStatus.PartiallyLoggedIn || userStatus === UserStatus.LoggingIn || userStatus === UserStatus.LogInError) {
            ref.current.focus();
        }
        else {
            setPinTo("");
        }
    }, [userStatus]);
    React.useEffect(() => {
        if (pin.length === 4) {
            const verify = async () => {
                try {
                    setUserStatusTo(UserStatus.VerifyingLogIn);
                    var username = JSON.parse(localStorage.getItem("CURRENT_LOGGED_IN_USER"))["NAME"];
                    let USER = {
                        "NAME": username, // SETS THE USERNAME
                        "PIN": pin, // SETS THE PIN
                    };
                    if (IsThisASignUp === true) {
                        var RESPONSE = await CredentialsUtility.add(USER);
                        // RESPONSE IS A TUPLE OF [BOOLEAN, USER] IF BOOLEAN IS TRUE; OTHERWISE, IT IS A TUPLE OF [BOOLEAN, STRING], WHERE STRING IS THE ERROR MESSAGE
                        if (RESPONSE[0] === true) {
                            setUserStatusTo(UserStatus.LoggedIn);
                            IsThisASignUp = false;
                            document.getElementById("app").classList.add("no-sign-up");
                            document.getElementById("app").classList.remove("sign-up");
                            localStorage.setItem("CURRENT_LOGGED_IN_USER", JSON.stringify(RESPONSE[1])); // SETS THE CURRENT LOGGED IN USER
                        }
                        else {
                            localStorage.removeItem("CURRENT_LOGGED_IN_USER");
                            currentErrorMessage = RESPONSE[1];
                            setUserStatusTo(UserStatus.LogInError);
                        }
                    } else {
                        var RESPONSE = await CredentialsUtility.verify(USER); // RESPONSE IS A TUPLE OF [BOOLEAN, USER] IF BOOLEAN IS TRUE; OTHERWISE, IT IS A TUPLE OF [BOOLEAN, STRING], WHERE STRING IS THE ERROR MESSAGE
                        if (RESPONSE[0] === true) {
                            setUserStatusTo(UserStatus.LoggedIn);
                            localStorage.setItem("CURRENT_LOGGED_IN_USER", JSON.stringify(RESPONSE[1])); // SETS THE CURRENT LOGGED IN USER
                        }
                        else {
                            localStorage.removeItem("CURRENT_LOGGED_IN_USER");
                            currentErrorMessage = RESPONSE[1];
                            setUserStatusTo(UserStatus.LogInError);
                        }
                    }
                }
                catch (err) {
                    console.error(err);
                    setUserStatusTo(UserStatus.LogInError);
                    localStorage.removeItem("CURRENT_LOGGED_IN_USER");
                }
            };
            verify();
        }
        if (userStatus === UserStatus.LogInError) {
            setUserStatusTo(UserStatus.LoggingIn);
        }
    }, [pin]);
    const handleOnClick = () => {
        ref.current.focus();
    };
    const handleOnCancel = () => {
        setUserStatusTo(UserStatus.LoggedOut);
        IsThisASignUp = false;
        localStorage.removeItem("CURRENT_LOGGED_IN_USER");
        document.getElementById("app").classList.add("no-sign-up");
        document.getElementById("app").classList.remove("sign-up");
    };
    const handleOnChange = (e) => {
        if (e.target.value.length <= 4) {
            setPinTo(e.target.value.toString());
        }
    };
    const getCancelText = () => {
        return (React.createElement("span", { id: "app-pin-cancel-text", onClick: handleOnCancel }, "Cancel"));
    };
    return (React.createElement("div", { id: "app-pin-wrapper" },
        React.createElement("input", { disabled: userStatus !== UserStatus.LoggingIn && userStatus !== UserStatus.LogInError && userStatus !== UserStatus.PartiallyLoggedIn, id: "app-pin-hidden-input", maxLength: 4, ref: ref, type: "number", value: pin, onChange: handleOnChange }),
        React.createElement("div", { id: "app-pin", onClick: handleOnClick },
            React.createElement(PinDigit, { focused: pin.length === 0, value: pin[0] }),
            React.createElement(PinDigit, { focused: pin.length === 1, value: pin[1] }),
            React.createElement(PinDigit, { focused: pin.length === 2, value: pin[2] }),
            React.createElement(PinDigit, { focused: pin.length === 3, value: pin[3] })),
        React.createElement("h3", { id: "app-pin-label" },
            "Enter PIN ",
            getCancelText())));
};
const UserStatusButton = (props) => {
    const { userStatus, setUserStatusTo } = React.useContext(AppContext);
    const handleOnClick = () => {
        setUserStatusTo(props.userStatus);
    };
    return (React.createElement("button", { id: props.id, className: "user-status-button clear-button", disabled: userStatus === props.userStatus, type: "button", onClick: handleOnClick },
        React.createElement("ion-icon", { name: props.icon })));
};
const Loading = () => {
    return (React.createElement("div", { id: "app-loading-icon" },
        React.createElement("ion-icon", { name: "game-controller" })));
};
const AppContext = React.createContext(null);
const App = () => {
    const [userStatus, setUserStatusTo] = React.useState(UserStatus.LoggedOut);
    const getStatusClass = () => {
        return userStatus.replace(/\s+/g, "-").toLowerCase();
    };
    const getIsThisASignUpClass = () => {
        return (IsThisASignUp === true ? "sign-up" : "no-sign-up");
    };
    React.useEffect(() => {
        if (localStorage.getItem("CURRENT_LOGGED_IN_USER") != null) {
            setUserStatusTo(UserStatus.LoggedIn);
        }
    }, []);
    React.useEffect(() => {
        if (userStatus === UserStatus.LoggedOut) {
            localStorage.removeItem("CURRENT_LOGGED_IN_USER");
        }
    }, [userStatus]);
    const handleSeeMore = () => {
        if (document.getElementById("app-our-team-header").innerHTML === "About Us") {
            document.getElementById("app-our-team-header").innerHTML = "Our Team";
            document.getElementById("app-our-team-paragraph").innerHTML = `We are a group of students from the Universidade Autónoma de Lisboa. Our resident clown is Mr. António Graça (with a master's degree in memeology); in second place, but as important, Mr. Afonso Romeiro, gun lover, secret (actually noy that secret) plane enthusiast; and last but not least, me, Mr. Pedro Simões (information redacted). We are a passionate bunch about board games and we want to share our passion with you. We hope you enjoy our website and have fun playing our games. If you have any questions or suggestions, please feel free to contact us. We would love to hear from you!`;
            document.getElementById("app-our-team-text").innerHTML = "Go to About Us";
        } else if (document.getElementById("app-our-team-header").innerHTML === "Our Team") {
            document.getElementById("app-our-team-header").innerHTML = "About Us";
            document.getElementById("app-our-team-paragraph").innerHTML = `Welcome to The Board Game Collective, your ultimate destination for all things board games! Whether you are looking for the the classics or some hidden gems, we have something for you. Browse and play our curated collection of games, and while you are at it, why not join our community of gamers, creators, reviewers, and enthusiasts. The Board Game Collective is more than just a website. It's a place where you can discover new worlds, challenge yourself, have fun, and make friends. Join us today and become part of the collective!`;
            document.getElementById("app-our-team-text").innerHTML = "Go to Our Team";
        }
    };
    return (React.createElement(AppContext.Provider, { value: { userStatus, setUserStatusTo } },
        React.createElement("div", { id: "app", className: `${getStatusClass()} ${getIsThisASignUpClass()}` },
            React.createElement(Username, null),
            // ONLY SHOW THE PIN IF THE USER IS PARTIALLY LOGGED IN
            userStatus === UserStatus.PartiallyLoggedIn && React.createElement(Pin, null),
            // React.createElement(Background, null),
            React.createElement("div", { id: "sign-in-button-wrapper" },
                // IF THE USER IS LOGGED OUT SHOW THE SIGN IN BUTTON, OTHERWISE SHOW THE SIGN OUT BUTTON
                userStatus === UserStatus.LoggedOut && (React.createElement(UserStatusButton, { id: "sign-in-button", userStatus: UserStatus.LoggingIn, icon: "log-in" })),
                userStatus === UserStatus.LoggedIn && (React.createElement(UserStatusButton, { id: "sign-out-button", userStatus: UserStatus.LoggedOut, icon: "log-out" }))),
            React.createElement(Loading, null),
            userStatus === UserStatus.LoggedIn && (
                React.createElement("div", { id: "game_hub", className: "grid" },
                    React.createElement("div", { className: "card" },
                        React.createElement("a", { href: "chess.html" },
                            React.createElement("h4", null, "Chess"),
                            React.createElement("p", null, "Chess is a great way to exercise your brain, impress your friends, and annoy your enemies. Just don't flip the board if you lose."),
                            React.createElement("div", { className: "shine" }),
                            React.createElement("div", { className: "background" },
                                React.createElement("div", { className: "tiles" },
                                    React.createElement("div", { className: "tile tile-1" }),
                                    React.createElement("div", { className: "tile tile-2" }),
                                    React.createElement("div", { className: "tile tile-3" }),
                                    React.createElement("div", { className: "tile tile-4" }),
                                    React.createElement("div", { className: "tile tile-5" }),
                                    React.createElement("div", { className: "tile tile-6" }),
                                    React.createElement("div", { className: "tile tile-7" }),
                                    React.createElement("div", { className: "tile tile-8" }),
                                    React.createElement("div", { className: "tile tile-9" }),
                                    React.createElement("div", { className: "tile tile-10" })),
                                React.createElement("div", { className: "line line-1" }),
                                React.createElement("div", { className: "line line-2" }),
                                React.createElement("div", { className: "line line-3" })))),
                    React.createElement("div", { className: "card" },
                        React.createElement("a", { href: "checkers.html" },
                            React.createElement("h4", null, "Checkers"),
                            React.createElement("p", null, "The game is also known as draughts, but don't confuse it with the delicious pastries. Checkers is fun for all ages, especially if you like to say \"king me\" a lot."),
                            React.createElement("div", { className: "shine" }),
                            React.createElement("div", { className: "background" },
                                React.createElement("div", { className: "tiles" },
                                    React.createElement("div", { className: "tile tile-1" }),
                                    React.createElement("div", { className: "tile tile-2" }),
                                    React.createElement("div", { className: "tile tile-3" }),
                                    React.createElement("div", { className: "tile tile-4" }),
                                    React.createElement("div", { className: "tile tile-5" }),
                                    React.createElement("div", { className: "tile tile-6" }),
                                    React.createElement("div", { className: "tile tile-7" }),
                                    React.createElement("div", { className: "tile tile-8" }),
                                    React.createElement("div", { className: "tile tile-9" }),
                                    React.createElement("div", { className: "tile tile-10" })),
                                React.createElement("div", { className: "line line-1" }),
                                React.createElement("div", { className: "line line-2" }),
                                React.createElement("div", { className: "line line-3" })))),
                    React.createElement("div", { className: "card" },
                        React.createElement("a", { href: "minesweeper.html" },
                            React.createElement("h4", null, "Minesweeper"),
                            React.createElement("p", null, "Try to avoid clicking on hidden bombs. Sounds easy, right? Wrong! If you make one mistake, boom! Game over. So, are you ready for some explosive fun?"),
                            React.createElement("div", { className: "shine" }),
                            React.createElement("div", { className: "background" },
                                React.createElement("div", { className: "tiles" },
                                    React.createElement("div", { className: "tile tile-1" }),
                                    React.createElement("div", { className: "tile tile-2" }),
                                    React.createElement("div", { className: "tile tile-3" }),
                                    React.createElement("div", { className: "tile tile-4" }),
                                    React.createElement("div", { className: "tile tile-5" }),
                                    React.createElement("div", { className: "tile tile-6" }),
                                    React.createElement("div", { className: "tile tile-7" }),
                                    React.createElement("div", { className: "tile tile-8" }),
                                    React.createElement("div", { className: "tile tile-9" }),
                                    React.createElement("div", { className: "tile tile-10" })),
                                React.createElement("div", { className: "line line-1" }),
                                React.createElement("div", { className: "line line-2" }),
                                React.createElement("div", { className: "line line-3" })))))),
            userStatus === UserStatus.LoggedOut && (
                React.createElement("div", { id: "about_us", className: "grid", style: { gridTemplateColumns: "repeat(1, 40rem)" } },
                    React.createElement("div", { className: "card" },
                        React.createElement("h4", { id: "app-our-team-header" }, "About Us"),
                        React.createElement("p", { id: "app-our-team-paragraph" }, "Welcome to The Board Game Collective, your ultimate destination for all things board games! Whether you are looking for the the classics or some hidden gems, we have something for you. Browse and play our curated collection of games, and while you are at it, why not join our community of gamers, creators, reviewers, and enthusiasts. The Board Game Collective is more than just a website. It's a place where you can discover new worlds, challenge yourself, have fun, and make friends. Join us today and become part of the collective!"),
                        React.createElement("span", { id: "app-our-team-text", onClick: handleSeeMore }, "Go to Our Team"),
                        React.createElement("div", { className: "shine" }),
                        React.createElement("div", { className: "background" },
                            React.createElement("div", { className: "tiles" },
                                React.createElement("div", { className: "tile tile-1" }),
                                React.createElement("div", { className: "tile tile-2" }),
                                React.createElement("div", { className: "tile tile-3" }),
                                React.createElement("div", { className: "tile tile-4" }),
                                React.createElement("div", { className: "tile tile-5" }),
                                React.createElement("div", { className: "tile tile-6" }),
                                React.createElement("div", { className: "tile tile-7" }),
                                React.createElement("div", { className: "tile tile-8" }),
                                React.createElement("div", { className: "tile tile-9" }),
                                React.createElement("div", { className: "tile tile-10" })),
                            React.createElement("div", { className: "line line-1" }),
                            React.createElement("div", { className: "line line-2" }),
                            React.createElement("div", { className: "line line-3" })))))
        )));
};
ReactDOM.render(React.createElement(App, null), document.getElementById("root"));