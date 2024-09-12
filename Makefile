all: start

create-env:
	touch .env .env.production .env.staging

jjplus:
	@if [ ! -d packages/joint/plus/src ]; then\
		rm -rf packages/joint/plus/jointplus;\
		unzip -q joint-plus.zip -d packages/joint/plus;\
		mkdir -p packages/joint/plus/src/packages;\
		mv packages/joint/plus/jointplus/src/packages/joint-format-raster packages/joint/plus/src/packages/;\
		mv packages/joint/plus/jointplus/src/packages/joint-format-svg packages/joint/plus/src/packages/;\
		mv packages/joint/plus/jointplus/src/packages/joint-free-transform packages/joint/plus/src/packages/;\
		mv packages/joint/plus/jointplus/src/packages/joint-keyboard packages/joint/plus/src/packages/;\
		mv packages/joint/plus/jointplus/src/packages/joint-navigator packages/joint/plus/src/packages/;\
		mv packages/joint/plus/jointplus/src/packages/joint-paper-scroller packages/joint/plus/src/packages/;\
		mv packages/joint/plus/jointplus/src/packages/joint-selection packages/joint/plus/src/packages/;\
		rm -rf packages/joint/plus/jointplus;\
	fi

create-network:
	docker network create nebulant-lan 2> /dev/null || true

start: create-env create-network jjplus
	docker compose -f docker-compose.yml up builder

startinbg: create-env create-network jjplus
	docker compose -f docker-compose.yml up -d builder

start_standalone:
	docker compose -f docker-compose.yml up

stop:
	docker compose -f docker-compose.yml stop

restart:
	docker compose -f docker-compose.yml restart

down:
	docker compose -f docker-compose.yml down

sh:
	docker compose -f docker-compose.yml exec builder bash

logs:
	docker compose -f docker-compose.yml logs --tail 250 -f

build: create-env jjplus
	docker compose -f docker-compose.yml build --progress plain --no-cache

build-test: create-env jjplus
	docker compose -f docker-compose.test.yml build --progress plain --no-cache

build-teste2e: create-env jjplus
	docker compose -f docker-compose.teste2e.yml build --progress plain --no-cache

rm-dangling-images:
	docker rmi $(docker images -f "dangling=true" -q) || true
	docker system prune -f || true

rm:
	docker compose -f docker-compose.yml down --rmi local

scaffold:
	docker compose -f docker-compose.yml exec builder yarn run scaffold
	sudo chown -R `whoami` src

generate_intellisense_predictors:
	docker compose -f docker-compose.yml exec builder yarn run generate_intellisense_predictors
	sudo chown -R `whoami` src

build-dist: jjplus
	docker compose -f docker-compose.yml run --rm builder yarn run build_prod

test: jjplus
	docker compose -f docker-compose.test.yml run --rm test yarn run test

teste2e: jjplus
	docker compose -f docker-compose.teste2e.yml run --rm teste2e yarn run teste2e

teste2elocal: jjplus
	docker compose -f docker-compose.teste2e.yml run --rm teste2e yarn run teste2elocal

codegen:
	docker run -it --rm --network=nebulant-external -e DISPLAY=host.docker.internal:0 --entrypoint=/codegen.sh develatio/nebulant_teste2e

test-live: jjplus
	docker compose -f docker-compose.test.yml run --rm test yarn run test_live

.PHONY: all create-env jjplus start start-prod startinbg stop restart down bash logs build rm-dangling-images rm scaffold generate_intellisense_predictors build-dist test teste2e teste2elocal test-live
