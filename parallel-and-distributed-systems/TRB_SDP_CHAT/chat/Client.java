// AUTHOR: PEDRO SIMÕES & ANTÓNIO GRAÇA

// [IMPORTS]------------------------------------------------------------------
import java.io.*;
import java.awt.*;
import javax.swing.JOptionPane;
import java.util.concurrent.TimeUnit;

// CLIENT CLASS: THIS CLASS IS THE MAIN CLASS FOR THE CLIENT SIDE OF THE APPLICATION AND IS RESPONSIBLE FOR THE GUI AND THE CLIENT SOCKET CLASS.
public class Client extends Frame {
    TextArea ecran = new TextArea(10, 30); // TEXT AREA FOR THE CHAT WINDOW
    TextField addr = new TextField(30); // TEXT FIELD FOR THE IP ADDRESS
    TextField text = new TextField(30); // TEXT FIELD FOR THE MESSAGE
    Label userlab = new Label(); // LABEL FOR THE USERNAME
    Button Send = new Button("Send"); // SEND BUTTON
    CliSocket sock = new CliSocket(ecran); // CLIENT SOCKET CLASS: THIS CLASS IS RESPONSIBLE FOR THE CLIENT SOCKET AND THE CLIENT SOCKET THREAD.
    String cliRegister; // STRING FOR THE CLIENT REGISTRATION: THIS IS THE STRING THAT IS SENT TO THE SERVER TO REGISTER THE CLIENT.
    String user = null; // STRING FOR THE USERNAME: THIS IS THE USERNAME THAT THE CLIENT WILL USE TO LOGIN.
    String formUser = null; // STRING FOR THE FORMATTED USERNAME: THIS IS THE USERNAME THAT IS SENT TO THE SERVER.
    String str = null; // STRING FOR THE MESSAGE: THIS IS THE MESSAGE THAT THE CLIENT WILL SEND TO THE SERVER.
    String strport = null; // STRING FOR THE PORT: THIS IS THE PORT THAT THE CLIENT WILL BE LISTENING ON.
    String tmpPort = null; // STRING FOR THE TEMPORARY PORT: THIS IS THE PORT THAT THE CLIENT WILL BE LISTENING ON BEFORE IT IS REGISTERED.
    int port; // INT FOR THE PORT: THIS IS THE PORT THAT THE CLIENT WILL BE LISTENING ON.
    boolean userLenValid = false; // BOOLEAN FOR THE USERNAME LENGTH VALIDATION: THIS BOOLEAN IS USED TO VALIDATE THE USERNAME LENGTH.
    boolean portLenValid = false; // BOOLEAN FOR THE PORT LENGTH VALIDATION: THIS BOOLEAN IS USED TO VALIDATE THE PORT LENGTH.
    boolean userRegValid = false; // BOOLEAN FOR THE USERNAME REGISTRATION VALIDATION: THIS BOOLEAN IS USED TO VALIDATE THE USERNAME REGISTRATION.
    boolean setup = false; // BOOLEAN FOR THE SETUP: THIS BOOLEAN IS USED TO VALIDATE THE SETUP.

    // [CONSTRUCTOR]--------------------------------------------------------------------------------
    // THIS CONSTRUCTOR IS USED TO INITIALIZE THE GUI AND THE CLIENT SOCKET. IT ALSO
    // SETS THE TITLE OF THE FRAME.
    public Client(String str) {
        super(str); // SETS THE TITLE OF THE FRAME
    } // END OF CONSTRUCTOR

    // [METHODS]------------------------------------------------------------------------------------
    // GETCLIENTREGISTER: THIS METHOD RETURNS THE CLIENT REGISTRATION STRING.
    public String getCliRegister() {
        return cliRegister; // RETURNS THE CLIENT REGISTRATION STRING
    } // END OF GETCLIENTREGISTER

    // GUI: THIS METHOD IS USED TO INITIALIZE THE GUI.
    public void GUI() {
        setBackground(Color.lightGray); // SETS THE BACKGROUND COLOR OF THE FRAME
        ecran.setEditable(false); // SETS THE CHAT WINDOW TO NOT BE EDITABLE
        GridBagLayout GBL = new GridBagLayout(); // CREATES A NEW GRIDBAGLAYOUT
        setLayout(GBL); // SETS THE LAYOUT OF THE FRAME TO THE GRIDBAGLAYOUT
        Panel P1 = new Panel(); // CREATES A NEW PANEL
        P1.setLayout(new BorderLayout(5, 5)); // SETS THE LAYOUT OF THE PANEL TO BORDERLAYOUT
        P1.add("North", userlab); // ADDS THE USERNAME LABEL TO THE PANEL
        P1.add("Center", text); // ADDS THE MESSAGE TEXT FIELD TO THE PANEL
        P1.add("West", addr); // ADDS THE IP ADDRESS TEXT FIELD TO THE PANEL
        P1.add("East", Send); // ADDS THE SEND BUTTON TO THE PANEL
        P1.add("South", ecran); // ADDS THE CHAT WINDOW TO THE PANEL
        GridBagConstraints P1C = new GridBagConstraints(); // CREATES A NEW GRIDBAGCONSTRAINTS
        P1C.gridwidth = GridBagConstraints.REMAINDER; // SETS THE GRIDWIDTH OF THE GRIDBAGCONSTRAINTS TO REMAINDER
        GBL.setConstraints(P1, P1C); // SETS THE CONSTRAINTS OF THE PANEL TO THE GRIDBAGCONSTRAINTS
        add(P1); // ADDS THE PANEL TO THE FRAME
    } // END OF GUI

    // SETUPCLIENT: THIS METHOD IS USED TO SETUP THE CLIENT.
    public void setupClient() {
        while (!setup) { // WHILE THE SETUP IS NOT COMPLETE
            int loginOption = JOptionPane.showConfirmDialog(null, "Do you have an account?", "Login",
                    JOptionPane.YES_NO_OPTION); // CREATES A NEW CONFIRMATION DIALOG: THIS DIALOG ASKS THE USER IF THEY HAVE AN ACCOUNT. IF THEY DO, THEY WILL BE ASKED TO ENTER THEIR USERNAME AND PORT. IF THEY DO NOT, THEY WILL BE ASKED TO ENTER A USERNAME AND PORT.
            switch (loginOption) { // SWITCH STATEMENT FOR THE LOGIN OPTION
                case JOptionPane.YES_OPTION: // IF THE USER HAS AN ACCOUNT
                    user = JOptionPane.showInputDialog("Enter your username"); // CREATES A NEW INPUT DIALOG: THIS DIALOG ASKS THE USER TO ENTER THEIR USERNAME.
                    if (user == null) { // IF THE USER CLICKS THE CANCEL BUTTON
                        break; // BREAKS OUT OF THE SWITCH STATEMENT
                    } // END OF IF
                    while (!userLenValid) { // WHILE THE USERNAME LENGTH IS NOT VALID
                        if (user.length() > 0) { // IF THE USERNAME LENGTH IS GREATER THAN 0
                            userLenValid = true; // SETS THE USERNAME LENGTH VALIDATION TO TRUE
                            break; // BREAKS OUT OF THE WHILE LOOP
                        } // END OF IF
                        else { // IF THE USERNAME LENGTH IS NOT GREATER THAN 0
                            user = JOptionPane.showInputDialog("Username cannot be empty! Enter your username"); // CREATES A NEW INPUT DIALOG: THIS DIALOG ASKS THE USER TO ENTER THEIR USERNAME.
                            if (user == null) { // IF THE USER CLICKS THE CANCEL BUTTON
                                System.exit(0); // EXITS THE PROGRAM
                            } // END OF IF
                        } // END OF ELSE
                    } // END OF WHILE
                    tmpPort = JOptionPane.showInputDialog("Enter your port"); // CREATES A NEW INPUT DIALOG: THIS DIALOG ASKS THE USER TO ENTER THEIR PORT.
                    if (tmpPort == null) { // IF THE USER CLICKS THE CANCEL BUTTON
                        break; // BREAKS OUT OF THE SWITCH STATEMENT
                    } // END OF IF
                    String loginmsg = "-l" + tmpPort + ',' + user.toLowerCase(); // CREATES A NEW STRING: THIS STRING IS USED TO SEND THE LOGIN MESSAGE TO THE SERVER.
                    user = "-l" + user;
                    sock.sendtoServices(8081, loginmsg); // SENDS THE LOGIN MESSAGE TO THE SERVER
                    userLenValid = false; // SETS THE USERNAME LENGTH VALIDATION TO FALSE
                    portLenValid = false; // SETS THE PORT LENGTH VALIDATION TO FALSE
                    while (!sock.getConfirm()) { // WHILE THE CONFIRMATION IS NOT RECEIVED
                        try { // TRY STATEMENT
                            TimeUnit.MILLISECONDS.sleep(500); // SLEEPS THE THREAD FOR 500 MILLISECONDS
                        } catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                            System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                        } // END OF CATCH
                        String logmsg = sock.getLogmsg(); // CREATES A NEW STRING: THIS STRING IS USED TO STORE THE LOGIN MESSAGE RECEIVED FROM THE SERVER.
                        try { // TRY STATEMENT
                            TimeUnit.MILLISECONDS.sleep(500); // SLEEPS THE THREAD FOR 500 MILLISECONDS
                        } catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                            System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                        } // END OF CATCH
                        if (logmsg.equals("notfound")) { // IF THE LOGIN MESSAGE IS NOT FOUND
                            user = JOptionPane.showInputDialog("Username not found! Enter your username"); // CREATES A NEW INPUT DIALOG: THIS DIALOG ASKS THE USER TO ENTER THEIR USERNAME.
                            if (user == null) { // IF THE USER CLICKS THE CANCEL BUTTON
                                break; // BREAKS OUT OF THE SWITCH STATEMENT
                            } // END OF IF
                            while (!userLenValid) { // WHILE THE USERNAME LENGTH IS NOT VALID
                                if (user.length() > 0) { // IF THE USERNAME LENGTH IS GREATER THAN 0
                                    userLenValid = true; // SETS THE USERNAME LENGTH VALIDATION TO TRUE
                                    break; // BREAKS OUT OF THE WHILE LOOP
                                } else { // IF THE USERNAME LENGTH IS NOT GREATER THAN 0
                                    user = JOptionPane.showInputDialog("Username cannot be empty! Enter your username"); // CREATES A NEW INPUT DIALOG: THIS DIALOG ASKS THE USER TO ENTER THEIR USERNAME.
                                    if (user == null) { // IF THE USER CLICKS THE CANCEL BUTTON
                                        break; // BREAKS OUT OF THE SWITCH STATEMENT
                                    } // END OF IF
                                } // END OF ELSE
                            } // END OF WHILE
                            tmpPort = JOptionPane.showInputDialog("Enter your port"); // CREATES A NEW INPUT DIALOG: THIS DIALOG ASKS THE USER TO ENTER THEIR PORT.
                            if (tmpPort == null) { // IF THE USER CLICKS THE CANCEL BUTTON
                                break; // BREAKS OUT OF THE SWITCH STATEMENT
                            } // END OF IF
                            loginmsg = "-l" + tmpPort + ',' + user.toLowerCase(); // CREATES A NEW STRING: THIS STRING IS USED TO SEND THE LOGIN MESSAGE TO THE SERVER.
                            user = "-l" + user;
                            sock.sendtoServices(8081, loginmsg); // SENDS THE LOGIN MESSAGE TO THE SERVER
                            try { // TRY STATEMENT
                                TimeUnit.MILLISECONDS.sleep(100); // SLEEPS THE THREAD FOR 100 MILLISECONDS
                            } catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                                System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                            } // END OF CATCH
                        } else if (logmsg.contains(",")) { // IF THE LOGIN MESSAGE CONTAINS A COMMA
                            String logmsgArray[] = logmsg.split(","); // CREATES A NEW STRING ARRAY: THIS ARRAY IS USED TO STORE THE LOGIN MESSAGE SPLIT BY THE COMMA
                            String errormsg = logmsgArray[0]; // CREATES A NEW STRING: THIS STRING IS USED TO STORE THE ERROR MESSAGE
                            String trueport = logmsgArray[1]; // CREATES A NEW STRING: THIS STRING IS USED TO STORE THE TRUE PORT
                            JOptionPane.showMessageDialog(null,
                                    "PIN does not match!\nREMEMBER YOUR PIN IS: " + trueport, errormsg.toUpperCase(),
                                    JOptionPane.ERROR_MESSAGE); // CREATES A NEW MESSAGE DIALOG: THIS DIALOG DISPLAYS THE ERROR MESSAGE AND THE TRUE PORT
                            tmpPort = JOptionPane.showInputDialog("Enter your port"); // CREATES A NEW INPUT DIALOG: THIS DIALOG ASKS THE USER TO ENTER THEIR PORT.
                            if (tmpPort == null) { // IF THE USER CLICKS THE CANCEL BUTTON
                                break; // BREAKS OUT OF THE SWITCH STATEMENT
                            } // END OF IF
                            loginmsg = "-l" + tmpPort + ',' + user.toLowerCase(); // CREATES A NEW STRING: THIS STRING IS USED TO SEND THE LOGIN MESSAGE TO THE SERVER.
                            user = "-l" + user;
                            sock.sendtoServices(8081, loginmsg); // SENDS THE LOGIN MESSAGE TO THE SERVER
                            try { // TRY STATEMENT
                                TimeUnit.MILLISECONDS.sleep(100); // SLEEPS THE THREAD FOR 100 MILLISECONDS
                            } catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                                System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                            } // END OF CATCH
                        }
                    } // END OF WHILE
                    if (tmpPort != null) { // IF THE PORT IS NOT NULL
                        formUser = user.substring(2); // CREATES A NEW STRING: THIS STRING IS USED TO STORE THE FORMATTED USERNAME
                        formUser = formUser.substring(0, 1).toUpperCase() + formUser.substring(1); // CREATES A NEW STRING: THIS STRING IS USED TO STORE THE FORMATTED USERNAME
                        userlab.setText("Logged in as: " + formUser); // SETS THE TEXT OF THE USER LABEL TO THE FORMATTED USERNAME
                        sock.setConfirm(false); // SETS THE CONFIRMATION TO FALSE
                        setup = true; // SETS THE SETUP TO TRUE
                        break; // BREAKS OUT OF THE SWITCH STATEMENT
                    } else { // IF THE PORT IS NULL
                        break; // BREAKS OUT OF THE SWITCH STATEMENT
                    } // END OF ELSE
                case JOptionPane.NO_OPTION: // IF THE USER CLICKS THE NO BUTTON
                    sock.sendtoServices(8081, "-c"); // SENDS THE CLOSE MESSAGE TO THE SERVER
                    try { // TRY STATEMENT
                        TimeUnit.MILLISECONDS.sleep(500); // SLEEPS THE THREAD FOR 500 MILLISECONDS
                    } catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                        System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                    } // END OF CATCH
                    if (sock.getLogmsg() != null && sock.getLogmsg().equals("full")) { // IF THE LOGIN MESSAGE IS NOT NULL AND THE LOGIN MESSAGE IS EQUAL TO FULL
                        JOptionPane.showMessageDialog(null, "Server is full! Try again later", "Error",
                                JOptionPane.ERROR_MESSAGE); // CREATES A NEW MESSAGE DIALOG: THIS DIALOG DISPLAYS THE ERROR MESSAGE
                        System.exit(0); // EXITS THE PROGRAM
                    } else { // IF THE LOGIN MESSAGE IS NULL OR THE LOGIN MESSAGE IS NOT EQUAL TO FULL
                        user = JOptionPane.showInputDialog("Enter your username"); // CREATES A NEW INPUT DIALOG: THIS DIALOG ASKS THE USER TO ENTER THEIR USERNAME
                        if (user == null) { // IF THE USER CLICKS THE CANCEL BUTTON
                            break; // BREAKS OUT OF THE SWITCH STATEMENT
                        } // END OF IF
                        while (!userLenValid) { // WHILE THE USERNAME LENGTH IS NOT VALID
                            if (user.length() > 0 && !user.equals(null)) { // IF THE USERNAME LENGTH IS GREATER THAN 0 AND THE USERNAME IS NOT EQUAL TO NULL
                                userLenValid = true; // SETS THE USERNAME LENGTH VALID TO TRUE
                                break; // BREAKS OUT OF THE WHILE LOOP
                            } else { // IF THE USERNAME LENGTH IS NOT GREATER THAN 0 OR THE USERNAME IS EQUAL TO NULL
                                user = JOptionPane.showInputDialog("Username cannot be empty! Enter your username"); // CREATES A NEW INPUT DIALOG: THIS DIALOG ASKS THE USER TO ENTER THEIR USERNAME
                                if (user == null) { // IF THE USER CLICKS THE CANCEL BUTTON
                                    break; // BREAKS OUT OF THE SWITCH STATEMENT
                                } // END OF IF
                            } // END OF ELSE
                        } // END OF WHILE
                        user = "-r" + user; // CREATES A NEW STRING: THIS STRING IS USED TO SEND THE REGISTER MESSAGE TO THE SERVER
                        sock.sendtoServices(8081, user); // SENDS THE REGISTER MESSAGE TO THE SERVER
                        try { // TRY STATEMENT
                            TimeUnit.MILLISECONDS.sleep(500); // SLEEPS THE THREAD FOR 500 MILLISECONDS
                        } catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                            System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                        } // END OF CATCH
                        while (!sock.getConfirm()) { // WHILE THE CONFIRMATION IS NOT TRUE
                            user = JOptionPane.showInputDialog("User name invalid! Enter your username"); // CREATES A NEW INPUT DIALOG: THIS DIALOG ASKS THE USER TO ENTER THEIR USERNAME
                            if (user == null) { // IF THE USER CLICKS THE CANCEL BUTTON
                                break; // BREAKS OUT OF THE SWITCH STATEMENT
                            } // END OF IF
                            user = "-r" + user; // CREATES A NEW STRING: THIS STRING IS USED TO SEND THE REGISTER MESSAGE TO THE SERVER
                            sock.sendtoServices(8081, user); // SENDS THE REGISTER MESSAGE TO THE SERVER
                            try { // TRY STATEMENT
                                TimeUnit.MILLISECONDS.sleep(500); // SLEEPS THE THREAD FOR 500 MILLISECONDS
                            } catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                                System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                            } // END OF CATCH
                        } // END OF WHILE
                        formUser = user.substring(2); // CREATES A NEW STRING: THIS STRING IS USED TO STORE THE FORMATTED USERNAME
                        formUser = formUser.substring(0, 1).toUpperCase() + formUser.substring(1); // CREATES A NEW STRING: THIS STRING IS USED TO STORE THE FORMATTED USERNAME
                        userlab.setText("Logged in as: " + formUser); // SETS THE TEXT OF THE USER LABEL TO THE FORMATTED USERNAME
                        sock.setConfirm(false); // SETS THE CONFIRMATION TO FALSE
                        setup = true; // SETS THE SETUP TO TRUE
                        break; // BREAKS OUT OF THE SWITCH STATEMENT
                    } // END OF ELSE
                default: // IF THE USER CLICKS THE CANCEL BUTTON
                    System.exit(0); // EXITS THE PROGRAM
                    break; // BREAKS OUT OF THE SWITCH STATEMENT
            } // END OF SWITCH
        } // END OF IF
    } // END OF ACTION

    // STARTSOCKET: THIS METHOD IS USED TO START THE SOCKET
    public void StartSocket() {
        sock.start(); // STARTS THE SOCKET
    } // END OF STARTSOCKET

    // HANDLEEVENT: THIS METHOD IS USED TO HANDLE THE EVENTS
    public boolean handleEvent(Event i) {
        if (i.id == Event.WINDOW_DESTROY) { // IF THE EVENT ID IS EQUAL TO WINDOW DESTROY
            dispose(); // DISPOSES THE FRAME
            System.exit(0); // EXITS THE PROGRAM
            return true; // RETURNS TRUE
        } // END OF IF
        return super.handleEvent(i); // RETURNS THE SUPER CLASS HANDLE EVENT METHOD
    } // END OF HANDLEEVENT

    // ACTION: THIS METHOD IS USED TO HANDLE THE EVENTS
    public boolean action(Event i, Object o) {
        if (i.target == Send) { // IF THE EVENT TARGET IS EQUAL TO SEND
            String tmpPortDest = null; // CREATES A NEW STRING: THIS STRING IS USED TO STORE THE TEMPORARY PORT DESTINATION
            String msg = text.getText(); // CREATES A NEW STRING: THIS STRING IS USED TO STORE THE MESSAGE
            if (msg.equals("")) { // IF THE MESSAGE IS EQUAL TO NOTHING
                return true; // RETURNS TRUE
            } //END IF
            else {
                if (addr.getText().contains(",")) { // IF THE ADDRESS TEXT FIELD CONTAINS A COMMA
                    String askDest = "-m" + addr.getText(); // CREATES A NEW STRING: THIS STRING IS USED TO SEND THE ASK DESTINATION MESSAGE TO THE SERVER
                    sock.sendtoServices(8080, askDest); // SENDS THE ASK DESTINATION MESSAGE TO THE SERVER
                } else { // IF THE ADDRESS TEXT FIELD DOES NOT CONTAIN A COMMA
                    String askDest = "-a" + addr.getText(); // CREATES A NEW STRING: THIS STRING IS USED TO SEND THE ASK DESTINATION MESSAGE TO THE SERVER
                    sock.sendtoServices(8080, askDest); // SENDS THE ASK DESTINATION MESSAGE TO THE SERVER
                } // END OF ELSE
                try { // TRY STATEMENT
                    TimeUnit.MILLISECONDS.sleep(100); // SLEEPS THE THREAD FOR 100 MILLISECONDS
                } catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                    System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                } // END OF CATCH
                tmpPortDest = sock.getdestPort(); // SETS THE TEMPORARY PORT DESTINATION TO THE DESTINATION PORT
                ecran.appendText("\n" + "You: " + msg); // APPENDS THE TEXT TO THE TEXT AREA WITH THE MESSAGE
                msg = user + '_' + msg; // CREATES A NEW STRING: THIS STRING IS USED TO STORE THE MESSAGE
                int iter = 0; // CREATES A NEW INTEGER: THIS INTEGER IS USED TO STORE THE ITERATOR
                String destArray[] = addr.getText().split(","); // CREATES A NEW STRING ARRAY: THIS STRING ARRAY IS USED TO STORE THE DESTINATION ARRAY
                for (int j = 0; j < tmpPortDest.length(); j = j + 4) { // FOR LOOP: THIS LOOP IS USED TO ITERATE THROUGH THE TEMPORARY PORT DESTINATION
                    String strPortDest = tmpPortDest.substring(j, j + 4); // CREATES A NEW STRING: THIS STRING IS USED TO STORE THE STRING PORT DESTINATION
                    if (strPortDest.equals("1234")) { // IF THE STRING PORT DESTINATION IS EQUAL TO 1234
                        ecran.append("\n" + "-Didn't send to user '" + destArray[iter] + "' because it was not found!"); // APPENDS THE TEXT TO THE TEXT AREA WITH THE MESSAGE
                    } else { // IF THE STRING PORT DESTINATION IS NOT EQUAL TO 1234
                        int singlePort = Integer.parseInt(strPortDest); // CREATES A NEW INTEGER: THIS INTEGER IS USED TO STORE THE SINGLE PORT
                        sock.sendDP(singlePort, msg, "127.0.0.1"); // SENDS THE MESSAGE TO THE SINGLE PORT
                    } // END OF ELSE
                    iter++; // INCREMENTS THE ITERATOR
                } // END OF FOR LOOP
                text.setText(""); // SETS THE TEXT FIELD TO BLANK
                return true; // RETURNS TRUE
            }
        } // END OF IF
        return false; // RETURNS FALSE
    } // END OF ACTION

    // [MAIN METHOD]-----------------------------------------------------------------------
    // MAIN: THIS METHOD IS USED TO START THE PROGRAM AND CALL THE METHODS
    public static void main(String[] args) throws IOException {
        Client app = new Client("Client"); // CREATES A NEW CLIENT: THIS CLIENT IS USED TO STORE THE CLIENT
        app.resize(600, 350); // RESIZES THE FRAME
        app.StartSocket(); // CALLS THE STARTSOCKET METHOD
        app.setupClient(); // CALLS THE SETUPCLIENT METHOD
        app.GUI(); // CALLS THE GUI METHOD
        app.show(); // SHOWS THE FRAME
    } // END OF MAIN
} // END OF CLIENT CLASS