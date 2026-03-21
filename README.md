# 🎬 LeTube Backend

![NestJS](https://img.shields.io/badge/Framework-NestJS-E0234E?style=flat-square)
![Microservices](https://img.shields.io/badge/Architecture-Microservices-1F2937?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square)
![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?style=flat-square)
![RabbitMQ](https://img.shields.io/badge/Broker-RabbitMQ-FF6600?style=flat-square)
![S3](https://img.shields.io/badge/Storage-S3_Compatible-569A31?style=flat-square)
![FFmpeg](https://img.shields.io/badge/Video-FFmpeg-007808?style=flat-square)
![HLS](https://img.shields.io/badge/Streaming-HLS-0F172A?style=flat-square)
![SRS](https://img.shields.io/badge/Server-SRS-2563EB?style=flat-square)

Backend проекта в формате микросервисной монорепы.
Сейчас основной фокус проекта на трех сервисах:

- 📦 `media` - регистрация медиа, выдача URL для загрузки и фиксация статуса обработки
- ⚙️ `media-worker` - асинхронная обработка видео и подготовка HLS через `ffmpeg`
- 📡 `stream` - логика live-стримов, stream key и интеграция с RTMP/HLS через SRS

Проект построен вокруг отдельного API gateway, внутренних TCP/RMQ-коммуникаций и общей контрактной библиотеки с DTO, pattern-ами и transport-константами.

## 📚 Содержание

- Обзор
- Технологический стек
- Микросервисы
- Поток обработки медиа
- Поток live-стрима
- Структура проекта
- Локальный запуск

## 📖 Обзор

Этот репозиторий реализует backend для платформы с загрузкой видео, асинхронной обработкой медиа и live-стримингом.

Архитектурно это NestJS-монорепа с отдельными сервисами, shared-библиотеками и DDD-структурой внутри ключевых модулей.

- `apps/*` - отдельные сервисы
- `libs/abstractions` - общие порты и токены для cache и storage
- `libs/contracts` - общие DTO, event pattern-ы и RPC-контракты
- `libs/infra-constants` - transport-константы, host/port и имена сервисов
- `libs/infra-core` - общая инфраструктура для Redis, RabbitMQ и S3
- `libs/modules` - переиспользуемые Nest-модули и auth-инструменты
- `libs/pure` - pure-helpers для формирования storage key и HLS-путей

Основная идея простая:

- gateway принимает внешний HTTP-запрос
- профильный микросервис выполняет бизнес-логику
- тяжелая обработка видео уходит в worker через RabbitMQ
- live-стримы проходят через SRS, а backend валидирует stream key

## 🧰 Технологический стек

### Runtime / Framework

- Node.js
- TypeScript
- NestJS
- NestJS Microservices
- NestJS CQRS

### Data / Infra

- PostgreSQL
- Prisma
- Redis
- RabbitMQ
- S3-compatible storage

### Shared Libraries

- `libs/abstractions`
- `libs/contracts`
- `libs/infra-constants`
- `libs/infra-core`
- `libs/modules`
- `libs/pure`

### Media / Streaming

- FFmpeg
- HLS
- SRS

## ✨ Микросервисы

| Сервис            | Роль                                                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 📦 `media`        | Создает запись о видео, выдает secure URL для загрузки исходника, принимает событие завершения upload и помечает видео как готовое после обработки |
| ⚙️ `media-worker` | Слушает очередь `uploaded`, скачивает исходник из storage, режет видео в HLS и публикует событие `processed`                                       |
| 📡 `stream`       | Генерирует `stream key`, валидирует публикацию live-потока и хранит состояние стрима                                                               |

## 📦 Media

`media` отвечает за lifecycle загруженного видео.

Что делает сервис:

- создает запись `Video` в базе
- формирует storage key для исходного файла
- выдает signed URL для прямой загрузки в бакет
- принимает `upload-complete` после завершения загрузки
- отправляет задачу на обработку в RabbitMQ
- после ответа от worker сохраняет `hlsMasterKey` и переводит видео в `READY`

Основные статусы видео:

- `UPLOADING`
- `UPLOADED`
- `READY`

HTTP-вход идет через gateway:

- `POST /media/upload`
- `POST /media/upload-complete`

Внутри сервис использует:

- TCP RPC для команд из gateway
- RabbitMQ queue `processed` для событий о завершенной обработке
- Prisma для таблицы `Video`
- S3 storage для исходников и HLS-артефактов

## ⚙️ Media Worker

`media-worker` занимается тяжелой фоновой обработкой после загрузки исходника.

Что делает сервис:

- слушает очередь `uploaded`
- проверяет, не был ли HLS уже собран
- скачивает исходный файл из storage
- создает временную рабочую директорию
- прогоняет файл через `ffmpeg`
- загружает HLS-плейлист и сегменты обратно в storage
- публикует событие `processed`
- очищает временные файлы после обработки

Результат обработки:

- HLS master playlist
- набор `.ts` сегментов
- ключ вида `streams/video/<videoId>/index.m3u8`

Обработка сейчас использует локальный `ffmpeg.exe`, а HLS-артефакты после сборки сохраняются в object storage.

## 📡 Stream

`stream` отвечает за server-side логику live-стриминга.

Что уже есть:

- генерация `stream key`
- сохранение `stream key` в Redis с TTL
- RPC endpoint для публикации стрима
- persistence-слой для сущности `Stream`
- интеграция с SRS через `http_hooks`

Текущий live-flow:

1. backend создает `stream key`
2. ключ сохраняется в Redis как `streamKey:<uuid>`
3. SRS вызывает webhook `on_publish`
4. gateway проксирует событие в `stream`
5. сервис проверяет существование ключа и возвращает `code: 0`

HLS-потоки отдаются через HTTP server внутри SRS.

## 🔄 Поток обработки медиа

```text
Client
  |
  v
API Gateway
  |
  v
media
  |
  |- создает Video record
  |- отдает signed upload URL
  |
  v
S3 / Object Storage
  |
  v
API Gateway -> media/upload-complete
  |
  v
media
  |- статус UPLOADED
  `- event: uploaded
  |
  v
RabbitMQ
  |
  v
media-worker
  |- download original
  |- ffmpeg -> HLS
  |- upload playlist + segments
  `- event: processed
  |
  v
media
  `- статус READY + hlsMasterKey
```

## 📡 Поток live-стрима

```text
Streamer / OBS
  |
  v
SRS (RTMP ingest)
  |
  |- on_publish
  v
API Gateway
  |
  v
stream
  |- validate stream key in Redis
  `- allow publish
  |
  v
SRS HTTP server -> HLS output
```

## 🏗 Структура проекта

```text
apps
 ├ app-gateway
 ├ media
 ├ media-worker
 ├ stream
 ├ identity
 ├ channel
 └ notification

libs
 ├ abstractions
 ├ contracts
 ├ infra-constants
 ├ infra-core
 ├ modules
 └ pure
```

Полезно отдельно отметить:

- `apps/media` - доменная и application-логика по видео
- `apps/media-worker` - background processing
- `apps/stream` - stream keys, publish flow, stream state
- `libs/abstractions` - контракты для интеграции со storage и cache
- `libs/contracts` - единая точка для DTO и transport contracts
- `libs/infra-constants` - константы для внутреннего транспорта между сервисами
- `libs/infra-core` - готовые инфраструктурные модули для Redis, RabbitMQ и S3
- `libs/modules` - общие Nest-модули и auth-инструменты
- `libs/pure/src/media` - генерация storage key для upload и HLS

## ⚡ Локальный запуск

### Инфраструктура

В `docker-compose.yaml` уже описаны:

- PostgreSQL
- RabbitMQ
- Redis
- SRS

Запуск инфраструктуры:

```bash
docker compose up -d
```

### Приложение

Установка зависимостей:

```bash
yarn install
```

Быстрый запуск базового набора сервисов:

```bash
yarn start:all
```

Для контура видео и стриминга отдельно:

```bash
yarn start:media
yarn start:media-worker
yarn start:stream
```

Дополнительно должны быть подняты:

- gateway
- PostgreSQL
- RabbitMQ
- Redis
- SRS
