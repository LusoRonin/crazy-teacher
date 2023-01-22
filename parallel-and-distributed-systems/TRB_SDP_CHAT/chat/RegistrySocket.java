// AUTHOR: PEDRO SIMÕES & ANTÓNIO GRAÇA

// [IMPORTS]------------------------------------------------------------------
import java.io.*;
import java.net.*;
import java.util.ArrayList;
import java.awt.*;

// REGISTRYSOCKET: THIS IS THE REGISTRY SOCKET CLASS THAT HANDLES THE REGISTRY SERVICE.
public class RegistrySocket extends Thread {
    InetAddress ER; // INETADDRESS OF THE SERVER
    DatagramSocket DS; // DATAGRAMSOCKET TO SEND AND RECEIVE PACKETS
    byte bp[] = new byte[1024]; // BYTE ARRAY TO STORE THE PAYLOAD OF THE PACKET
    TextArea Registry = new TextArea(12, 40); // TEXT AREA TO DISPLAY THE IP ADDRESS OF THE SERVER
    ArrayList<String> usersList = new ArrayList<String>(); // ARRAYLIST TO STORE THE USERS
    String assignedmsg = null; // STRING TO STORE THE ASSIGNED MESSAGE

    // [CONSTRUCTOR]------------------------------------------------------------
    // INITIALIZE THE REGISTRYSOCKET CLASS
    RegistrySocket(TextArea ta) {
        Registry = ta; // SET THE TEXT AREA TO THE TEXT AREA PASSED IN
    } // END OF CONSTRUCTOR

    // [METHODS]----------------------------------------------------------------
    // SEND A PACKET TO THE CLIENT
    public void run() {
        try { // TRY TO CREATE A NEW DATAGRAMSOCKET
            DS = new DatagramSocket(8081); // CREATE A NEW DATAGRAMSOCKET ON PORT 8081
            Registry.append("Welcome to the Registry Service!\n"); // DISPLAY A WELCOME MESSAGE
        } catch (IOException e) { // IF AN ERROR OCCURS
            Registry.append("Error: " + e + " \n"); // DISPLAY THE ERROR
        } // END OF TRY-CATCH BLOCK
        while (true) { // WHILE THE PROGRAM IS RUNNING
            receiveDP(); // RECEIVE A PACKET
        } // END OF WHILE LOOP
    } // END OF RUN METHOD

    // RECEIVE ASSIGN DP: RECEIVE THE ASSIGN DATAGRAM PACKET
    public String receiveAssignDP() {
        String msg = null; // STRING TO STORE THE MESSAGE
        try { // TRY TO RECEIVE THE PACKET
            DatagramPacket DP = new DatagramPacket(bp, 1024); // CREATE A NEW DATAGRAM PACKET WITH A PAYLOAD OF 1024
            DS.receive(DP); // RECEIVE THE PACKET
            byte Payload[] = DP.getData(); // GET THE PAYLOAD OF THE PACKET
            int len = DP.getLength(); // GET THE LENGTH OF THE PAYLOAD
            msg = new String(Payload, 0, 0, len); // CREATE A NEW STRING WITH THE PAYLOAD OF THE PACKET
        } catch (IOException e) { // IF AN ERROR OCCURS
        } // END OF TRY-CATCH BLOCK
        return msg; // RETURN THE MESSAGE
    } // END OF RECEIVE ASSIGN DP METHOD

    // RECEIVE DP: RECEIVE THE DATAGRAM PACKET
    public void receiveDP() {
        try { // TRY TO RECEIVE THE PACKET
            DatagramPacket DP = new DatagramPacket(bp, 1024); // CREATE A NEW DATAGRAM PACKET WITH A PAYLOAD OF 1024
            DS.receive(DP); // RECEIVE THE PACKET
            byte Payload[] = DP.getData(); // GET THE PAYLOAD OF THE PACKET
            int len = DP.getLength(); // GET THE LENGTH OF THE PAYLOAD
            int sender = DP.getPort(); // GET THE PORT OF THE SENDER
            String msg = new String(Payload, 0, 0, len); // CREATE A NEW STRING WITH THE PAYLOAD OF THE PACKET AND THE LENGTH OF THE PAYLOAD
            String tag = msg.substring(0, 2); // GET THE TAG OF THE MESSAGE
            switch (tag) { // SWITCH STATEMENT TO HANDLE THE TAG
                case "-c": // IF THE TAG IS -c
                    if (usersList.size() == 11) { // IF THE SIZE OF THE ARRAYLIST IS 11
                        sendDP(sender, "-nfull"); // SEND A PACKET TO THE CLIENT
                    } // END OF IF STATEMENT
                    // else { // IF THE SIZE OF THE ARRAYLIST IS NOT 11
                    //     sendDP(sender, "-y"); // SEND A PACKET TO THE CLIENT
                    // } // END OF ELSE STATEMENT
                    break; // BREAK OUT OF THE SWITCH STATEMENT
                case "-r": // IF THE TAG IS -r
                    String regmsg = msg.substring(2); // GET THE MESSAGE
                    String sendRegmsg = "-r" + regmsg; // CREATE A NEW STRING WITH THE TAG AND THE MESSAGE
                    sendDP(8080, sendRegmsg); // SEND A PACKET TO THE CLIENT
                    assignedmsg = receiveAssignDP(); // RECEIVE A PACKET
                    if (assignedmsg.charAt(0) == '-' && assignedmsg.charAt(1) == 'y') { // IF THE FIRST TWO CHARACTERS OF THE ASSIGNED MESSAGE ARE -y
                        String msgToSend = assignedmsg; // CREATE A NEW STRING WITH THE ASSIGNED MESSAGE
                        usersList.add(regmsg.toLowerCase()); // ADD THE MESSAGE TO THE ARRAYLIST
                        sendDP(sender, msgToSend); // SEND A PACKET TO THE CLIENT
                        regmsg = regmsg.substring(0, 1).toUpperCase() + regmsg.substring(1); // CREATE A NEW STRING WITH THE MESSAGE
                        Registry.append("\nCreated: " + regmsg + "!"); // DISPLAY THE MESSAGE IN THE TEXT AREA
                    } else if (assignedmsg.equals("-nr")) { // IF THE ASSIGNED MESSAGE IS -nr
                        String res = "-n"; // CREATE A NEW STRING WITH THE TAG -n
                        Registry.append("\n" + "User not assigned due to a conflict!"); // DISPLAY THE MESSAGE IN THE TEXT AREA
                        sendDP(sender, res); // SEND A PACKET TO THE CLIENT
                    } // END OF IF-ELSE STATEMENT
                    assignedmsg = null; // SET THE ASSIGNED MESSAGE TO NULL
                    break; // BREAK OUT OF THE SWITCH STATEMENT
                case "-l": // IF THE TAG IS -l
                    boolean found = false; // BOOLEAN TO CHECK IF THE USER IS FOUND
                    String loginmsg = msg.substring(2); // GET THE MESSAGE
                    String[] loginArray = loginmsg.split(","); // SPLIT THE MESSAGE
                    String loginPort = loginArray[0]; // GET THE PORT
                    String loginName = loginArray[1]; // GET THE NAME
                    for (int i = 0; i < usersList.size(); i++) { // FOR LOOP TO CHECK IF THE USER IS FOUND
                        if (usersList.get(i).equals(loginName)) { // IF THE USER IS FOUND
                            found = true; // SET THE BOOLEAN TO TRUE
                            String loginToNameService = "-a" + loginName; // CREATE A NEW STRING WITH THE TAG -a AND THE NAME
                            sendDP(8080, loginToNameService); // SEND A PACKET TO THE CLIENT
                            String portToLogin = receiveAssignDP(); // RECEIVE A PACKET
                            portToLogin = portToLogin.substring(2); // GET THE PORT
                            if (portToLogin.equals(loginPort)) { // IF THE PORTS MATCH
                                Registry.append("\nJust logged in: " + loginName + "!"); // DISPLAY THE MESSAGE IN THE TEXT AREA
                                sendDP(sender, "-yl" + loginPort); // SEND A PACKET TO THE CLIENT
                                break; // BREAK OUT OF THE FOR LOOP
                            } else { // IF THE PORTS DO NOT MATCH
                                String errormsg = "-nlnomatch" + "," + portToLogin; // CREATE A NEW STRING WITH THE TAG -nlnomatch AND THE PORT
                                Registry.append(
                                        "\nFailed to login: " + loginName + " sending PIN: " + portToLogin + "!"); // DISPLAY THE MESSAGE IN THE TEXT AREA
                                sendDP(sender, errormsg); // PORT DOES NOT MATCH THE PORT IN THE NAME SERVICE
                            } // END OF IF-ELSE STATEMENT
                        } // END OF IF STATEMENT
                    } // END OF FOR LOOP
                    if (!found) { // IF THE USER IS NOT FOUND
                        Registry.append("\nFailed to login: " + "'" + loginName + "'" + " doesn't exist!"); // DISPLAY THE MESSAGE IN THE TEXT AREA
                        sendDP(sender, "-nlnotfound"); // NAME NOT FOUND IN THE NAME SERVICE
                    } // END OF IF STATEMENT
                    break; // BREAK OUT OF THE SWITCH STATEMENT
            } // END OF SWITCH STATEMENT
        } catch (IOException e) { // CATCH ANY IOEXCEPTIONS
        } // END OF TRY-CATCH STATEMENT
    } // END OF METHOD

    // SENDDP: SENDS A PACKET TO THE CLIENT
    public void sendDP(int Pr, String msg) {
        int len = msg.length(); // GET THE LENGTH OF THE MESSAGE
        byte b[] = new byte[len]; // CREATE A NEW BYTE ARRAY WITH THE LENGTH OF THE MESSAGE
        msg.getBytes(0, len, b, 0); // GET THE BYTES OF THE MESSAGE
        try { // TRY TO SEND THE PACKET
            ER = InetAddress.getByName("127.0.0.1"); // GET THE IP ADDRESS
            DatagramPacket DP = new DatagramPacket(b, len, ER, Pr); // CREATE A NEW DATAGRAM PACKET WITH THE BYTE ARRAY, THE LENGTH, THE IP ADDRESS, AND THE PORT
            DS.send(DP); // SEND THE PACKET
        } catch (IOException e) { // CATCH ANY IOEXCEPTIONS
        } // END OF TRY-CATCH STATEMENT
    } // END OF METHOD
} // END OF CLASS