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

    RegistrySocket(TextArea ta) {
        Registry = ta;
    }

    public void run() {
        try {
            DS = new DatagramSocket(8081);
        } catch (IOException e) {
        }
        while (true)
            receiveDP();
    }

    public String receiveAssignDP(){
        String msg = null;
        try{
            DatagramPacket DPAssign = new DatagramPacket(bp, 1024);
            DS.receive(DPAssign);
            byte Payload[] = DPAssign.getData();
            int len = DPAssign.getLength();
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

                String usize = Integer.toString(usersList.size());

                if (usersList.size() == 0){
                    usersList.add(regmsg);
                    Registry.append(regmsg + " registado");
                    String res = "y";
                    sendDP(sender, res);

                    regmsg= "-r" + sender + "," + regmsg;

                    sendDP(8080, regmsg);
                }
                else{
                    for (int i = 0; i < usersList.size(); i++) {
                        if (usersList.get(i).toString().equals(regmsg)) {
                            String res = "n";
                            sendDP(sender, res);

                            break;
                        }else{
                            String res = "y";
                            usersList.add(regmsg);
                            Registry.append("\n" + regmsg + " registado");
                            sendDP(sender, res);

                            regmsg= "-r" + sender + "," + regmsg;

                            sendDP(8080, regmsg);

                            break;
                            //String updatedUsers = usersList.toString();
                            //sendDP(8080, updatedUsers);
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