# GumgaQuery e QueryObject

[![](https://avatars3.githubusercontent.com/u/13262049?s=200&v=4)](https://github.com/GUMGA/frameworkbackend)

Neste exemplo vamos falar sobre o GQuery e as entidades que o envolvem, principalmente o QueryObject.
> GQuery é uma abstração para GumgaQuery, de agora em diante iremos nos referir desta maneira para nos aproximar mais dos termos declarados em código

O GQuery é uma ferramenta existente no framework, que possibilita pesquisa avançada sem a necessidade de se preocupar com qual banco está sendo utilizado.

Este recurso surgiu com o intuito de resolver problemas de compatibilidade entre bancos e facilitar consultas complexas utilizando orientação a objetos, excluindo assim, a necessidade de escrita de HQL para pesquisas Objeto Relacional.

Antes de entrarmos nos exemplos do GQuery, precisamos entender um pouco mais sobre o QueryObject.

#### QueryObject

Esta classe do framework serve para representar uma pesquisa, ela basicamente encapsula em seus campos todos os parâmetros de busca, vejamos abaixo sua declaração:
```java
package io.gumga.core;
//imports

/**
 * Classe para representar os parâmetros de uma pesquisa enviada ao Framework
 *
 * @author Equipe Gumga
 */
public class QueryObject {

    public static final String AQO = "AQO";
    public static final String SIMPLE = "SIMPLE";
    public static final String EMPTY = "[]";

    /**
     * Objeto representa uma pequisa OO
     */
    private GQuery gQuery = null;

    /**
     * Objeto JSON que representa uma pequisa avançada
     */
    private String aqo = EMPTY;
    /**
     * Trecho HQL que representa uma pequisa avançada FROM Classe obj WHERE ....
     */
    private String aq = SIMPLE;
    /**
     * Critério da pesquisa simples
     */
    private String q = "";
    /**
     * Posição inicial esperada no retorno
     */
    private int start = 0;
    /**
     * Tamanho da página
     */
    private int pageSize = 10;
    /**
     * Atributo de ordenaçao
     */
    private String sortField = "";
    /**
     * Ordem de ordenação ascendente ou descendente
     */
    private String sortDir = "asc";
    /**
     * Atributos para pesquisa simples
     */
    private String[] searchFields;

    /**
     * Indica pesquisa fonética ou não
     */
    private boolean phonetic = false;

    /**
     * Apenas conta, sem trazer os resultados
     */
    private boolean countOnly = false;

    /**
     * Acao a ser executada na api queryaction
     */
    private String action;

    /**
     * Se true, busca apenas os inativos
     */
    private boolean inactiveSearch = false;
    /**
     * Se true, faz a consulta de count na tabela
     */
    private boolean searchCount = true;

    public boolean isGQuery() {
        return gQuery != null;
    }

    public boolean isAQO() {
        return AQO.equals(aq);
    }

    public boolean isInactiveSearch() {
        return inactiveSearch;
    }

    /**
     * Se true, busca apenas os inativos
     */
    public void setInactiveSearch(boolean inactiveSearch) {
        this.inactiveSearch = inactiveSearch;
    }

    public boolean isCountOnly() {
        return countOnly;
    }

    public void setCountOnly(boolean countOnly) {
        this.countOnly = countOnly;
    }

    public boolean isPhonetic() {
        return phonetic;
    }

    public void setPhonetic(boolean phonetic) {
        this.phonetic = phonetic;
    }

    public String getAqo() {
        return aqo;
    }

    public void setAqo(String aqo) {
        this.aqo = aqo;
    }

    public String getQ() {
        return q;
    }

    public void setQ(String q) {
        this.q = q;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public String getSortField() {
        return sortField;
    }

    public void setSortField(String sortField) {
        this.sortField = sortField;
    }

    public String getSortDir() {
        return sortDir;
    }

    public void setSortDir(String sortDir) {
        if (Arrays.asList(new String[]{"asc", "desc"}).contains(sortDir)) {
            this.sortDir = sortDir;
        }
    }

    public String[] getSearchFields() {
        return searchFields;
    }

    public void setSearchFields(String searchFields) {
        this.searchFields = searchFields.split(",");
    }

    public void setSearchFields(String... fields) {
        this.searchFields = fields;
    }

    public int getCurrentPage() {
        if (start == 0) {
            return 1;
        }
        return start / pageSize + 1;
    }

    public boolean isValid() {
        return searchFields != null && searchFields.length > 0
                && q != null && !q.isEmpty();
    }

    public String getAq() {
        return aq;
    }

    public void setAq(String aq) {
        this.aq = aq;
    }

    public boolean isAdvanced() {
        return !SIMPLE.equals(aq);
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public GQuery getgQuery() {
        return gQuery;
    }

    public void setgQuery(GQuery gQuery) {
        this.gQuery = gQuery;
    }

    @Override
    public String toString() {
        return "QueryObject{ phonetic=" + phonetic + ", aq=" + aq + ", q=" + q + ", start=" + start + ", pageSize=" + pageSize + ", sortField=" + sortField + ", sortDir=" + sortDir + ", action=" + action + ", searchFields=" + Arrays.asList(searchFields == null ? Collections.EMPTY_LIST : searchFields) + '}';
    }

    public boolean isSearchCount() {
        return searchCount;
    }

    public void setSearchCount(boolean searchCount) {
        this.searchCount = searchCount;
    }
}

```
Mantivemos os getters e setters aqui no exemplo a fim de mostrar o papel de cada um dos métodos dessa entidade.

Vamos ver na prática como podemos criar uma busca utilizando o *QueryObject*.<br>

> O projeto exemplo possui um conjunto de Seeds de Pessoa para facilitar nossas buscas

A busca propriamente dita é realizada pelas entidades Repository, que implementam os métodos de busca JPA do motor de busca escolhido
Criamos o método *getListPessoaQo(...)* na classe de Serviço de Pessoa (*PessoaService*) que implementa uma busca simples utilizando o QueryObject. Veja a declaração abaixo:
```java
public List<Pessoa> getListPessoaQo(String param){
    /**
     * O objeto QueryObject contém campos de representação de uma pesquisa
     */
    QueryObject object = new QueryObject();
    /**
     * O campo Aq recebe diretamente uma hql
     */
    object.setAq("obj.nome like '%" + param + "%'");
    /**
    * Podemos configurar diversos parâmetros do objeto de resposta, como paginação, ordenação do resultado, etc.
    **/
    object.setPageSize(25);
    /**
     * O objeto de pesquisa pode ser passado por parâmetro a qualquer recurso de busca implementado
     */
    return repositoryPessoa.search(object).getValues();
}
```
Basicamente isso é suficiente para realizar uma busca simples por nome, chamaremos essa busca no método da API:
```java
@RequestMapping("/geto/{param}")
public List<Pessoa> getListPessoaQo(@PathVariable("param") String param){
    return pessoaService.getListPessoaQo(param);
}
```
Vamos fazer uma requisição GET na seguinte rota:
```
http://*servidor*/gumgaQuery-api/api/pessoa/geto/p
```
> "p" é o parâmetro de busca, no nosso exemplo queremos buscar todos os registros que contenham "p" no campo nome.

O resultado do servidor é esse:
```JSON
[
    {
        "id": "35FDF93522EC70A85B950242A70565A1",
        "oi": null,
        "nome": "Felipe",
        "idade": 25,
        "peso": 102,
        "altura": 1.8,
        "imc": 31.48148148148148
    },
    {
        "id": "35FDF9352E10009270B30242A70565A1",
        "oi": null,
        "nome": "Sophia",
        "idade": 30,
        "peso": 85.4,
        "altura": 1.57,
        "imc": 34.64643596089091
    }
]
```
Experimente fazer outras buscas.

#### Criando uma busca com gQuery

Nem sempre queremos declarar uma HQL no meio do código, ou ainda quando precisamos fazer uma busca relacional se faz necessário uma ferramenta mais específica, para isso temos o gQuery.<br>
Vamos criar uma busca simples utilizando este método. Assim como no QueryObject, quem executa a busca são os métodos do Repository.

Declaramos o seguinte método de busca na classe Service (PessoaService):
```java
public List<Pessoa> getListPessoaGquery(String param){
    /**
     * Este é o objeto principal da pesquisa, podemos criar todos os parâmetros de busca dentro do GQuery
     * e passá-lo como parâmetro para um método específico do repository
     */
    GQuery gQuery = new GQuery(new Criteria("obj.nome", ComparisonOperator.CONTAINS, param).addIgnoreCase().addTranslate());
    /**
     * Chamada do método que execura a busca no repository
     */
    return repositoryPessoa.findAll(gQuery);
}
```
Observe que, criamos a mesma busca feita anteriormente sem precisar escrever o código HQL
> Os métodos *addIgnoreCase()* e *addTranslate()* servem para ignorar maiúsculas e minusculas e acentuação, respectivamente

Declaramos o método que chama a busca na seguinte rota:
```
http://*servidor*/gumgaQuery-api/api/pessoa/getg/go
```
> "go" é o parâmetro de busca, no nosso exemplo queremos buscar todos os registros que contenham "go" no campo nome.

O servidor deverá retornar nossa busca:
```JSON
[
    {
        "id": "35FDF9352A8D90810E9C0242A70565A1",
        "oi": null,
        "nome": "Thiago",
        "idade": 31,
        "peso": 80,
        "altura": 1.81,
        "imc": 24.41927902078691
    },
    {
        "id": "35FDF9352B50E05F2C350242A70565A1",
        "oi": null,
        "nome": "Diego",
        "idade": 26,
        "peso": 98,
        "altura": 1.95,
        "imc": 25.77251808021039
    }
]
```
Outra possibilidade é enviar diretamente um objeto gQuery para o servidor, isso facilita em muito a construção de buscas mais complexas.<br>
Antes, vamos ver um pouco mais a fundo o que essa classe nos disponibiliza:

```java
package io.gumga.core.gquery;

import java.io.Serializable;
import java.util.*;

/**
 * Classe para criação de objetos de pesquisa orientada a objeto (consulta no banco de dados)
 * @author munif
 */
public class GQuery implements Serializable {

    /**
     * Operador Lógico de consulta
     */
    private LogicalOperator logicalOperator;
    /**
     * Critério de busca
     */
    private Criteria criteria;
    /**
     * Sub-consultas
     */
    private List<GQuery> subQuerys;
    /**
     * Junções de pesquisa, exemplo: inner join, left join...
     */
    private List<Join> joins = new LinkedList<>();
    /**
     * Indica se adicionara DISTINCT na consulta para evitar repetição de registros
     */
    private Boolean useDistinct = Boolean.FALSE;

    /**
     * Construtor da classe que iniciará uma modelo de consulta simples
     */
    public GQuery() {
        this.logicalOperator = LogicalOperator.SIMPLE;
        this.criteria = new Criteria();
    }
    public GQuery(LogicalOperator logicalOperator, Criteria criteria, List<GQuery> subQuerys) {
        this.logicalOperator = logicalOperator;
        this.criteria = criteria;
        this.subQuerys = subQuerys;
    }
    public GQuery(LogicalOperator logicalOperator, Criteria criteria) {
        this.logicalOperator = logicalOperator;
        this.criteria = criteria;
    }
    public GQuery(Criteria criteria) {
        this.logicalOperator = logicalOperator.SIMPLE;
        this.criteria = criteria;
    }
    public GQuery(LogicalOperator logicalOperator, List<GQuery> subQuerys) {
        this.logicalOperator = logicalOperator;
        this.subQuerys = subQuerys;
        y(this);
    }
    public LogicalOperator getLogicalOperator() {
        return logicalOperator;
    }
    public void setLogicalOperator(LogicalOperator logicalOperator) {
        this.logicalOperator = logicalOperator;
    }
    public Criteria getCriteria() {
        return criteria;
    }
    public void setCriteria(Criteria criteria) {
        this.criteria = criteria;
    }
    public List<GQuery> getSubQuerys() {
        return subQuerys;
    }
    public void setSubQuerys(List<GQuery> subQuerys) {
        this.subQuerys = subQuerys;
    }
    public GQuery and(GQuery other) {
        if (LogicalOperator.AND.equals(this.logicalOperator)) {
            this.subQuerys.add(other);
            return this;
        }
        return new GQuery(LogicalOperator.AND, Arrays.asList(new GQuery[]{this, other}));
    }
    public GQuery or(GQuery other) {
        if (LogicalOperator.OR.equals(this.logicalOperator)) {
            this.subQuerys = new LinkedList<>(subQuerys);
            this.subQuerys.add(other);
            return this;
        }
        return new GQuery(LogicalOperator.OR, Arrays.asList(new GQuery[]{this, other}));
    }
    public GQuery and(Criteria criteria) {
        GQuery other = new GQuery(criteria);
        if (LogicalOperator.AND.equals(this.logicalOperator)) {
            this.subQuerys = new LinkedList<>(subQuerys);
            this.subQuerys.add(other);
            return this;
        }
        return new GQuery(LogicalOperator.AND, Arrays.asList(new GQuery[]{this, other}));
    }
    public GQuery or(Criteria criteria) {
        GQuery other = new GQuery(criteria);
        if (LogicalOperator.OR.equals(this.logicalOperator)) {
            this.subQuerys = new LinkedList<>(subQuerys);
            this.subQuerys.add(other);
            return this;
        }
        return new GQuery(LogicalOperator.OR, Arrays.asList(new GQuery[]{this, other}));
    }
    public GQuery join(Join join) {
        this.joins.add(join);
        return this;
    }
    public String getJoins() {
        StringBuilder builder = new StringBuilder();
        x(this, builder);
        return builder.toString();
    }
    public Boolean useDistinct() {
        Map<String, Boolean> result = new HashMap();
        result.put("useDistinct", Boolean.FALSE);
        this.searchUseDistinct(this, result);
        return result.get("useDistinct");
    }
    public void addIgnoreCase() {
        if (criteria != null) {
            criteria.addIgnoreCase();
        }
        if (subQuerys != null) {
            subQuerys.stream().forEach((gq) -> gq.addIgnoreCase());
        }
    }
    public Boolean getUseDistinct() {
        return useDistinct;
    }
    public void setUseDistinct(Boolean useDistinct) {
        this.useDistinct = useDistinct;
    }
}

```
> abstraímos alguns métodos dessa representação, você pode consultar essa classe no código fonte disponibilizado.

Observe que precisamos passar um objeto *Criteria* para a instanciação do mesmo, este objeto possui a especificação da busca. Seus principais campos sâo:
* field - Representa o "Campo" a ser buscado do objetos;
* ComparisonOperator - Recebe um enum com o operador de comparação utilizando, estes podem ser:
```java
EQUAL(" = "),
    GREATER(" > "),
    LOWER(" < "),
    GREATER_EQUAL(" >= "),
    LOWER_EQUAL(" <= "),
    LIKE(" like "),
    NOT_EQUAL(" != "),
    STARTS_WITH(" like "),
    ENDS_WITH(" like "),
    CONTAINS(" like "),
    IN(" in "),
    IN_ELEMENTS(" in elements "),
    IS(" is "),
    BETWEEN(" between "),
    NOT_CONTAINS(" not like ");
```
* value - É o valor a ser buscado

Observe que a classe gQuery dispõe de métodos *and(...), or(...), join(...)* etc, isso permite que sejam criadas buscas compostas de uma maneira muito simples, simplesmente "concatenando" objetos gQuery, por ex:
```java
GQuery gquery = new GQuery(new Criteria('nome', ComparisonOperator.EQUAL, 'Mateus'))
                 .or(new Criteria('nome', ComparisonOperator.CONTAINS, 'Felipe'))
                 .and(new Criteria('nome', ComparisonOperator.ENDS_WITH, 'Almeida'))
```
Vamos fazer agora uma busca passando um objeto gQuery.<br>
Faremos uma requisição POST passando um JSON que representa o gQuery com a busca na seguinte rota:
```
http://*servidor*/gumgaQuery-api/api/pessoa/gq
```
No corpo da requisição, passaremos o seguinte JSON

```JSON
{
	"subQuerys" : [
	{
		"subQuerys" : [],
		"joins" : [],
		"criteria" : {
			"comparisonOperator": "LOWER_EQUAL",
			"fieldFunction": "%s",
			"valueFunction": "%s",
			"field": "idade",
			"value": "21"
		},
		"logicalOperator": "SIMPLE"
	},
	{
		"subQuerys" : [],
		"joins" : [],
		"criteria" : {
			"comparisonOperator": "GREATER_EQUAL",
			"fieldFunction": "%s",
			"valueFunction": "%s",
			"field": "imc",
			"value": "20"
		},
		"logicalOperator": "SIMPLE"
	}

	],
	"joins" : [],
	"logicalOperator" : "AND"
}
```
>Este objeto solicita ao servidor todas as pessoas com idade menor que 21 anos, e que possuam imc maior que 20


Temos o seguinte resultado:
```JSON
[
    {
        "id": "35FE271A163F308FD83D02427939C24E",
        "oi": {
            "value": "1."
        },
        "nome": "Mateus",
        "idade": 17,
        "peso": 90,
        "altura": 1.55,
        "imc": 37.460978147762745
    },
    {
        "id": "35FE271A1C59B06E4CBD02427939C24E",
        "oi": {
            "value": "1."
        },
        "nome": "Fernanda",
        "idade": 15,
        "peso": 57,
        "altura": 1.62,
        "imc": 21.719250114311837
    }
]
```
Experimente modificar os parâmetros de busca explorando os *comparisonOperator* e *logicalOperator*.


License
----

LGPL-3.0


**Free Software, Hell Yeah!**
