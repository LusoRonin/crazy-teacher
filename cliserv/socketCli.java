import java.io.*;
import java.net.*;
import java.awt.*;

public class socketCli extends Thread {
    InetAddress ER;
    DatagramSocket DS;
    byte bp[] = new byte[1024];
    TextArea Server = new TextArea(10, 30);

    socketCli(TextArea ta) {
        Server = ta;
    }

    public void run() {
        //ser16 s = new ser16();
        //int newSock = s.checknextSock();
        //s.updateUserSock(newSock);
        //System.out.print(newSock);
        //System.out.print(s.getUserSock());
        try {
            DS = new DatagramSocket(8080);
        } catch (IOException e) {
        }
        while (true)
            receiveDP();
    }

    public void receiveDP() {
        try {
            DatagramPacket DP = new DatagramPacket(bp, 1024);
            DS.receive(DP);
            byte Payload[] = DP.getData();
            int len = DP.getLength();
            String res = new String(Payload, 0, 0, len);
            Server.appendText("\n" + res);
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