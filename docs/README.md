# Introdução

O cp-image-crop é um componente para manipulação de imagens, ele permite que o usuário recorte e customize uma imagem do computador, o componente também tem integração o google drive que facilita o usuário buscar uma imagem quando ela não está no computador.

------
# Instalação

## # CDN
Recomendamos vincular a um número de versão específico que você possa atualizar manualmente, porém no exemplo iremos utilizar a ultima versão disponível.
```html
<!-- Stylesheet -->
<link rel="stylesheet" href="https://unpkg.com/cp-image-crop@latest/dist/cp-image-crop.min.css">

<!-- Component -->
<script src="https://unpkg.com/cp-image-crop@latest/dist/cp-image-crop.min.js"></script>
```
Certifique-se de ler sobre as diferentes construções e use a produção, substituindo os arquivos .js por .min.js. Esta é uma compilação otimizada para velocidade em vez de experiência de desenvolvimento.

## # NPM
O NPM é o método de instalação recomendado ao criar aplicativos de grande escala. Ele combina muito bem com bundlers de módulo, como Webpack ou Browserify.

```shell
$ npm install cp-image-crop --save
```
Após a instalação, precisamos importar o componente no projeto, o componente é feito utilizando **typescript** então é necessário configurar o **ts-loader** no arquivo do configuração do seu **webpack**. Exemplo:
```javascript
module.exports = {
  ...
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```
Com o **ts-loader** configurado, basta importarmos o componente no arquivo principal do seu projeto. Exemplo:
```javascript
import 'cp-image-crop';
```

------
# Instância do componente

Se chegamos até aqui, provavelmente a instalação foi finalizada êxito, isso significa que já podemos utilizar o cp-image-crop.
Vamos agora criar uma nova instância do componente, primeiro faça a declaração no HTML dando um **alias** para essa instância no exemplo usaremos o alias **exampleCrop**.

```html
<cp-image-crop cp-model="$ctrl.pessoa.foto"></cp-image-crop>
```

Depois de declarar o componente no HTML precisamos inicializa-lo, nesse momento é possível passar alguns parâmetros caso julgarmos necessário.
Na inicialização do componente, precisar informar o contexto que será aplicado o valor. Exemplo:
```javascript
class MyController {
    constructor() {
      this.pessoa = {
        foto: ''
      }
    }
}

capivara.controller(document.body, MyController);
```

Exemplo em CapivaraJS - [Jsfiddle](https://jsfiddle.net/t0b8xxfj/6/).

Exemplo em Angular.js - [Jsfiddle](https://jsfiddle.net/t0b8xxfj/8/).

Exemplo em Angular - [Jsfiddle](https://jsfiddle.net/1hk7knwq/3584/).

Exemplo em Vue.js - [Jsfiddle](http://jsfiddle.net/td4v7qqd/61/).

Exemplo em React - [Jsfiddle](http://jsfiddle.net/td4v7qqd/62/).



------
# Configuração

O componente aceita algumas constantes que permitem configurar funcionalidades. No exemplo abaixo iremos fazer a visualização em **200x200**, entretanto definir que a imagem será recortada em **250x250**.

Você pode ver esse exemplo no [Jsfiddle](https://jsfiddle.net/xfnkp3no/15/)

```javascript
class MyController {
  constructor() {
    this.pessoa = {
      foto: 'https://goo.gl/SYn4yp'
    }
  }

  $onInit() {
    const config = {
      crop: {
        viewport: {
          width: 50,
          height: 250
        }
      }
    };
    capivara.componentBuilder('exampleCrop').then((instance) => {
      instance.constants(config).build();
    });
  }

}

capivara.controller(document.body, MyController);

```
## Objeto de config
| Atributo: Default      | Tipo          | Descrição |
| ------------- |:-------------:| -----:|
| width: 170px      | string | Define a largura da área de visualização. |
| height: 170px      | string | Define a altura da área de visualização. |
| crop      | CropConfig | Configuração da área de recorte. |
| drive      | DriveConfig | Configuração do google drive. |

## CropConfig

Veja esse exemplo no [Jsfiddle](https://jsfiddle.net/xfnkp3no/20/) que demostramos como deixar o resize livre e o zoom infinito.

| Atributo: Default      | Tipo          | Descrição |
| ------------- |:-------------:| -----:|
| customClass: ''   | string | Uma classe de sua escolha para adicionar ao contêiner para adicionar estilos personalizados. |
| enableOrientation: false      | boolean | Ativar ou desativar o suporte a orientação personalizada.  |
| enableResize: false      | boolean | Ativar ou desativar o suporte para redimensionar a área da janela de visualização. |
| enableZoom: true      | boolean | Ative a funcionalidade de zoom. Se definido como falso, a rolagem não aumentariam. |
| enforceBoundary: true      | boolean | Restringe o zoom, de modo que a imagem não pode ser menor que a viewport. |
| showZoomer: true      | boolean | Ocultar ou Mostrar o controle deslizante de zoom. |
| viewport: object      | ViewPortConfig | Configuração da parte visível da imagem. |

## ViewPortConfig
| Atributo: Default      | Tipo          | Descrição |
| ------------- |:-------------:| -----:|
| width: 170px      | string | Define a largura da área de recorte. |
| height: 170px      | string | Define a altura da área de recorte. |
| type: square/circle      | string | Define a a imagem será recortada em circulo ou quadrado. |

## DriveConfig
| Atributo      | Tipo          | Descrição |
| ------------- |:-------------:| -----:|
| apiKey      | string | Define a chave da api do google. |
| clientId      | string | Define o id do cliente google. |

------
# Integração com google drive

Você pode permitir que seu usuário sincronize as imagens do google drive com o componente, permitindo que ele faça troca das imagens com mais praticidade. Caso você queira utilizar essa funcionalidade, siga as instruções abaixo: 

* 1 - Acesse [Google console](https://console.developers.google.com/apis/api/drive.googleapis.com?project=_) e selecione ou crie seu projeto. 
* 2 - Após selecionar seu projeto, clique em Ativar na tela de consentimento. 
* 3 - Com o serviço Google Drive API ativo, vá até a guia Credenciais e crie uma credencial do tipo **Chave de API** e **ID do cliente OAuth**. 

Obs: Quando estiver criando o **ID do cliente OAuth** certifique-se de colocar as URL de origens permitidas.

Veja no [Jsfiddle](https://jsfiddle.net/xfnkp3no/26/) como informar suas chaves.