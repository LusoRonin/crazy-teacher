import java.io.*;
import java.awt.*;
import javax.swing.JOptionPane;
import java.util.concurrent.TimeUnit;

// CLIENT CLASS: THIS CLASS IS THE MAIN CLASS OF THE CLIENT SIDE OF THE APPLICATION AND IS RESPONSIBLE FOR THE GUI AND SOCKET COMMUNICATION.
public class Client extends Frame {
    // [GUI COMPONENTS]--------------------------------------------------------------------------------------
    TextArea ecran = new TextArea(10, 30);
    TextField addr = new TextField(30);
    TextField text = new TextField(30);
    Label userlab = new Label();
    Button Send = new Button("Send");
    // [SOCKET COMPONENTS]--------------------------------------------------------------------------------------
    CliSocket sock = new CliSocket(ecran); // SOCKET OBJECT
    String cliRegister; // REGISTER MESSAGE
    // [VARIABLES]--------------------------------------------------------------------------------------
    String user = null; // USERNAME
    String formUser = null; // FORMATTED USERNAME
    String str = null; // STRING TO SEND
    String strport = null; // PORT TO SEND
    String tmpPort = null; // TEMPORARY PORT
    int port; // PORT
    // [VALIDATION VARIABLES----------------------------------------------------------------------------------------
    boolean userLenValid = false; // USERNAME LENGTH VALIDATION: TRUE IF USERNAME LENGTH IS > 0
    boolean portLenValid = false; // PORT LENGTH VALIDATION: TRUE IF PORT LENGTH IS > 0
    boolean userRegValid = false; // USERNAME REGISTRATION VALIDATION: TRUE IF USERNAME IS NOT ALREADY REGISTERED
    boolean setup = false; // SETUP VALIDATION: TRUE IF SETUP IS COMPLETE

    // [CONSTRUCTOR]--------------------------------------------------------------------------------------
    // THIS CONSTRUCTOR IS CALLED WHEN THE CLIENT IS STARTED AND IS RESPONSIBLE FOR
    // THE GUI AND SOCKET COMMUNICATION.
    public Client(String str) {
        super(str); // CALLS THE CONSTRUCTOR OF THE PARENT CLASS (FRAME)
    }

    // [METHODS]--------------------------------------------------------------------------------------
    // GETCLIENTREGISTER: THIS METHOD RETURNS THE REGISTER MESSAGE.
    public String getCliRegister() {
        return cliRegister; // RETURNS THE REGISTER MESSAGE
    }

    // GUI: THIS METHOD IS RESPONSIBLE FOR THE GUI.
    public void GUI() {
        setBackground(Color.lightGray); // SETS THE BACKGROUND COLOR OF THE FRAME: LIGHT GRAY.
        ecran.setEditable(false); // SETS THE TEXT AREA TO READ ONLY.
        GridBagLayout GBL = new GridBagLayout(); // CREATES A NEW GRIDBAGLAYOUT OBJECT.
        setLayout(GBL); // SETS THE LAYOUT OF THE FRAME TO GRIDBAGLAYOUT.
        Panel P1 = new Panel(); // CREATES A NEW PANEL.
        P1.setLayout(new BorderLayout(5, 5)); // SETS THE LAYOUT OF THE PANEL TO BORDERLAYOUT.
        P1.add("North", userlab); // ADDS THE USER LABEL TO THE NORTH OF THE PANEL.
        P1.add("Center", text); // ADDS THE TEXT FIELD TO THE CENTER OF THE PANEL.
        P1.add("West", addr); // ADDS THE ADDRESS FIELD TO THE WEST OF THE PANEL.
        P1.add("East", Send); // ADDS THE SEND BUTTON TO THE EAST OF THE PANEL.
        P1.add("South", ecran); // ADDS THE TEXT AREA TO THE SOUTH OF THE PANEL.
        GridBagConstraints P1C = new GridBagConstraints(); // CREATES A NEW GRIDBAGCONSTRAINTS OBJECT.
        P1C.gridwidth = GridBagConstraints.REMAINDER; // SETS THE GRIDWIDTH OF THE PANEL TO REMAINDER.
        GBL.setConstraints(P1, P1C); // SETS THE CONSTRAINTS OF THE PANEL TO THE GRIDBAGCONSTRAINTS OBJECT.
        add(P1); // ADDS THE PANEL TO THE FRAME.
    }

    // SETUPCLIENT: THIS METHOD IS RESPONSIBLE FOR THE SETUP OF THE CLIENT. IT ASKS
    // THE USER IF THEY HAVE AN ACCOUNT AND IF THEY DO NOT, IT ASKS THEM TO
    // REGISTER. IT THEN SENDS THE REGISTER MESSAGE TO THE SERVER.
    public void setupClient() {
        while (!setup) { // WHILE THE SETUP IS NOT COMPLETE
            int loginOption = JOptionPane.showConfirmDialog(null, "Do you have an account?", "Login",
                    JOptionPane.YES_NO_OPTION); // ASKS THE USER IF THEY HAVE AN ACCOUNT; YES = LOGIN, NO = REGISTER;
                                                // RETURNS THE OPTION SELECTED.
            switch (loginOption) { // SWITCH STATEMENT FOR THE OPTION SELECTED.
                case JOptionPane.YES_OPTION: // IF THE USER SELECTED YES; LOGIN
                    user = JOptionPane.showInputDialog("Enter your username"); // ASKS THE USER TO ENTER THEIR USERNAME.
                    if (user == null) { // IF THE USER CLICKED CANCEL
                        break; // BREAKS THE SWITCH STATEMENT
                    } // END IF
                    while (!userLenValid) { // WHILE THE USERNAME LENGTH IS NOT VALID
                        if (user.length() > 0) { // IF THE USERNAME LENGTH IS > 0; VALID
                            userLenValid = true; // SETS THE USERNAME LENGTH VALIDATION TO TRUE
                            break; // BREAKS THE WHILE LOOP
                        } else { // IF THE USERNAME LENGTH IS NOT > 0; INVALID
                            user = JOptionPane.showInputDialog("Username cannot be empty! Enter your username"); // ASKS THE USER TO ENTER THEIR USERNAME.
                            if (user == null) { // IF THE USER CLICKED CANCEL
                                System.exit(0); // EXITS THE PROGRAM
                            } // END IF
                        } // END ELSE
                    } // END WHILE
                    tmpPort = JOptionPane.showInputDialog("Enter your port"); // ASKS THE USER TO ENTER THEIR PORT.
                    if (tmpPort == null) { // IF THE USER CLICKED CANCEL
                        break; // BREAKS THE SWITCH STATEMENT
                    } // END IF
                    String loginmsg = "-l" + tmpPort + ',' + user.toLowerCase(); // CREATES THE LOGIN MESSAGE: -lPORT,USERNAME (ALL LOWERCASE)
                    sock.sendtoServices(8081, loginmsg); // SENDS THE LOGIN MESSAGE TO THE SERVER
                    userLenValid = false; // RESETS THE USERNAME LENGTH VALIDATION TO FALSE
                    portLenValid = false; // RESETS THE PORT LENGTH VALIDATION TO FALSE
                    while (!sock.getConfirm()) { // WHILE THE SERVER HAS NOT CONFIRMED THE LOGIN
                        try { // TRY-CATCH BLOCK: TRY TO SLEEP FOR 500 MILLISECONDS
                            TimeUnit.MILLISECONDS.sleep(500); // SLEEPS FOR 500 MILLISECONDS
                        } // END TRY
                        catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                            System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                        } // END CATCH
                        String logmsg = sock.getLogmsg(); // GETS THE LOGIN MESSAGE FROM THE SERVER
                        try { // TRY-CATCH BLOCK: TRY TO SLEEP FOR 500 MILLISECONDS
                            TimeUnit.MILLISECONDS.sleep(500); // SLEEPS FOR 500 MILLISECONDS
                        } // END TRY
                        catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                            System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                        } // END CATCH
                        if (logmsg.equals("notfound")) { // IF THE LOGIN MESSAGE IS "NOTFOUND"
                            user = JOptionPane.showInputDialog("Username not found! Enter your username"); // ASKS THE USER TO ENTER THEIR USERNAME.
                            if (user == null) { // IF THE USER CLICKED CANCEL
                                break; // BREAKS THE SWITCH STATEMENT
                            } // END IF
                            while (!userLenValid) { // WHILE THE USERNAME LENGTH IS NOT VALID
                                if (user.length() > 0) { // IF THE USERNAME LENGTH IS > 0; VALID
                                    userLenValid = true; // SETS THE USERNAME LENGTH VALIDATION TO TRUE
                                    break; // BREAKS THE WHILE LOOP
                                } else { // IF THE USERNAME LENGTH IS NOT > 0; INVALID
                                    user = JOptionPane.showInputDialog("Username cannot be empty! Enter your username"); // ASKS THE USER TO ENTER THEIR USERNAME.
                                    if (user == null) { // IF THE USER CLICKED CANCEL
                                        break; // BREAKS THE SWITCH STATEMENT
                                    } // END IF
                                } // END ELSE
                            } // END WHILE
                            tmpPort = JOptionPane.showInputDialog("Enter your port"); // ASKS THE USER TO ENTER THEIR PORT.
                            if (tmpPort == null) { // IF THE USER CLICKED CANCEL
                                break; // BREAKS THE SWITCH STATEMENT
                            } // END IF
                            loginmsg = "-l" + tmpPort + ',' + user.toLowerCase(); // CREATES THE LOGIN MESSAGE: -lPORT,USERNAME (ALL LOWERCASE)
                            sock.sendtoServices(8081, loginmsg); // SENDS THE LOGIN MESSAGE TO THE SERVER
                            try { // TRY-CATCH BLOCK: TRY TO SLEEP FOR 500 MILLISECONDS
                                TimeUnit.MILLISECONDS.sleep(100); // SLEEPS FOR 500 MILLISECONDS
                            } // END TRY
                            catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                                System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                            } // END CATCH
                        } else if (logmsg.contains(",")) { // IF THE LOGIN MESSAGE CONTAINS A COMMA
                            String logmsgArray[] = logmsg.split(","); // SPLIT THE LOGIN MESSAGE INTO AN ARRAY
                            String errormsg = logmsgArray[0]; // GET THE ERROR MESSAGE
                            String trueport = logmsgArray[1]; // GET THE TRUE PORT
                            JOptionPane.showMessageDialog(null,
                                    "PIN does not match!\nREMEMBER YOUR PIN IS: " + trueport, errormsg.toUpperCase(),
                                    JOptionPane.ERROR_MESSAGE); // SHOWS THE ERROR MESSAGE: PIN DOES NOT MATCH: TRUEPORT
                            tmpPort = JOptionPane.showInputDialog("Enter your port"); // ASKS THE USER TO ENTER THEIR PORT.
                            if (tmpPort == null) { // IF THE USER CLICKED CANCEL
                                break; // BREAKS THE SWITCH STATEMENT
                            } // END IF
                            loginmsg = "-l" + tmpPort + ',' + user.toLowerCase(); // CREATES THE LOGIN MESSAGE: -lPORT,USERNAME (ALL LOWERCASE)
                            sock.sendtoServices(8081, loginmsg); // SENDS THE LOGIN MESSAGE TO THE SERVER
                            try { // TRY-CATCH BLOCK: TRY TO SLEEP FOR 500 MILLISECONDS
                                TimeUnit.MILLISECONDS.sleep(100); // SLEEPS FOR 500 MILLISECONDS
                            } // END TRY
                            catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                                System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                            } // END CATCH
                        }
                    } // END WHILE
                    if (tmpPort != null) { // IF THE USER DID NOT CLICK CANCEL
                        formUser = user.substring(2); // GETS THE USERNAME WITHOUT THE PREFIX
                        formUser = formUser.substring(0, 1).toUpperCase() + formUser.substring(1); // CAPITALIZES THE FIRST LETTER OF THE USERNAME
                        userlab.setText("Logged in as: " + formUser); // SETS THE USER LABEL TO THE USERNAME
                        sock.setConfirm(false); // SETS THE CONFIRMATION TO FALSE
                        setup = true; // SETS THE SETUP TO TRUE
                        break; // BREAKS THE SWITCH STATEMENT
                    } else { // IF THE USER CLICKED CANCEL
                        break; // BREAKS THE SWITCH STATEMENT
                    } // END ELSE
                case JOptionPane.NO_OPTION: // IF THE USER CLICKED NO
                    sock.sendtoServices(8081, "-c"); // SENDS THE CANCEL MESSAGE TO THE SERVER
                    try { // TRY-CATCH BLOCK: TRY TO SLEEP FOR 500 MILLISECONDS
                        TimeUnit.MILLISECONDS.sleep(500); // SLEEPS FOR 500 MILLISECONDS
                    } catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                        System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                    } // END CATCH
                    if (sock.getLogmsg() != null && sock.getLogmsg().equals("full")) { // IF THE SERVER IS FULL; SHOWS THE ERROR MESSAGE
                        JOptionPane.showMessageDialog(null, "Server is full! Try again later", "Error", JOptionPane.ERROR_MESSAGE); // SHOWS THE ERROR MESSAGE
                        System.exit(0); // EXITS THE PROGRAM
                    } else { // IF THE SERVER IS NOT FULL
                        user = JOptionPane.showInputDialog("Enter your username"); // ASKS THE USER TO ENTER THEIR USERNAME.
                        if (user == null) { // IF THE USER CLICKED CANCEL
                            break; // BREAKS THE SWITCH STATEMENT
                        } // END IF
                        while (!userLenValid) { // WHILE THE USERNAME IS NOT VALID
                            if (user.length() > 0 && !user.equals(null)) { // IF THE USERNAME IS NOT EMPTY AND NOT NULL
                                userLenValid = true; // SETS THE USERNAME VALID TO TRUE
                                break; // BREAKS THE WHILE LOOP
                            } else { // IF THE USERNAME IS EMPTY OR NULL
                                user = JOptionPane.showInputDialog("Username cannot be empty! Enter your username"); // ASKS THE USER TO ENTER THEIR USERNAME.
                                if (user == null) { // IF THE USER CLICKED CANCEL
                                    break; // BREAKS THE SWITCH STATEMENT
                                } // END IF
                            } // END ELSE
                        } // END WHILE
                        user = "-r" + user; // CREATES THE REGISTER MESSAGE: -rUSERNAME
                        sock.sendtoServices(8081, user); // SENDS THE REGISTER MESSAGE TO THE SERVER
                        try { // TRY-CATCH BLOCK: TRY TO SLEEP FOR 500 MILLISECONDS
                            TimeUnit.MILLISECONDS.sleep(500); // SLEEPS FOR 500 MILLISECONDS
                        } catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                            System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                        } // END CATCH
                        while (!sock.getConfirm()) { // WHILE THE USERNAME IS NOT VALID
                            user = JOptionPane.showInputDialog("User name invalid! Enter your username"); // ASKS THE USER TO ENTER THEIR USERNAME.
                            if (user == null) { // IF THE USER CLICKED CANCEL
                                break; // BREAKS THE SWITCH STATEMENT
                            } // END IF
                            user = "-r" + user; // CREATES THE REGISTER MESSAGE: -rUSERNAME
                            sock.sendtoServices(8081, user); // SENDS THE REGISTER MESSAGE TO THE SERVER
                            try { // TRY-CATCH BLOCK: TRY TO SLEEP FOR 500 MILLISECONDS
                                TimeUnit.MILLISECONDS.sleep(500); // SLEEPS FOR 500 MILLISECONDS
                            } catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                                System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
                            } // END CATCH
                        } // END WHILE
                        formUser = user.substring(2); // GETS THE USERNAME WITHOUT THE PREFIX
                        formUser = formUser.substring(0, 1).toUpperCase() + formUser.substring(1); // CAPITALIZES THE FIRST LETTER OF THE USERNAME
                        userlab.setText("Logged in as: " + formUser); // SETS THE USER LABEL TO THE USERNAME
                        sock.setConfirm(false); // SETS THE CONFIRMATION TO FALSE
                        setup = true; // SETS THE SETUP TO TRUE
                        break; // BREAKS THE SWITCH STATEMENT
                    } // END ELSE
                default: // DEFAULT CASE
                    System.exit(0); // EXITS THE PROGRAM
                    break; // BREAKS THE SWITCH STATEMENT
            } // END SWITCH
        } // END WHILE
    } // END SETUP METHOD

    // STARTSOCKET METHOD: STARTS THE SOCKET THREAD
    public void StartSocket() {
        sock.start(); // STARTS THE SOCKET THREAD
    }

    // HANDLEEVENT METHOD: HANDLES THE EVENTS
    public boolean handleEvent(Event i) {
        if (i.id == Event.WINDOW_DESTROY) { // IF THE USER CLICKED THE X BUTTON
            dispose(); // DISPOSES THE FRAME
            System.exit(0); // EXITS THE PROGRAM
            return true; // RETURNS TRUE
        } // END IF
        return super.handleEvent(i);
    }

    // ACTION METHOD: HANDLES THE EVENTS
    public boolean action(Event i, Object o) {
        if (i.target == Send) { // IF THE USER CLICKED THE SEND BUTTON
            int portDest = 0; // INITIALIZES THE DESTINATION PORT
            String msg = text.getText(); // GETS THE MESSAGE FROM THE TEXT FIELD
            if (addr.getText().contains(",")) { // IF THE ADDRESS CONTAINS A COMMA
                String askDest = "-m" + addr.getText(); // CREATES THE MESSAGE: -mADDRESS,MESSAGE
                sock.sendtoServices(8080, askDest); // SENDS THE MESSAGE TO THE SERVER
            } else { // IF THE ADDRESS DOES NOT CONTAIN A COMMA
                String askDest = "-a" + addr.getText(); // CREATES THE MESSAGE: -aADDRESS
                sock.sendtoServices(8080, askDest); // SENDS THE MESSAGE TO THE SERVER
            } // END ELSE
            try { // TRY-CATCH BLOCK: TRY TO SLEEP FOR 100 MILLISECONDS
                TimeUnit.MILLISECONDS.sleep(100); // SLEEPS FOR 100 MILLISECONDS
            } catch (InterruptedException e) { // CATCHES THE INTERRUPTED EXCEPTION
                System.out.println("Interrupted"); // PRINTS THE INTERRUPTED EXCEPTION
            } // END CATCH
            portDest = sock.getdestPort(); // GETS THE DESTINATION PORT
            ecran.appendText("\n" + "You: " + msg); // APPENDS THE MESSAGE TO THE TEXT AREA
            msg = user + '_' + msg; // CREATES THE MESSAGE: USERNAME_MESSAGE
            for (int j = 0; j < Integer.toString(portDest).length(); j = j + 4) { // FOR LOOP: FOR THE LENGTH OF THE PORT NUMBER
                String strPortDest = Integer.toString(portDest).substring(j, j + 4); // GETS THE PORT NUMBER
                int singlePort = Integer.parseInt(strPortDest); // CONVERTS THE PORT NUMBER TO AN INTEGER
                sock.sendDP(singlePort, msg, "127.0.0.1"); // SENDS THE MESSAGE TO THE DESTINATION PORT
            } // END FOR LOOP
            text.setText(""); // SETS THE TEXT FIELD TO EMPTY
            sock.setdestPort(0); // SETS THE DESTINATION PORT TO 0
            return true; // RETURNS TRUE
        } // END IF
        return false; // RETURNS FALSE
    } // END ACTION METHOD

    // [MAIN METHOD]--------------------------------------------------------------
    // MAIN METHOD: CREATES THE CLIENT; SETS THE SIZE OF THE FRAME; STARTS THE SOCKET; SETS UP THE CLIENT; CREATES THE GUI; SHOWS THE FRAME.
    public static void main(String[] args) throws IOException {
        Client app = new Client("Client"); // CREATES THE CLIENT
        app.resize(600, 350); // SETS THE SIZE OF THE FRAME
        app.StartSocket(); // STARTS THE SOCKET
        app.setupClient(); // SETS UP THE CLIENT
        app.GUI(); // CREATES THE GUI
        app.show(); // SHOWS THE FRAME
    } // END MAIN METHOD
} // END CLIENT CLASS