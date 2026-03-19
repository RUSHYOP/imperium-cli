# RXDS Illustrations

> 76 illustration components for empty states, errors, feedback, and contextual visuals.
> All components are from the RXDS library file `H9Z2GxsyE6Zi78ciqUmH3B`, page **Illustrations** (node `37955:4676`).

---

## Usage

- Use illustrations in **Empty States** (`references/empty-states.md`) to reinforce zero-data contexts visually.
- Reference by component name (kebab-case) when importing via `rxds_import`.
- Illustrations are standalone RXDS components — place inside a `Col` when using the rAutocode grid.
- Prefer the **General / Empty States** category for generic no-data views; use scenario-specific illustrations for domain screens.
- **Illustrations replace empty image frames** — wherever a design calls for a placeholder image frame (e.g. a blank `RECTANGLE` or an empty `FRAME` used as an image slot), use an appropriate illustration component instead. Never leave a raw empty image frame in a layout.

---

## Figma Source

| File | Page | Node |
|------|------|------|
| [RXDS Library](https://www.figma.com/design/H9Z2GxsyE6Zi78ciqUmH3B/RXDS--Ramco-s-Xperience-Design-System-?node-id=37955-4676) | Illustrations ✅ | `37955:4676` |

---

## 1. General / Empty States

Use when a list, table, or view has no content to display.

| Name | Node ID | Component Key |
|------|---------|---------------|
| `no-data` | `38210:9311` | `d34b2ace7b01cccbef20db10de3e578f22522860` |
| `no-item-yet` | `38210:9312` | `04b30d4371b636d777ed050880f55922d4151536` |
| `list-empty` | `38210:9317` | `5c9e6f4ee5f7b0cc49f405074a33fd58dd3046a2` |
| `no-records-found` | `38210:9366` | `878f165d73e8a0265231b11754701a0123e0cc4e` |
| `no-notification` | `38210:9313` | `762e4c7b5543efd3ae5547fd03848210707e0a49` |
| `no-favorites` | `38210:9325` | `c62b2f04a4776c7759fba8648beeabae61d71eb7` |
| `no-recent-activity` | `38210:9324` | `4932d0ce581eab0f36585ec4b66350bdf01a50a7` |
| `no-history` | `38210:9326` | `26ca09de123a940f7b73e8e08bcdba41088092fd` |
| `cleared-history` | `38210:9322` | `69c208c72fe753925254b4b46dc260a61afd7798` |
| `no-download-yet` | `38210:9339` | `98205ad2f2523c3d287fdbf2a17fe4178c56772e` |
| `no-upload-yet` | `38210:9340` | `f1833c3871c4b2532dcbd0f12db3e1189519644d` |

---

## 2. Status & Feedback

Use for process outcomes, loading states, and task completion.

| Name | Node ID | Component Key |
|------|---------|---------------|
| `success` | `38210:9314` | `7059687975a8faf5a9e45b863145ef5eecc7874e` |
| `failure` | `38210:9315` | `087cd8421bd6024acbacea38d90c238b44eb6998` |
| `loading` | `38210:9365` | `f145b985682f3920f9e6bba2936bd3276a296cbe` |
| `not-loading` | `38210:9316` | `5bb4049b75f97570a6f621ff54e25b7216f88cd1` |
| `completed-task` | `38210:9323` | `7c991ffc63957b39d9a14974b07d684f724868a7` |
| `no-achievements-yet` | `38210:9351` | `d0162dc7f5dcfbea0e6473d003992c3cea1dab43` |
| `no-goals-set` | `38210:9350` | `dfac5670241fd749101bc8b036fd84fc27678bc6` |

---

## 3. HTTP & Network Errors

Use for error pages and network-related feedback. Map to the corresponding HTTP status code.

| Name | HTTP / Context | Node ID | Component Key |
|------|----------------|---------|---------------|
| `page-not-found` | 404 | `38210:9327` | `d230d99de01ea246feda67aab5a4fb5fc27da33b` |
| `bad-request` | 400 | `38210:9334` | `12cb126100603a2735935fb50b848d6425eeb203` |
| `unauthorized` | 401 | `38210:9332` | `aa0eb8e2530de061b6ce51e75cb03affda1f0857` |
| `forbidden` | 403 | `38210:9328` | `b2acb137a01b89d900d13af7f9d8e42512e01847` |
| `internal-server-error` | 500 | `38210:9329` | `58546d33700234476b9b355bcc260a83a4636058` |
| `bad-gateway` | 502 | `38210:9330` | `518938d0af205b30f60200a2a4fdf5a66d34f5ce` |
| `service-unavailable` | 503 | `38210:9331` | `8ffc3e6ffc377f7c26f6afe17205a2b7b2f4957c` |
| `gateway-timeout` | 504 | `38210:9333` | `064ae69503b065451a929455aad77e19f53e3aca` |
| `too-many-requests` | 429 | `38210:9335` | `7b969db7aee2e9863ed1c4f174ac98f259f4229c` |
| `server-error` | General 5xx | `38210:9321` | `48cb50241c1e35668c0edce8a819c9ac5f6293fd` |
| `no-internet-connection` | Offline | `38210:9320` | `459393309b741844abd6645c098f3e97956b465f` |
| `connection-lost` | Dropped connection | `38210:9336` | `9a9edc707d0c300e09a8ca4ec9d2d2cbf06383ab` |
| `maintenance-mode` | Scheduled downtime | `38210:9337` | `fcba8289baef678243773b511da37a7d89abb67b` |
| `unsuppoerted-browser` | Unsupported browser *(sic)* | `38210:9338` | `9bfea674181ff881b407c7773fde0cb9b463f461` |

---

## 4. Access & Auth

Use for authentication walls and permission-denied screens.

| Name | Context | Node ID | Component Key |
|------|---------|---------|---------------|
| `access-denied` | No permission to view | `38210:9318` | `ab63c858eeffa7f10204bb9f7e707cf9b24db011` |
| `login-required` | Must authenticate first | `38210:9319` | `37bfa447fd04349b48187375f8fe7cb6cdf641a1` |

---

## 5. File Transfer & Sync

Use for upload/download flows and backup states.

| Name | Context | Node ID | Component Key |
|------|---------|---------|---------------|
| `upload-in-progress` | Active upload | `38210:9342` | `2cdf7c442fe5e26082be9627bfa12a62d36c26e3` |
| `download-in-progress` | Active download | `38210:9341` | `556290be75bd9f15f09c60ad1f7b79a335c3709c` |
| `download-upload-failed` | Transfer error | `38210:9343` | `d2b4df531279b6afda653d87d96a7bf0ed8e26cb` |
| `no-sync-yet` | Sync not started | `38210:9344` | `f8d95c9c56ed2fee684d5ddd2697cffd99abfa41` |
| `sync-in-progress` | Active sync | `38210:9345` | `168cc4017ee8e9849dc6f49bd88c63f82e5289cf` |
| `backup-not-setup` | Backup not configured | `38210:9346` | `ba6b9506df8af5362b50ddd46e77ef378167fee9` |
| `backup-completed` | Backup done | `38210:9347` | `ae0b9b0473d807e08999f595f44fb61edb2754a9` |

---

## 6. User Management & HR

Use for people-related screens — user onboarding, profiles, payroll, goals.

| Name | Context | Node ID | Component Key |
|------|---------|---------|---------------|
| `add-user` | Single user onboarding | `38589:101` | `33a74a0722d71ad48bded37f15a8f181b29be301` |
| `add-users` | Bulk user add | `38600:54831` | `b6cc69e0ddfa46fcf04584ad7ad1a075b70dcb04` |
| `employee-profile` | Employee view | `38600:54834` | `bbb440e8c89b5dc1b77ce029e67465f39af3356a` |
| `pay-elements` | Payroll setup | `38210:9352` | `9c67d92c781f9796b6723934978ad92b8c3de0f9` |
| `add-policies` | Policy creation | `38210:9353` | `d158566065b3eb7133cef1b6a7f998fe2a351f2d` |

---

## 7. Commerce & Orders

Use for e-commerce, procurement, and order management screens.

| Name | Context | Node ID | Component Key |
|------|---------|---------|---------------|
| `empty-cart` | Cart is empty | `38210:9348` | `50170f8dfe5ea50235723f3d263d69497a10b196` |
| `no-orders-yet` | No orders placed | `38210:9349` | `6f14d8a13a8e437e03fa3a4dd13d61207edf0301` |
| `add-order` | Prompt to create first order | `38210:9357` | `c12c4114e9c5e8b4019caeb688c6c3263a1691dc` |
| `order-summary` | Order detail view | `38210:9354` | `97110a76003ed339b070787f5135cdef10ff03d6` |
| `no-document-found` | Document search empty | `38210:9355` | `ed8e30b4f9b9edd1dc4541de19352023ea2125d5` |
| `no-job-found` | Job/work-order search empty | `38210:9356` | `6ca3c6753bc4cbb8b3f3fc43b03f5aae94c43ea8` |
| `tarrif-list` | Tariff listing | `38210:9358` | `201cce9b383ead3b1dd0900662ddd1dbcf903009` |
| `tarrif-value` | Tariff value detail | `38210:9359` | `e6b4be0e6f7a860e94a139fc99a85ef973d4a591` |

---

## 8. Logistics & Transport

Use for trip planning, fleet management, and logistics operations.

| Name | Context | Node ID | Component Key |
|------|---------|---------|---------------|
| `booking-summary` | Trip/booking summary | `38210:9360` | `00f73b1053f1981f37c2cf7faeb21bdc2ac60518` |
| `trip-detail` | Trip detail view | `38210:9361` | `3c73a8c3d9157cee4f5f864edc9a75655ca11233` |
| `no-trip-selected` | No trip chosen yet | `38210:9362` | `66d22f424825d6c5d8716bdf1becb5fd40dcec3f` |
| `add-trip-plan` | Create first trip plan | `38210:9363` | `ff54e70f5d7bb0d1d16410b743e7fa10244b0057` |
| `scan-order` | Order scanning | `38210:9364` | `8f898a2d156e2906e6d983f9460fe5b5cb25beb8` |
| `vehicle` | Fleet / vehicle | `38210:9367` | `1ba65605f928c8665e730432e6720c49ecc0e885` |
| `location` | Location / map | `38210:9368` | `bf24237def29260b55983da6ebdf2322c93a36d3` |
| `equipment` | Equipment catalogue | `38210:9369` | `1110e663f5e9165626661eaccb236d2762ba9234` |
| `trip-plan` | Trip plan overview | `38210:9370` | `01a8a1f399b0e34c4d18db4eea8a5cb4c648dbcc` |
| `driver` | Driver profile | `38210:9371` | `6212775dcf3cf6cf4f98ae8a9fdbf49d08b545ae` |
| `handler` | Handler / operator | `38210:9372` | `20f754c1a1fed46be88ef109a79c5b2e8f9defb9` |
| `agent` | Agent profile | `38210:9373` | `e03e5b1575b9686fea756d719e70b9bc75d9a0bc` |
| `schedule` | Schedule view | `38210:9374` | `26536fb80ab2ef8240d8e51b108b7863d5e5ad5e` |

---

## 9. Packaging & Warehouse

Use for warehouse management, consignment tracking, and supply chain screens.

| Name | Context | Node ID | Component Key |
|------|---------|---------|---------------|
| `box` | Generic box | `38600:54832` | `4a367207a4e227c947da985dcd8a060f91690980` |
| `cardboard-box` | Cardboard box | `38600:54833` | `a36c684250250d2c6ab85ec657a56c61659e6abc` |
| `empty-box-1` | Empty box variant 1 | `38600:54835` | `87e1fac2eb9cceaf35cf5e77689bfc690a47f92a` |
| `empty-box-2` | Empty box variant 2 | `38600:54836` | `af585d96703307f00ba1b227ee9cef388bedfeab` |
| `consignment-1` | Consignment variant 1 | `38600:54837` | `4ce3ba840f1ff19b385131d1466e85dcd6bfe2bd` |
| `consignment-2` | Consignment variant 2 | `38600:54838` | `af99ae41417403690141b4305221a44cd199024b` |
| `thu` | THU (Transport Handling Unit) | `38600:54841` | `07d11a393bf61a39d9daf14293cf1715eb284c25` |
| `value-added-services` | VAS screen | `38600:54839` | `c55664907480dea1c6e1ba5892eaa8d71f5146c5` |
| `scan-consignment` | Consignment scanning | `38600:54840` | `5670328f782d04cc33d4b90e6ce2ba0d47cc96fc` |

---

## Quick Reference — All 76 Illustrations

| # | Name | Category |
|---|------|----------|
| 1 | `no-data` | General / Empty States |
| 2 | `no-item-yet` | General / Empty States |
| 3 | `list-empty` | General / Empty States |
| 4 | `no-records-found` | General / Empty States |
| 5 | `no-notification` | General / Empty States |
| 6 | `no-favorites` | General / Empty States |
| 7 | `no-recent-activity` | General / Empty States |
| 8 | `no-history` | General / Empty States |
| 9 | `cleared-history` | General / Empty States |
| 10 | `no-download-yet` | General / Empty States |
| 11 | `no-upload-yet` | General / Empty States |
| 12 | `success` | Status & Feedback |
| 13 | `failure` | Status & Feedback |
| 14 | `loading` | Status & Feedback |
| 15 | `not-loading` | Status & Feedback |
| 16 | `completed-task` | Status & Feedback |
| 17 | `no-achievements-yet` | Status & Feedback |
| 18 | `no-goals-set` | Status & Feedback |
| 19 | `page-not-found` | HTTP & Network Errors |
| 20 | `bad-request` | HTTP & Network Errors |
| 21 | `unauthorized` | HTTP & Network Errors |
| 22 | `forbidden` | HTTP & Network Errors |
| 23 | `internal-server-error` | HTTP & Network Errors |
| 24 | `bad-gateway` | HTTP & Network Errors |
| 25 | `service-unavailable` | HTTP & Network Errors |
| 26 | `gateway-timeout` | HTTP & Network Errors |
| 27 | `too-many-requests` | HTTP & Network Errors |
| 28 | `server-error` | HTTP & Network Errors |
| 29 | `no-internet-connection` | HTTP & Network Errors |
| 30 | `connection-lost` | HTTP & Network Errors |
| 31 | `maintenance-mode` | HTTP & Network Errors |
| 32 | `unsuppoerted-browser` | HTTP & Network Errors |
| 33 | `access-denied` | Access & Auth |
| 34 | `login-required` | Access & Auth |
| 35 | `upload-in-progress` | File Transfer & Sync |
| 36 | `download-in-progress` | File Transfer & Sync |
| 37 | `download-upload-failed` | File Transfer & Sync |
| 38 | `no-sync-yet` | File Transfer & Sync |
| 39 | `sync-in-progress` | File Transfer & Sync |
| 40 | `backup-not-setup` | File Transfer & Sync |
| 41 | `backup-completed` | File Transfer & Sync |
| 42 | `add-user` | User Management & HR |
| 43 | `add-users` | User Management & HR |
| 44 | `employee-profile` | User Management & HR |
| 45 | `pay-elements` | User Management & HR |
| 46 | `add-policies` | User Management & HR |
| 47 | `empty-cart` | Commerce & Orders |
| 48 | `no-orders-yet` | Commerce & Orders |
| 49 | `add-order` | Commerce & Orders |
| 50 | `order-summary` | Commerce & Orders |
| 51 | `no-document-found` | Commerce & Orders |
| 52 | `no-job-found` | Commerce & Orders |
| 53 | `tarrif-list` | Commerce & Orders |
| 54 | `tarrif-value` | Commerce & Orders |
| 55 | `booking-summary` | Logistics & Transport |
| 56 | `trip-detail` | Logistics & Transport |
| 57 | `no-trip-selected` | Logistics & Transport |
| 58 | `add-trip-plan` | Logistics & Transport |
| 59 | `scan-order` | Logistics & Transport |
| 60 | `vehicle` | Logistics & Transport |
| 61 | `location` | Logistics & Transport |
| 62 | `equipment` | Logistics & Transport |
| 63 | `trip-plan` | Logistics & Transport |
| 64 | `driver` | Logistics & Transport |
| 65 | `handler` | Logistics & Transport |
| 66 | `agent` | Logistics & Transport |
| 67 | `schedule` | Logistics & Transport |
| 68 | `box` | Packaging & Warehouse |
| 69 | `cardboard-box` | Packaging & Warehouse |
| 70 | `empty-box-1` | Packaging & Warehouse |
| 71 | `empty-box-2` | Packaging & Warehouse |
| 72 | `consignment-1` | Packaging & Warehouse |
| 73 | `consignment-2` | Packaging & Warehouse |
| 74 | `thu` | Packaging & Warehouse |
| 75 | `value-added-services` | Packaging & Warehouse |
| 76 | `scan-consignment` | Packaging & Warehouse |
