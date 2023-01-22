# *Modelos de computação P2P*
*P2P computing é usada na partilha de ficheiros na Internet, sistema de comunicação em tempo real e diferido, streaming de vídeo e redes sociais;*

> *Stands for "Peer to Peer." ***In a P2P network, the "peers" are computer systems*** which are connected to each other via the Internet. ***Files can be shared directly between systems on the network without the need of a central server.*** In other words, ***each computer on a P2P*** network ***becomes a file server as well as a client***.*

 - *As redes P2P, ao contrário dos sistemas distribuídos tradicionais, são autónomas e auto-organizadas, com participação voluntária dos seus membros;*
 - *Numa rede P2P, os nós partilham recursos de computação e armazenamento. Verificam-se vantagens económicas e problemas legais com a utilização das atuais redes P2P.*
    - *P2P computing não carece de um nó central de coordenação, e nenhum nó da rede dispõe da visão global de todo o sistema; Pelo contrário, os pares da rede podem desempenhar tanto o papel de servidores como de clientes, partilhando serviços diretamente uns com os outros;*

*Em termos genéricos, as diferenças entre os modelos de computação P2P e Cliente/Servidor encontram-se relacionados com os modos de comunicação não orientada e orientada á conexão.*

> ## *How Does P2P Network Work?*
> *Let’s understand the working of the Peer-to-Peer network through an example. Suppose, the user wants to download a file through the peer-to-peer network then the download will be handled in this way:*
> - *If the peer-to-peer software is not already installed, then the user first has to install the peer-to-peer software on his computer;*
> - *This creates a virtual network of peer-to-peer application users;*
> - *The user then downloads the file, which is received in bits that come from multiple computers in the network that have already that file;*
> - *The data is also sent from the user’s computer to other computers in the network that ask for the data that exist on the user’s computer.*
> 
> *Thus, it can be said that in the peer-to-peer network the file transfer load is distributed among the peer computers.*

<p align="center">
    <img src="ASSETS\CLIENT_SERVER_VS_PEER_TO_PEER.png">
</p>

# *Características:*
*Os modelos de computação P2P apresentam as seguintes características:*
 - ****Descentralização***: em P2P computing, os pares são iguais e não existe servidor central com funções de coordenação. Cada nó apenas dispõe de visão parcial do sistema;*
 - ****Auto-organização***: significa que não é necessário nenhum ponto central para promover a gestão conjunta dos recursos de computação e armazenamento dos pares. Os recursos disponíveis no sistema variam a todo o momento. Seria altamente dispendioso dedicar servidores à gestão de um sistema deste género;*
 - ****Conetividade ad-hoc***: o número de pares na rede varia a cada instante, sendo imprevisível a forma como varia ao longo do tempo. P2P computing deverá fornecer serviços estáveis, mesmo em ambientes muito dinâmicos;*
 - ****Anonimato***: numa rede P2P descentralizada, a comunicação entre pares pode ter de ocorrer através de nós intermédios, o que garante o anonimato dos pares em comunicação;*
 - ****Escalabilidade***: P2P computing elimina o problema do ponto singular de falta, característico do modelo de computação Cliente/Servidor. Como cada par apenas mantém um numero limitado de partilhas com outros, garante-se a elevada escalabilidade do sistema;*
 - ****Tolerância a faltas***: numa rede P2P todos os pares dispõem de iguais capacidades de acesso, de tal modo que nenhum poderá ser ponto singular de falta do sistema. Os recursos podem ser angariados em múltiplos pares. Estas características do sistema facilitam a tolerância a faltas.*

# *Tipos de redes P2P:*
*...E subdividem-se nos seguintes modelos:*
 - ****Modelo P2P Puro***: É totalmente destruturado. Para se encontrar um nó é necessário, primeiro, proceder-se á procura (ineficiente) do mesmo.*
    > ****Unstructured P2P networks***: In this type of P2P network, ***each device is able to make an equal contribution.*** This network is easy to build as devices can be connected randomly in the network. ***But being unstructured, it becomes difficult to find content.****

 - ****Modelo Hierárquico***: Existem peers e super-peers. Os super peers atuam como um controlo de maneira a saber a localização dos nós á sua volta.*
    > ****Structured P2P networks***: It is designed using software that ***creates a virtual layer in order to put the nodes in a specific structure.*** These are ***not easy to set up but can give easy access to users to the content.****

 - ****Modelo Centralizado***: Usa um index server para localizar "peers" na rede.*
    > ****Hybrid P2P networks***: ***It combines the features of both P2P networks and client-server architecture.*** An example of such a network ***is to find a node using the central server.****

> ## *Advantages of P2P Network*
*Como já referido, ***P2P computing evita a necessidade de existência de controlo centralizado dos sistemas***; Esta característica ***torna os sistemas mais flexíveis e escaláveis***.*

> - ****Easy to maintain***: The network is easy to maintain because each node is independent of the other.*
> - ****Less costly***: Since each node acts as a server, therefore the cost of the central server is saved. Thus, there is no need to buy an expensive server.*
> - ****No network manager***: In a P2P network since each node manages his or her own computer, thus there is no need for a network manager. Adding nodes is easy: Adding, deleting, and repairing nodes in this network is easy.*
> - ****Less network traffic***: In a P2P network, there is less network traffic than in a client/ server network.*

> ## *Disadvantages of P2P Network*
*Logo, vamos analisar os principais desafios colocados por este tipo de sistemas, e indicar algumas das soluções utilizadas em aplicações reais.*
 - ****Heterogeneidade dos pares***: A heterogeneidade dos pares pode ocorrer aos niveis de hardware, software e rede;*
    - *Com efeito, vai existir incompatibilidade ao nível do hardware e sistema operativo dos pares, e estes vão também encontrar-se ligados a diferentes tipos de redes, usando protocolos de comunicação dispares;*
        - *P2P computing deverá ser concebido de modo a integrar de forma transparente nós heterogéneos.*
> - ****Data is vulnerable***: Because of no central server, data is always vulnerable to getting lost because of no backup.*
 - ****Anonimato***: O anonimato deve ser sempre uma característica oferecida aos nós de um sistema de comunicação P2P. Existem dois tipos diferentes de anonimato: uniderecional e bidirecional.*
    - *O anonimato unidirecional pode, ainda, assumir duas variantes: anonimato de quem inicia a comunicação ou anonimato de quem responde a um pedido de comunicação;*
    - *O anonimato bidirecional abrange simultaneamente quem inicia e quem responde, numa operação de comunicação.*
        ### *Tor*
         - *Tor é um sistema P2P que proporciona comunicação anónima, garantindo a privacidade. A sigla deriva do nome original deste projeto, “The Onion Router.*
            - *Numa rede Tor, as mensagens são encapsuladas em diferentes camadas de cifragem, dai o nome onion (cebola) atribuído a esta tecnologia. As mensagens cifradas são transmitidas através de uma cadeia de “onion routers”, cada um dos quais remove a sua camada de cifragem para saber o endereço do router seguinte, a quem será passada a mensagem.*
                - *Para criar uma mensagem, a fonte da informação seleciona um conjunto de nós de uma lista, fornecida por um serviço de diretório especifico do sistema Tor.*
                - *Os nós escolhidos são organizados numa cadeia, através da qual a mensagem vai ser transmitida. Para preservar o anonimato da origem, nenhum nó do circuito pode dizer se o anterior é a origem ou outro nó da cadeia.*
            - *É utilizada criptografia assimétrica.*
            - *Este tipo de tecnologias têm como principal desvantagem a sobrecarga de processamento sobre o sistema.*
> - ****Less secure***: It becomes difficult to secure the complete network because each node is independent.*
 - ****Escalabilidade do sistema***: Esta característica garante o crescimento futuro deste tipo de sistemas. De tal modo é importante, que constitui um objetivo fundamental de P2P computing;*
    - *A escala de crescimento mede-se em milhões de nós a integrar o sistema, sem afetar significativamente a eficiência. A escalabilidade encontra-se diretamente relacionada com o desempenho e largura de banda disponível;*
        - *No que respeita a desempenho, por exemplo no caso de um sistema de ficheiros distribuído, que usa o método de envio de mensagens para troca de informação entre servidores, o sistema de ficheiros não pode escalar indefinidamente, sob pena das mensagens serem demasiado grandes para serem processadas;*
        - *No que respeita a utilização de largura de banda, num sistema que use o mecanismo de flooding para troca de mensagens, verifica-se que a capacidade máxima da rede será rapidamente atingida deixando o sistema de ser escalável;*
    - *Uma solução para este problema reside num alteração da topologia do sistema P2P, em que passam a existir dois tipos de nós: pares normais e super pares;*
        - *Nestas condições, cada par ou é um super par ou está atribuído a um super par. As operações de pesquisa só vão implicar o flooding dos super pares, o que vai poupar largura de banda, tornando o sistema mais escalável.*
> - ****Slow performance***: In a P2P network, each computer is accessed by other computers in the network which slows down the performance of the user.*
 - ****Pesquisa de pares***: Num sistema P2P, para usar um recurso ou objeto, é necessário efetuar primeiro uma operação de localização ou pesquisa;*
    - *Porém, como não existe um servidor central para indexação dos recursos partilhados, cada par dispõe apenas de um conhecimento parcial do sistema;*
        - *Sendo difícil de encontrar rapidamente os pares que estão a partilhar o recurso que se pretende, o desempenho dos sistemas P2P depende muito da eficiência dos algoritmos de pesquisa que utiliza. Os algoritmos de pesquisa podem ser classificados em duas grandes categorias, denominadas pesquisa cega e pesquisa informada:*
            - *No caso de pesquisa cega, os pares apenas podem contar com o conhecimento dos índices dos seus próprios recursos. Quando recebe um pedido de consulta, um nó passa esse pedido a todos os pares que conhece;*
            - *No caso de pesquisa informada, os pares mantem em cache índices para recursos partilhados por outros nós. Por exemplo, um nó armazena em cache índices para pares situados até S saltos da sua localização na rede. Os pedidos de consulta são encaminhados de acordo com o conteúdo destas caches.*
> - ****Files hard to locate***: In a P2P network, the files are not centrally stored, rather they are stored on individual computers which makes it difficult to locate the files.*
 - ****Proximidade na rede***: Dados do mesmo tipo (ou seja, com atributos semelhantes) devem ser mantidos em pares próximos uns dos outros. Trata-se de uma forma eficiente de suportar operações de pesquisa complexa e de proporcionar rapidez na localização de recursos;*
    - *Tendo em conta esta noção de proximidade, podem ser construídas redes P2P de suporte (overlay) sobre a infraestrutura de rede TCP/IP, com os nós relevantes próximos uns dos outros;*
        - *Nestas condições, as mensagens de pesquisa podem ser trocadas de forma mais eficiente, aumentando a qualidade do serviço (QoS – Quality of Service) e poupando largura de banda.*
 - ****Encaminhamento***: A eficiência das redes TCP/IP encontra-se muito dependente da rapidez e eficácia das tarefas de encaminhamento;*
    - *Isto assim acontece porque algumas das melhores características das redes TCP/IP também interessam para as redes P2P. Nomeadamente, caminhos alternativos para os destinos;*
    - *Além disso, os sistemas P2P também apresentam como objetivo evitar pontos singulares de falta, o que conseguem através de replicação; A manutenção da consistência das réplicas num sistema distribuído é sempre uma tarefa complicada.*
 - ****Free Riders***: Num sistema P2P são sempre de evitar nós apenas com a função de cliente do sistema.*
    - *Ou seja, é altamente desejável que o maior número possível de nós desempenhe simultaneamente a dupla função de cliente e servidor;*
        - *O problema dos pares apenas clientes (free riders) acontece com frequência em sistemas que confiam na contribuição voluntária dos nós;*
            - *Uma das formas mais comuns de estimular o duplo comportamento dos pares consiste na criação de mecanismos de incentivo desse comportamento.*

### *Segurança*
 - ****Confiança***: Pretende-se que os sistemas P2P implementem um ambiente de computação de confiança, no qual os pares mal comportados são banidos.*
    - *Porém, os sistemas P2P são totalmente distribuídos, com as transações a serem executadas diretamente entre pares.*
        - *Não existe um registo central global das transações. Logo, construir um sistema P2P de confiança, nas condições anteriores, constitui uma tarefa difícil de concretizar.*
 - ****Ataques***: Devido ás suas características especificas de descentralização, as redes P2P são muito vulneráveis a ataques.*
    - *Os mais comuns são os ataques de negação do serviço (DoS - Denial of Service e DDoS – Distributed Denial of Service);*
    - *Outros também muito efetuados são os ataques á qualidade do serviço, em que um nó serve os pedidos de forma intencionalmente lenta.*
 - ****Falhas dos nós***: Os nós numa rede P2P são muito dinâmicos, uma vez que podem entrar, sair ou falhar de forma aleatória.*
    - *Em muitas situações, a falha de um nó acarreta a desconexão de muitos outros, apenas devido á topologia da rede P2P.*
        - *Como não existe coordenação centralizada, a situação anterior torna difícil a implementação de tolerância a faltas numa rede P2P.*
            - *A forma mais comum de resolver o problema consiste em usar um protocolo de heartbeat entre os nós, para aferir da sua disponibilidade.*
 - ****Pirataria***: A pirataria da informação tem sido um dos principais problemas dos sistemas P2P de partilha de ficheiros.*
    - *Esta questão tem limitado a utilização de redes P2P abertas para disponibilização comercial de conteúdos.*
        - *A maioria dos operadores tem usado soluções baseadas em credenciais, com serviço de autenticação centralizado e manutenção de informação de estado, para mitigar a ocorrência destes problemas.*

> ## *Applications of P2P Network*
> *Below are some of the common uses of P2P network:*
> - ****File sharing***: P2P network is the most convenient, cost-efficient method for file sharing for businesses. Using this type of network there is no need for intermediate servers to transfer the file.*
> - ****Blockchain***: The P2P architecture is based on the concept of decentralization. When a peer-to-peer network is enabled on the blockchain it helps in the maintenance of a complete replica of the records ensuring the accuracy of the data at the same time. At the same time, peer-to-peer networks ensure security also.*
> - ****Direct messaging***: P2P network provides a secure, quick, and efficient way to communicate. This is possible due to the use of encryption at both the peers and access to easy messaging tools.*
> - ****Collaboration***: The easy file sharing also helps to build collaboration among other peers in the network.*
> - ****File sharing networks***: Many P2P file sharing networks like G2, and eDonkey have popularized peer-to-peer technologies.*
> - ****Content distribution***: In a P2P network, unline the client-server system so the clients can both provide and use resources. Thus, the content serving capacity of the P2P networks can actually increase as more users begin to access the content.*
> - ****IP Telephony***: Skype is one good example of a P2P application in VoIP.*