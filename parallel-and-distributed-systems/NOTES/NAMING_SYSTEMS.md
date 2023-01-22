# *Sistemas De Nomeação*
****Nomes são fundamentais em sistemas informáticos para permitir identificação, localização e partilha de objetos.*** São por isso, usados em linguagens de programação, BDs, SOs e ficheiros.*

*As regras de utilização de nomes são complexas em bases de dados, mas mais simples em sistemas operativos. ***Por norma, estas regras apresentam uma associação ente um nome e um objeto do sistema.****

****O objetivo principal do serviço de nomes consiste na gestão das associações***, às quais são afetados diversos atributos que podem ser usados por vários serviços do SO, sendo o RPC (Remote Procedure Call) um exemplo de serviço.*

****Além disso, uma das mais importantes funções consiste na resolução de nomes***, ou seja, ***na obtenção de identificadores*** que permitem manipulação de objetos.*
 - ****Identificadores são nomes que fazem referência a objetos, de forma a serem discriminados.*** Por isso, para utilizar um dito objeto é preciso primeiro localizá-lo pelo seu identificador; operação esta que pode envolver vários serviços de nomes até localizar o identificador pretendido.*

*Podemos referir que os nomes permitem:*
 - *Criar mecanismos de interface dos sistemas com os utilizadores;*
 - *Contribuir para a virtualização das E/S (Entrada/Saída);*
 - *Criar mecanismos de indireção na designação dos objetos.*

> ****Sistemas de ficheiros*** ***ilustram claramente a impossibilidade de oferecer o serviço de armazenamento persistente da informação, sem fornecer um espaço de nomes compreensível para o utilizador.*** Este vai promover a estruturação da info armazenada de forma permanente e possibilitar a partilha da mesma.*
> 
> ****A distribuição carece ainda mais de sistemas de nomeação devido às inúmeras entidades que é necessário designar e ainda à necessidade de as partilhar.*** Por isso, ***o serviço de nomes é uma componente fundamental das infraestruturas de suporte à distribuição*** e uma parte integrante de todas as plataformas em sistemas distribuídos.*

## *Espaço De Nomes*
****Nomes são definidos num espaço próprio*** (espaço de nomes), ***que caracteriza a sua estrutura***; trata-se assim de um conjunto de regras que permitem definir os nomes admissíveis.*

*A linguagem C inclui um espaço de nomes para os identificadores. Já Internet define um espaço de nomes para as máquinas que interliga. A arquitetura de memória também engloba um espaço de nomes para endereços virtuais.*

 - ****Contexto***: ***Um conjunto de associações pertencentes a um determinado espaço de nomes.*** Nas linguagens de programação um procedimento constitui o contexto. Já nos SOs, um processo, uma máquina ou uma rede local, são contextos.*
 - ****Diretórios***: ***Tabelas de registo de associações nas quais podemos traduzir a noção de contexto, permitindo a resolução de nomes.*** Uma implementação recente destes destas noções é a Active Directory do Windows Server 2003, que constitui um sistema de nomeação distribuído dos objetos existentes numa rede local organizada em domínios. Tipos de objetos considerados na catalogação incluem: utilizadores, máquinas, impressoras, ficheiros e contas de email.*

****Espaços de nomes podem possuir uma organização hierárquica, pelo que o 
diretório pode conter nomes simbólicos a que correspondem a referências 
para outros contextos.*** A associação nome/objeto é feita a nível lógico, 
sendo realizada entre dois nomes com validade em camadas de abstração 
diferentes, correspondendo a diferentes espaços de nomes.*

 - ****Nome Simbólico***: ***Um nome quando é usado como referência ou elo de
ligação para outro nome***, no mesmo espaço de nomes ou noutro diferente. 
Não faz referência direta ao objeto.*

*Como exemplo da primeira situação temos as ligações (links) do sistema de ficheiros do Unix. Já o exemplo da segunda situação as cadeias de associações do tipo:*

***Nome DNS*** → ***Endereço IP*** → ***Endereço Ethernet***

****A definição do espaço de nomes inclui condicionantes*** que refletem as 
propriedades que queremos que os nomes apresentem:*

 - ****Unicidade Referencial***: Em dado contexto, um nome não pode estar associado a dois objetos diferentes. Nestas condições, a operação de registo de um nome tem de ser autorizada por uma entidade que possui controlo sobre um espaço de nomes ou possui um contexto seu.*
 - ****Âmbito***: Poderá ser global ou absoluto, isto é, um nome apresenta o mesmo significado em qualquer contexto do espaço de nomes de nomes, local ou relativo, em que o nome apenas tem um significado válido no contexto onde é criado. A dificuldade de implementação de um sistema de nomes globais prende-se com a necessidade de garantir a sua unicidade referencial em todo o sistema. A forma mais simples de construir nomes globais consiste em considerar uma estrutura hierárquica, em que cada nome é único se considerado na sua totalidade, sendo o contexto dividido em subcontextos.*
 - ****Pureza***: Denominam-se puros os nomes em que o algoritmo de resolução não utiliza informação presente no nome para inferir a localização do objeto referenciado. Os UUID do RPC-DCE são nomes puros porque apesar do endereço IP da máquina ser usado na construção do nome, não é utilizado na resolução. Os sockets TCP ou UDP são nomes impuros porque a sua resolução é baseada no endereço IP contêm. A vantagem dos nomes puros consiste na independência da localização do objeto relativamente à informação contida no seu nome, e a desvantagem consiste na maior dificuldade na resolução.*