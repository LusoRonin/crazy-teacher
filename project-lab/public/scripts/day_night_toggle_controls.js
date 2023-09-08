document.querySelector(".day-night input").addEventListener("change", () => { // DAY/NIGHT TOGGLE BUTTON
  document.querySelector("body").classList.add("toggle"); // ADD CLASS 'TOGGLE' TO BODY, IN ORDER TO TRIGGER THE TRANSITION
  setTimeout(() => { // SET TIMEOUT TO REMOVE CLASS 'TOGGLE' FROM BODY, IN ORDER TO TRIGGER THE TRANSITION
    document.querySelector("body").classList.toggle("light"); // TOGGLE CLASS 'LIGHT' ON BODY
    setTimeout(
      () => document.querySelector("body").classList.remove("toggle"), // REMOVE CLASS 'TOGGLE' FROM BODY, IN ORDER TO TRIGGER THE TRANSITION
      10
    );
  }, 5);
}); // END OF DAY/NIGHT TOGGLE BUTTON

window.onload = () => { // CHECK IF USER HAS DARK MODE ENABLED ON THEIR DEVICE, ON PAGE LOAD
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { // IF USER HAS DARK MODE ENABLED ON THEIR DEVICE
    document.querySelector("body").classList.remove("light"); // REMOVE CLASS 'LIGHT' FROM BODY
  } else { // IF USER HAS LIGHT MODE ENABLED ON THEIR DEVICE
    document.querySelector("body").classList.add("light"); // ADD CLASS 'LIGHT' TO BODY
  } // END OF IF STATEMENT
} // END OF CHECK IF USER HAS DARK MODE ENABLED ON THEIR DEVICE, ON PAGE LOAD

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => { // CHECK IF USER HAS DARK MODE ENABLED ON THEIR DEVICE, ON THEME CHANGE
  const newColorScheme = event.matches ? "dark" : "light"; // IF USER HAS DARK MODE ENABLED ON THEIR DEVICE
  if (newColorScheme == "dark") { // IF USER HAS DARK MODE ENABLED ON THEIR DEVICE
    document.querySelector("body").classList.remove("light"); // REMOVE CLASS 'LIGHT' FROM BODY
  } else { // IF USER HAS LIGHT MODE ENABLED ON THEIR DEVICE
    document.querySelector("body").classList.add("light"); // ADD CLASS 'LIGHT' TO BODY
  } // END OF IF STATEMENT
}); // END OF CHECK IF USER HAS DARK MODE ENABLED ON THEIR DEVICE, ON THEME CHANGE