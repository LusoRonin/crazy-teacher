// AUTHOR: PEDRO SIMÕES & ANTÓNIO GRAÇA

// [IMPORTS]------------------------------------------------------------------
import java.io.*;
import java.awt.*;

// NAME SERVER: THIS IS THE NAME SERVER WINDOW THAT WILL DISPLAY THE IP ADDRESS OF THE SERVER AND THE PORT NUMBER THAT THE SERVER IS LISTENING ON
public class NameServer extends Frame {
    TextArea NameServer = new TextArea(12, 40); // TEXT AREA TO DISPLAY THE IP ADDRESS OF THE SERVER
    NameServerSocket sock = new NameServerSocket(NameServer); // CREATE A NEW SERVER SOCKET

    // [CONSTRUCTOR]------------------------------------------------------------
    // INITIALIZE THE NAME SERVER WINDOW
    public NameServer(String nm) {
        super(nm); // CALL THE CONSTRUCTOR OF THE FRAME CLASS
    } // END OF CONSTRUCTOR

    // [GUI]--------------------------------------------------------------------
    // CREATE THE GUI FOR THE NAME SERVER WINDOW
    public void GUI() {
        setBackground(Color.lightGray); // SET THE BACKGROUND COLOR OF THE WINDOW
        NameServer.setEditable(false); // SET THE TEXT AREA TO NOT BE EDITABLE
        GridBagLayout GBL = new GridBagLayout(); // CREATE A NEW GRID BAG LAYOUT
        setLayout(GBL); // SET THE LAYOUT OF THE WINDOW TO THE GRID BAG LAYOUT
        Panel P1 = new Panel(); // CREATE A NEW PANEL
        P1.setLayout(new BorderLayout(5, 5)); // SET THE LAYOUT OF THE PANEL TO A BORDER LAYOUT
        P1.add("Center", NameServer); // ADD THE TEXT AREA TO THE CENTER OF THE PANEL
        GridBagConstraints P1C = new GridBagConstraints(); // CREATE A NEW GRID BAG CONSTRAINTS OBJECT
        P1C.gridwidth = GridBagConstraints.REMAINDER; // SET THE GRID WIDTH TO REMAINDER
        GBL.setConstraints(P1, P1C); // SET THE CONSTRAINTS OF THE PANEL TO THE GRID BAG CONSTRAINTS OBJECT
        add(P1); // ADD THE PANEL TO THE WINDOW
    } // END OF GUI

    // [METHODS]----------------------------------------------------------------
    // START THE SERVER SOCKET
    public void StartSocket() {
        sock.start(); // START THE SERVER SOCKET
    } // END OF StartSocket

    // HANDLEEVENT: THIS METHOD WILL HANDLE THE EVENTS THAT OCCUR IN THE WINDOW SUCH
    // AS THE WINDOW BEING CLOSED.
    public boolean handleEvent(Event i) {
        if (i.id == Event.WINDOW_DESTROY) { // IF THE WINDOW IS BEING CLOSED
            dispose(); // DISPOSE OF THE WINDOW
            System.exit(0); // EXIT THE PROGRAM
            return true; // RETURN TRUE
        } // END OF IF
        return super.handleEvent(i); // RETURN THE EVENT TO THE SUPERCLASS
    } // END OF handleEvent

    // [MAIN]-------------------------------------------------------------------
    // MAIN METHOD: THIS IS THE MAIN METHOD OF THE PROGRAM AND WILL BE THE FIRST
    // METHOD TO BE CALLED WHEN THE PROGRAM IS RUN
    public static void main(String[] args) throws IOException {
        NameServer app = new NameServer("Name Service"); // CREATE A NEW NAME SERVER WINDOW
        app.resize(320, 240); // RESIZE THE WINDOW
        app.GUI(); // CALL THE GUI METHOD
        app.show(); // SHOW THE WINDOW
        app.StartSocket(); // START THE SERVER SOCKET
    } // END OF main
} // END OF NameServer