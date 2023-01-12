import java.io.*;
import java.awt.*;
import javax.swing.JOptionPane;


public class cli16 extends Frame {
    String userName;
    ser16 ser = new ser16();
    TextArea Server = new TextArea(10, 30);
    TextField Client = new TextField(30);
    TextField Destination = new TextField(30);
    Button Send = new Button("Send");
    socketCli sock = new socketCli(Server);

    public cli16(String str) {
        super(str);
    }

    public static void main(String[] args) throws IOException {
        cli16 app = new cli16("cli16");
        app.resize(320, 270);
        app.GUI();
        app.show();
        app.StartSocket();
    }

    public void GUI() {
        userName = JOptionPane.showInputDialog("Enter your name");
        setBackground(Color.lightGray);
        Server.setEditable(false);
        GridBagLayout GBL = new GridBagLayout();
        setLayout(GBL);
        Panel P1 = new Panel();
        P1.setLayout(new BorderLayout(5, 5));
        P1.add("North", Destination);
        P1.add("West", Client);
        P1.add("East", Send);
        P1.add("South", Server);
        GridBagConstraints P1C = new GridBagConstraints();
        P1C.gridwidth = GridBagConstraints.REMAINDER;
        GBL.setConstraints(P1, P1C);
        add(P1);
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
            String msg = Client.getText();
            sock.sendDP(8081, msg);
            Client.setText("");
            return true;
        }
        return false;
    }
}
