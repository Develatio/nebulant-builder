## Setup

### Docker

Este proyecto tiene 2 branches:

* `master`: producción
* `develop`: devel

Una vez has clonado el repo asegúrate de estar en el brach `develop` antes de continuar.

* Construye el proyecto: `make build`
* Arranca el proyecto: `make start`

### ¿Qué hemos arrancado?

Si todo ha ido bien debería haberse arrancado el builder de Nebulant:

- [builder.nebulant.lc](https://builder.nebulant.lc)

## ¿Cómo ejecutar los tests?

Para correr los tests, en el branch `develop` debemos hacer lo siguiente:

```sh
$ make build-test
$ make test
```

Y para los tests e2e:

```sh
$ make build-teste2e
$ make teste2e
```

### How to run e2e tests on Mac

1. Install XQuartz - https://www.xquartz.org/
2. Reboot. No, really, **REBOOT**.
3. Run XQuartz, go to `Settings -> security` and enable `Allow connections from network clients`
4. Quit XQuartz. **QUIT**, not **Close**.
4. Run `xhost +localhost`
5. You're ready to go, run `make teste2elocal`

### How to run codegen helper tool on Mac

Once you have `XQuartz` ready in your macos, you can also run codegen tool:

1. `make codegen`
2. From the interactive container: `npx playwright codegen --ignore-https-errors https://nebulant_builder`
