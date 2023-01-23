// AUTHOR: PEDRO SIMÕES & ANTÓNIO GRAÇA

// [IMPORTS]------------------------------------------------------------------
import java.io.*;
import java.net.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

// NAME SERVER SOCKET: THIS IS THE SERVER SOCKET THAT WILL LISTEN FOR CLIENTS TO CONNECT TO IT AND THEN SEND THE CLIENTS THE IP ADDRESS OF THE SERVER
public class NameServerSocket extends Thread {
    ArrayList<List> userList = new ArrayList<List>(); // CREATE A NEW ARRAY LIST TO STORE THE IP ADDRESS OF THE CLIENTS
    InetAddress ER; // CREATE A NEW INET ADDRESS OBJECT: ER
    DatagramSocket DS; // CREATE A NEW DATAGRAM SOCKET: DS
    byte bp[] = new byte[1024]; // CREATE A NEW BYTE ARRAY: bp
    TextArea Server = new TextArea(12, 40); // CREATE A NEW TEXT AREA: Server
    boolean getListUpdated = false; // CREATE A NEW BOOLEAN: getListUpdated

    // [CONSTRUCTOR]------------------------------------------------------------
    // INITIALIZE THE SERVER SOCKET
    NameServerSocket(TextArea ta) {
        Server = ta; // SET THE TEXT AREA TO THE TEXT AREA PASSED TO THE CONSTRUCTOR
    } // END OF CONSTRUCTOR

    // [METHODS]----------------------------------------------------------------
    // RUN: THIS METHOD WILL BE CALLED WHEN THE SERVER SOCKET IS STARTED
    public void run() {
        try { // TRY TO CREATE A NEW DATAGRAM SOCKET
            DS = new DatagramSocket(8080); // CREATE A NEW DATAGRAM SOCKET ON PORT 8080
            Server.append("Welcome to the Name Service\n"); // APPEND THE TEXT AREA WITH THE FOLLOWING MESSAGE
        } catch (IOException e) { // IF AN ERROR OCCURS
            Server.append("Error: " + e); // APPEND THE TEXT AREA WITH THE ERROR
        } // END OF TRY-CATCH BLOCK
        while (true) { // WHILE THE SERVER IS RUNNING
            receiveDP(); // CALL THE receiveDP() METHOD
        } // END OF WHILE LOOP
    } // END OF run() METHOD

    // GETARRAYLIST: THIS METHOD WILL RETURN THE ARRAY LIST OF THE CLIENTS
    public ArrayList<List> getArrayList() {
        return userList; // RETURN THE ARRAY LIST OF THE CLIENTS
    } // END OF getArrayList() METHOD

    // RECEIVEDP: THIS METHOD WILL RECEIVE THE DATAGRAM PACKET FROM THE CLIENT
    public void receiveDP() {
        try { // TRY TO RECEIVE THE DATAGRAM PACKET
            DatagramPacket DP = new DatagramPacket(bp, 1024); // CREATE A NEW DATAGRAM PACKET: DP
            DS.receive(DP); // RECEIVE THE DATAGRAM PACKET
            byte Payload[] = DP.getData(); // GET THE DATA FROM THE DATAGRAM PACKET
            int len = DP.getLength(); // GET THE LENGTH OF THE DATAGRAM PACKET
            String msg = new String(Payload, 0, 0, len); // CREATE A NEW STRING: msg; SET THE STRING TO THE DATA FROM THE DATAGRAM PACKET
            int sender = DP.getPort(); // GET THE PORT OF THE DATAGRAM PACKET
            String assignedPort = null; // CREATE A NEW STRING: assignedPort
            String assignedmsg = null; // CREATE A NEW STRING: assignedmsg
            String tag = msg.substring(0, 2); // CREATE A NEW STRING: tag; SET THE STRING TO THE FIRST TWO CHARACTERS OF THE STRING: msg
            String askmsg = null; // CREATE A NEW STRING: askmsg
            String assignedmsgStr = null; // CREATE A NEW STRING: assignedmsgStr
            switch (tag) { // SWITCH STATEMENT TO CHECK THE TAG
                case "-m": // IF THE TAG IS -m THEN
                    askmsg = msg.substring(2).toLowerCase(); // SET THE STRING: askmsg TO THE STRING: msg; STARTING AT THE THIRD CHARACTER
                    String[] askmsgArray = askmsg.split(","); // CREATE A NEW STRING ARRAY: askmsgArray; SET THE STRING ARRAY TO THE STRING: askmsg; SPLIT THE STRING AT THE COMMA
                    assignedmsg = "-m"; // SET THE STRING: assignedmsg TO -m
                    for (String dest : askmsgArray) { // FOR EACH STRING IN THE STRING ARRAY: askmsgArray
                        boolean userExists = false; // CREATE A NEW BOOLEAN: userExists; SET THE BOOLEAN TO FALSE
                        for (int i = 0; i < userList.size(); i++) { // FOR EACH ELEMENT IN THE ARRAY LIST: userList
                            if (userList.get(i).get(1).toString().equals(dest)) { // IF THE ELEMENT IN THE ARRAY LIST IS EQUAL TO THE STRING: dest
                                userExists = true; // SET THE BOOLEAN: userExists TO TRUE
                                assignedPort = userList.get(i).get(0).toString(); // SET THE STRING: assignedPort TO THE ELEMENT IN THE ARRAY LIST
                                assignedmsg += assignedPort; // APPEND THE STRING: assignedmsg WITH THE STRING: assignedPort
                                assignedmsgStr += "," + assignedPort; // APPEND THE STRING: assignedmsgStr WITH THE STRING: assignedPort
                            } // END OF IF STATEMENT
                        } // END OF FOR LOOP
                        if (!userExists) { // IF THE BOOLEAN: userExists IS FALSE
                            assignedmsg += "1234"; // APPEND THE STRING: assignedmsg WITH 1234
                        } // END OF IF STATEMENT
                    } // END OF FOR LOOP
                    sendDP(sender, assignedmsg); // CALL THE sendDP() METHOD
                    String senderStr = Integer.toString(sender); // CREATE A NEW STRING: senderStr; SET THE STRING TO THE INTEGER: sender
                    assignedmsgStr = assignedmsgStr.substring(5); // SET THE STRING: assignedmsgStr TO THE STRING: assignedmsgStr; STARTING AT THE SIXTH CHARACTER
                    Server.append("\nRequest: Port " + senderStr + " requested Port " + assignedmsgStr);
                    break; // BREAK OUT OF THE SWITCH STATEMENT
                case "-a": // IF THE TAG IS -a THEN
                    askmsg = msg.substring(2).toLowerCase(); // SET THE STRING: askmsg TO THE STRING: msg; STARTING AT THE THIRD CHARACTER
                    for (int i = 0; i < userList.size(); i++) { // FOR EACH ELEMENT IN THE ARRAY LIST: userList
                        if (userList.get(i).get(1).toString().equals(askmsg)) { // IF THE ELEMENT IN THE ARRAY LIST IS EQUAL TO THE STRING: askmsg
                            assignedPort = userList.get(i).get(0).toString(); // SET THE STRING: assignedPort TO THE ELEMENT IN THE ARRAY LIST
                            assignedmsg = "-a" + assignedPort; // SET THE STRING: assignedmsg TO -a + THE STRING: assignedPort
                            sendDP(sender, assignedmsg); // CALL THE sendDP() METHOD
                            senderStr = Integer.toString(sender); // CREATE A NEW STRING: senderStr; SET THE STRING TO THE INTEGER: sender
                            assignedmsgStr = assignedmsg.substring(2); // SET THE STRING: assignedmsgStr TO THE STRING: assignedmsgStr; STARTING AT THE THIRD CHARACTER
                            Server.append("\nRequest: Port " + senderStr + " requested Port " + assignedmsgStr);
                            break; // BREAK OUT OF THE FOR LOOP
                        } // END OF IF STATEMENT
                        if (i == userList.size() - 1) { // IF THE ELEMENT IN THE ARRAY LIST IS EQUAL TO THE LAST ELEMENT IN THE ARRAY LIST
                            if (userList.get(i).get(1).toString().equals(askmsg) == false) { // IF THE ELEMENT IN THE ARRAY LIST IS NOT EQUAL TO THE STRING: askmsg
                                assignedmsg = "-a" + "1234"; // SET THE STRING: assignedmsg TO -a + 1234
                                sendDP(sender, assignedmsg); // CALL THE sendDP() METHOD
                                break; // BREAK OUT OF THE FOR LOOP
                            } // END OF IF STATEMENT
                        } // END OF IF STATEMENT
                    } // END OF FOR LOOP
                    break; // BREAK OUT OF THE SWITCH STATEMENT
                case "-r": // IF THE TAG IS -r THEN
                    String regmsg = msg.substring(2).toLowerCase(); // SET THE STRING: regmsg TO THE STRING: msg; STARTING AT THE THIRD CHARACTER
                    if (userList.size() == 0) { // IF THE ARRAY LIST: userList IS EMPTY
                        List tempList = new ArrayList(); // CREATE A NEW ARRAY LIST: tempList
                        String cliSenderName = regmsg.toLowerCase(); // SET THE STRING: cliSenderName TO THE STRING: regmsg
                        int cliSenderPort = 8000; // SET THE INTEGER: cliSenderPort TO 8000
                        tempList.add(cliSenderPort); // ADD THE INTEGER: cliSenderPort TO THE ARRAY LIST: tempList
                        tempList.add(cliSenderName); // ADD THE STRING: cliSenderName TO THE ARRAY LIST: tempList
                        userList.add(tempList); // ADD THE ARRAY LIST: tempList TO THE ARRAY LIST: userList
                        String user = userList.get(0).get(1).toString(); // SET THE STRING: user TO THE ELEMENT IN THE ARRAY LIST
                        user = user.substring(0, 1).toUpperCase() + user.substring(1); // SET THE STRING: user TO THE FIRST CHARACTER OF THE STRING: user; CAPITALISED + THE REST OF THE STRING: user
                        Server.append("\nAssigned '" + user + "' on Port: " + userList.get(0).get(0).toString() + "!"); // APPEND THE STRING: user + THE ELEMENT IN THE ARRAY LIST + THE STRING: user
                        String portAssign = "-y" + "p" + "8000"; // SET THE STRING: portAssign TO -yp8000
                        sendDP(sender, portAssign); // CALL THE sendDP() METHOD
                    } else { // IF THE ARRAY LIST: userList IS NOT EMPTY
                        List tempList = new ArrayList(); // CREATE A NEW ARRAY LIST: tempList
                        String portAssign = null; // CREATE A NEW STRING: portAssign; SET THE STRING TO NULL
                        String cliSenderName = regmsg; // SET THE STRING: cliSenderName TO THE STRING: regmsg
                        for (int i = 0; i < userList.size(); i++) { // FOR EACH ELEMENT IN THE ARRAY LIST: userList
                            if (userList.get(i).get(1).equals(regmsg)) { // IF THE ELEMENT IN THE ARRAY LIST IS EQUAL TO THE STRING: regmsg
                                assignedmsg = "-nr"; // SET THE STRING: assignedmsg TO -nr
                                Server.append("\n'" + regmsg + "'' already exists!"); // APPEND THE STRING: regmsg + THE STRING: regmsg
                                sendDP(sender, assignedmsg); // CALL THE sendDP() METHOD
                                break; // BREAK OUT OF THE FOR LOOP
                            } else { // IF THE ELEMENT IN THE ARRAY LIST IS NOT EQUAL TO THE STRING: regmsg
                                if (i == userList.size() - 1) { // IF THE ELEMENT IN THE ARRAY LIST IS EQUAL TO THE LAST ELEMENT IN THE ARRAY LIST
                                    String lastPort = userList.get(i).get(0).toString(); // SET THE STRING: lastPort TO THE ELEMENT IN THE ARRAY LIST
                                    int lastPortInt = Integer.parseInt(lastPort); // SET THE INTEGER: lastPortInt TO THE STRING: lastPort
                                    int lastPortIntPlus = lastPortInt + 1; // SET THE INTEGER: lastPortIntPlus TO THE INTEGER: lastPortInt + 1
                                    int cliSenderPort = lastPortIntPlus; // SET THE INTEGER: cliSenderPort TO THE INTEGER: lastPortIntPlus
                                    String tmpCliPort = Integer.toString(cliSenderPort); // SET THE STRING: tmpCliPort TO THE INTEGER: cliSenderPort
                                    tempList.add(cliSenderPort); // ADD THE INTEGER: cliSenderPort TO THE ARRAY LIST: tempList
                                    tempList.add(cliSenderName); // ADD THE STRING: cliSenderName TO THE ARRAY LIST: tempList
                                    userList.add(tempList); // ADD THE ARRAY LIST: tempList TO THE ARRAY LIST: userList
                                    String user = userList.get(i + 1).get(1).toString(); // SET THE STRING: user TO THE ELEMENT IN THE ARRAY LIST
                                    user = user.substring(0, 1).toUpperCase() + user.substring(1); // SET THE STRING: user TO THE FIRST CHARACTER OF THE STRING: user; CAPITALISED + THE REST OF THE STRING: user
                                    Server.append("\nAssigned '" + user + "' on Port: "
                                            + userList.get(i + 1).get(0).toString() + "!"); // APPEND THE STRING: user + THE ELEMENT IN THE ARRAY LIST + THE STRING: user
                                    portAssign = "-y" + "p" + tmpCliPort; // SET THE STRING: portAssign TO -yp + THE STRING: tmpCliPort
                                    sendDP(sender, portAssign); // CALL THE sendDP() METHOD
                                    break; // BREAK OUT OF THE FOR LOOP
                                } // END OF IF STATEMENT
                            } // END OF IF STATEMENT
                        } // END OF FOR LOOP
                    } // END OF IF STATEMENT
                    break; // BREAK OUT OF THE SWITCH STATEMENT
            } // END OF SWITCH STATEMENT
        } catch (IOException e) { // IF THERE IS AN ERROR
            Server.append("\nError: " + e); // APPEND THE STRING: Error + THE ERROR
        } // END OF TRY/CATCH STATEMENT
    } // END OF run() METHOD

    // SEND DATA PACKET METHOD: sendDP(); SENDS A DATA PACKET TO THE CLIENT
    public void sendDP(int Pr, String msg) {
        int len = msg.length(); // SET THE INTEGER: len TO THE LENGTH OF THE STRING: msg
        byte b[] = new byte[len]; // CREATE A NEW BYTE ARRAY: b; SET THE LENGTH OF THE BYTE ARRAY TO THE INTEGER: len
        msg.getBytes(0, len, b, 0); // GET THE BYTES OF THE STRING: msg; SET THE LENGTH OF THE BYTE ARRAY TO THE INTEGER: len; SET THE BYTE ARRAY TO THE BYTE ARRAY: b; SET THE OFFSET TO 0
        try { // TRY TO SEND THE DATA PACKET
            ER = InetAddress.getByName("127.0.0.1"); // SET THE INET ADDRESS: ER TO THE LOCAL HOST
            DatagramPacket DP = new DatagramPacket(b, len, ER, Pr); // CREATE A NEW DATA PACKET: DP; SET THE BYTE ARRAY: b; SET THE LENGTH OF THE DATA PACKET TO THE INTEGER: len; SET THE INET ADDRESS: ER; SET THE PORT TO THE INTEGER: Pr
            DS.send(DP); // SEND THE DATA PACKET: DP
        } catch (IOException e) { // IF THERE IS AN ERROR
            Server.append("\nError: " + e); // APPEND THE STRING: Error + THE ERROR
        } // END OF TRY/CATCH STATEMENT
    } // END OF sendDP() METHOD
} // END OF ServerThread CLASS