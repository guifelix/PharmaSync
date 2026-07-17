# Architecture Workspace

This folder contains two complementary diagram sources:

- `workspace.dsl` is the canonical Structurizr model. Use it when you want one model with multiple C4 views, validation, exports, and future documentation/ADR links.
- `d2/*.d2` are portable C4-style D2 diagrams for quick rendering, sharing, and experimentation.

## View with Structurizr locally

Docker:

```bash
docker run --rm -it --user 0:0 -p 8080:8080 -v "$PWD/architecture:/usr/local/structurizr" structurizr/structurizr local
```

Then open `http://localhost:8080`.

## Validate Structurizr views

Validated locally with Docker:

```bash
docker run --rm -v "$PWD/architecture:/workspace" structurizr/cli validate -workspace /workspace/workspace.dsl
```

## Optional Structurizr exports

Structurizr documentation notes D2 export support in the CLI distribution. In this local Docker image, validation worked but `-format d2` did not create output files, so treat these as optional commands to test with your installed or newer Structurizr tooling:

```bash
structurizr export -workspace architecture/workspace.dsl -format d2 -output architecture/exported-d2
structurizr export -workspace architecture/workspace.dsl -format mermaid -output architecture/exported-mermaid
```

## Render D2 directly

If `d2` is installed:

```bash
d2 architecture/d2/context.d2 architecture/out/context.svg
d2 architecture/d2/container.d2 architecture/out/container.svg
d2 architecture/d2/component-inventory-api.d2 architecture/out/component-inventory-api.svg
d2 architecture/d2/component-integration-gateway.d2 architecture/out/component-integration-gateway.svg
d2 architecture/d2/database-model.d2 architecture/out/database-model.svg
```

Preferred with Podman:

```bash
mkdir -p architecture/out
podman run --rm -v "$PWD:/workspace:Z" -w /workspace docker.io/terrastruct/d2 architecture/d2/context.d2 architecture/out/context.svg
podman run --rm -v "$PWD:/workspace:Z" -w /workspace docker.io/terrastruct/d2 architecture/d2/container.d2 architecture/out/container.svg
podman run --rm -v "$PWD:/workspace:Z" -w /workspace docker.io/terrastruct/d2 architecture/d2/component-inventory-api.d2 architecture/out/component-inventory-api.svg
podman run --rm -v "$PWD:/workspace:Z" -w /workspace docker.io/terrastruct/d2 architecture/d2/component-integration-gateway.d2 architecture/out/component-integration-gateway.svg
podman run --rm -v "$PWD:/workspace:Z" -w /workspace docker.io/terrastruct/d2 architecture/d2/database-model.d2 architecture/out/database-model.svg
```

Docker fallback:

```bash
mkdir -p architecture/out
chmod 777 architecture/out
docker run --rm -v "$PWD:/workspace" -w /workspace terrastruct/d2 architecture/d2/context.d2 architecture/out/context.svg
docker run --rm -v "$PWD:/workspace" -w /workspace terrastruct/d2 architecture/d2/container.d2 architecture/out/container.svg
docker run --rm -v "$PWD:/workspace" -w /workspace terrastruct/d2 architecture/d2/component-inventory-api.d2 architecture/out/component-inventory-api.svg
docker run --rm -v "$PWD:/workspace" -w /workspace terrastruct/d2 architecture/d2/component-integration-gateway.d2 architecture/out/component-integration-gateway.svg
docker run --rm -v "$PWD:/workspace" -w /workspace terrastruct/d2 architecture/d2/database-model.d2 architecture/out/database-model.svg
```

## Local verification status

- `architecture/workspace.dsl` validated with `structurizr/cli` via Docker.
- All direct D2 files rendered successfully to SVG in `architecture/out/`.
- Docker is the supported local runtime in this workspace. Podman rootless mounts can fail on Structurizr's generated `.structurizr` cache.
