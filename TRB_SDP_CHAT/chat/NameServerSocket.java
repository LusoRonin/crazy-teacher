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
            Server.append("Welcome to the Name Service\n");
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

            String assignedPort = null;
            String assignedmsg = null;

            String tag = msg.substring(0, 2);

            /*if (tag.equals("-l")){
                String loginmsg = msg.substring(2);
                String [] loginmsgArray = loginmsg.split(",");
                String loginName = loginmsgArray[0];
                String loginPort = loginmsgArray[1];
                for (int i = 0; i < userList.size(); i++){
                    if (userList.get(i).get(1).toString().equals(loginName)){
                        assignedPort = userList.get(i).get(0).toString();
                        assignedmsg = "-l" + assignedPort;
                        sendDP(sender, assignedmsg);
                        break;
                    }
                }
            }*/
            
            if (tag.equals("-m")){
                String askmsg = msg.substring(2).toLowerCase();
                String [] askmsgArray = askmsg.split(",");
                assignedmsg = "-m";
                for (String dest:askmsgArray){
                    for (int i = 0; i < userList.size(); i++){
                        if (userList.get(i).get(1).toString().equals(dest)){
                            assignedPort = userList.get(i).get(0).toString();
                            assignedmsg += assignedPort;
                        }
                    }
                }
                sendDP(sender, assignedmsg);
            }

            if (tag.equals("-a")){
                String askmsg = msg.substring(2).toLowerCase();
                for (int i = 0; i < userList.size(); i++){
                    if (userList.get(i).get(1).toString().equals(askmsg)){
                        assignedPort = userList.get(i).get(0).toString();
                        assignedmsg = "-a" + assignedPort;
                        sendDP(sender, assignedmsg);
                        break;
                    }
                }
            }

            if (tag.equals("-r")){
                String regmsg = msg.substring(2).toLowerCase();
                if (userList.size() == 0){
                    List tempList = new ArrayList();
                    String cliSenderName = regmsg.toLowerCase();
                    int cliSenderPort = 8000;
                    tempList.add(cliSenderPort);
                    tempList.add(cliSenderName);
                    userList.add(tempList);
                    String user = userList.get(0).get(1).toString();
                    user = user.substring(0, 1).toUpperCase() + user.substring(1);
                    Server.append("\nAssigned '" + user + "' on Port: " +  userList.get(0).get(0).toString() + "!");
                    String portAssign = "-y" + "p" + "8000";
                    sendDP(sender, portAssign);
                }
                else{
                    List tempList = new ArrayList();
                    String portAssign = null;
                    String cliSenderName = regmsg;
                    for (int i = 0; i < userList.size(); i++){
                        if (userList.get(i).get(1).equals(regmsg)){
                            assignedmsg = "-rn";
                            Server.append("\n'" + regmsg + "'' already exists!");
                            sendDP(sender, assignedmsg);
                            break;
                        }
                        else{
                            if (i == userList.size() - 1){
                                String lastPort = userList.get(i).get(0).toString();
                                int lastPortInt = Integer.parseInt(lastPort);
                                int lastPortIntPlus = lastPortInt + 1;
                                int cliSenderPort = lastPortIntPlus;
                                String tmpCliPort = Integer.toString(cliSenderPort);
                                tempList.add(cliSenderPort);
                                tempList.add(cliSenderName);
                                userList.add(tempList);
                                String user = userList.get(i+1).get(1).toString();
                                user = user.substring(0, 1).toUpperCase() + user.substring(1);
                                Server.append("\nAssigned '" + user + "' on Port: " +  userList.get(i+1).get(0).toString() + "!");
                                portAssign = "-y" + "p" + tmpCliPort;
                                sendDP(sender, portAssign);
                                break;
                            }  
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