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

            String tag = msg.substring(0, 2);

            switch (tag){
                case "-c":
                    if (usersList.size() == 11){
                        sendDP(sender, "-nfull");
                    }
                    break;
                case "-r":
                    String regmsg = msg.substring(2);
                    String sendRegmsg = "-r" + regmsg;
                    sendDP(8080, sendRegmsg);
                    assignedmsg = receiveAssignDP();
                    if(assignedmsg.charAt(0) == '-' && assignedmsg.charAt(1) == 'y'){
                        String msgToSend = assignedmsg;
                        usersList.add(regmsg.toLowerCase());
                        sendDP(sender, msgToSend);
                        regmsg = regmsg.substring(0, 1).toUpperCase() + regmsg.substring(1);
                        Registry.append("\nCreated: "  + regmsg  + "!");
                    }
                    else if (assignedmsg.equals("-nr")){
                        String res = "-n";
                        Registry.append("\n" + "User not assigned due to a conflict!");
                        sendDP(sender, res);
                    }
                    assignedmsg = null;
                    break;
                case "-l":
                    boolean found = false;
                    String loginmsg = msg.substring(2);
                    String [] loginArray = loginmsg.split(",");
                    String loginPort = loginArray[0];
                    String loginName = loginArray[1];

                    for (int i = 0; i < usersList.size(); i++){
                        if (usersList.get(i).equals(loginName)){
                            found = true;
                            String loginToNameService = "-a" + loginName;
                            sendDP(8080, loginToNameService);
                            String portToLogin = receiveAssignDP();
                            portToLogin = portToLogin.substring(2);
                            if (portToLogin.equals(loginPort)){
                                Registry.append("\nJust logged in: " +  loginName + "!");
                                sendDP(sender, "-yl" + loginPort);
                                break;
                            }
                            else{
                                String errormsg = "-nlnomatch"  + "," + portToLogin;
                                Registry.append("\nFailed to login: "  + loginName  + " sending PIN: " + portToLogin + "!");
                                sendDP(sender, errormsg); //PORT DOES NOT MATCH
                            }
                        }
                    }
                    if (!found){
                        Registry.append("\nFailed to login: " + "'"  + loginName + "'" + " doesn't exist!");
                        sendDP(sender, "-nlnotfound"); //NAME NOT FOUND
                    }
                    break;
            }

            /*if (tag.equals("-c")){
                if (usersList.size() == 11){
                    sendDP(sender, "-nfull");
                }
            }

            if (tag.equals("-r")){

                String regmsg = msg.substring(2);
                String sendRegmsg = "-r" + regmsg;
                sendDP(8080, sendRegmsg);
                assignedmsg = receiveAssignDP();
                if(assignedmsg.charAt(0) == '-' && assignedmsg.charAt(1) == 'y'){
                    String msgToSend = assignedmsg;
                    usersList.add(regmsg.toLowerCase());
                    sendDP(sender, msgToSend);
                    regmsg = regmsg.substring(0, 1).toUpperCase() + regmsg.substring(1);
                    Registry.append("\nCreated: "  + regmsg  + "!");
                }
                else{
                    String res = "n";
                    Registry.append("\n" + "User not assigned due to a conflict!");
                    sendDP(sender, res);
                }
                assignedmsg = null;
            }

            if (tag.equals("-l")){
                boolean found = false;
                String loginmsg = msg.substring(2);
                String [] loginArray = loginmsg.split(",");
                String loginPort = loginArray[0];
                String loginName = loginArray[1];

                for (int i = 0; i < usersList.size(); i++){
                    if (usersList.get(i).equals(loginName)){
                        found = true;
                        String loginToNameService = "-a" + loginName;
                        sendDP(8080, loginToNameService);
                        String portToLogin = receiveAssignDP();
                        portToLogin = portToLogin.substring(2);
                        if (portToLogin.equals(loginPort)){
                            Registry.append("\nJust logged in: " +  loginName + "!");
                            sendDP(sender, "-yl" + loginPort);
                            break;
                        }
                        else{
                            String errormsg = "-nlnomatch"  + "," + portToLogin;
                            Registry.append("\nFailed to login: "  + loginName  + " sending PIN: " + portToLogin + "!");
                            sendDP(sender, errormsg); //PORT DOES NOT MATCH
                        }
                    }
                }
                if (!found){
                    Registry.append("\nFailed to login: " + "'"  + loginName + "'" + " doesn't exist!");
                    sendDP(sender, "-nlnotfound"); //NAME NOT FOUND
                }
            }*/
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