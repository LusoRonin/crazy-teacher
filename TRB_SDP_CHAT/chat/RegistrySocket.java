import java.io.*;
import java.net.*;
import java.util.ArrayList;
import java.awt.*;

public class RegistrySocket extends Thread {
    InetAddress ER;
    DatagramSocket DS;
    byte bp[] = new byte[1024];
    TextArea Registry = new TextArea(12, 40);

    ArrayList<String> usersList = new ArrayList<String>();

    String assignedmsg = null;

    RegistrySocket(TextArea ta) {
        Registry = ta;
    }

    public void run() {
        try {
            DS = new DatagramSocket(8081);
            Registry.append("Welcome to the Registry Service!\n");
        } catch (IOException e) {
        }
        while (true)
            receiveDP();
    }

    public String receiveAssignDP(){
        String msg = null;
        try{
            DatagramPacket DP = new DatagramPacket(bp, 1024);
            DS.receive(DP);
            byte Payload[] = DP.getData();
            int len = DP.getLength();
            msg = new String(Payload, 0, 0, len);
        }
        catch (IOException e) {
        }
        return msg;
    }

    public void receiveDP() {
        try {
            DatagramPacket DP = new DatagramPacket(bp, 1024);
            DS.receive(DP);
            byte Payload[] = DP.getData();
            int len = DP.getLength();
            int sender = DP.getPort();
            String msg = new String(Payload, 0, 0, len);
            if (msg.charAt(0) == '-' && msg.charAt(1) == 'r'){
                String regmsg = msg.substring(2);
                String sendRegmsg = "-r" + regmsg;
                sendDP(8080, sendRegmsg);
                assignedmsg = receiveAssignDP();
                if(assignedmsg.charAt(0) == 'y'){
                    String msgToSend = assignedmsg;
                    sendDP(sender, msgToSend);
                    Registry.append("\nCreated: " + regmsg + "!");
                }
                else{
                    String res = "n";
                    Registry.append("\n" + "User not assigned due to a conflict!");
                    sendDP(sender, res);
                }
            }  
        } catch (IOException e) {
        }
    }

    public void sendDP(int Pr, String msg) {
        int len = msg.length();
        byte b[] = new byte[len];
        msg.getBytes(0, len, b, 0);
        try {
            ER = InetAddress.getByName("127.0.0.1");
            DatagramPacket DP = new DatagramPacket(b, len, ER, Pr);
            DS.send(DP);
        } catch (IOException e) {
        }
    }
}