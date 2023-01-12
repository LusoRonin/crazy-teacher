import java.io.*;
import java.awt.*;
import java.util.ArrayList;

public class ser16 extends Frame {
    ArrayList<Integer> userSock = new ArrayList<Integer>();
    TextArea Server = new TextArea(12, 40);
    socketSer sock = new socketSer(Server);

    public ser16(String str) {
        super(str);
    }

    public ser16() {
    }

    public ArrayList<Integer> getUserSock() {
        return userSock;
    }

    public void updateUserSock(int uSock) {
        userSock.add(uSock);
    }
    public int checknextSock(){
        if (userSock.size() == 0) {
            return 8000;
        } else {
            return userSock.size() + 1;
        }
    }

    public static void main(String[] args) throws IOException {
        ser16 app = new ser16("ser16");
        app.resize(320, 240);
        app.GUI();
        app.show();
        app.StartSocket();
    }

    public void GUI() {
        setBackground(Color.lightGray);
        Server.setEditable(false);
        GridBagLayout GBL = new GridBagLayout();
        setLayout(GBL);
        Panel P1 = new Panel();
        P1.setLayout(new BorderLayout(5, 5));
        P1.add("Center", Server);
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
}