# *Problemas de Satisfação de Restrições*

*Problemas de Satisfação de Restrições (CSPs) ***são questões matemáticas definidas como um conjunto de objetos cujo estado deve satisfazer uma série de restrições ou limitações.*** Os CSPs representam as entidades num problema como uma coleção homogênea de restrições finitas sobre variáveis, que é resolvida por métodos de satisfação de restrições.*

*Algoritmos de procura para um CSP utilizam heurísticas gerais em vez de heurísticas específicas do problema. A ideia principal ***consiste em eliminar grandes partes do espaco de procura por identificação de combinações variâvel/valor que violam as restrições***.*

***Um CSP é resolvido quando cada variâvel tem um valor que satisfaz todas as restrições que lhe são impostas.***

```python
# CSP: DEFINES A REPRESENTATION OF A CONSTRAINT SATISFACTION PROBLEM. THE CSP IS DEFINED BY ITS VARIABLES, DOMAINS, NEIGHBORS, CONSTRAINTS.
class CSP:
    # INITIALIZE THE CSP OBJECT AND DEFINES THE NEIGHBORS OF EACH VARIABLE.
    def __init__(self, VARIABLES, DOMAINS, CONSTRAINTS):
        self.VARIABLES = VARIABLES # LIST OF VARIABLES
        self.DOMAINS = DOMAINS # DICTIONARY OF DOMAINS: THE KEYS OF THE DICTIONARY ARE THE VARIABLES. THE VALUE OF EACH KEY IN THE DICTIONARY IS THE LIST OF VALUES OF THAT VARIABLE. THE VALUES OF A VARIABLE ARE THE VALUES THAT THE VARIABLE CAN TAKE.
        self.CONSTRAINTS = CONSTRAINTS # LIST OF CONSTRAINTS: THE CONSTRAINT VARIABLE IS DEFINED BY A LISTS OF TWO TUPLES (PAIRS). EACH TUPLE REPRESENTS A PAIR OF VARIABLES THAT MUST SATISFY THE CONSTRAINT. THE CONSTRAINT IS SATISFIED IF THE PAIR DOES NOT HAVE THE SAME VALUE.
        self.NEIGHBORS = {} # DICTIONARY OF NEIGHBORS: THE KEY OF THE DICTIONARY IS THE VARIABLE. THE VALUE OF THE DICTIONARY IS THE LIST OF NEIGHBORS OF THE VARIABLE. THE NEIGHBORS OF A VARIABLE ARE THE VARIABLES THAT SHARE A CONSTRAINT WITH THE VARIABLE.
        for VARIABLE in self.VARIABLES: # FOR EACH VARIABLE, FIND THE NEIGHBORS OF THE VARIABLE.
            self.NEIGHBORS[VARIABLE] = [] # INITIALIZE THE LIST OF NEIGHBORS OF THE VARIABLE.
            for CONSTRAINT in self.CONSTRAINTS: # FOR EACH CONSTRAINT, FIND THE NEIGHBORS OF THE VARIABLE.
                if VARIABLE in CONSTRAINT: # IF THE VARIABLE IS INVOLVED IN THE CONSTRAINT, FIND THE NEIGHBORS OF THE VARIABLE.
                    for VARIABLE_2 in CONSTRAINT: # FOR EACH VARIABLE INVOLVED IN THE CONSTRAINT, FIND THE NEIGHBORS OF THE VARIABLE.
                        if VARIABLE_2 != VARIABLE: # IF THE THEY ARE NOT THE SAME VARIABLE, ADD THE VARIABLE TO THE LIST OF NEIGHBORS OF THE VARIABLE.
                            self.NEIGHBORS[VARIABLE].append(VARIABLE_2) # ADD THE VARIABLE TO THE LIST OF NEIGHBORS OF THE VARIABLE.
```

*Como se vê acima, um CSP, é composto por três componentes: ***X***, ***D***, ***C*** onde:*
 - ****X*** é uma ***lista de variáveis***.*
 - ****D*** é um ***dicionário de domínios***, um para cada variável. ***Um domínio de uma variável é o conjunto de valores permitidos que essa variável pode tomar.****
 - ****C*** é uma ***lista de restrições que especifíca combinações permitidas de valores***. Ou seja, é uma lista de tuplos, cada tuplo sendo um par de duas variáveis que deve satisfazer a condição; ***tal condição é satisfeita se o par não tiver o mesmo valor***.*

*De uma maneira mais complexa: Cada restrição consiste num tuplo/par ***(scope, relation)*** onde ***scope*** é a ***tupla de variáveis que participam na restrição*** e ***relation*** é uma condição, essencialmente ***uma relação, que define os valores que essas variáveis podem ter***.*
 - ****Uma relação pode ser representada por uma lista de todas as tuplas de valores que satisfazem a restrição***, ou com uma relação abstrata que suporta duas operações:*
    - *testar se uma tupla é membro da relação;*
    - *enumerar os membros da relação.*

*Num CSP um ***estado*** é uma ***atribuição de valores a algumas ou a todas as variáveis.*** O espaço de estado é a coleção de todos os estados.*

 - ****Consistente*** ou legal: é uma atribuição de valores que não viola quaisquer restrições.*
 - ****Completa***: é uma atribuição de valores a todas as variáveis.*

***Uma solução é uma atribuição de valores consistente e completa.***

## *Variações na formulação de CSPs*
### *Variáveis*
****O tipo mais simples de CSP envolve variáveis que têm domínios discretos e finitos.*** Ou seja, cujos possíveis valores são limitados e inteiros. (O problema da coloração de mapas é desse tipo.)*
 - *Um ***domínio discreto pode ser infinito***. Neste caso, ***não é possível descrever restrições por enumeração exaustiva de todas as combinações permitidas*** de valores das variáveis, tornando-se ***necessário usar uma relação***, que compreenda todas as restrições.*
    - *Existem algoritmos de pesquisa de soluções com restrições lineares em variáveis discretas. Pode provar-se que não existe nenhum algoritmo genérico capaz do mesmo para restrições não lineares.*

*Existem também ***CSPs com variáveis de domínios contínuos*** (que são muito comuns): sendo que o exemplo mais conhecido os problemas de programação linear, nos quais as restrições são igualdades ou desigualdades lineares.*
 - *Os problemas de programação linear são resolúveis em tempo polinomial nas variáveis (***a duração máxima de resolução é dada por um polinómio cujas variáveis são as variáveis do CSP***). Ou seja, ***mais variáveis, mais tempo***.*

### *Restrições*
*Além do tipo de variáveis que podemos ter, importa também abordar o tipo de restrições.* 

#### *Quanto ao tamanho dos tuplos: binárias, (...) n-árias.*
 - *As restrições de tipo mais simples são as ***restrições unárias***: ***restrições que afetam apenas uma variável***.*
 - *Uma ***restrição binária*** envolve ***duas variáveis***.*
    - *Um ***CSP binário*** contém apenas ***restrições binárias***, e pode ser representado por um grafo de restrições.*
 - *Podemos também definir ***restrições de ordem superior***.*
    - *Por exemplo, podemos restrigir o valor de Y a estar entre os valores das variáveis X e Z, usando a ***restrição ternária***:*

        ```python
        def BETWEEN(X, Y, Z): # DEFINES A RESTRICTION THAT FORCES Y TO BE BETWEEN X AND Z.
            pass
        ```
 - *Uma restrição que ***envolve um número arbitrário de variáveis*** é denominada ***restrição global*** (não é necessário que envolva todas as variáveis).*
    - *Existem duas razões pelas quais podemos preferir eventualmente um restrição global, ao invês de definir um conjunto de restrições binárias:*
        - *é mais fácil e menos propenso a erros a restrição do CSP usando uma função;*
        - *é possível desenvolver algoritmos de inferências para restrições globais, que não estão disponíveis para um conjunto de restrições mais primitivas.*

*Pode mostrar-se que qualquer restrição envolvendo variáveis de domínio finito ***pode ser reduzida a um conjunto de restrições binárias*** desde que se ***introduzam variáveis auxiliares*** em número suficiente.*
 - ****Variáveis auxiliares***: variáveis criadas minimizando os tuplos (n-ários) que definem cada variável em novos tuplos (binários) por permutação de todas as combinações possíveis.* 

*Assim, um ***CSP qualquer poderá*** eventualmente ***ser transformável num CSP binário***, o que permite que a pesquisa seja mais simples.*

#### *Quanto ao tipo de solução: absolutas ou preferíveis.*
*Num CSP as restrições podem ser:*
 - ****absolutas***: ou seja, ***restrições cuja violação coloca de parte uma potencial solução***;*
 - *ou podem ser, ***restrições de preferência***: ou seja, ***indicam que soluções são preferíveis***.*
    - *As restrições de preferência ***podem ser codificadas através de custos nas atribuições de valores às variáveis***. Nesta formulação, o CSP pode ser resolvido com método de procura de otimização (denominando-se então COP, ou Constraint Optimization Problem). Um problema de otimização linear é deste tipo.*

## *Propagação de restrições: inferência*
****Um algoritmo de resolução*** de um CSP ***pode fazer*** duas coisas:*
 - ****Procura***, ou seja, escolher (de entre várias possibilidades) uma atribuição de valores para as variáveis;*
 - ****Propagação de restrições***, ou seja, ***utilizar as restrições para reduzir o*** número de valores permitidos para uma variável (***dominío***), que por sua vez pode reduzir os dominíos de outra variável, e assim sucessivamente.*
    - *A propagação de restrições pode ser feita intercaladamente com a procura, ou então, pode ser feita como pré-processamento, antes da procura.*

## *Consistência de nós (node consistent)*
*Uma variável diz-se ***node consistent se todos os valores do seu domínio satisfazem as restrições unárias da variável***.*

## *Consistência de arcos (arc consistent)*
*Uma ***variável*** diz-se ***arc consistent se todos os valores do seu domínio satisfazem as restrições binárias***.*
 - *Ou seja, a variável ϰi diz-se arc consistent em relação a outra variável ϰj se todos os valores do seu domínio Ⅾi existe algum valor do domínio Ⅾj que satisfaz a restrição binária do arco (ϰi, ϰj).*

*Uma ***rede*** diz-se ***arc consistent se todas as variáveis são arc consistent em relação a todas as outras variáveis*** (com quem tenham uma restrição binária).*

### *AC3: Arc Consistency Algorithm #3*
*O algoritmo mais popular para implementar arc consistency num CSP é denominado de AC-3:*

```python
# AC3(): RUNS THE AC-3 ALGORITHM. RETURNS FALSE IF AN INCONSISTENCY IS FOUND, OTHERWISE RETURNS TRUE.
def AC3(CSP):
    QUEUE = [] # QUEUE, QUEUE OF ARCS, INITIALLY ALL THE ARCS IN THE PROBLEM.
    for VARIABLE in CSP.VARIABLES: # FOR EACH VARIABLE, FIND THE NEIGHBORS OF THE VARIABLE.
        for NEIGHBOR in CSP.NEIGHBORS[VARIABLE]: # FOR EACH NEIGHBOR OF THE VARIABLE, ADD THE ARC (VARIABLE, NEIGHBOR) TO THE QUEUE.
            QUEUE.append((VARIABLE, NEIGHBOR)) # ADD THE ARC (VARIABLE, NEIGHBOR) TO THE QUEUE.
    while len(QUEUE) > 0: # WHILE THE QUEUE IS NOT EMPTY, POP THE FIRST ARC (X_I, X_J) FROM THE QUEUE.
        (X_I, X_J) = QUEUE.pop(0) # POP THE FIRST ARC (X_I, X_J) FROM THE QUEUE.
        if REVISE(CSP, X_I, X_J): # IF THE DOMAINS OF THE VARIABLE X_I ARE REVISED, DO THE FOLLOWING:
            if len(CSP.DOMAINS[X_I]) == 0: # IF THE DOMAIN OF THE VARIABLE X_I IS EMPTY, RETURN FALSE.
                return False # RETURN FALSE.
            for X_K in CSP.NEIGHBORS[X_I]: # FOR EACH X_K IN NEIGHBOURS MINUS X_J, ADD THE (X_K, X_I) TO THE QUEUE.
                if X_K != X_J: # IF X_K IS DIFERENT THAN X_J, ADD THE (X_K, X_I) TO THE QUEUE.
                    QUEUE.append((X_K, X_I)) # ADD THE (X_K, X_I) TO THE QUEUE.
    return True # RETURNS TRUE.

# REVISE(): [PRIVATE FUNCTION] REVISES THE DOMAINS OF THE VARIABLE X_I, GIVEN THE DOMAINS OF THE VARIABLE X_J. RETURNS TRUE IF THE DOMAINS OF THE VARIABLE X_I ARE REVISED, OTHERWISE RETURNS FALSE.
def REVISE(CSP, X_I, X_J):
    REVISED = False # REVISED, BOOLEAN, INDICATES IF THE DOMAINS OF THE VARIABLE X_I ARE REVISED.
    for X in CSP.DOMAINS[X_I]: # FOR EACH VALUE X OF THE DOMAIN OF THE VARIABLE X_I, CHECK IF THE VALUE X SATISFIES THE CONSTRAINT (X_I, X_J).
        SATISFIED = False # SATISFIED, BOOLEAN, INDICATES IF THE VALUE X SATISFIES THE CONSTRAINT (X_I, X_J).
        for Y in CSP.DOMAINS[X_J]: # FOR EACH VALUE Y OF THE DOMAIN OF THE VARIABLE X_J, CHECK IF THE VALUE X SATISFIES THE CONSTRAINT (X_I, X_J).
            if X != Y: # IF THE VALUE X DOES NOT SATISFY THE CONSTRAINT (X_I, X_J), REMOVE THE VALUE X FROM THE DOMAIN OF THE VARIABLE X_I.
                SATISFIED = True # THE VALUE X SATISFIES THE CONSTRAINT (X_I, X_J).
                break # BREAK THE LOOP.
        if not SATISFIED: # IF THERE'S NO VALUE Y OF THE DOMAIN OF THE VARIABLE X_J THAT ALLOWS (X, Y) TO SATISFY THE CONSTRAINT BETWEEN (X_I, X_J), REMOVE THE VALUE X FROM THE DOMAIN OF THE VARIABLE X_I.
            del CSP.DOMAINS[X_I][CSP.DOMAINS[X_I].index(X)] # REMOVE THE VALUE X FROM THE DOMAIN OF THE VARIABLE X_I.
            REVISED = True # THE DOMAINS OF THE VARIABLE X_I ARE REVISED.
    return REVISED # RETURN THE BOOLEAN REVISED.
```

- *Para tornar consistentes todos os arcos do grafo de restrições é mantida uma lista de arcos a tratar; esta lista contém, inicialmente, todos os arcos do grafo de restrições.*

    ```python
    # [...]
    QUEUE = [] # QUEUE, QUEUE OF ARCS, INITIALLY ALL THE ARCS IN THE PROBLEM.
    for VARIABLE in CSP.VARIABLES: # FOR EACH VARIABLE, FIND THE NEIGHBORS OF THE VARIABLE.
        for NEIGHBOR in CSP.NEIGHBORS[VARIABLE]: # FOR EACH NEIGHBOR OF THE VARIABLE, ADD THE ARC (VARIABLE, NEIGHBOR) TO THE QUEUE.
            QUEUE.append((VARIABLE, NEIGHBOR)) # ADD THE ARC (VARIABLE, NEIGHBOR) TO THE QUEUE.
    # [...]
    ```

- *Um arco (ϰi, ϰj) da lista (aleatoriamente escolhido) é retirado; ϰi é, então, tornado arc consistent com ϰj.*

    ```python
    # [...]
    while len(QUEUE) > 0: # WHILE THE QUEUE IS NOT EMPTY, POP THE FIRST ARC (X_I, X_J) FROM THE QUEUE.
        (X_I, X_J) = QUEUE.pop(0) # POP THE FIRST ARC (X_I, X_J) FROM THE QUEUE.
        if REVISE(CSP, X_I, X_J): # IF THE DOMAINS OF THE VARIABLE X_I ARE REVISED, DO THE FOLLOWING:
    # [...]
    ```

    - *Se no passo anterior Ⅾi (domínio de ϰi) ficou inalterado, o algoritmo volta-se para outro arco da lista.*
    - *Se Ⅾi mudou, ou seja, ficou mais pequeno, então todos os arcos (ϰk, ϰi) (sendo ϰk as variáveis vizinhas (***neighbours***) de ϰi com k ≠ j) são adicionados à lista, pois a redução de Ⅾi pode significar uma revisão (redução) nos domínios Ⅾk (ainda que ϰk já tenha sido previamente considerada).*

        ```python
        # [...]
        for X_K in CSP.NEIGHBORS[X_I]: # FOR EACH X_K IN NEIGHBOURS MINUS X_J, ADD THE (X_K, X_I) TO THE QUEUE.
            if X_K != X_J: # IF X_K IS DIFERENT THAN X_J, ADD THE (X_K, X_I) TO THE QUEUE.
                QUEUE.append((X_K, X_I)) # ADD THE (X_K, X_I) TO THE QUEUE.
        # [...]
        ```

- *Caso algum Ⅾi seja reduzido de tal modo que se torne vazio então AC-3 retorna falha. Tal significa que o CSP não tem solução (com o tipo de consistência e algoritmo em uso). ***Ou seja, não é consistente.****

    ```python
    # [...]
    if len(CSP.DOMAINS[X_I]) == 0: # IF THE DOMAIN OF THE VARIABLE X_I IS EMPTY, RETURN FALSE.
        return False # RETURN FALSE.
    # [...]
    ```

    - *Caso contrário o algoritmo continua, revendo os valores dos domínios das variáveis até que a lista de arcos esteja vazia.*

        ```python
        # [...]
        while len(QUEUE) > 0: # WHILE THE QUEUE IS NOT EMPTY, POP THE FIRST ARC (X_I, X_J) FROM THE QUEUE.
            # [...]
        # [...]
        ```

*No final do algoritmo ficamos com um CSP que é equivalente ao original pois tem as mesmas soluções. Tendo os domínios das variáveis sido diminuídos, num CSP que é arc consistent a pesquisa será mais rápida.*

***A noção de consistência de arco pode ser generalizada de modo a contemplar restrições n-árias: é o que se denomina de generalized arc consistency ou hyperarc consistency.***

## *Consistência de caminhos (path consistent)*
*Embora a consistência de arcos possa reduzir bastante os domínios das variáveis (podendo até determinar a solução do CSP ou concluir que o CSP não tem solução) muitas vezes não consegue fazer as inferências necessárias.*

****A consistência de arcos estreita os domínios (restrições unárias) usando arcos (restrições binárias)***. Mas para resolver problemas como o da coloração de mapas precisamos de uma ***noção mais forte de consistência***: a ***path consistency*** (consistência de caminhos).*

*A ***path consistency estreita as restrições binárias usando restrições implícitas que são inferidas olhando para triplas de variáveis*** (restrições triplas: tuplos de três variáveis).*
 - *O conjunto de duas variáveis { ϰi, ϰj } diz-se ***path consistent em relação a uma terceira variável*** ϰm ***se, para qualquer atribuição de valores consistente com as restrições que existam*** em { ϰi, ϰj }, ***existe uma atribuição*** a ϰm que ***satisfaz as restrições*** em { ϰi, ϰm } e { ϰm, ϰj }.*