import java.io.*;
import java.net.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

public class NameServerSocket extends Thread {
    ArrayList<List> userList = new ArrayList<List>();
    InetAddress ER;
    DatagramSocket DS;
    byte bp[] = new byte[1024];
    TextArea Server = new TextArea(12, 40);
    boolean getListUpdated = false;

    NameServerSocket(TextArea ta) {
        Server = ta;
    }

    public void run() {
        try {
            DS = new DatagramSocket(8080);
        } catch (IOException e) {
        }
        while (true)
            receiveDP();
    }

    public ArrayList<List> getArrayList() {
        return userList;
    }

    public void receiveDP() {
        try {
            DatagramPacket DP = new DatagramPacket(bp, 1024);
            DS.receive(DP);
            byte Payload[] = DP.getData();
            int len = DP.getLength();
            String msg = new String(Payload, 0, 0, len);

            if (msg.charAt(0) == 't') {
                String regmsg = msg.substring(1);
                List tempList = new ArrayList();
                String tmpName = regmsg.substring(0, msg.length() - 4);
                tempList.add(tmpName);
                String tmpPort = regmsg.substring(msg.length() - 5);
                tempList.add(tmpPort);
                userList.add(tempList);
                System.out.print(userList);
            }

            /*else{
                String dest = msg.substring(0, msg.length() - 4);
                for (int i = 0; i < userList.size(); i++) {
                    if (userList.get(i).get(0).equals(dest)) {
                        String port = userList.get(i).get(1).toString();
                        int portInt = Integer.parseInt(port);
                        String msgToSend = msg.substring(msg.length() - 4);
                        sendDP(portInt, msgToSend);
                    }
                }
            }*/

            

            //String regmsg = msg.substring(msg.length() - 4);
            //System.out.println(regmsg);
            //Server.appendText("\nCliente->" + regmsg);
            
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