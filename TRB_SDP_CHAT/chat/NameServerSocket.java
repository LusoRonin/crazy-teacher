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
            int sender = DP.getPort();

            if (msg.charAt(0) == 'r'){
                String regmsg = msg.substring(1);

                if (userList.size() == 0){
                    List tempList = new ArrayList();
                    for (int i = 0; i < regmsg.length(); i++){
                        if (regmsg.charAt(i) == ','){
                            String tmpStr = regmsg.substring(0, i);
                            String cliSenderName = regmsg.substring(i+1);

                            int cliSenderPort = 8000;

                            tempList.add(cliSenderPort);
                            tempList.add(cliSenderName);
                            
                            userList.add(tempList);

                            Server.append(userList.toString());
                            break;
                        }
                    }

                    String portAssign = "p" + "8000";

                    sendDP(sender, portAssign);
                }
                else{
                    List tempList = new ArrayList();
                    for (int i = 0; i < userList.size(); i++){
                        if (i == userList.size() - 1){
                            String tmpVar = userList.get(i).get(1).toString();
                        }
                    }
                    String portAssign = null;
                    for (int i = 0; i < userList.size(); i++){
                        if (i == userList.size() - 1){
                            String lastPort = userList.get(i).get(0).toString();

                            int lastPortInt = Integer.parseInt(lastPort);
                            int lastPortIntPlus = lastPortInt + 1;

                            int cliSenderPort = lastPortIntPlus;
                            String tmpCliPort = Integer.toString(cliSenderPort);
                            
                            portAssign = "p" + tmpCliPort;

                            tempList.add(cliSenderPort);

                            break;
                        }
                    }
                    for (int i = 0; i < regmsg.length(); i++){ 
                        if (regmsg.charAt(i) == ','){
                            String tmpStr = regmsg.substring(0, i);
                            String cliSenderName = regmsg.substring(i+1);

                            tempList.add(cliSenderName);

                            userList.add(tempList);

                            Server.append("\n" + userList.toString());

                            sendDP(sender, portAssign);
                            break;
                        }
                    }
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