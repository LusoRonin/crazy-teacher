import java.io.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

// REGISTRY SERVICE: THIS CLASS IS THE REGISTRY SERVICE FOR THE CHAT.
public class Registry extends Frame {
    TextArea Registry = new TextArea(12, 40); // REGISTRY TEXT AREA
    RegistrySocket sock = new RegistrySocket(Registry); // REGISTRY SOCKET

    // [CONSTRUCTOR]----------------------------------------------------------
    // THIS CONSTRUCTOR CREATES A NEW REGISTRY SERVICE.
    public Registry(String nm) {
        super(nm); // CALL THE FRAME CONSTRUCTOR
    } // END OF CONSTRUCTOR

    // [GUI]------------------------------------------------------------------
    // THIS METHOD CREATES THE GUI FOR THE REGISTRY SERVICE.
    public void GUI() {
        setBackground(Color.lightGray); // SET THE BACKGROUND COLOR
        Registry.setEditable(false); // SET THE TEXT AREA TO READ ONLY
        GridBagLayout GBL = new GridBagLayout(); // CREATE A NEW LAYOUT
        setLayout(GBL); // SET THE LAYOUT
        Panel P1 = new Panel(); // CREATE A NEW PANEL
        P1.setLayout(new BorderLayout(5, 5)); // SET THE PANEL LAYOUT
        P1.add("Center", Registry); // ADD THE TEXT AREA TO THE PANEL
        GridBagConstraints P1C = new GridBagConstraints(); // CREATE A NEW
        P1C.gridwidth = GridBagConstraints.REMAINDER; // SET THE GRID WIDTH
        GBL.setConstraints(P1, P1C); // SET THE CONSTRAINTS
        add(P1); // ADD THE PANEL TO THE FRAME
    } // END OF GUI

    // [METHODS]--------------------------------------------------------------
    // START THE REGISTRY SOCKET: THIS METHOD STARTS THE REGISTRY SOCKET.
    public void StartSocket() {
        sock.start(); // START THE REGISTRY SOCKET
    } // END OF StartSocket

    // HANDLE THE WINDOW DESTROY EVENT: THIS METHOD HANDLES THE WINDOW DESTROY
    public boolean handleEvent(Event i) {
        if (i.id == Event.WINDOW_DESTROY) { // IF THE WINDOW IS DESTROYED
            dispose(); // DISPOSE OF THE WINDOW
            System.exit(0); // EXIT THE APPLICATION
            return true; // RETURN TRUE
        } // END OF IF
        return super.handleEvent(i); // RETURN THE EVENT
    } // END OF handleEvent

    // [MAIN METHOD]----------------------------------------------------------
    // MAIN METHOD: THIS IS THE MAIN METHOD FOR THE REGISTRY SERVICE.
    public static void main(String[] args) throws IOException {
        Registry app = new Registry("Registry Service"); // CREATE A NEW REGISTRY SERVICE
        app.resize(320, 240); // RESIZE THE FRAME
        app.GUI(); // CREATE THE GUI
        app.show(); // SHOW THE FRAME
        app.StartSocket(); // START THE REGISTRY SOCKET
    } // END OF MAIN METHOD
} // END OF REGISTRY CLASS