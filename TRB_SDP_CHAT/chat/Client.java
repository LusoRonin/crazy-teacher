import java.io.*;
import java.sql.Time;
import java.awt.*;
import javax.swing.JOptionPane;
import java.util.concurrent.TimeUnit;

public class Client extends Frame {
    TextArea ecran = new TextArea(10, 30);
    TextField addr = new TextField(30);
    TextField text = new TextField(30);
    Label userlab = new Label();
    Button Send = new Button("Send");
    CliSocket sock = new CliSocket(ecran);
    String cliRegister;

    String user = null;
    String formUser = null;
    String str = null;
    String strport = null;
    int port;

    boolean userLenValid = false;
    boolean userRegValid = false;
    
    public Client(String str) {
        super(str);
    }

    public String getCliRegister(){
        return cliRegister;
    }

    public void GUI() {
        setBackground(Color.lightGray);
        ecran.setEditable(false);
        GridBagLayout GBL = new GridBagLayout();
        setLayout(GBL);
        Panel P1 = new Panel();
        P1.setLayout(new BorderLayout(5, 5));
        P1.add("North", userlab);
        P1.add("Center", text);
        P1.add("West", addr);
        P1.add("East", Send);
        P1.add("South", ecran);
        GridBagConstraints P1C = new GridBagConstraints();
        P1C.gridwidth = GridBagConstraints.REMAINDER;
        GBL.setConstraints(P1, P1C);
        add(P1);
    }

    public void setupClient(){
        while (!userLenValid){
            user = JOptionPane.showInputDialog("Enter your username");
            if (user.length() > 0){
                userLenValid = true;
                break;
            }
            else{
                JOptionPane.showInputDialog("Username cannot be empty! Enter your username");
            }
        }
        user = "-r" + user;
        formUser = user.substring(2);
        userlab.setText("Logged in as: " + formUser);
        sock.sendtoServices(8081, user);
        try{
            TimeUnit.MILLISECONDS.sleep(100);
            }
            catch (InterruptedException e){
                System.out.println("Interrupted");
            }
        while (!sock.getConfirm()){
            user = JOptionPane.showInputDialog("User name invalid! Enter your username");
            user = "-r" + user;
            sock.sendtoServices(8081, user);
            try{
                TimeUnit.MILLISECONDS.sleep(100);
            }
            catch (InterruptedException e){
                System.out.println("Interrupted");
            }
        }
    }

    public void StartSocket() {
        sock.start();
    }

    public boolean handleEvent(Event i) {
        if (i.id == Event.WINDOW_DESTROY) {
            dispose();
            System.exit(0);
            return true;
        }
        return super.handleEvent(i);
    }

    public boolean action(Event i, Object o) {
        if (i.target == Send) {
            int portDest = 0;
            String msg = text.getText();
            if(addr.getText().contains(",")){
                String askDest = "-am" + addr.getText();
                sock.sendtoServices(8080, askDest);
            }else{
            String askDest = "-a" + addr.getText();
            sock.sendtoServices(8080, askDest);
            }
            

            try{
                TimeUnit.MILLISECONDS.sleep(100);
                }
                catch (InterruptedException e){
                    System.out.println("Interrupted");
                }

            portDest = sock.getdestPort();

            ecran.appendText("\n" + "You: " + msg);

            msg = user + ',' + msg;
            
            for (int j = 0; j < Integer.toString(portDest).length(); j = j + 4){
                String strPortDest = Integer.toString(portDest).substring(j, j + 4);
                int singlePort = Integer.parseInt(strPortDest);
                sock.sendDP(singlePort, msg, "127.0.0.1");
                
            }

            text.setText("");

            sock.setdestPort(0);

            return true;
        }
        return false;
    }

    public static void main(String[] args) throws IOException {
        Client app = new Client("Client");
        app.resize(600, 350);
        app.StartSocket();
        app.setupClient();
        app.GUI();
        app.show();
    }
}