*Redes de grandes dimensões têm demasiados componentes para que a sua gestão possa fazer-se apenas com intervenção humana.*
*Por isso utilizamos técnicas, tais como:*
 - ****Localização dispersa***: necessárias ferramnetas de monitorização e configuração remotas.*

*São necessários o uso de ferramentas que:*
 - *Definam procedimentos genéricos para monitorização e configuração;*
 - *Sejam suficientemente flexíveis para poder gerir qualquer dispositivo.*

# *SNMP: Simple Network Management Protocol*
## *O que é o SNMP?*
> ****Simple Network Management Protocol (SNMP) is an application–layer protocol*** defined by the Internet Architecture Board (IAB) in RFC1157 ***for exchanging management information between network devices.*** It is a part of Transmission Control Protocol⁄Internet Protocol (TCP⁄IP) protocol suite.*

*É o protocolo usado para troca de informação de gestão entre dispositivos.*
 
> ****SNMP is one of the widely accepted network protocols that manages and monitors network elements.*** Most of the professional–grade network elements come with bundled SNMP agent. ***These agents have to be enabled and configured to communicate with the network monitoring tools or network management system*** (NMS).*

### *Objectivos do SNMP*
 - *Para gestão de dispositivos conectados a uma rede, com o objectivo de obter informações sobre o estado destes dispositivos, como velocidade de conexão, uso de CPU, uso de memória, etc.*
 - *Obter o melhor desempenho da rede.*
 - *Separação de funções entre o software de gestão e o protocolo usado para trocar informação de gestão.*

## *Versões do protocolo SNMP*
 - ****SNMPv1*** tinha limitações significativas, nomeadamente a nível de:* 
    > *It uses community strings for authentication and uses UDP only.*
    - *Segurança;*
    - *Fiabilidade nas notificações assíncronas.*
 - ****SNMPv2*** pretendia colmatar essas limitações; contudo:*
    > *It uses community strings for authentication. It uses UDP but can be configured to use TCP.*
 - ****SNMPv3*** veio resolver a confusão do SNMPv2:* 
    > *It uses Hash-based MAC with MD5 or SHA for authentication and DES-56 for privacy. This version uses TCP. Therefore, the conclusion is the higher the version of SNMP, the more secure it will be.*
    - *Incorpora diversos modelos de segurança;*
    - *Suporta:*
        - *Autenticação segura;*
        - *Integridade das mensagens;*
        - *Privacidade.*

## *Tipos de dispositivos*
*O SNMP define dois tipos básicos de dispositivos:*
 - ***Dispositivos geridos:***
    - *Contêm objectos geridos organizados numa base de dados com estrutura em árvore, designada MIB (Management Information Base).*
    - *Contém um agente SNMP:*
        - *Software que implementa o protocolo e comunica com a estação de gestão.*
 - ***Estações de gestão:***
    - *Dispositivos usados para gerir os dispositivos geridos;*
    - *Contêm um gestor SNMP:*
        - *Software que implementa o protocolo e comunica com os dispositivos geridos.*
    - *Aplicações SNMP usadas pelo administrador para gerir a rede.*
 - *Existe um terceiro tipo de dispositivo, o ***proxy***:*
    - *Usado para possibilitar a gestão por SNMP de dispositivos que não o suportam.*

## *Componentes da estrutura de gestão SNMP*
1. ***Management Information Base (MIB):***
    - *Base de dados de objectos geridos, descrita usando o SMI.*
    - *Estrutura em árvore:*
        - *Sub-árvores definidas em diferentes módulos MIB.*
    - *Cada nó (excepto o raiz) possui um OID (Object Identifier). O OID é usado como um identificador único para nomiar objectos numa estrutura hierárquica.* 
2. ***Struture of Management Information (SMI):***
    - *Linguagem de definição para os objctos gerenciados da MIB, ou seja, é um conjunton de regras que define como uma MIB deve ser especificada.*

    *A MIB representa a base de dados de objectos e a SMI representa a documentação para a definição dos tipos de dados em cada objecto que compõe a MIB.*

    ### *Definição de Objectos*
    *Cada objecto na MIB possui um nome, um tipo, um valor, uma forma de acesso, um status, e uma descrição, e a sua própria definição segundo a SMI.*
     - ****SYNTAX***: tipo do objecto;*
     - ****ACCESS***: modo de acesso: read-only, read-write, write-only, not-accessible;*
     - ****STATUS***: mandatory, optional, obsolete, and depracated;*
     - ****DESCRIPTION***: nome textual para descrever o objecto de maneira mais legível.*

3. ***Protocolo SNMP:***
    - *Transporta informações e comandos entre o gerente e o elemento gerenciado.*
4. ***Segurança e Administração:***
    - ****Segurança:*** (Autenticação, Integridade das mensagens, Privacidade)*
    - ***Administração:***
        - *Autorização e controlo de acesso;*
        - *Nomeação de entidades, identidades e informações;*
        - *Nomes de usuário e gestão de chaves;*
        - *Destinos de notificação e relacionamentos de proxy;*
        - *Configuração remota via operações SNMP.*

- *MIB contém variáveis (objectos) que podem ser lidas e/ou escritas:*
    - *Execução de comandos através da escrita em variáveis.*
    
        *Exemplos:*
        - *Alterações do endereço IP de uma interface através da escrita numa variável para o endereço IP dessa interface*;*
        - *Colocação de um dispositivo em modo teste através da escrita numa variável representando o modo corrente;*
        - *Ordem de reboot através de uma variável representando o tempo até ao próximo reboot: a escrita nessa variável inicia a contagem decrescente.*
    - *Além da leitura e escrita de variáveis, SNMP suporta também notificações assíncronas (traps).*

> *There are 3 components of SNMP:* 
>  - ****SNMP Manager***: It is a centralized system used to monitor network. It is also known as Network Management Station (NMS).*
>  - ****SNMP agent***: It is a software management software module installed on a managed device. Managed devices can be network devices like PC, routers, switches, servers, etc.*
>  - ****Management Information Base***: MIB consists of information on resources that are to be managed. This information is organized hierarchically. It consists of objects instances which are essentially variables.*

## *Transferência de informação: Polling vs. Traps*
*A recuperação dos dados por parte do gestor deve seguir duas políticas:*
 - ****Trap***: o agente envia uma mensagem que indica se aconteceu um erro ou anomalia na gestão da rede.*
    > *These are the message sent by the agent without being requested by the manager. It is sent when a fault has occurred.*
 - ****Polling***: o gestor procura as informações em intervalos de tempo regulares.*

*A política polling é utilizada durante o funcionamento normal do equipamento, com os dados a serem lidos em intervalos regulares de tempo, Caso algum problema ocorra, o gerente é notificado via trap.*

## *Segurança do SNMP*
 - ****SNMPv3***:*
    - *As mensagens incluem um hash criptográfico calculado sobre:*
        - *O conteúdo da mensagem;*
        - *A password do utilizador;*
        - *O instante de transmissão.*
    - *Suporta autenticação segura:*
        - *A password nunca é incluída nas mensagens;*
        - *Existe uma password por utilizador;*
        - *Permite definir diferentes níveis de acessp a diferentes partes da MIB.*
    - Garante autenticidade e integridade das mensagens:*
        - *Verifica que a mensagem não foi alterada nem é forjada.*
    - *Impede a (re)utilização de mensagens antigas;*
    - *Suporta cifragem completa das mensagens para garantir privacidade.*

### *Níveis de segurança do SNMPv3:*
 - ****noAuthPriv***: Inseguro;*
    > *This (no authentication, no privacy) security level uses a community string for authentication and no encryption for privacy.*
 - ***AuthNoPriv***
    > *This security level (authentication, no privacy) uses HMAC with Md5 for authentication and no encryption is used for privacy.*
    - *Autenticação seguro, por utilizador;*
    - *Garantia de integridade das mensagens;*
    - *Sem cifragem: alguém que escute os pacotes na rede pode obter informações sobre os dispositivos.*
 - ***AuthPriv***
    > *This security level (authentication, privacy) uses HMAC with Md5 or SHA for authentication and encryption uses the DES-56 algorithm.*
    - *Mensagens crifadas;*
    - *Nível mais seguro.*