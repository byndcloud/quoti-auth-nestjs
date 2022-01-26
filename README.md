# Introdução
Essa biblioteca é um simples wrapper para o Quoti Auth. Ela possui um Module global que recebe os mesmos parâmetros que o método `setup()` do Quoti Auth e permite que uma única instância do Quoti Auth esteja disponível para toda a aplicação via Dependency Injection.

# Decorator @Auth

# Autenticação
A biblioteca possui um decorator `@Auth` que cuida da autenticação via Quoti Auth para qualquer rota de um controller. Para requerer **autenticação** do usuário basta adicionar o decorator em um método de um controller, e.g: 

```ts
import { Auth } from 'quoti-auth-nestjs';

@Controller({ path: 'foos', version: '1' })
export class ExtensionController {

  @Get()
  @Auth()
  async getFoos(): Promise<Foo> {
    ...
    return [new Foo()]
  }
}
```

Agora, para que um usuário possa chamar o endpoint `GET /foos` ele deve fazer uma chamada passando algum dos tokens de autenticação que o Quoti Auth permite na requisição. Caso isso não ocorra, o Nest irá automaticamente responder com status 403, Forbidden.
