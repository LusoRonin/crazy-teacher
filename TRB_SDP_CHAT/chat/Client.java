import java.io.*;
import java.awt.*;
import javax.swing.JOptionPane;

public class Client extends Frame {
    TextArea ecran = new TextArea(10, 30);
    TextField addr = new TextField(30);
    TextField text = new TextField(30);
    TextField p = new TextField(30);
    Button Send = new Button("Send");
    CliSocket sock = new CliSocket(ecran);
    String cliRegister;

    String user = null;
    String str = null;
    String strport = null;
    int port;

    boolean userValid = false;
    boolean portValid = false;
    


    public Client(String str) {
        super(str);
    }


    public void sendtoServer(String msg){
        sock.sendtoServer(msg);
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
        P1.add("North", text);
        P1.add("West", addr);
        P1.add("East", Send);
        P1.add("South", ecran);
        P1.add("Center", p);
        GridBagConstraints P1C = new GridBagConstraints();
        P1C.gridwidth = GridBagConstraints.REMAINDER;
        GBL.setConstraints(P1, P1C);
        add(P1);
    }

    public void setupClient(){
        while (!userValid){
            user = JOptionPane.showInputDialog("Enter your username");
            if (user.length() > 0){
                userValid = true;
                break;
            }
        }
        
        while (!portValid){
        str= JOptionPane.showInputDialog("Enter your port");
        int tmpport = Integer.parseInt(str);
            if (tmpport >= 8000 && tmpport <= 8010){
                portValid = true;
                port = tmpport;
                break;
            }
        }

        String cliRegister =  "t" + user + port;
        sock.setPort(port);

        System.out.println(cliRegister);

        sendtoServer(cliRegister);

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
            String msg = text.getText();
            String end = addr.getText();
            String strp = p.getText();
            int pli = Integer.parseInt(strp);
            sock.sendDP(pli, msg, end);
            text.setText("");
            return true;
        }
        return false;
    }

    public static void main(String[] args) throws IOException {
        Client app = new Client("Client");
        app.resize(600, 350);
        app.GUI();
        app.show();
        app.StartSocket();
        app.setupClient();
    }
}