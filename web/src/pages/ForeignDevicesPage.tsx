interface Registration {
    address: string;
    interfaceName: string;
    ttl: number;
    expiresIn: string;
    registered: string;
    status: "Active" | "Grace";
}

interface ForeignDevicePath {
    address: string;
    interfaceName: string;
    networks: number;
    devices: number;
    subscriptions: number;
    lastSeen: string;
}

const registrations: Registration[] = [
    {
        address: "10.7.6.148:47808",
        interfaceName: "BACnet Primary",
        ttl: 600,
        expiresIn: "7m 52s",
        registered: "8m 21s ago",
        status: "Active",
    },
    {
        address: "10.7.4.208:47808",
        interfaceName: "BACnet Primary",
        ttl: 600,
        expiresIn: "5m 14s",
        registered: "10m 43s ago",
        status: "Active",
    },
    {
        address: "10.7.5.108:47808",
        interfaceName: "BACnet Secondary",
        ttl: 300,
        expiresIn: "1m 08s",
        registered: "4m 11s ago",
        status: "Active",
    },
    {
        address: "10.7.9.17:47808",
        interfaceName: "BACnet Primary",
        ttl: 600,
        expiresIn: "Grace",
        registered: "12m 32s ago",
        status: "Grace",
    },
];

const paths: ForeignDevicePath[] = [
    {
        address: "10.7.6.148:47808",
        interfaceName: "BACnet Primary",
        networks: 14,
        devices: 83,
        subscriptions: 27,
        lastSeen: "3 seconds ago",
    },
    {
        address: "10.7.4.208:47808",
        interfaceName: "BACnet Primary",
        networks: 8,
        devices: 41,
        subscriptions: 12,
        lastSeen: "11 seconds ago",
    },
    {
        address: "10.7.5.108:47808",
        interfaceName: "BACnet Secondary",
        networks: 3,
        devices: 17,
        subscriptions: 4,
        lastSeen: "42 seconds ago",
    },
    {
        address: "10.7.9.17:47808",
        interfaceName: "BACnet Primary",
        networks: 6,
        devices: 29,
        subscriptions: 8,
        lastSeen: "2 minutes ago",
    },
];

export default function ForeignDevicesPage() {
    const activeRegistrations = registrations.filter(
        (registration) => registration.status === "Active",
    ).length;

    const graceRegistrations = registrations.filter(
        (registration) => registration.status === "Grace",
    ).length;

    return (
        <div className="page">
            <h2>Foreign Devices</h2>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">
                        {activeRegistrations}
                    </div>

                    <div className="stat-label">
                        Active Registrations
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">
                        {graceRegistrations}
                    </div>

                    <div className="stat-label">
                        Grace Period
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">
                        {paths.length}
                    </div>

                    <div className="stat-label">
                        Known Paths
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-value">
                        {paths.reduce(
                            (total, path) =>
                                total + path.devices,
                            0,
                        )}
                    </div>

                    <div className="stat-label">
                        Learned Devices
                    </div>
                </div>
            </div>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Active Registrations</h2>

                    <div className="settings-group-description">
                        BACnet/IP foreign devices currently registered
                        with SuperRouter interfaces.
                    </div>
                </div>

                <div className="settings-group-body">
                    <div className="table-container">
                        <table>
                            <thead>
                            <tr>
                                <th>Address</th>
                                <th>Interface</th>
                                <th>TTL</th>
                                <th>Expires</th>
                                <th>Registered</th>
                                <th>Status</th>
                            </tr>
                            </thead>

                            <tbody>
                            {registrations.map(
                                (registration) => (
                                    <tr
                                        key={
                                            registration.address
                                        }
                                    >
                                        <td>
                                            <code>
                                                {
                                                    registration.address
                                                }
                                            </code>
                                        </td>

                                        <td>
                                            {
                                                registration.interfaceName
                                            }
                                        </td>

                                        <td>
                                            {
                                                registration.ttl
                                            } s
                                        </td>

                                        <td>
                                            {
                                                registration.expiresIn
                                            }
                                        </td>

                                        <td>
                                            {
                                                registration.registered
                                            }
                                        </td>

                                        <td>
                                                <span className="status">
                                                    {
                                                        registration.status
                                                    }
                                                </span>
                                        </td>
                                    </tr>
                                ),
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Known Foreign Device Paths</h2>

                    <div className="settings-group-description">
                        Persistent routing and subscription knowledge
                        learned through foreign devices, including paths
                        whose current registration may have expired.
                    </div>
                </div>

                <div className="settings-group-body">
                    <div className="table-container">
                        <table>
                            <thead>
                            <tr>
                                <th>Address</th>
                                <th>Interface</th>
                                <th>Networks</th>
                                <th>Devices</th>
                                <th>COV Subscriptions</th>
                                <th>Last Seen</th>
                            </tr>
                            </thead>

                            <tbody>
                            {paths.map((path) => (
                                <tr key={path.address}>
                                    <td>
                                        <code>
                                            {path.address}
                                        </code>
                                    </td>

                                    <td>
                                        {
                                            path.interfaceName
                                        }
                                    </td>

                                    <td>
                                        {path.networks}
                                    </td>

                                    <td>
                                        {path.devices}
                                    </td>

                                    <td>
                                        {
                                            path.subscriptions
                                        }
                                    </td>

                                    <td>
                                        {path.lastSeen}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}