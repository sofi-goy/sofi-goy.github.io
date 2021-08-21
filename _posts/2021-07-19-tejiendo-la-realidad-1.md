---
layout: post
title:  "Tejiendo la Realidad en el Blockchain"
date:   2021-07-19 18:35:52 -0300
---

<!-- # Tejiendo la Realidad en el Blockchain -->

## Introducción

Estuve investigando sobre física cuántica. En específico, las ideas de la decoherencia, el darwinismo cuántico y la interpretación de los *many worlds*. Y llegué a una conclusión. El punto principal es el siguiente: **el estado de la realidad viene dado por una red de entrelazamientos cuánticos, que llega a un consenso descentralizado *a la blockchain***. Ahora, ya sé que dije muchas *buzz words*, pero creo honestamente que llegué a algo importante, o por lo menos, un concepto muy entretenido. ¿De qué estoy hablando? Bueno, me propongo hacer una serie de posts desarrollando esta idea. En este post, hablaré de la segunda parte de esta idea: el consenso descentralizado a través del blockchain.

## Blockchain, o Cómo Llegar a un Consenso Descentralizado

Antes de empezar, quiero decir que probablemente el siguiente video resume el funcionamiento del blockchain mucho mejor de lo que yo puedo hacerlo: [But how does bitcoin actually work?](https://www.youtube.com/watch?v=bBC-nXj3Ng4) por 3Blue1Brown. Sin embargo, entra en mucho mayor detalle matemático del que necesitamos.

Nuestro objetivo es entender qué quiere decir tener un *consenso descentralizado*, y por qué el blockchain lo permite. El blockchain, como probablemente sepas, es la tecnología criptográfica detrás de criptomonedas como Bitcoin. ¿Cuáles son las características interesantes de estas criptomonedas? La más importante es la siguiente: es una manera de realizar transacciones sin tener que confiar en un banco que las verifique. A esto nos referimos con *descentralizado*, no es necesario confiar en una autoridad central. Si bien el blockchain sirve para otras cosas más allá de las criptomonedas, es un ejemplo bastante rico que nos permitirá entender otros usos más generales.

Empezaremos entonces nuestra historia imaginando un sistema para transacciones. Como primer propuesta, imaginamos un grupo de gente que lleva un historial de transacciones, en forma de libro o sitio web. Este libro (o, en inglés, *Ledger*) se podría ver de la siguiente forma:

> **Ledger**
>
> - Ana le paga $100 a Bianca
> - Bianca le paga $50 a Carlos

Cada cierto período, el grupo se junta, se calcula cuánta plata gastó o recibió cada une y se saldan las cuentas. Imaginemos también que en este libro se permite a cualquiera agregar transacciones. En este esquema tan simple, aparecen al menos tres problemas importantes:

1. Cualquier persona puede agregar cualquier transacción, por ejemplo, Ana puede agregar

    > Carlos le paga $1000 a Ana

    y de repente Carlos fue estafado. ¿Cómo evitar esta falsificación?

2. Una persona con muchas deudas, como nuestro pobre Carlos, podría decidir no aparecer a la hora de saldar las cuentas (y no queremos resolverlo de manera mafiosa, ¿no?).

3. Si bien, en teoría, cada persona puede agregar líneas, el sistema sigue estando centralizado. El problema es: ¿dónde se guarda el historial? Si es un libro físico, una persona o institución lo tiene. Si es una página web, alguien es dueño del servidor y tiene acceso al código fuente. Quien posea el historial, puede controlar quién añade transacciones y quién no, o puede eliminar las transacciones que no le gusten.

Trataremos ahora de ir mejorando el sistema para responder a estos problemas.

## Problema 1: Evitando falsificaciones

Si el historial estuviera en un libro físico, hay una solución simple: pedir que cada transacción esté firmada por quién la realiza. Pero finalmente, el caso que nos interesa es el digital. Acá es dónde entra la primer herramienta criptográfica: **las firmas digitales**. No me interesa entrar en detalle de cómo funcionan, pero algo importante a decir es que una firma digital no es siempre la misma: sino, bastaría con un *Ctrl+C, Ctrl+V* para falsificarla. En cambio, una firma digital cambia con el mensaje que se quiere firmar. Esto casi soluciona el problema, pero:

- **Problema 1'**. Supongamos que hay una transacción

> - Ana le paga $100 a Bianca, 01011001... (firma digital de Ana)

Entonces la viva de Bianca puede hacer *Ctrl+C, Ctrl+V*:

> - Ana le paga $100 a Bianca, 01011001... (firma digital de Ana)
> - Ana le paga $100 a Bianca, 01011001... (firma digital de Ana)
> - Ana le paga $100 a Bianca, 01011001... (firma digital de Ana)
> - ...

Como el mensaje (transacción) a firmar es el mismo, la misma firma digital es válida. Esto se soluciona variando el mensaje: podemos agregar, junto a la transacción, un *ID*, un número de transacción. Si ahora Ana quiere transferir dos veces a Bianca, debe agregar las líneas:

> 1. Ana le paga $100 a Bianca, 01011001... (firma digital 1 de Ana)
> 2. Ana le paga $100 a Bianca, 11000100... (firma digital 2 de Ana)
> 3. ...

Y ahora Bianca es incapaz de repetir esta transferencia, ya que no sabe cómo generar las distintas firmas digitales necesarias.

## Problema 2: Evitando morosos

La solución a este problema no nos interesa tanto pra nuestros propósitos, es más del orden económico. La solución es eliminar el ajuste de cuentas a fin de mes. Cada persona podría arrancar con un saldo. Las primeras líneas del historial serían:

> **Ledger**
>
> 1. Ana recibe $1000
> 2. Bianca recibe $1000
> 3. Carlos recibe $5
> 4. ...

Después de esto, deberíamos asegurarnos antes de cada transacción que el firmante tenga el saldo necesario. Esto nos complica aún más en el tercer problema: ahora necesitamos *algo* que verifique el saldo antes de declarar a una transacción válida. Y para verificar el saldo hay que mantener el historial bien completo y ordenado.

## Problema 3: Evitando centralización

Finalmente, llegamos a la parte más interesante. Hasta ahora resolvimos un par de problemas que poco tienen que ver con el blockchain *per se*. Hasta ahora, sólo tenemos un historial de transacciones, donde hay ciertas garantías criptográficas contra las falsificaciones. Ahora atacamos el problema de la centralización. La manera en la que lo hacemos es totalmente anárquica: dejamos que *cada persona tenga su propia copia del historial*. Cada vez que alguien quiere realizar una transacción, transmite a la red la información, junto con la firma. Cada persona podría verificar por su cuenta la firma y el saldo de quién opera. Pero para ello, cada persona necesita tener el historial completo. El tercer problema, entonces, se convierte en las preguntas:

- ¿Cómo se puede llegar a un **consenso** sobre el *verdadero* historial de transacciones, de todas las copias que hay?
- Si recién me uno a la red y pido el historial completo, ¿cómo confío en que la información que me llega es verdadera?
- ¿Cómo sé si las nuevas transacciones que escucho son verdaderas y si las estoy anotando en el mismo orden que el resto de la red?

Estas son las preguntas fundamentales que viene a resolver el blockchain.

Las herramientas criptográficas relevantes son los conceptos de "prueba de trabajo" y de funciones de hash. Primero hablemos sobre los *hashes*. Una [función hash](https://es.wikipedia.org/wiki/Funci%C3%B3n_hash) es como una máquina a la que le doy un mensaje, y me devuelve un identificador o resumen del mensaje, de una longitud fija. Por ejemplo, uno de los algoritmos hash más usados al día es *SHA-256*. A este algoritmo le pasaremos un "bloque": una lista de transacciones. Veamos un ejemplo: supongamos que tenemos el bloque

> *Bloque 23*
>
> 1. Ana le paga $100 a Bianca, 01011001...
> 2. Ana le paga $100 a Bianca, 11000100...
> 3. Carlos le paga $1 a Ana,   00000000...

Si le aplicamos SHA-256 (esto se puede hacer online [aquí](https://coding.tools/sha256)) a este mensaje, obtenemos la siguiente cadena aparentemente aleatoria:

> 0464B84A241A1D8183D3D9818594933A1A78301E5D0840474A85664D77E99A41

Si cambiamos ligeramente el bloque, por ejemplo cambiando el monto de la última operación de $1 a $2, el hash cambia totalmente:

> 13A6ABF9BD93CF00788D3C27BAC56767BE42B22B6F62F7C264E3824164BFCFE8

Este comportamiento es usual (y deseable) en una función hash. Es importante mencionar que, teniendo el hash, es imposible "aplicar el algoritmo a la inversa" y recuperar el mensaje que produjo ese hash. La única manera es probar todos los mensajes posibles hasta producir el mismo hash. Pero a fines prácticos, esto es imposible: llevaría miles y miles de años hasta con las mejores computadoras.

Pasamos al otro concepto importante: las pruebas de trabajo. Es un concepto computacional que consiste en un método para que yo pueda convencer a cualquiera de que invertí tiempo y recursos computacionales en una determinada tarea, y que me puedan creer con garantías dadas por la "magia criptográfica". Vamos al ejemplo relevante a Bitcoin: supongamos que tenemos el bloque de más arriba, y yo agrego un *número mágico* al final del bloque:

> *Bloque 23*
>
> 1. Ana le paga $100 a Bianca, 01011001...
> 2. Ana le paga $100 a Bianca, 11000100...
> 3. Carlos le paga $1 a Ana,   00000000...
>
> 33891817

¿Qué tiene de mágico ese número? Bueno, veamos que pasa cuando calculo el hash SHA-256 de este mensaje:

> **000000**A6C8C4D2EF7CDDD8A977B1B5E74B32A023D72CE6104F5F13AD03EB9C73

Resalté algo de este hash: ¡comienza con 6 ceros seguidos! Qué curioso. Ahora, teniendo en cuenta que estos hashes parecen aleatorios y no hay manera de revertirlos, espero haberte convencido de que tuve que probar (o mi computadora tuvo que probar) varios números hasta encontrar el mágico `33891817`. Mejor aún, ni siquiera necesitás creerme que ese es el hash: usando herramientas online como la mencionada más arriba podés verificarlo independientemente. En conclusión, podés creerme que tuve que hacer trabajo computacional. De hecho para encontrar ese número utilicé el siguiente código en Python:

```python
import hashlib

bloque = """Bloque 23

1. Ana le paga $100 a Bianca, 01011001...
2. Ana le paga $100 a Bianca, 11000100...
3. Carlos le paga $2 a Ana, 01001000...
"""

magic = 1
while magic < 1000000000:
    mensaje = bloque + str(magic)
    hasheado = hashlib.sha256()
    hasheado.update(mensaje.encode('utf-8'))
    if (hasheado.hexdigest()[:6] == '0'*6):
        print(magic)
        print(hasheado.hexdigest().upper())
        break
    
    magic += 1
```

Lo que hace el programa es probar con los números del 1 a 1000000000, calcular el hash del mensaje y detenerse si encuentra que el hash empieza con seis ceros. Tuve entonces que hashear 33891817 mensajes antes de dar con el mágico. También medí el tiempo que tardó mi computadora en encontrarlo: 53.2 segundos.

Creo que es claro que si pedimos que el hash empiece con, por ejemplo, **10 ceros**, será mucho más difícil encontrar el número mágico correspondiente.

¿Cómo se relaciona todo esto con Bitcoin? Proponemos un mecanismo para mejorar nuestro historial. Habrá gente que "trabaje" (también conocido como minar Bitcoin). Sus tareas serán:

- Escuchar en la red a nuevas transacciones e ir anotándolas
- Cuando haya suficientes transacciones, armar un bloque
- **(Importante)** Incluir en el bloque el hash del bloque anterior
- Calcular el número mágico para que el hash comience con una secuencia de, por ejemplo, 60 ceros
- Transmitir el nuevo bloque a la red

¿Por qué resalto uno de los pasos? Es donde se arma una **cadena de bloques**. Asegura, en primer lugar, que los bloques estén ordenados secuencialmente. En segundo lugar, hace que falsificar el historial se vuelva imposible. ¿Por qué? Si quisieramos cambiar o agregar una operación en un determinado bloque, debemos computar un nuevo número mágico para ese bloque, y su hash cambiará. Pero  la falsificación no termina ahí. Para tener una cadena de bloques válidos, debemos cambiar también el bloque siguiente, por el paso remarcado, y computar un nuevo número mágico. Y así *ad infinitum*. Es un esfuerzo computacional inmenso, que se hace más difícil a medida que salen más bloques y resulta imposible hacerlo en la práctica. La versión del historial que gana el estatus de *real* es aquella en la que la mayoría de la red puso esfuerzo computacional. *Y ta-dah, eso es el blockchain*. Al menos en el contexto de las criptomonedas.

## Conclusiones

Uff. Esto quedó más largo de lo que esperaba. Divagué un poco con cosas más de criptomonedas que con el blockchain. Pero felicitaciones, si llegaste hasta acá sos capaz de mirar bloques de Bitcoin [acá](https://blockexplorer.com/blocks/) y disecar su anatomía. Pero lo que más me importa que te lleves de este post es la siguiente idea:
> el blockchain es la tecnología que permite que cada actor tenga una lista de eventos, operaciones o transacciones que considera "reales" y que a partir de esas versiones se llegue a una única realidad consensuada.

Solo para mencionar otros ejemplos, hablemos un poco de *Ethereum*. Al igual que Bitcoin, permite transferir ua moneda digital, en este caso, el ETH. Pero permite más que eso: existe lo que se llama la *Ethereum Virtual Machine* (EVM). La realidad consensuada en este caso es un historial de computaciones, y hay programas que se *pueden ejecutar en la EVM*. Es decir, en un momento dado hay un consenso sobre el estado de la EVM. El análogo con bitcoin sería tener el saldo de todas las cuentas a un tiempo determinado. Luego viene un nuevo bloque, con operaciones que se pueden programar en un lenguaje especial. Estas operaciones cambian el estado de la máquina de manera determinística. Cada persona puede calcular por su cuenta el resultado que debería dar tal computación, siguiendo ciertas reglas de transición. Finalmente, el blockchain asegura que, luego de un tiempo, se consensue cuál es el estado real de la EVM luego de la computación.

> Antes de finalizar, me gustaría mencionar que no todo es de color rosa con el blockchain. Hay críticas muy fuertes a su funcionamiento, a la idea de "confianza" que postula. Para más información, ver los siguientes links:
>
> - [There's no good reason to trust Blockchain Technology](https://www.wired.com/story/theres-no-good-reason-to-trust-blockchain-technology/)
> - [Blockchain is not only crappy technology but a bad vision for the future](https://medium.com/@kaistinchcombe/decentralized-and-trustless-crypto-paradise-is-actually-a-medieval-hellhole-c1ca122efdec)

Con esto, ya estoy en condiciones de spoilear un poco de lo que sigue: mi hipótesis es que las partículas guardan (en su estado cuántico) información sobre los procesos que ocurren a su alrededor. Estas informaciones pueden posiblemente contradecirse (véase el principio de superposición), pero hay un mecanismo (entrelazamiento cuántico y decoherencia) que permite que la rareza cuántica desaparezca, y que se llegue a un consenso sobre los fenómenos macroscópicos que observamos mediante la mecánica clásica.
