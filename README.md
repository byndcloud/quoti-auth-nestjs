# Introdução

Essa biblioteca é um simples wrapper para o Quoti Auth que é compatível com o
Nest.js. Ela possui um módulo global que recebe os mesmos parâmetros que o
método `setup()` do Quoti Auth e permite que uma única instância do Quoti Auth
esteja disponível para toda a aplicação via Dependency Injection.

# Requisitos

Para utilizar esse package é necessário ter os packages
`@nestjs/platform-express`, `@nestjs/common`, `@nestjs/core` e `quoti-auth`
instalados no seu projeto (idealmente com a mesma versão que consta no
package.json desse projeto), pois eles são
[peer dependencies](https://nodejs.org/es/blog/npm/peer-dependencies/). As
versões mínimas são as seguintes:
```json
"@nestjs/common": "8.2.6",
"@nestjs/core": "8.2.6",
"@nestjs/platform-express": "8.2.6",
"quoti-auth": "^1.6.1"
```

# Setup

O setup do Quoti Auth deve ser feito no módulo principal da aplicação, dessa
forma o decorator `@Auth` poderá ser utilizado em qualquer lugar da aplicação.
Por exemplo:

```ts
import { QuotiAuthModule } from 'quoti-auth-nestjs';

@Module({
  imports: [
    ... outros módulos da API ...,

    // O método .register recebe o mesmo objeto de configuração que o método .setup do Quoti Auth
    QuotiAuthModule.register({
      orgSlug: 'Slug da sua organização no Quoti',
      apiKey: 'Sua API key para utilização do Quoti Auth',
      ...
    }),
  ],
  ...
  providers: [...],
})
export class AppModule implements NestModule {
  ...
}
```

# Decorator @Auth

## Autenticação

A biblioteca possui um decorator `@Auth` que cuida da autenticação via Quoti
Auth para qualquer rota de um controller. Para requerer **autenticação** do
usuário basta adicionar o decorator em um método de um controller, e.g:

```ts
import { Auth } from 'quoti-auth-nestjs';

@Controller({ path: 'foos', version: '1' })
export class FooController {

  @Get()
  @Auth()
  async getFoos(): Promise<Foo> {
    ...
    return [new Foo()]
  }
}
```

Agora, para que um usuário possa chamar o endpoint `GET /foos` ele deve fazer
uma chamada passando algum dos tokens de autenticação que o Quoti Auth permite
na requisição. Caso isso não ocorra, o Nest irá automaticamente responder com
status 401, Forbidden.

## Autorização

Também é possível realizar chegagens de permissões com o decorator `@Auth`, ele
aceita um array de arrays de string (`string[][]`) que contém quais permissões o
usuário deve ter para poder acessar a rota, por exemplo:

```ts
import { Auth } from 'quoti-auth-nestjs';

@Controller({ path: 'foos', version: '1' })
export class FooController {

  @Get()
  @Auth([['list.foo']])
  async getFoos(): Promise<Foo> {
    ...
    return [new Foo()]
  }
}
```

Agora, para que um usuário acesse a rota `GET /foos` precisa ter a permissão
`list.foos`. **O decorator `@Auth` e a função `.middleware(..)` do Quoti Auth,
eles recebem os mesmos parâmetros e tem a mesma funcionalidade.**
