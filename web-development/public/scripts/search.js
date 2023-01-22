// SEARCH(): HIGHTLIGHTS ALL RESULTS IN THE WEBSITE THAT MATCH THE SEARCH QUERY (NON-CASE SENSITIVE); AND SCROLLS TO THE FIRST.
function search() {
    // REMOVE ALL THE HIGHLIGHTS
    const MARKS = document.querySelectorAll("mark");
    for (let i = 0; i < MARKS.length; i++) {
        MARKS[i].outerHTML = MARKS[i].innerHTML;
    }
    // WE NEED TO GET THE QUERY
    const QUERY = document.getElementById("search_input").value;
    // IF THE QUERY IS EMPTY, THEN WE DON'T NEED TO DO ANYTHING
    if (QUERY == "") {
        return;
    } else {
        // OTHERWISE, WE NEED TO HIGHLIGHT ALL THE RESULTS
        // WE NEED TO GET ALL THE ELEMENTS THAT HAVE THE P, I, B, H1, H2, H3, H4, H5 AND H6 TAGS
        const ELEMENTS = document.querySelectorAll("p, i, b, h1, h2, h3, h4, h5, h6");
        // WE NEED TO LOOP THROUGH ALL THE ELEMENTS
        for (let i = 0; i < ELEMENTS.length; i++) {
            // WE NEED TO GET THE TEXT OF THE ELEMENT
            const TEXT = ELEMENTS[i].innerHTML;
            // WE NEED TO CHECK IF THE QUERY IS IN THE TEXT
            if (TEXT.toLowerCase().includes(QUERY.toLowerCase())) {
                // IF IT IS, THEN WE NEED TO HIGHLIGHT THE TEXT
                ELEMENTS[i].innerHTML = TEXT.replace(QUERY, `<mark>${QUERY}</mark>`);
            }
        }
    }
}