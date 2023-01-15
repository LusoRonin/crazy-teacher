import java.io.*;
import java.awt.*;
import java.util.ArrayList;

public class NameServer extends Frame {
    TextArea NameServer = new TextArea(12, 40);
    NameServerSocket sock = new NameServerSocket(NameServer);

    public NameServer(String nm) {
        super(nm);
    }

    public void GUI() {
        setBackground(Color.lightGray);
        NameServer.setEditable(false);
        GridBagLayout GBL = new GridBagLayout();
        setLayout(GBL);
        Panel P1 = new Panel();
        P1.setLayout(new BorderLayout(5, 5));
        P1.add("Center", NameServer);
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

    public static void main(String[] args) throws IOException {
        NameServer app = new NameServer("Name Service");
        app.resize(320, 240);
        app.GUI();
        app.show();
        app.StartSocket();
    }
}
