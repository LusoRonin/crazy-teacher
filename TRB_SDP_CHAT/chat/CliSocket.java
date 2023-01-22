import java.io.*;
import java.net.*;
import java.awt.*;

// CLISOCKET CLASS: THIS CLASS IS RESPONSIBLE FOR THE COMMUNICATION BETWEEN THE CLIENT AND THE SERVER THROUGH UDP PACKETS.
public class CliSocket extends Thread {
    // [VARIABLES]------------------------------------------------------------------------------------------------------------------
    InetAddress ER, IPr; // ER: END RECEIVER: IP ADDRESS OF THE DESTINATION; IPr: IP ADDRESS OF THE
                         // SENDER.
    DatagramSocket DS; // DS: DATAGRAM SOCKET: SOCKET USED TO SEND AND RECEIVE UDP PACKETS.
    byte bp[] = new byte[1024]; // bp: BYTE PACKET: ARRAY OF BYTES USED TO STORE THE UDP PACKET.
    int port; // port: PORT NUMBER: PORT NUMBER USED TO SEND AND RECEIVE UDP PACKETS.
    int destPort; // destPort: DESTINATION PORT NUMBER: PORT NUMBER OF THE DESTINATION.
    // [GUI
    // COMPONENTS]------------------------------------------------------------------------------------
    TextArea ecran = new TextArea(10, 30); // ecran: TEXT AREA: TEXT AREA USED TO DISPLAY THE CHAT MESSAGES.
    // [VALIDATION
    // VARIABLES]----------------------------------------------------------------------------------
    boolean regUser = false; // regUser: REGISTERED USER: BOOLEAN VARIABLE USED TO VALIDATE IF THE USER IS
                             // REGISTERED.
    boolean newPort = false; // newPort: NEW PORT: BOOLEAN VARIABLE USED TO VALIDATE IF THE USER IS USING A
                             // NEW PORT.
    boolean confirm = false; // confirm: CONFIRMATION: BOOLEAN VARIABLE USED TO VALIDATE IF THE USER IS
                             // CONFIRMED.
    String logmsg = null; // logmsg: LOGIN MESSAGE: STRING VARIABLE USED TO STORE THE LOGIN MESSAGE.

    // [CONSTRUCTOR]------------------------------------------------------------------------------------------------------------------
    // CliSocket: CONSTRUCTOR OF THE CLASS. IT CREATES A DATAGRAM SOCKET AND STARTS
    // THE THREAD.
    CliSocket(TextArea ta) {
        ecran = ta; // SETS THE TEXT AREA OF THE GUI.
    }

    // [METHODS]------------------------------------------------------------------------------------------------------------------
    // SETPORT: SETS THE PORT NUMBER. IT IS USED TO SET THE PORT NUMBER OF THE
    // DESTINATION.
    public void setPort(int p) {
        port = p; // SETS THE PORT NUMBER.
    }

    // GETCONFIRM: RETURNS THE VALUE OF THE CONFIRMATION VARIABLE.
    public boolean getConfirm() {
        return confirm; // RETURNS THE VALUE OF THE CONFIRMATION VARIABLE.
    }

    // SETCONFIRM: SETS THE VALUE OF THE CONFIRMATION VARIABLE.
    public void setConfirm(boolean c) {
        confirm = c; // SETS THE VALUE OF THE CONFIRMATION VARIABLE.
    }

    // GETDESTPORT: RETURNS THE VALUE OF THE DESTINATION PORT NUMBER.
    public int getdestPort() {
        return destPort; // RETURNS THE VALUE OF THE DESTINATION PORT NUMBER.
    }

    // SETDESTPORT: SETS THE VALUE OF THE DESTINATION PORT NUMBER.
    public void setdestPort(int p) {
        destPort = p; // SETS THE VALUE OF THE DESTINATION PORT NUMBER.
    }

    // GETLOGMSG: RETURNS THE VALUE OF THE LOGIN MESSAGE.
    public String getLogmsg() {
        return logmsg; // RETURNS THE VALUE OF THE LOGIN MESSAGE.
    }

    // SETLOGMSG: SETS THE VALUE OF THE LOGIN MESSAGE.
    public void setLogmsg(String l) {
        logmsg = l; // SETS THE VALUE OF THE LOGIN MESSAGE.
    }

    // RECEIVEDP: RECEIVES THE UDP PACKET AND DISPLAYS THE MESSAGE IN THE TEXT AREA.
    public void receiveDP() {
        try { // TRY-CATCH BLOCK TO CATCH ANY EXCEPTIONS.
            DatagramPacket DP = new DatagramPacket(bp, 1024); // CREATES A DATAGRAM PACKET.
            DS.receive(DP); // RECEIVES THE UDP PACKET.
            IPr = DP.getAddress(); // GETS THE IP ADDRESS OF THE SENDER.
            byte Payload[] = DP.getData(); // GETS THE PAYLOAD OF THE UDP PACKET.
            int len = DP.getLength(); // GETS THE LENGTH OF THE UDP PACKET.
            String res = new String(Payload, 0, 0, len); // CONVERTS THE PAYLOAD TO A STRING.
            String tag = res.substring(0, 2); // GETS THE TAG OF THE MESSAGE.
            if (tag.equals("-a") || tag.equals("-m")) { // IF THE TAG IS -a OR -m, IT DISPLAYS THE MESSAGE IN THE TEXT AREA.
                destPort = Integer.parseInt(res.substring(2)); // GETS THE PORT NUMBER OF THE DESTINATION.
            } else { // IF THE TAG IS NOT -a OR -m, IT DISPLAYS THE MESSAGE IN THE TEXT AREA.
                String[] resArray = res.split("_"); // SPLIT THE MESSAGE INTO TWO PARTS.
                String userSent = resArray[0].substring(2); // GETS THE USERNAME OF THE SENDER.
                userSent = userSent.substring(0, 1).toUpperCase() + userSent.substring(1); // CAPITALIZES THE FIRST LETTER OF THE USERNAME.
                String newRes = resArray[1]; // GETS THE MESSAGE.
                ecran.appendText("\n" + userSent + ": " + newRes); // DISPLAYS THE MESSAGE IN THE TEXT AREA.
            } // END OF IF-ELSE STATEMENT.
        } catch (IOException e) { // CATCHES ANY EXCEPTIONS.
            e.printStackTrace(); // PRINTS THE STACK TRACE.
        } // END OF TRY-CATCH BLOCK.
    } // END OF RECEIVEDP METHOD.

    // RECEIVEREGDP: RECEIVES THE UDP PACKET AND DISPLAYS THE MESSAGE IN THE TEXT AREA.
    public void receiveRegDP() {
        try { // TRY-CATCH BLOCK TO CATCH ANY EXCEPTIONS.
            DatagramPacket DP = new DatagramPacket(bp, 1024); // CREATES A DATAGRAM PACKET.
            DS.receive(DP); // RECEIVES THE UDP PACKET.
            IPr = DP.getAddress(); // GETS THE IP ADDRESS OF THE SENDER.
            byte Payload[] = DP.getData(); // GETS THE PAYLOAD OF THE UDP PACKET.
            int len = DP.getLength(); // GETS THE LENGTH OF THE UDP PACKET.
            String res = new String(Payload, 0, 0, len); // CONVERTS THE PAYLOAD TO A STRING.
            String tag = res.substring(0, 2); // GETS THE TAG OF THE MESSAGE.
            switch (tag) { // SWITCH STATEMENT TO CHECK THE TAG OF THE MESSAGE.
                case "-n": // IF THE TAG IS -n, IT DISPLAYS THE MESSAGE IN THE TEXT AREA.
                    if (res.length() < 3) { // IF THE MESSAGE IS LESS THAN 3 CHARACTERS, IT DISPLAYS THE MESSAGE IN THE TEXT AREA.
                        break; // BREAKS OUT OF THE SWITCH STATEMENT.
                    } else { // IF THE MESSAGE IS MORE THAN 3 CHARACTERS, IT DISPLAYS THE MESSAGE IN THE TEXT AREA.
                        if (res.charAt(2) == 'l') { // IF THE THIRD CHARACTER IS l, IT DISPLAYS THE MESSAGE IN THE TEXT AREA.
                            logmsg = res.substring(3); // GETS THE MESSAGE.
                            break; // BREAKS OUT OF THE SWITCH STATEMENT.
                        } else { // IF THE THIRD CHARACTER IS NOT l, IT DISPLAYS THE MESSAGE IN THE TEXT AREA.
                            logmsg = res.substring(2); // GETS THE MESSAGE.
                            break; // BREAKS OUT OF THE SWITCH STATEMENT.
                        } // END OF IF-ELSE STATEMENT.
                    } // END OF IF-ELSE STATEMENT.
                case "-y": // IF THE TAG IS -y, IT DISPLAYS THE MESSAGE IN THE TEXT AREA.
                    confirm = true; // SETS THE VALUE OF confirm TO TRUE.
                    if (res.length() > 2) { // IF THE MESSAGE IS MORE THAN 2 CHARACTERS, IT DISPLAYS THE MESSAGE IN THE TEXT AREA.
                        if (res.charAt(2) == 'p' || res.charAt(2) == 'l') { // IF THE THIRD CHARACTER IS p OR l, IT DISPLAYS THE MESSAGE IN THE TEXT AREA.
                            logmsg = "accepted"; // SETS THE VALUE OF logmsg TO accepted.
                            String tmp = res.substring(3); // GETS THE MESSAGE.
                            int p = Integer.parseInt(tmp); // CONVERTS THE MESSAGE TO AN INTEGER.
                            setPort(p); // SETS THE PORT NUMBER OF THE CLIENT.
                            regUser = true; // SETS THE VALUE OF regUser TO TRUE.
                            ecran.append("Welcome to the chat! Your PIN is: " + p + ".\n"); // DISPLAYS THE MESSAGE IN THE TEXT AREA.
                        } // END OF IF STATEMENT.
                    } // END OF IF STATEMENT.
                    break; // BREAKS OUT OF THE SWITCH STATEMENT.
            } // END OF SWITCH STATEMENT.
        } catch (IOException e) { // CATCHES ANY EXCEPTIONS.
            e.printStackTrace(); // PRINTS THE STACK TRACE.
        } // END OF TRY-CATCH BLOCK.
    } // END OF RECEIVEREGDP METHOD.

    // SENDDP: SENDS THE UDP PACKET TO THE DESTINATION.
    public void sendDP(int Pr, String msg, String end) {
        int len = msg.length(); // GETS THE LENGTH OF THE MESSAGE.
        byte b[] = new byte[len]; // CREATES A BYTE ARRAY.
        msg.getBytes(0, len, b, 0); // CONVERTS THE MESSAGE TO A BYTE ARRAY.
        try { // TRY-CATCH BLOCK TO CATCH ANY EXCEPTIONS.
            ER = InetAddress.getByName(end); // GETS THE IP ADDRESS OF THE DESTINATION.
            DatagramPacket DP = new DatagramPacket(b, len, ER, Pr); // CREATES A DATAGRAM PACKET.
            DS.send(DP); // SENDS THE UDP PACKET.
        } catch (IOException e) { // CATCHES ANY EXCEPTIONS.
            e.printStackTrace(); // PRINTS THE STACK TRACE.
        } // END OF TRY-CATCH BLOCK.
    } // END OF SENDDP METHOD.

    // SENDTOSERVICES: SENDS THE UDP PACKET TO THE SERVICES.
    public void sendtoServices(int Pr, String msg) {
        int len = msg.length(); // GETS THE LENGTH OF THE MESSAGE.
        byte b[] = new byte[len]; // CREATES A BYTE ARRAY.
        msg.getBytes(0, len, b, 0); // CONVERTS THE MESSAGE TO A BYTE ARRAY.
        try { // TRY-CATCH BLOCK TO CATCH ANY EXCEPTIONS.
            ER = InetAddress.getByName("127.0.0.1"); // GETS THE IP ADDRESS OF THE SERVICES.
            DatagramPacket DP = new DatagramPacket(b, len, ER, Pr); // CREATES A DATAGRAM PACKET.
            DS.send(DP); // SENDS THE UDP PACKET.
        } catch (IOException e) { // CATCHES ANY EXCEPTIONS.
            e.printStackTrace(); // PRINTS THE STACK TRACE.
        } // END OF TRY-CATCH BLOCK.
    } // END OF SENDTOSERVICES METHOD.

    // RUN: RUNS THE THREAD. IT CREATES A DATAGRAM SOCKET AND RECEIVES THE UDP PACKET.
    public void run() {
        try { // TRY-CATCH BLOCK TO CATCH ANY EXCEPTIONS.
            DS = new DatagramSocket(); // CREATES A DATAGRAM SOCKET.
            System.out.println("Porta: " + DS.getLocalPort()); // PRINTS THE PORT NUMBER OF THE CLIENT.
        } catch (IOException e) { // CATCHES ANY EXCEPTIONS.
            e.printStackTrace(); // PRINTS THE STACK TRACE.
        } // END OF TRY-CATCH BLOCK.
        while (!regUser) { // WHILE regUser IS FALSE, IT RECEIVES THE UDP PACKET.
            receiveRegDP(); // CALLS THE RECEIVEREGDP METHOD.
        } // END OF WHILE LOOP.
        DS.close(); // CLOSES THE DATAGRAM SOCKET.
        try { // TRY-CATCH BLOCK TO CATCH ANY EXCEPTIONS.
            DS = new DatagramSocket(port); // CREATES A DATAGRAM SOCKET.
            System.out.println("Nova porta: " + DS.getLocalPort()); // PRINTS THE PORT NUMBER OF THE CLIENT.
        } catch (IOException e) { // CATCHES ANY EXCEPTIONS.
            e.printStackTrace(); // PRINTS THE STACK TRACE.
        } // END OF TRY-CATCH BLOCK.
        while (true) { // WHILE TRUE, IT RECEIVES THE UDP PACKET.
            receiveDP(); // CALLS THE RECEIVEREGDP METHOD.
        } // END OF WHILE LOOP.
    } // END OF RUN METHOD.
} // END OF CLIENT CLASS.