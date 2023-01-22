// AUTHOR: PEDRO SIMÕES & ANTÓNIO GRAÇA

// [IMPORTS]------------------------------------------------------------------
import java.io.*;
import java.net.*;
import java.awt.*;

// CLIENT SOCKET CLASS: THIS CLASS IS RESPONSIBLE FOR THE COMMUNICATION BETWEEN THE CLIENT AND THE SERVER AND THE SERVICES SERVER
public class CliSocket extends Thread {
    InetAddress ER, IPr; // ER: REMOTE ADDRESS, IPr: LOCAL ADDRESS
    DatagramSocket DS; // DS: DATAGRAM SOCKET: UDP.
    byte bp[] = new byte[1024]; // bp: BUFFER: 1024 BYTES
    TextArea ecran = new TextArea(10, 30); // ecran: TEXT AREA
    int port; // port: PORT NUMBER: 0 BY DEFAULT
    String destPort; // destPort: DESTINATION PORT
    boolean regUser = false; // regUser: REGISTERED USER (TRUE IF REGISTERED): FALSE BY DEFAULT
    boolean newPort = false; // newPort: NEW PORT (TRUE IF NEW PORT): FALSE BY DEFAULT
    boolean confirm = false; // confirm: CONFIRMATION (TRUE IF CONFIRMED): FALSE BY DEFAULT
    String logmsg = null; // logmsg: LOGIN MESSAGE (NULL IF NOT LOGGED IN)

    // [CONSTRUCTOR]--------------------------------------------------------------
    // [PARAMETERS]: TEXT AREA
    // CREATES A NEW CLIENT SOCKET. SETS THE TEXT AREA TO THE ONE PASSED AS
    // PARAMETER. SETS THE PORT TO 0.
    CliSocket(TextArea ta) {
        ecran = ta; // SETS THE TEXT AREA TO THE ONE PASSED AS PARAMETER
    } // END OF CONSTRUCTOR

    // [GETTERS AND SETTERS]------------------------------------------------------
    // SETS THE PORT TO THE ONE PASSED AS PARAMETER
    public void setPort(int p) {
        port = p; // SETS THE PORT TO THE ONE PASSED AS PARAMETER
    } // END OF SET PORT

    // GETCONFIRM: RETURNS THE CONFIRMATION
    public boolean getConfirm() {
        return confirm; // RETURNS THE CONFIRMATION
    } // END OF GET CONFIRM

    // SETCONFIRM: SETS THE CONFIRMATION TO THE ONE PASSED AS PARAMETER
    public void setConfirm(boolean c) {
        confirm = c; // SETS THE CONFIRMATION TO THE ONE PASSED AS PARAMETER
    } // END OF SET CONFIRM

    // GETDESTPORT: RETURNS THE DESTINATION PORT
    public String getdestPort() {
        return destPort; // RETURNS THE DESTINATION PORT
    } // END OF GET DEST PORT

    // GETLOGMSG: RETURNS THE LOGIN MESSAGE
    public String getLogmsg() {
        return logmsg; // RETURNS THE LOGIN MESSAGE
    } // END OF GET LOG MSG

    // SETLOGMSG: SETS THE LOGIN MESSAGE TO THE ONE PASSED AS PARAMETER
    public void setLogmsg(String l) {
        logmsg = l; // SETS THE LOGIN MESSAGE TO THE ONE PASSED AS PARAMETER
    } // END OF SET LOG MSG

    // [METHODS]-----------------------------------------------------------------
    // RECEIVE: RECEIVES A DATAGRAM PACKET
    public void receiveDP() {
        try { // TRY CATCH BLOCK
            DatagramPacket DP = new DatagramPacket(bp, 1024); // CREATES A NEW DATAGRAM PACKET
            DS.receive(DP); // RECEIVES THE DATAGRAM PACKET
            IPr = DP.getAddress(); // SETS THE LOCAL ADDRESS TO THE ONE OF THE DATAGRAM PACKET
            byte Payload[] = DP.getData(); // CREATES A NEW BYTE ARRAY
            int len = DP.getLength(); // GETS THE LENGTH OF THE DATAGRAM PACKET
            String res = new String(Payload, 0, 0, len); // CREATES A NEW STRING
            String tag = res.substring(0, 2); // CREATES A NEW STRING WITH THE FIRST TWO CHARACTERS OF THE STRING
            if (tag.equals("-a") || tag.equals("-m")) { // IF THE TAG IS -a OR -m THEN
                destPort = res.substring(2); // SETS THE DESTINATION PORT TO THE STRING WITHOUT THE FIRST TWO CHARACTERS
            } // END IF
            else { // ELSE IF THE TAG IS NOT -a OR -m THEN
                String[] resArray = res.split("_"); // CREATES A NEW STRING ARRAY AND SPLIT THE STRING BY THE UNDERSCORE
                String userSent = resArray[0].substring(2); // CREATES A NEW STRING WITH THE FIRST TWO CHARACTERS OF THE STRING
                userSent = userSent.substring(0, 1).toUpperCase() + userSent.substring(1); // CREATES A NEW STRING WITH THE FIRST CHARACTER IN UPPERCASE
                String newRes = resArray[1]; // CREATES A NEW STRING WITH THE SECOND ELEMENT OF THE STRING ARRAY
                ecran.appendText("\n" + userSent + ": " + newRes); // APPENDS THE TEXT TO THE TEXT AREA
            } // END ELSE
        } catch (IOException e) { // CATCHES THE IOEXCEPTION
            e.printStackTrace(); // PRINTS THE STACK TRACE
        } // END CATCH
    } // END OF RECEIVE DP

    // RECEIVE REG DP: RECEIVES A REGISTRATION DATAGRAM PACKET
    public void receiveRegDP() {
        try { // TRY CATCH BLOCK
            DatagramPacket DP = new DatagramPacket(bp, 1024); // CREATES A NEW DATAGRAM PACKET
            DS.receive(DP); // RECEIVES THE DATAGRAM PACKET
            IPr = DP.getAddress(); // SETS THE LOCAL ADDRESS TO THE ONE OF THE DATAGRAM PACKET
            byte Payload[] = DP.getData(); // CREATES A NEW BYTE ARRAY
            int len = DP.getLength(); // GETS THE LENGTH OF THE DATAGRAM PACKET
            String res = new String(Payload, 0, 0, len); // CREATES A NEW STRING WITH THE FIRST TWO CHARACTERS OF THE STRING AND THE LENGTH OF THE DATAGRAM PACKET
            String tag = res.substring(0, 2); // CREATES A NEW STRING WITH THE FIRST TWO CHARACTERS OF THE STRING
            switch (tag) { // SWITCH STATEMENT
                case "-n": // IF THE TAG IS -n THEN
                    if (res.length() < 3) { // IF THE LENGTH OF THE STRING IS LESS THAN 3 THEN
                        break; // BREAK
                    } else { // ELSE IF THE LENGTH OF THE STRING IS NOT LESS THAN 3 THEN
                        if (res.charAt(2) == 'l') { // IF THE THIRD CHARACTER OF THE STRING IS l THEN
                            logmsg = res.substring(3); // SETS THE LOGIN MESSAGE TO THE STRING WITHOUT THE FIRST THREE CHARACTERS
                            break; // BREAK
                        } // END IF
                        else { // ELSE IF THE THIRD CHARACTER OF THE STRING IS NOT l THEN
                            logmsg = res.substring(2); // SETS THE LOGIN MESSAGE TO THE STRING WITHOUT THE FIRST TWO CHARACTERS
                            break; // BREAK
                        } // END ELSE
                    } // END ELSE
                case "-y": // IF THE TAG IS -y THEN
                    confirm = true; // SETS THE CONFIRMATION TO TRUE
                    if (res.length() > 2) { // IF THE LENGTH OF THE STRING IS GREATER THAN 2 THEN
                        if (res.charAt(2) == 'p' || res.charAt(2) == 'l') { // IF THE THIRD CHARACTER OF THE STRING IS p OR l THEN
                            logmsg = "accepted"; // SETS THE LOGIN MESSAGE TO accepted
                            String tmp = res.substring(3); // CREATES A NEW STRING WITH THE STRING WITHOUT THE FIRST THREE CHARACTERS
                            int p = Integer.parseInt(tmp); // CREATES A NEW INTEGER WITH THE STRING
                            setPort(p); // SETS THE PORT TO THE INTEGER
                            regUser = true; // SETS THE REGISTRATION USER TO TRUE
                            ecran.append("Welcome to the chat! Your PIN is: " + p + ".\n"); // APPENDS THE TEXT TO THE TEXT AREA
                        } // END IF
                    } // END IF
                    break; // BREAK
            } // END SWITCH
        } catch (IOException e) { // CATCHES THE IOEXCEPTION
            e.printStackTrace(); // PRINTS THE STACK TRACE
        } // END CATCH
    } // END OF RECEIVE REG DP

    // SEND DP: SENDS A DATAGRAM PACKET
    public void sendDP(int Pr, String msg, String end) {
        int len = msg.length(); // CREATES A NEW INTEGER WITH THE LENGTH OF THE STRING
        byte b[] = new byte[len]; // CREATES A NEW BYTE ARRAY
        msg.getBytes(0, len, b, 0); // GETS THE BYTES OF THE STRING
        try { // TRY CATCH BLOCK
            ER = InetAddress.getByName(end); // SETS THE ER TO THE END
            DatagramPacket DP = new DatagramPacket(b, len, ER, Pr); // CREATES A NEW DATAGRAM PACKET WITH THE BYTE ARRAY, THE LENGTH OF THE STRING, THE ER AND THE PORT
            DS.send(DP); // SENDS THE DATAGRAM PACKET
        } catch (IOException e) { // CATCHES THE IOEXCEPTION
            e.printStackTrace(); // PRINTS THE STACK TRACE
        } // END CATCH
    } // END OF SEND DP

    // SEND TO SERVICES: SENDS A DATAGRAM PACKET TO THE SERVICES
    public void sendtoServices(int Pr, String msg) {
        int len = msg.length(); // CREATES A NEW INTEGER WITH THE LENGTH OF THE STRING
        byte b[] = new byte[len]; // CREATES A NEW BYTE ARRAY
        msg.getBytes(0, len, b, 0); // GETS THE BYTES OF THE STRING
        try { // TRY CATCH BLOCK
            ER = InetAddress.getByName("127.0.0.1"); // SETS THE ER TO THE END
            DatagramPacket DP = new DatagramPacket(b, len, ER, Pr); // CREATES A NEW DATAGRAM PACKET WITH THE BYTE ARRAY, THE LENGTH OF THE STRING, THE ER AND THE PORT
            DS.send(DP); // SENDS THE DATAGRAM PACKET
        } catch (IOException e) { // CATCHES THE IOEXCEPTION
            e.printStackTrace(); // PRINTS THE STACK TRACE
        } // END CATCH
    } // END OF SEND TO SERVICES

    // RUN: RUNS THE THREAD AND RECEIVES THE DATAGRAM PACKETS
    public void run() {
        try { // TRY CATCH BLOCK
            DS = new DatagramSocket(); // CREATES A NEW DATAGRAM SOCKET
            System.out.println("Porta: " + DS.getLocalPort()); // PRINTS THE LOCAL PORT
        } catch (IOException e) { // CATCHES THE IOEXCEPTION
            e.printStackTrace(); // PRINTS THE STACK TRACE
        } // END CATCH
        while (!regUser) { // WHILE THE REGISTRATION USER IS FALSE THEN
            receiveRegDP(); // RECEIVES THE REGISTRATION DATAGRAM PACKET
        } // END WHILE
        DS.close(); // CLOSES THE DATAGRAM SOCKET
        try { // TRY CATCH BLOCK
            DS = new DatagramSocket(port); // CREATES A NEW DATAGRAM SOCKET WITH THE PORT
            System.out.println("Nova porta: " + DS.getLocalPort()); // PRINTS THE LOCAL PORT
        } catch (IOException e) { // CATCHES THE IOEXCEPTION
            e.printStackTrace(); // PRINTS THE STACK TRACE
        } // END CATCH
        while (true) { // WHILE TRUE THEN
            receiveDP(); // RECEIVES THE DATAGRAM PACKET
        } // END WHILE
    } // END OF RUN
} // END OF CLIENT