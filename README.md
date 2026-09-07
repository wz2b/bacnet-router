# SuperRouter

SuperRouter is an experimental BACnet/IP router and BBMD designed to provide more control over how BACnet traffic moves between IP networks.

Traditional BACnet/IP routing and BBMD arrangements are intentionally simple. That simplicity works well for small systems, but it can become inefficient on large sites where many BACnet networks, BBMDs, Foreign Devices, routers, and building controllers share routing and discovery traffic.

SuperRouter is intended to sit between those systems and make better forwarding decisions.

Rather than blindly repeating every broadcast everywhere, SuperRouter can learn what exists behind each path, selectively forward traffic, answer some discovery requests locally, and expose enough operational information to understand what the BACnet network is actually doing.

The project is written in Go with a React/TypeScript management interface.

---

## What Problem Is SuperRouter Trying to Solve?

Large BACnet/IP systems can accumulate significant amounts of unnecessary traffic.

Typical examples include:

- repeated `Who-Is` discovery broadcasts
- repeated `Who-Is-Router-To-Network` requests
- BBMD broadcast distribution across many IP segments
- Foreign Device traffic being forced through a particular BBMD even when a more direct path is known
- controllers repeatedly rediscovering devices or networks
- COV traffic being forwarded to places where no interested subscriber exists
- large routing tables being propagated into controllers with limited routing capacity

A conventional BBMD generally does not know very much about the traffic it forwards. If a BACnet broadcast arrives, its job is largely to distribute that broadcast according to the configured BDT and FDT.

SuperRouter is intended to maintain more context.

It can learn which BACnet devices and networks are reachable through which remote paths and use that knowledge when deciding whether traffic needs to be forwarded.

The goal is not to change BACnet protocol semantics. The goal is to make smarter decisions about when and where valid BACnet traffic needs to travel.

---

## Conceptual Architecture

SuperRouter can maintain relationships with multiple remote BACnet/IP networks while presenting a smaller and more controlled routing surface to systems such as WebCTRL.

A simplified installation might look like:

```text
                         WebCTRL
                            |
                     Foreign Device
                     Registration
                            |
                            v
                    +---------------+
                    |               |
                    |  SuperRouter  |
                    |               |
                    +---------------+
                     /      |      \
                    /       |       \
                   v        v        v
                BBMD A   BBMD B   BBMD C
                  |        |        |
               BACnet   BACnet   BACnet
               Network  Network  Network
```

SuperRouter does not need to treat every BBMD relationship as one large broadcast domain.

Instead, each relationship is a path through which networks, devices, subscriptions, and traffic can be learned independently.

---

## Major Features

### Multiple BACnet/IP Interfaces

SuperRouter can be configured with one or more local BACnet/IP interfaces.

Each interface has its own:

- bind address
- advertised address
- BACnet/IP UDP port
- Foreign Device Registration policy

Separating the bind address from the advertised address allows future configurations involving NAT, virtual IP addresses, containers, and high-availability systems.

---

### Multiple BBMD Relationships

A SuperRouter instance can communicate with multiple remote BBMDs.

Each BBMD is associated with a specific local BACnet/IP interface and may have its own routing, forwarding, COV, and traffic policies.

A BBMD relationship includes:

- remote address
- local interface
- optional BDT management
- additional BDT entries
- learned and static network information
- COV forwarding policy
- traffic filtering policy

---

### Learned Routing

SuperRouter can learn BACnet network reachability from traffic it observes.

Possible evidence includes:

- `I-Am-Router-To-Network`
- `I-Am`
- routed BACnet traffic
- administratively configured static networks

Learned routes retain their provenance so SuperRouter knows which path produced the information.

This is important for preventing traffic from being reflected back toward the path from which it was learned.

---

### Selective Discovery Forwarding

SuperRouter is intended to reduce unnecessary discovery broadcasts.

For example, if SuperRouter already knows that Device 110609 is reachable through a particular BBMD path, a targeted `Who-Is` does not necessarily need to be broadcast to every connected BACnet network.

Similarly, routing discovery can be answered or forwarded based on known network reachability.

Cache and learned-state responses must obey split-horizon rules. Information learned through a path must not be used to reflect the same traffic back onto that path.

---

### COV-Aware Forwarding

SuperRouter can observe BACnet COV subscriptions and maintain knowledge of which subscribers are interested in which devices or objects.

That information can be used to avoid forwarding COV notifications toward paths where there is no known subscriber.

Static COV forwarding rules can also be configured when traffic must always be forwarded regardless of learned subscription state.

---

### Traffic Policy

Individual BBMD relationships may apply policy to common sources of unnecessary or undesirable BACnet traffic.

Examples include:

- `Who-Is-Router-To-Network` with no target network
- global `Who-Is`
- global `Who-Has`
- unsolicited `I-Am`
- confirmed broadcasts
- wildcard application requests
- excessive discovery traffic

Rate limiting can also be applied to selected BACnet services.

The intent is not to silently repair broken BACnet systems, but to provide an administrative boundary where known pathological behavior can be contained.

---

### Foreign Device Registration

SuperRouter can act as a BACnet Foreign Device Registration server.

Registrations are associated with the local interface on which they were received.

The management interface exposes:

- active registrations
- TTL
- remaining registration lifetime
- registration state
- known networks behind a Foreign Device path
- learned devices
- learned COV subscriptions

---

## BACnet Management Device

SuperRouter may optionally expose itself as a BACnet Device.

This allows existing BACnet supervisory systems to monitor SuperRouter without requiring a separate monitoring integration.

Potential BACnet-visible metrics include:

```text
Router uptime
Active Foreign Device registrations
Known BBMD paths
Learned networks
Learned devices
Learned COV subscriptions

Packets received
Packets forwarded
Broadcasts received
Broadcasts forwarded
Broadcasts suppressed
Routing requests suppressed
COV notifications suppressed
Rate-limited packets
Protocol/decode errors
```

The BACnet management device is intended primarily as a read-only monitoring surface.

Configuration remains controlled through the SuperRouter management API and web interface.

---

## Management Interface

SuperRouter includes a browser-based management application written in React and TypeScript.

Current interface areas include:

```text
Router
  Dashboard

Interfaces
  Interface Settings
  Interface Diagnostics

BBMDs
  Settings
  Routes
  COV
  Traffic Policy
  Diagnostics

Foreign Devices
  Registrations
  Learned Paths
```

The interface is intentionally being developed before the backend configuration API is finalized.

This allows the operational model and configuration workflow to be tested before persistence and REST schemas are locked down.

---

## Configuration Model

The management API is intended to operate on desired configuration rather than exposing the database schema directly.

Conceptually, a client sends the configuration that a SuperRouter should have:

```text
PUT desired configuration
        |
        v
REST configuration layer
        |
        +-- validate
        +-- normalize
        +-- resolve identities
        +-- create missing objects
        +-- update mutable properties
        +-- remove objects no longer present
        |
        v
Persistent configuration
```

Configuration objects may use natural identities such as a BACnet/IP address and UDP port.

The persistence layer may assign internal UUIDs to those objects.

For example, when the configuration contains:

```text
129.21.1.1:47808
```

the server can locate the corresponding persistent interface.

If it exists, its UUID is reused.

If it does not exist, a new interface and UUID are created.

If that address later disappears from the desired configuration, the old persistent interface is removed.

Changing an identity-defining property therefore represents replacement rather than mutation.

This keeps database identity out of the user interface and makes configuration synchronization easier to reason about.

---

## High Availability

The persistence design is intended to support multiple SuperRouter instances and future high-availability configurations.

A database may contain configuration for multiple logical SuperRouters.

Configuration therefore belongs to a specific SuperRouter rather than existing globally.

A future HA deployment may distinguish between:

```text
SuperRouter
    Logical configuration and routing identity

SuperRouter Node
    A particular running process or machine
```

Multiple nodes may consume the same logical SuperRouter configuration.

Persistent UUIDs are internal implementation details and do not need to become part of the user-facing configuration model.

---

## Technology

### Backend

- Go
- `net/http`
- GORM
- PostgreSQL and SQL Server are intended persistence targets
- custom Go BACnet implementation derived from the associated `go-bacnet` work

### Frontend

- React
- TypeScript
- React Router
- SCSS
- Yarn

---

## Repository Layout

```text
bacnet-router/
├── main.go
├── server.go
├── spa.go
├── model/
└── web/
    ├── public/
    └── src/
        ├── api/
        ├── app/
        ├── auth/
        ├── components/
        ├── layouts/
        ├── pages/
        ├── styles/
        ├── types/
        └── utils/
```

---

## Web Development

From the `web` directory:

```bash
yarn install
yarn start
```

The React development server runs on port 3000.

Development API requests are proxied to the Go server on port 8080.

To create the production frontend:

```bash
yarn build
```

The Go application can serve the resulting React application from:

```text
web/build
```

Client-side React routes are handled using SPA fallback behavior.

---

## Authentication

The current application includes a simple local authentication implementation used while the management interface is being developed.

The intended architecture keeps authentication in the Go backend rather than in the React application.

Future authentication mechanisms may include:

- local accounts
- OpenID Connect
- SAML through an appropriate identity integration

React receives authenticated user information through the backend API and does not own authentication credentials or tokens.

---

## Development Status

SuperRouter is currently under active development.

The management UI is being used to establish the configuration and operational model before the REST API and persistence layer are finalized.

Many screens currently contain representative or simulated data.

The current development sequence is intentionally:

```text
User interface and operational model

        ↓

Shared frontend configuration model

        ↓

REST configuration API

        ↓

Persistent data model

        ↓

BACnet routing implementation
```

This prevents database implementation details from defining the product before the desired behavior and management workflow are understood.

---

## Project Philosophy

SuperRouter is not intended to invent a replacement for BACnet routing.

It is intended to understand enough about a BACnet system to avoid doing unnecessary work.

The core principle is:

> Forward traffic where it is needed, preserve BACnet behavior, and avoid propagating traffic merely because a traditional router or BBMD has no better information.

Operational visibility is equally important. A routing device that makes intelligent decisions should also be able to explain what it learned, why a path exists, what traffic it forwarded, and what traffic it intentionally did not forward.