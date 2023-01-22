import java.io.*;
import java.net.*;
import java.util.ArrayList;
import java.awt.*;

// REGISTRY SOCKET: THIS CLASS IS THE REGISTRY SOCKET FOR THE CHAT. IT IS A THREAD THAT LISTENS FOR REGISTRY REQUESTS. WHEN A REQUEST IS RECEIVED, IT IS PROCESSED AND A RESPONSE IS SENT BACK TO THE CLIENT. THE REGISTRY SOCKET IS A THREAD THAT RUNS IN THE BACKGROUND.
public class RegistrySocket extends Thread {
    InetAddress ER; // THE IP ADDRESS OF THE REGISTRY SERVICE: THIS IS THE IP ADDRESS OF THE REGISTRY SERVICE.
    DatagramSocket DS; // THE DATAGRAM SOCKET: THIS IS THE DATAGRAM SOCKET THAT IS USED TO SEND AND RECEIVE MESSAGES.
    byte bp[] = new byte[1024]; // THE BYTE ARRAY: THIS IS THE BYTE ARRAY THAT IS USED TO STORE THE MESSAGE. THE MESSAGE IS CONVERTED TO A BYTE ARRAY BEFORE IT IS SENT AND CONVERTED BACK TO A STRING AFTER IT IS RECEIVED.
    TextArea Registry = new TextArea(12, 40); // REGISTRY TEXT AREA
    ArrayList<String> usersList = new ArrayList<String>(); // LIST OF USERS: THIS IS THE LIST OF USERS THAT ARE CURRENTLY REGISTERED WITH THE REGISTRY SERVICE.
    String assignedmsg = null; // ASSIGNED MESSAGE: THIS IS THE MESSAGE THAT IS SENT TO THE CLIENT WHEN THE CLIENT IS ASSIGNED A PORT NUMBER.

    // [CONSTRUCTOR]----------------------------------------------------------
    // THIS CONSTRUCTOR CREATES A NEW REGISTRY SOCKET.
    RegistrySocket(TextArea ta) {
        Registry = ta; // SETS THE REGISTRY TEXT AREA TO THE ONE PASSED IN.
    } // END OF CONSTRUCTOR

    // [METHODS]--------------------------------------------------------------
    // THIS METHOD SENDS A MESSAGE TO THE CLIENT.
    public void run() {
        try { // TRY TO CREATE A NEW DATAGRAM SOCKET.
            DS = new DatagramSocket(8081); // CREATE A NEW DATAGRAM SOCKET ON PORT 8081.
            Registry.append("Welcome to the Registry Service!\n"); // PRINT A WELCOME MESSAGE TO THE REGISTRY TEXT AREA.
        } catch (IOException e) { // IF AN ERROR OCCURS, PRINT THE ERROR MESSAGE.
            Registry.append("Error: " + e.getMessage() + " in RegistrySocket!\n"); // PRINT THE ERROR MESSAGE TO THE REGISTRY TEXT AREA.
        } // END OF TRY-CATCH BLOCK
        while (true) { // WHILE THE REGISTRY SOCKET IS RUNNING.
            receiveDP(); // RECEIVE A MESSAGE FROM THE CLIENT.
        } // END OF WHILE LOOP
    } // END OF run METHOD

    // RECEIVEASSIGNDP: RECEIVE A MESSAGE FROM THE CLIENT.
    public String receiveAssignDP() {
        String msg = null; // THE MESSAGE: THIS IS THE MESSAGE THAT IS RECEIVED FROM THE CLIENT.
        try { // TRY TO RECEIVE A MESSAGE FROM THE CLIENT.
            DatagramPacket DP = new DatagramPacket(bp, 1024); // CREATE A NEW DATAGRAM PACKET. THIS IS THE PACKET THAT WILL BE USED TO RECEIVE THE MESSAGE.
            DS.receive(DP); // RECEIVE THE MESSAGE.
            byte Payload[] = DP.getData(); // GET THE MESSAGE FROM THE DATAGRAM PACKET.
            int len = DP.getLength(); // GET THE LENGTH OF THE MESSAGE.
            msg = new String(Payload, 0, 0, len); // CONVERT THE MESSAGE TO A STRING.
        } catch (IOException e) { // IF AN ERROR OCCURS, PRINT THE ERROR MESSAGE.
            Registry.append("Error: " + e.getMessage() + " in receiveAssignDP!\n"); // PRINT THE ERROR MESSAGE TO THE REGISTRY TEXT AREA.
        } // END OF TRY-CATCH BLOCK
        return msg; // RETURN THE MESSAGE.
    } // END OF receiveAssignDP METHOD

    // RECEIVEDP: RECEIVE A MESSAGE FROM THE CLIENT.
    public void receiveDP() {
        try { // TRY TO RECEIVE A MESSAGE FROM THE CLIENT.
            DatagramPacket DP = new DatagramPacket(bp, 1024); // CREATE A NEW DATAGRAM PACKET. THIS IS THE PACKET THAT WILL BE USED TO RECEIVE THE MESSAGE.
            DS.receive(DP); // RECEIVE THE MESSAGE.
            byte Payload[] = DP.getData(); // GET THE MESSAGE FROM THE DATAGRAM PACKET.
            int len = DP.getLength(); // GET THE LENGTH OF THE MESSAGE.
            int sender = DP.getPort(); // GET THE PORT NUMBER OF THE CLIENT.
            String msg = new String(Payload, 0, 0, len); // CONVERT THE MESSAGE TO A STRING.
            String tag = msg.substring(0, 2); // GET THE TAG FROM THE MESSAGE.
            switch (tag) { // SWITCH ON THE TAG.
                case "-c": // IF THE TAG IS -c, THE CLIENT IS REQUESTING TO CONNECT TO THE CHAT.
                    if (usersList.size() == 11) { // IF THE LIST OF USERS IS FULL.
                        sendDP(sender, "-nfull"); // SEND A MESSAGE TO THE CLIENT THAT THE LIST OF USERS IS FULL.
                    }
                    // else { // IF THE LIST OF USERS IS NOT FULL.
                    //     sendDP(sender, "-y"); // SEND A MESSAGE TO THE CLIENT THAT THE LIST OF USERS IS NOT FULL.
                    // } // END OF IF-ELSE STATEMENT
                    break; // BREAK OUT OF THE SWITCH STATEMENT.
                case "-r": // IF THE TAG IS -r, THE CLIENT IS REQUESTING TO REGISTER WITH THE REGISTRY SERVICE.
                    String regmsg = msg.substring(2); // GET THE USERNAME FROM THE MESSAGE.
                    String sendRegmsg = "-r" + regmsg; // CREATE A NEW MESSAGE TO SEND TO THE REGISTRY SERVICE.
                    sendDP(8080, sendRegmsg); // SEND THE MESSAGE TO THE REGISTRY SERVICE.
                    assignedmsg = receiveAssignDP(); // RECEIVE THE MESSAGE FROM THE REGISTRY SERVICE.
                    if (assignedmsg.charAt(0) == '-' && assignedmsg.charAt(1) == 'y') { // IF THE MESSAGE IS -y, THE CLIENT HAS BEEN ASSIGNED A PORT NUMBER.
                        String msgToSend = assignedmsg; // CREATE A NEW MESSAGE TO SEND TO THE CLIENT.
                        usersList.add(regmsg.toLowerCase()); // ADD THE USERNAME TO THE LIST OF USERS.
                        sendDP(sender, msgToSend); // SEND THE MESSAGE TO THE CLIENT.
                        regmsg = regmsg.substring(0, 1).toUpperCase() + regmsg.substring(1); // CAPITALISE THE FIRST LETTER OF THE USERNAME.
                        Registry.append("\nCreated: " + regmsg + "!"); // PRINT A MESSAGE TO THE REGISTRY TEXT AREA.
                    } else if (assignedmsg.equals("-nr")) { // IF THE MESSAGE IS -nr, THE CLIENT HAS NOT BEEN ASSIGNED A PORT NUMBER.
                        String res = "-n"; // CREATE A NEW MESSAGE TO SEND TO THE CLIENT.
                        Registry.append("\n" + "User not assigned due to a conflict!"); // PRINT A MESSAGE TO THE REGISTRY TEXT AREA.
                        sendDP(sender, res); // SEND THE MESSAGE TO THE CLIENT.
                    } // END OF IF-ELSE STATEMENT
                    assignedmsg = null; // SET THE MESSAGE TO NULL.
                    break; // BREAK OUT OF THE SWITCH STATEMENT.
                case "-l": // IF THE TAG IS -l, THE CLIENT IS REQUESTING TO LOG IN TO THE CHAT.
                    boolean found = false; // SET THE FOUND VARIABLE TO FALSE.
                    String loginmsg = msg.substring(2); // GET THE PORT NUMBER AND USERNAME FROM THE MESSAGE.
                    String[] loginArray = loginmsg.split(","); // SPLIT THE MESSAGE INTO AN ARRAY.
                    String loginPort = loginArray[0]; // GET THE PORT NUMBER FROM THE ARRAY.
                    String loginName = loginArray[1]; // GET THE USERNAME FROM THE ARRAY.
                    for (int i = 0; i < usersList.size(); i++) { // LOOP THROUGH THE LIST OF USERS.
                        if (usersList.get(i).equals(loginName)) { // IF THE USERNAME IS IN THE LIST OF USERS.
                            found = true; // SET THE FOUND VARIABLE TO TRUE.
                            String loginToNameService = "-a" + loginName; // CREATE A NEW MESSAGE TO SEND TO THE REGISTRY SERVICE.
                            sendDP(8080, loginToNameService); // SEND THE MESSAGE TO THE REGISTRY SERVICE.
                            String portToLogin = receiveAssignDP(); // RECEIVE THE MESSAGE FROM THE REGISTRY SERVICE.
                            portToLogin = portToLogin.substring(2); // GET THE PORT NUMBER FROM THE MESSAGE.
                            if (portToLogin.equals(loginPort)) { // IF THE PORT NUMBER MATCHES THE PORT NUMBER IN THE MESSAGE.
                                Registry.append("\nJust logged in: " + loginName + "!"); // PRINT A MESSAGE TO THE REGISTRY TEXT AREA.
                                sendDP(sender, "-yl" + loginPort); // SEND A MESSAGE TO THE CLIENT THAT THE LOGIN WAS SUCCESSFUL.
                                break; // BREAK OUT OF THE LOOP.
                            } else { // IF THE PORT NUMBER DOES NOT MATCH THE PORT NUMBER IN THE MESSAGE.
                                String errormsg = "-nlnomatch" + "," + portToLogin; // CREATE A NEW MESSAGE TO SEND TO THE CLIENT.
                                Registry.append(
                                        "\nFailed to login: " + loginName + " sending PIN: " + portToLogin + "!"); // PRINT A MESSAGE TO THE REGISTRY TEXT AREA.
                                sendDP(sender, errormsg); // PORT DOES NOT MATCH THE PORT NUMBER IN THE MESSAGE.
                            } // END OF IF-ELSE STATEMENT
                        } // END OF IF STATEMENT
                    } // END OF FOR LOOP
                    if (!found) { // IF THE USERNAME IS NOT IN THE LIST OF USERS.
                        Registry.append("\nFailed to login: " + "'" + loginName + "'" + " doesn't exist!"); // PRINT A MESSAGE TO THE REGISTRY TEXT AREA.
                        sendDP(sender, "-nlnotfound"); // NAME NOT FOUND IN THE LIST OF USERS.
                    } // END OF IF STATEMENT
                    break; // BREAK OUT OF THE SWITCH STATEMENT.
            } // END OF SWITCH STATEMENT
        } catch (IOException e) { // IF THERE IS AN ERROR.
            Registry.append("\n" + "Error: " + e); // PRINT A MESSAGE TO THE REGISTRY TEXT AREA.
        } // END OF TRY-CATCH STATEMENT
    } // END OF METHOD

    // SENDDP: SENDS A MESSAGE TO THE REGISTRY SERVICE.
    public void sendDP(int Pr, String msg) {
        int len = msg.length(); // GET THE LENGTH OF THE MESSAGE.
        byte b[] = new byte[len]; // CREATE A NEW BYTE ARRAY.
        msg.getBytes(0, len, b, 0); // GET THE BYTES FROM THE MESSAGE.
        try { // TRY TO SEND THE MESSAGE.
            ER = InetAddress.getByName("127.0.0.1"); // GET THE IP ADDRESS OF THE REGISTRY SERVICE.
            DatagramPacket DP = new DatagramPacket(b, len, ER, Pr); // CREATE A NEW DATAGRAM PACKET.
            DS.send(DP); // SEND THE DATAGRAM PACKET.
        } catch (IOException e) { // IF THERE IS AN ERROR.
            Registry.append("\n" + "Error: " + e); // PRINT A MESSAGE TO THE REGISTRY TEXT AREA.
        } // END OF TRY-CATCH STATEMENT
    } // END OF METHOD
} // END OF CLASS