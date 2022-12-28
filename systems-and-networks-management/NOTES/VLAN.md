# *LAN: Local Area Network*
*É uma rede onde estão conectados um grupo de computadores e dispositivos periféricos que compartilham uma linha de comunicação.*
> *A LAN, or local area network, is a group of connected computing devices within a localized area that usually share a centralized Internet connection.*

***Objectivos:***
 - *permitir que vários dispositivos em uma LAN compartilhem uma única conexão com a internet;*
 - *permitir o acesso a aplicações centralizadas que residem em servidores;*
 - *permitir que todos os dispositivos armazenem dados críticos de negócios em um local centralizado;*
 - *proteger os dispositivos conectados à LAN usando ferramentas de segurança de rede;*
 - *permitir o compartilhamento de recursos, incluindo impressoras,aplicações e outros serviços compartilhados.*

*Frequentemente é necessário dividir uma rede em “zonas” sem ligação directa entre si (domínios de difusão separados):*
 - *Por diversos motivos: Organização da rede, desempenho, segurança, privacidade, etc.*

*Tradicionalmente, a divisão lógica correspondia à divisão física:*
 - *Por exemplo, com ethernet cada domínio de difusão corresponde a um ou mais comutadores ligados entre si (LAN indepentende);*
    - *Comunicação entre as diferentes LAN (“zonas”) através de routers.*

*Muitas vezes a divisão lógica que se pretende não se mapeia bem na organização física do espaço.*

# *VLAN: Virtual Local Area Networks*
> *Virtual LANs, or VLANs, are a way of splitting up traffic on the same physical network into two networks. Imagine setting up two separate LANs, each with their own router and Internet connection, in the same room. VLANs are like that, but they are divided virtually using software instead of physically using hardware: only one router with one Internet connection is necessary.*

> #### ***Even more detailed:***
> *Virtual LAN (VLAN) is a concept in which we can divide the devices logically on layer 2 (data link layer). Generally, layer 3 devices divide broadcast domain but broadcast domain can be divided by switches using the concept of VLAN.*
> 
> *A broadcast domain is a network segment in which if a device broadcast a packet then all the devices in the same broadcast domain will receive it. The devices in the same broadcast domain will receive all the broadcast packets but it is limited to switches only as routers don’t forward out the broadcast packet. To forward out the packets to different VLAN (from one VLAN to another) or broadcast domain, inter Vlan routing is needed. Through VLAN, different small-size sub-networks are created which are comparatively easy to handle.*

 - *Muitos comutadores permitem configurar conjuntos de portas como se fossem LAN fisicamente independentes.*
 - *Cada VLAN é um domínio de difusão.*
    - *Tramas broadcast propagadas apenas às portas pertencentes à VLAN.*
 - *Não há comunicação directa entre VLAN diferentes.*
    - *Cada VLAN vai corresponder a uma sub-rede diferente;*
    - *Tal como no caso de várias LAN fisicamente independentes, a comunicação entre diferentes VLAN faz-se através de routers.*
        - *Ou dos chamados comutadores de camada 3, que são basicamente 2-em-1 de comutador e router.*

> *VLANs help with network management, especially with very large LANs. By subdividing the network, administrators can manage the network much more easily. (VLANs are very different from subnets, which are another way of subdividing networks for greater efficiency.)*

- *O uso de VLAN permite tornar a organização lógica da rede independente da configuração física dos equipamentos.*

## *Atribuição de VLANs a portas físicas*
 - *A atribuição de VLAN pode ser feita de diferentes formas:*
    - *Por configuração directa: ***VLAN estáticas***;*
    - *De forma automática, segundo determinado critério: ***VLAN dinâmicas***.*

*Alguns critérios para atribuição de VLAN a portas físicas:*
 - *Endereço MAC do terminal;*
 - *Autenticação 802.1x;*
 - *Endereço IP do terminal:*
    - *Critério de camada 3 (camada de rede).*

    *A comutação continua a ser feita na camada 2 (ligação lógica), o ***endereço IP é usado apenas inicialmente para atribuir a VLAN à porta física.****

*Alguns comutadores permitem várias VLAN na mesma porta física, para pacotes de protocolos diferentes:*
 - *Permite isolar e priorizar determinados tipos de tráfego (e.g., VoIP);*
 - *Permite fazer distribuição de carga.*

```powershell
Switch(config-if-range)# switchport trunk allowed vlan 2-3
```

## *Interligação de comutadores com VLAN*
> ### *Types of connections in VLAN*
> There are three ways to connect devices on a VLAN, the type of connections are based on the connected devices i.e. whether they are:
>  - ****VLAN-aware***: a device that understands VLAN formats and VLAN membership; or*
>  - ****VLAN-unaware***: a device that doesn’t understand VLAN format and VLAN membership.*

*Os comutadores que suportam VLAN têm dois tipos de configuração para cada porta:*
 - ****Modo Acesso***: pertence a uma única VLAN;*
    > 1. ****Access link***: It connects VLAN-unaware devices to a VLAN-aware bridge. All frames on the access link must be untagged.*
 - ****Modo trunk***: não pertence a uma VLAN específica, podendo transportar tramas de todas as VLAN.*
    > 2. ****Trunk Link***: All connected devices to a trunk link must be VLAN-aware. All frames on this should have a special header attached to it called tagged frames.*
    - *O entroncamento (trunking) agrupa vários enlaces lógicos num enlace físico.*
        - *Isto permite o tráfego de várias VLANs num único cabo entre os comutadores (switches).*
> 3. ****Hybrid link***: It is a combination of the Trunk link and Access link. Here both VLAN-unaware and VLAN-aware devices are attached and it can have both tagged and untagged frames.*

***A interligação entre comutadores faz-se usando portas trunk.***

#### ****Entroncamento*** (trunking)*
 - *É importante entender que um tronco não pertence a uma VLAN específica. O tronco é um como um duto para VLANs entre switches e roteadores.*
    - *Cada quadro enviado pelo enlace único do tronco é marcado (tagged) para identificar a que VLAN pertence.*

*Existem diferentes esquemas de marcação:*
 - ***ISL: Inter-Switch Link Protocol:***
    - *Protocolo proprietário da Cisco;*
    - *Em desuso. O 2950 não reconhece este protocolo.*
 - ***802.1Q:***
    - *Padrão IEEE adotado como mecanismo de marcação (tag) para entroncamento em geral.*
    - *Ao ligar equipamentos de fabricantes diferentes com tronco, conseguem "entender" 802.1Q.*

*A marcação de quadros põe uma identificação única no cabeçalho de cada quadro quando ele é encaminhado para o tronco (backbone, trunk).*

*O identificador é entendido e examinado pelo comutador (switch) antes de transmitir o quadro para outro switch, roteador ou estação destino.*

*Quando o quadro sai do tronco, o switch retira a marcação antes de transmití-lo para a estação destino.*

*A marcação de quadros funciona na camada 2 (enlace) e não requer muito recurso de rede e de administração.*

## *Comunicação entre VLANs*
 - *Uma sub-interface é uma interface lógica numa interface física.*
     - *Várias sub-interfaces podem existir numa interface física.*
 - *Cada sub-interface suporta uma VLAN e tem um número IP daquela VLAN, que normalmente é uma sub-rede.*
 - *Para rotear tráfego entre VLANs com sub-interfaces, deve-se criar uma sub-interface para cada VLAN.*
 - *Cada VLAN tem sua própria rede ou sub-rede IP.*

> ## *Advantages*
> - ****Performance***: The network traffic is full of broadcast and multicast. VLAN reduces the need to send such traffic to unnecessary destinations. e.g.-If the traffic is intended for 2 users but as 10 devices are present in the same broadcast domain, therefore, all will receive the traffic i.e. wastage of bandwidth but if we make VLANs, then the broadcast or multicast packet will go to the intended users only.*
> - ****Formation of virtual groups***: As there are different departments in every organization namely sales, finance etc., VLANs can be very useful in order to group the devices logically according to their departments.*
> - ****Security***: In the same network, sensitive data can be broadcast which can be accessed by the outsider but by creating VLAN, we can control broadcast domains, set up firewalls, restrict access. Also, VLANs can be used to inform the network manager of an intrusion. Hence, VLANs greatly enhance network security.*
> - ****Flexibility***: VLAN provide flexibility to add, remove the number of host we want.*
> - ****Cost reduction***: VLANs can be used to create broadcast domains which eliminate the need for expensive routers. By using Vlan, the number of small size broadcast domain can be increased which are easy to handle as compared to a bigger broadcast domain.*