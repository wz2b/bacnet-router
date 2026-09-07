import { useState } from "react";

import FormField from "../components/FormFieldRow";

interface LearnedRoute {
    network: number;
    source: string;
    lastSeen: string;
}

const sampleRoutes: LearnedRoute[] = [
    {
        network: 2493,
        source: "I-Am",
        lastSeen: "12 seconds ago",
    },
    {
        network: 7132,
        source: "Routed traffic",
        lastSeen: "3 minutes ago",
    },
    {
        network: 200,
        source: "Router advertisement",
        lastSeen: "8 minutes ago",
    },
];

export default function BBMDRoutesPage() {
    const [
        learnFromRouterAdvertisements,
        setLearnFromRouterAdvertisements,
    ] = useState(true);

    const [
        learnFromIAm,
        setLearnFromIAm,
    ] = useState(true);

    const [
        learnFromTraffic,
        setLearnFromTraffic,
    ] = useState(false);

    const [
        answerTargetedRouteRequests,
        setAnswerTargetedRouteRequests,
    ] = useState(true);

    const [
        answerUntargetedRouteRequests,
        setAnswerUntargetedRouteRequests,
    ] = useState(false);

    const [
        splitHorizon,
        setSplitHorizon,
    ] = useState(true);

    const handleClearLearnedRoutes = () => {
        // TODO: DELETE learned routes through backend.
        console.log("clear learned routes");
    };

    return (
        <div className="page">
            <h2>Routes</h2>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Route Learning</h2>

                    <div className="settings-group-description">
                        Control how SuperRouter discovers BACnet
                        networks reachable through this BBMD.
                    </div>
                </div>

                <div className="settings-group-body">
                    <FormField
                        label="Learn from Router Advertisements"
                        hint="Learn networks explicitly advertised by BACnet routers reachable through this path."
                        help={
                            <>
                                <p>
                                    BACnet router messages such as
                                    I-Am-Router-To-Network directly advertise
                                    network reachability.
                                </p>

                                <p>
                                    These messages provide stronger routing
                                    information than inferring reachability
                                    from ordinary device traffic.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={learnFromRouterAdvertisements}
                            onChange={(event) =>
                                setLearnFromRouterAdvertisements(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Learn from I-Am"
                        hint="Learn source networks from I-Am messages received through this path."
                        help={
                            <>
                                <p>
                                    When an I-Am message is received from
                                    a routed BACnet device, its source network
                                    provides evidence that the network is
                                    reachable through this BBMD path.
                                </p>

                                <p>
                                    This is conservative passive route
                                    discovery, but quiet networks may not be
                                    discovered until a device sends an I-Am.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={learnFromIAm}
                            onChange={(event) =>
                                setLearnFromIAm(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Learn from Traffic"
                        hint="Learn source networks from any routed BACnet message observed through this path."
                        help={
                            <>
                                <p>
                                    When enabled, SuperRouter learns a network
                                    whenever routed traffic containing a source
                                    network is observed through this BBMD path.
                                </p>

                                <p>
                                    This can discover networks more quickly
                                    than relying only on explicit router
                                    advertisements or I-Am messages, but it is
                                    the broadest route-learning policy.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={learnFromTraffic}
                            onChange={(event) =>
                                setLearnFromTraffic(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <div className="button-row">
                        <button
                            type="button"
                            className="button"
                            onClick={handleClearLearnedRoutes}
                        >
                            Clear Learned Routes
                        </button>
                    </div>
                </div>
            </section>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Route Export Policy</h2>

                    <div className="settings-group-description">
                        Control which known routes SuperRouter advertises
                        toward this BBMD path.
                    </div>
                </div>

                <div className="settings-group-body">
                    <FormField
                        label="Answer Targeted Route Requests"
                        hint="Answer Who-Is-Router-To-Network requests for specific networks known to SuperRouter."
                        help={
                            <>
                                <p>
                                    When a device reachable through this BBMD
                                    asks for a specific BACnet network,
                                    SuperRouter may respond with
                                    I-Am-Router-To-Network if it has a valid
                                    route to that network.
                                </p>

                                <p>
                                    This allows devices to discover routes
                                    without causing SuperRouter to advertise
                                    its entire routing table.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={answerTargetedRouteRequests}
                            onChange={(event) =>
                                setAnswerTargetedRouteRequests(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Answer Untargeted Route Requests"
                        hint="Advertise known networks in response to an untargeted Who-Is-Router-To-Network request."
                        help={
                            <>
                                <p>
                                    An untargeted Who-Is-Router-To-Network
                                    request asks routers to advertise the
                                    networks they can reach.
                                </p>

                                <p>
                                    Enabling this can expose a large number of
                                    learned networks and generate substantially
                                    more routing traffic.
                                </p>

                                <p>
                                    For a SuperRouter with a large internal
                                    routing table, leaving this disabled is
                                    generally preferable.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={answerUntargetedRouteRequests}
                            onChange={(event) =>
                                setAnswerUntargetedRouteRequests(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Split Horizon"
                        hint="Do not advertise a learned route back toward the path from which it was learned."
                        help={
                            <>
                                <p>
                                    If network 2493 was learned through this
                                    BBMD, SuperRouter will not advertise
                                    network 2493 back toward this same BBMD.
                                </p>

                                <p>
                                    This prevents useless route advertisements
                                    and reduces the possibility of routing
                                    loops or misleading reachability
                                    information.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={splitHorizon}
                            onChange={(event) =>
                                setSplitHorizon(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>
                </div>
            </section>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Learned Routes</h2>

                    <div className="settings-group-description">
                        Networks currently known to be reachable
                        through this BBMD path.
                    </div>
                </div>

                <div className="settings-group-body">
                    <div className="table-container">
                        <table>
                            <thead>
                            <tr>
                                <th>Network</th>
                                <th>Learned From</th>
                                <th>Last Seen</th>
                            </tr>
                            </thead>

                            <tbody>
                            {sampleRoutes.map((route) => (
                                <tr key={route.network}>
                                    <td>{route.network}</td>
                                    <td>{route.source}</td>
                                    <td>{route.lastSeen}</td>
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