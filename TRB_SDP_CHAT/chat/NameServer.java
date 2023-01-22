import java.io.*;
import java.awt.*;

// NAME SERVER CLASS: THIS CLASS IS THE NAME SERVER FOR THE CHAT APPLICATION AND IS RESPONSIBLE FOR KEEPING TRACK OF THE USERS AND THEIR IP ADDRESSES
public class NameServer extends Frame {
    TextArea NameServer = new TextArea(12, 40); // TEXT AREA TO DISPLAY THE USERS AND THEIR IP ADDRESSES
    NameServerSocket sock = new NameServerSocket(NameServer); // NAME SERVER SOCKET CLASS

    // [CONSTRUCTOR]--------------------------------------------------------------------------------------
    // INITIALIZE THE NAME SERVER FRAME
    public NameServer(String nm) {
        super(nm); // CALLS THE CONSTRUCTOR OF THE FRAME CLASS
    }

    // [GUI]----------------------------------------------------------------------------------------------
    // SETS UP THE GUI FOR THE NAME SERVER
    public void GUI() {
        setBackground(Color.lightGray); // SETS THE BACKGROUND COLOR OF THE FRAME
        NameServer.setEditable(false); // SETS THE TEXT AREA TO READ ONLY
        GridBagLayout GBL = new GridBagLayout(); // CREATES A GRID BAG LAYOUT
        setLayout(GBL); // SETS THE LAYOUT OF THE FRAME TO THE GRID BAG LAYOUT
        Panel P1 = new Panel(); // CREATES A PANEL
        P1.setLayout(new BorderLayout(5, 5)); // SETS THE LAYOUT OF THE PANEL TO BORDER LAYOUT
        P1.add("Center", NameServer); // ADDS THE TEXT AREA TO THE CENTER OF THE PANEL
        GridBagConstraints P1C = new GridBagConstraints(); // CREATES A GRID BAG CONSTRAINTS OBJECT
        P1C.gridwidth = GridBagConstraints.REMAINDER; // SETS THE GRID WIDTH TO REMAINDER
        GBL.setConstraints(P1, P1C); // SETS THE CONSTRAINTS OF THE PANEL TO THE GRID BAG CONSTRAINTS OBJECT
        add(P1); // ADDS THE PANEL TO THE FRAME
    } // END OF GUI METHOD

    // [METHODS]-----------------------------------------------------------------------------------------
    // STARTSOCKET METHOD: STARTS THE NAME SERVER SOCKET
    public void StartSocket() {
        sock.start(); // STARTS THE NAME SERVER SOCKET
    }

    // HANDLEEVENT METHOD: HANDLES THE WINDOW DESTROY EVENT
    public boolean handleEvent(Event i) {
        if (i.id == Event.WINDOW_DESTROY) { // IF THE WINDOW DESTROY EVENT IS DETECTED
            dispose(); // DISPOSES THE FRAME
            System.exit(0); // EXITS THE APPLICATION
            return true; // RETURNS TRUE
        } // END OF IF STATEMENT
        return super.handleEvent(i); // CALLS THE HANDLEEVENT METHOD OF THE FRAME CLASS
    } // END OF HANDLEEVENT METHOD

    // [MAIN METHOD]--------------------------------------------------------------------------------------
    // MAIN METHOD: CREATES THE NAME SERVER FRAME AND STARTS THE NAME SERVER SOCKET
    public static void main(String[] args) throws IOException {
        NameServer app = new NameServer("Name Service"); // CREATES THE NAME SERVER FRAME
        app.resize(320, 240); // RESIZES THE FRAME
        app.GUI(); // CALLS THE GUI METHOD
        app.show(); // SHOWS THE FRAME
        app.StartSocket(); // CALLS THE STARTSOCKET METHOD
    } // END OF MAIN METHOD
} // END OF NAME SERVER CLASS