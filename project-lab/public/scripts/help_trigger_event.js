window.addEventListener(
    "keydown",
    (event) => {
        if (event.defaultPrevented) {
            return; // Do nothing if the event was already processed
        }
        switch (event.key) {
            case "F1":
                document.getElementById("brief-overview-modal").open = false;
                if (document.getElementById("how-to-play-modal").open == false) {
                    document.getElementById("how-to-play-modal").open = true;
                } else {
                    document.getElementById("how-to-play-modal").open = false;
                }
                break;
            case "F2":
                document.getElementById("how-to-play-modal").open = false;
                if (document.getElementById("brief-overview-modal").open == false) {
                    document.getElementById("brief-overview-modal").open = true;
                } else {
                    document.getElementById("brief-overview-modal").open = false;
                }
                break;
            case "Escape":
                // CLOSE ALL MODALS
                document.getElementById("how-to-play-modal").open = false;
                document.getElementById("brief-overview-modal").open = false;
                break;
            default:
                return; // Quit when this doesn't handle the key event.
        }
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    },
    true
);