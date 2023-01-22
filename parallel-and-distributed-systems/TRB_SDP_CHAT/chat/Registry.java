// AUTHOR: PEDRO SIMÕES & ANTÓNIO GRAÇA

// [IMPORTS]------------------------------------------------------------------
import java.io.*;
import java.awt.*;

// REGISTRY: THIS IS THE REGISTRY WINDOW
public class Registry extends Frame {
    TextArea Registry = new TextArea(12, 40); // TEXT AREA TO DISPLAY THE IP ADDRESS OF THE SERVER
    RegistrySocket sock = new RegistrySocket(Registry); // CREATE A NEW SERVER SOCKET

    // [CONSTRUCTOR]------------------------------------------------------------
    // INITIALIZE THE REGISTRY WINDOW
    public Registry(String nm) {
        super(nm); // CALL THE CONSTRUCTOR OF THE FRAME CLASS
    } // END OF CONSTRUCTOR

    // [GUI]--------------------------------------------------------------------
    // CREATE THE GUI FOR THE REGISTRY WINDOW
    public void GUI() {
        setBackground(Color.lightGray); // SET THE BACKGROUND COLOR OF THE WINDOW
        Registry.setEditable(false); // SET THE TEXT AREA TO NOT BE EDITABLE
        GridBagLayout GBL = new GridBagLayout(); // CREATE A NEW GRID BAG LAYOUT
        setLayout(GBL); // SET THE LAYOUT OF THE WINDOW TO THE GRID BAG LAYOUT
        Panel P1 = new Panel(); // CREATE A NEW PANEL
        P1.setLayout(new BorderLayout(5, 5)); // SET THE LAYOUT OF THE PANEL TO A BORDER LAYOUT
        P1.add("Center", Registry); // ADD THE TEXT AREA TO THE CENTER OF THE PANEL
        GridBagConstraints P1C = new GridBagConstraints(); // CREATE A NEW GRID BAG CONSTRAINTS
        P1C.gridwidth = GridBagConstraints.REMAINDER; // SET THE GRID WIDTH TO REMAINDER
        GBL.setConstraints(P1, P1C); // SET THE CONSTRAINTS OF THE PANEL
        add(P1); // ADD THE PANEL TO THE WINDOW
    } // END OF GUI

    // [METHODS]----------------------------------------------------------------
    // START THE SERVER SOCKET
    public void StartSocket() {
        sock.start(); // START THE SERVER SOCKET
    } // END OF StartSocket

    // handleEvent: HANDLE THE WINDOW DESTROY EVENT
    public boolean handleEvent(Event i) {
        if (i.id == Event.WINDOW_DESTROY) { // IF THE WINDOW DESTROY EVENT IS TRIGGERED
            dispose(); // DISPOSE THE WINDOW
            System.exit(0); // EXIT THE PROGRAM
            return true; // RETURN TRUE
        } // END OF IF
        return super.handleEvent(i); // RETURN THE EVENT
    } // END OF handleEvent

    // [MAIN]-------------------------------------------------------------------
    // MAIN METHOD: CREATE A NEW REGISTRY WINDOW
    public static void main(String[] args) throws IOException {
        Registry app = new Registry("Registry Service"); // CREATE A NEW REGISTRY WINDOW
        app.resize(320, 240); // RESIZE THE WINDOW
        app.GUI(); // CREATE THE GUI
        app.show(); // SHOW THE WINDOW
        app.StartSocket(); // START THE SERVER SOCKET
    } // END OF MAIN
} // END OF CLASS Registry