# Changelog

## 1.0.0 (2026-07-18)


### Features

* Add DMN diagram support to model viewer ([9896a9d](https://github.com/guifelix/PharmaSync/commit/9896a9d0473cf48633b8d826357bf19f5e46301c))
* **api:** add dependency health checks ([80c0d33](https://github.com/guifelix/PharmaSync/commit/80c0d334f1f337e9adc79e11e27093541a6d3726))
* **api:** add medication lot expiration tracking ([a06d26f](https://github.com/guifelix/PharmaSync/commit/a06d26fda4dba90dda652ecafe49d979cd154f75))
* **api:** add medication product reference data ([95879f1](https://github.com/guifelix/PharmaSync/commit/95879f1b2ccfb7dc187f371cfee42cde9870b839))
* **api:** add organizations and sites ([0ed95cd](https://github.com/guifelix/PharmaSync/commit/0ed95cdb2d51f57e3659840f3038c919e3acb91e))
* **api:** add workforce auth context ([6797acc](https://github.com/guifelix/PharmaSync/commit/6797accd1bd086be226372701d289e28e8315e20))
* **api:** enforce role-based access ([9732d5b](https://github.com/guifelix/PharmaSync/commit/9732d5b727d448047a117e8a9cb5b77887f1e128))
* **api:** enforce tenant query scope ([e93bef3](https://github.com/guifelix/PharmaSync/commit/e93bef365cf0eb6e75ca225190b742c26863ae6a))
* **api:** implement stock position reference slice ([d39311f](https://github.com/guifelix/PharmaSync/commit/d39311f0001b1bc089380243b4a7331eb71f9d3f))
* **api:** Map validated partner feed records to canonical inventory events ([6af5b97](https://github.com/guifelix/PharmaSync/commit/6af5b97cb48387ce296a08b77d342a9833d22eb1))
* **api:** Scaffold Adonis API application ([ded3dc0](https://github.com/guifelix/PharmaSync/commit/ded3dc009c2751f9c2b041ae638f8556ff5f30ff))
* **config:** validate runtime environment ([bb5069a](https://github.com/guifelix/PharmaSync/commit/bb5069a4a11c508afa75472018b76bd638b6c924))
* **core:** Add shared domain packages and local infra ([9607adc](https://github.com/guifelix/PharmaSync/commit/9607adcffd912cf607cc0af1bf89c8c440ce962f))
* **domain:** record inventory movements ([ee5444a](https://github.com/guifelix/PharmaSync/commit/ee5444a0aabbbf89e5e0d647539eff89db486d3b))
* Implement Phase 1 tooling stack ([9a716ab](https://github.com/guifelix/PharmaSync/commit/9a716ab1082f128bcbea6570b43a91271c608e51))
* Model all PharmaSync processes with bpmnkit ([e3b34d4](https://github.com/guifelix/PharmaSync/commit/e3b34d44eeb25c4c3f2466be0017515bc7b39bd5))
* **outbox:** add transactional inventory outbox ([8ee641e](https://github.com/guifelix/PharmaSync/commit/8ee641ec7f3f15d201087970f6d25b1f1fa762a4))
* **pharmasync:** add traceable partner feed ingress ([cad9a8c](https://github.com/guifelix/PharmaSync/commit/cad9a8c6a644da636c7f4268aa6df34422722a4d))
* **web:** Add Vue operations dashboard shell ([ed640a0](https://github.com/guifelix/PharmaSync/commit/ed640a05d1efccc5a4ea811b12fdd67e8658d2ae))
* **worker:** Add background processing stub ([30b71c8](https://github.com/guifelix/PharmaSync/commit/30b71c8ec7e2a84ee809f3ed767dee0493fef7dd))


### Bug Fixes

* **integration:** Use .ts extension for outbox re-export ([f78996d](https://github.com/guifelix/PharmaSync/commit/f78996d6eb5f5d79d5a8a9c85cd7c54f5347e3ed))
* **worker:** Handle DB-not-ready error on initial tick ([aa29a02](https://github.com/guifelix/PharmaSync/commit/aa29a02f7af86c9f925b9de1d39305b71cf38db0))
