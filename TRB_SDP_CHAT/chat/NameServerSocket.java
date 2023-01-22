import java.io.*;
import java.net.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

// NAME SERVER SOCKET CLASS: THIS CLASS IS THE NAME SERVER SOCKET FOR THE CHAT APPLICATION AND IS RESPONSIBLE FOR RECEIVING THE DATAGRAM PACKETS AND SENDING THE RESPONSES
public class NameServerSocket extends Thread {
    ArrayList<List> userList = new ArrayList<List>(); // LIST OF USERS: PORT, NAME, IP ADDRESS
    InetAddress ER; // IP ADDRESS OF THE NAME SERVER
    DatagramSocket DS; // DATAGRAM SOCKET: USED TO SEND AND RECEIVE DATAGRAM PACKETS
    byte bp[] = new byte[1024]; // BYTE ARRAY: USED TO STORE THE DATAGRAM PACKET
    TextArea Server = new TextArea(12, 40); // TEXT AREA TO DISPLAY THE USERS AND THEIR IP ADDRESSES
    boolean getListUpdated = false; // BOOLEAN TO CHECK IF THE LIST OF USERS HAS BEEN UPDATED

    // [CONSTRUCTOR]--------------------------------------------------------------------------------------
    // INITIALIZE THE NAME SERVER SOCKET
    NameServerSocket(TextArea ta) {
        Server = ta; // SETS THE TEXT AREA TO THE TEXT AREA PASSED IN
    }

    // [METHODS]-----------------------------------------------------------------------------------------
    // RUN METHOD: RECEIVES THE DATAGRAM PACKETS AND SENDS THE RESPONSES
    public void run() {
        try { // TRY CATCH BLOCK
            DS = new DatagramSocket(8080); // SETS THE DATAGRAM SOCKET TO THE PORT 8080
            Server.append("Welcome to the Name Service\n"); // DISPLAYS THE WELCOME MESSAGE
        } catch (IOException e) { // CATCHES THE IOEXCEPTION
            Server.append("Error: " + e); // DISPLAYS THE ERROR MESSAGE
        } // END OF TRY CATCH BLOCK
        while (true) { // WHILE LOOP
            receiveDP(); // CALLS THE METHOD TO RECEIVE THE DATAGRAM PACKET
        } // END OF WHILE LOOP
    } // END OF RUN METHOD

    // GET ARRAY LIST METHOD: RETURNS THE LIST OF USERS
    public ArrayList<List> getArrayList() {
        return userList; // RETURNS THE LIST OF USERS
    } // END OF GET ARRAY LIST METHOD

    // RECEIVE DATAGRAM PACKET METHOD: RECEIVES THE DATAGRAM PACKET
    public void receiveDP() {
        try { // TRY CATCH BLOCK
            DatagramPacket DP = new DatagramPacket(bp, 1024); // CREATES A DATAGRAM PACKET: USED TO RECEIVE THE DATAGRAM PACKET. THE SIZE OF THE DATAGRAM PACKET IS 1024.
            DS.receive(DP); // RECEIVES THE DATAGRAM PACKET
            byte Payload[] = DP.getData(); // GETS THE DATA FROM THE DATAGRAM PACKET
            int len = DP.getLength(); // GETS THE LENGTH OF THE DATAGRAM PACKET
            String msg = new String(Payload, 0, 0, len); // CREATES A STRING: USED TO STORE THE DATA FROM THE DATAGRAM PACKET
            int sender = DP.getPort(); // GETS THE PORT NUMBER OF THE SENDER
            String assignedPort = null; // STRING: USED TO STORE THE PORT NUMBER OF THE USER. THE ASSIGNED PORT NUMBER IS THE PORT NUMBER OF THE USER.
            String assignedmsg = null; // STRING: USED TO STORE THE MESSAGE TO BE SENT TO THE USER.
            String tag = msg.substring(0, 2); // STRING: USED TO STORE THE TAG OF THE MESSAGE. THE TAG IS THE FIRST TWO CHARACTERS OF THE MESSAGE.
            String askmsg = null; // ASK MESSAGE: USED TO STORE THE PORT NUMBER OF THE USER.
            switch (tag) { // SWITCH STATEMENT
                case "-m": // IF THE TAG IS -m: THE MESSAGE IS A MESSAGE TO BE SENT TO MULTIPLE USERS
                    askmsg = msg.substring(2).toLowerCase(); // GETS THE MESSAGE TO BE SENT TO MULTIPLE USERS
                    String[] askmsgArray = askmsg.split(","); // SPLIT THE MESSAGE TO BE SENT TO MULTIPLE USERS
                    assignedmsg = "-m"; // SETS THE MESSAGE TO BE SENT TO MULTIPLE USERS
                    for (String dest : askmsgArray) { // FOR LOOP: ITERATES THROUGH THE ARRAY OF USERS
                        for (int i = 0; i < userList.size(); i++) { // FOR LOOP: ITERATES THROUGH THE LIST OF USERS
                            if (userList.get(i).get(1).toString().equals(dest)) { // IF THE USER IS IN THE LIST OF USERS
                                assignedPort = userList.get(i).get(0).toString(); // GETS THE PORT NUMBER OF THE USER
                                assignedmsg += assignedPort; // ADDS THE PORT NUMBER OF THE USER TO THE MESSAGE TO BE SENT TO MULTIPLE USERS
                            } // END OF IF STATEMENT
                        } // END OF FOR LOOP
                    } // END OF FOR LOOP
                    sendDP(sender, assignedmsg); // CALLS THE METHOD TO SEND THE MESSAGE TO THE USER
                    break; // BREAKS OUT OF THE SWITCH STATEMENT
                case "-a": // IF THE TAG IS -a: THE MESSAGE IS A MESSAGE TO BE SENT TO A SINGLE USER
                    askmsg = msg.substring(2).toLowerCase(); // GETS THE MESSAGE TO BE SENT TO A SINGLE USER
                    for (int i = 0; i < userList.size(); i++) { // FOR LOOP: ITERATES THROUGH THE LIST OF USERS
                        if (userList.get(i).get(1).toString().equals(askmsg)) { // IF THE USER IS IN THE LIST OF USERS
                            assignedPort = userList.get(i).get(0).toString(); // GETS THE PORT NUMBER OF THE USER
                            assignedmsg = "-a" + assignedPort; // SETS THE MESSAGE TO BE SENT TO THE USER
                            sendDP(sender, assignedmsg); // CALLS THE METHOD TO SEND THE MESSAGE TO THE USER
                            break; // BREAKS OUT OF THE FOR LOOP
                        } // END OF IF STATEMENT
                    } // END OF FOR LOOP
                    break; // BREAKS OUT OF THE SWITCH STATEMENT
                case "-r": // IF THE TAG IS -r: THE MESSAGE IS A MESSAGE TO REGISTER A USER
                    String regmsg = msg.substring(2).toLowerCase(); // GETS THE MESSAGE TO REGISTER A USER
                    if (userList.size() == 0) { // IF THE LIST OF USERS IS EMPTY
                        List tempList = new ArrayList(); // CREATES A LIST: USED TO STORE THE PORT NUMBER AND THE NAME OF THE USER
                        String cliSenderName = regmsg.toLowerCase(); // GETS THE NAME OF THE USER
                        int cliSenderPort = 8000; // SETS THE PORT NUMBER OF THE USER
                        tempList.add(cliSenderPort); // ADDS THE PORT NUMBER OF THE USER TO THE LIST
                        tempList.add(cliSenderName); // ADDS THE NAME OF THE USER TO THE LIST
                        userList.add(tempList); // ADDS THE LIST TO THE LIST OF USERS
                        String user = userList.get(0).get(1).toString(); // GETS THE NAME OF THE USER
                        user = user.substring(0, 1).toUpperCase() + user.substring(1); // CAPITALISES THE FIRST LETTER OF THE NAME OF THE USER
                        Server.append("\nAssigned '" + user + "' on Port: " + userList.get(0).get(0).toString() + "!"); // APPENDS THE NAME OF THE USER AND THE PORT NUMBER OF THE USER TO THE SERVER
                        String portAssign = "-y" + "p" + "8000"; // SETS THE MESSAGE TO BE SENT TO THE USER
                        sendDP(sender, portAssign); // CALLS THE METHOD TO SEND THE MESSAGE TO THE USER
                    } else { // IF THE LIST OF USERS IS NOT EMPTY
                        List tempList = new ArrayList(); // CREATES A LIST: USED TO STORE THE PORT NUMBER AND THE NAME OF THE USER
                        String portAssign = null; // PORT ASSIGN: USED TO STORE THE PORT NUMBER OF THE USER TO BE ASSIGNED TO THE USER (BETWEEN 8000 AND 8010)
                        String cliSenderName = regmsg; // GETS THE NAME OF THE USER
                        for (int i = 0; i < userList.size(); i++) { // FOR LOOP: ITERATES THROUGH THE LIST OF USERS
                            if (userList.get(i).get(1).equals(regmsg)) { // IF THE USER IS IN THE LIST OF USERS
                                assignedmsg = "-nr"; // SETS THE MESSAGE TO BE SENT TO THE USER
                                Server.append("\n'" + regmsg + "'' already exists!"); // APPENDS THE NAME OF THE USER TO THE SERVER
                                sendDP(sender, assignedmsg); // CALLS THE METHOD TO SEND THE MESSAGE TO THE USER
                                break; // BREAKS OUT OF THE FOR LOOP
                            } else { // IF THE USER IS NOT IN THE LIST OF USERS
                                if (i == userList.size() - 1) { // IF THE USER IS THE LAST USER IN THE LIST OF USERS
                                    String lastPort = userList.get(i).get(0).toString(); // GETS THE PORT NUMBER OF THE LAST USER IN THE LIST OF USERS
                                    int lastPortInt = Integer.parseInt(lastPort); // CONVERTS THE PORT NUMBER OF THE LAST USER IN THE LIST OF USERS TO AN INTEGER
                                    int lastPortIntPlus = lastPortInt + 1; // INCREMENTS THE PORT NUMBER OF THE LAST USER IN THE LIST OF USERS BY 1
                                    int cliSenderPort = lastPortIntPlus; // SETS THE PORT NUMBER OF THE USER TO THE INCREMENTED PORT NUMBER OF THE LAST USER IN THE LIST OF USERS
                                    String tmpCliPort = Integer.toString(cliSenderPort); // CONVERTS THE PORT NUMBER OF THE USER TO A STRING
                                    tempList.add(cliSenderPort); // ADDS THE PORT NUMBER OF THE USER TO THE LIST
                                    tempList.add(cliSenderName); // ADDS THE NAME OF THE USER TO THE LIST
                                    userList.add(tempList); // ADDS THE LIST TO THE LIST OF USERS
                                    String user = userList.get(i + 1).get(1).toString(); // GETS THE NAME OF THE USER
                                    user = user.substring(0, 1).toUpperCase() + user.substring(1); // CAPITALISES THE FIRST LETTER OF THE NAME OF THE USER
                                    Server.append("\nAssigned '" + user + "' on Port: "
                                            + userList.get(i + 1).get(0).toString() + "!"); // APPENDS THE NAME OF THE USER AND THE PORT NUMBER OF THE USER TO THE SERVER
                                    portAssign = "-y" + "p" + tmpCliPort; // SETS THE MESSAGE TO BE SENT TO THE USER
                                    sendDP(sender, portAssign); // CALLS THE METHOD TO SEND THE MESSAGE TO THE USER
                                    break; // BREAKS OUT OF THE FOR LOOP
                                } // END OF IF STATEMENT
                            } // END OF IF STATEMENT
                        } // END OF FOR LOOP
                    } // END OF IF STATEMENT
                    break; // BREAKS OUT OF THE SWITCH STATEMENT
            } // END OF SWITCH STATEMENT
        } catch (IOException e) { // CATCHES ANY IO EXCEPTIONS
        } // END OF TRY CATCH STATEMENT
    } // END OF METHOD

    // SEND DATAGRAM PACKET METHOD: USED TO SEND A MESSAGE TO A USER
    public void sendDP(int Pr, String msg) {
        int len = msg.length(); // GETS THE LENGTH OF THE MESSAGE
        byte b[] = new byte[len]; // CREATES A BYTE ARRAY: USED TO STORE THE MESSAGE
        msg.getBytes(0, len, b, 0); // CONVERTS THE MESSAGE TO A BYTE ARRAY
        try { // TRY CATCH STATEMENT: USED TO CATCH ANY IO EXCEPTIONS
            ER = InetAddress.getByName("127.0.0.1"); // SETS THE IP ADDRESS OF THE USER
            DatagramPacket DP = new DatagramPacket(b, len, ER, Pr); // CREATES A DATAGRAM PACKET: USED TO SEND THE MESSAGE TO THE USER
            DS.send(DP); // SENDS THE DATAGRAM PACKET TO THE USER
        } catch (IOException e) { // CATCHES ANY IO EXCEPTIONS
        } // END OF TRY CATCH STATEMENT
    } // END OF METHOD
} // END OF CLASS