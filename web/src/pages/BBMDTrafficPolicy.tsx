import { useState } from "react";

import FormField from "../components/FormFieldRow";

export default function BBMDTrafficPolicy() {
    const [
        blockWhoIsRouterToAll,
        setBlockWhoIsRouterToAll,
    ] = useState(true);

    const [
        blockTargetedWhoIsRouter,
        setBlockTargetedWhoIsRouter,
    ] = useState(false);

    const [
        blockGlobalWhoIs,
        setBlockGlobalWhoIs,
    ] = useState(false);

    const [
        blockGlobalWhoHas,
        setBlockGlobalWhoHas,
    ] = useState(false);

    const [
        blockIAm,
        setBlockIAm,
    ] = useState(false);

    const [
        blockIHave,
        setBlockIHave,
    ] = useState(false);

    const [
        blockConfirmedGlobalBroadcasts,
        setBlockConfirmedGlobalBroadcasts,
    ] = useState(true);

    const [
        blockConfirmedLocalBroadcasts,
        setBlockConfirmedLocalBroadcasts,
    ] = useState(true);

    const [
        blockWildcardTargets,
        setBlockWildcardTargets,
    ] = useState(true);

    const [
        rateLimitWhoIs,
        setRateLimitWhoIs,
    ] = useState(false);

    const [
        whoIsLimit,
        setWhoIsLimit,
    ] = useState(20);

    const [
        rateLimitWhoIsRouter,
        setRateLimitWhoIsRouter,
    ] = useState(false);

    const [
        whoIsRouterLimit,
        setWhoIsRouterLimit,
    ] = useState(10);

    return (
        <div className="page">
            <h2>Traffic Policy</h2>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Routing Control Traffic</h2>

                    <div className="settings-group-description">
                        Control which BACnet routing discovery messages
                        are allowed to propagate through this BBMD path.
                    </div>
                </div>

                <div className="settings-group-body">
                    <FormField
                        label="Block Who-Is-Router-To-All"
                        hint="Do not propagate untargeted Who-Is-Router-To-Network requests."
                        help={
                            <>
                                <p>
                                    A Who-Is-Router-To-Network request with no
                                    specific destination network effectively asks
                                    routers to advertise every network they can
                                    reach.
                                </p>

                                <p>
                                    On a large BACnet internetwork this can
                                    generate substantial routing traffic and
                                    expose a very large routing table.
                                </p>

                                <p>
                                    Enabling this setting does not prevent
                                    targeted requests for a specific network.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={blockWhoIsRouterToAll}
                            onChange={(event) =>
                                setBlockWhoIsRouterToAll(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Block Targeted Who-Is-Router"
                        hint="Do not propagate Who-Is-Router-To-Network requests even when a specific network is requested."
                        help={
                            <>
                                <p>
                                    Targeted routing requests ask for reachability
                                    to one specific BACnet network and are
                                    generally much less disruptive than
                                    untargeted requests.
                                </p>

                                <p>
                                    This option should normally remain disabled
                                    unless the path is intentionally isolated
                                    from routing discovery.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={blockTargetedWhoIsRouter}
                            onChange={(event) =>
                                setBlockTargetedWhoIsRouter(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>
                </div>
            </section>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Discovery Traffic</h2>

                    <div className="settings-group-description">
                        Control propagation of common BACnet discovery
                        broadcasts.
                    </div>
                </div>

                <div className="settings-group-body">
                    <FormField
                        label="Block Global Who-Is"
                        hint="Do not propagate global Who-Is requests through this path."
                        help={
                            <>
                                <p>
                                    Who-Is is a normal BACnet device discovery
                                    mechanism. Blocking it can reduce broadcast
                                    traffic but may prevent devices and management
                                    systems from discovering remote devices.
                                </p>

                                <p>
                                    This should normally remain disabled unless
                                    discovery behavior is deliberately being
                                    restricted.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={blockGlobalWhoIs}
                            onChange={(event) =>
                                setBlockGlobalWhoIs(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Block Global Who-Has"
                        hint="Do not propagate global Who-Has requests through this path."
                        help={
                            <>
                                <p>
                                    Who-Has requests search for BACnet objects
                                    by object identifier or object name.
                                </p>

                                <p>
                                    These broadcasts are legitimate but can
                                    generate significant traffic when issued
                                    frequently across a large internetwork.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={blockGlobalWhoHas}
                            onChange={(event) =>
                                setBlockGlobalWhoHas(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Block I-Am"
                        hint="Do not propagate I-Am device announcements through this path."
                        help={
                            <>
                                <p>
                                    I-Am messages are used to announce BACnet
                                    device identity and are commonly generated
                                    in response to Who-Is.
                                </p>

                                <p>
                                    Blocking them can prevent remote device
                                    discovery and may also reduce the routing
                                    information available to SuperRouter.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={blockIAm}
                            onChange={(event) =>
                                setBlockIAm(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Block I-Have"
                        hint="Do not propagate I-Have object discovery responses through this path."
                        help={
                            <>
                                <p>
                                    I-Have messages are responses to Who-Has
                                    discovery requests and identify devices that
                                    contain matching BACnet objects.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={blockIHave}
                            onChange={(event) =>
                                setBlockIHave(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>
                </div>
            </section>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Broadcast Safety</h2>

                    <div className="settings-group-description">
                        Block request patterns that are likely to create
                        excessive or ambiguous BACnet traffic.
                    </div>
                </div>

                <div className="settings-group-body">
                    <FormField
                        label="Block Confirmed Global Broadcasts"
                        hint="Drop confirmed BACnet requests addressed to a global broadcast destination."
                        help={
                            <>
                                <p>
                                    Confirmed BACnet services expect a response
                                    associated with a specific invoke ID.
                                </p>

                                <p>
                                    Sending a confirmed request to a global
                                    broadcast destination can cause many devices
                                    to attempt to respond to the same request.
                                </p>

                                <p>
                                    Services such as ReadProperty,
                                    WriteProperty, and SubscribeCOV should
                                    normally target a specific device.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={blockConfirmedGlobalBroadcasts}
                            onChange={(event) =>
                                setBlockConfirmedGlobalBroadcasts(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Block Confirmed Local Broadcasts"
                        hint="Drop confirmed BACnet requests addressed to a local broadcast destination."
                        help={
                            <>
                                <p>
                                    A local broadcast limits the scope of the
                                    request to one BACnet network, but confirmed
                                    services still expect a response from a
                                    single peer.
                                </p>

                                <p>
                                    Blocking these requests prevents malformed
                                    or poorly configured applications from
                                    generating response storms.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={blockConfirmedLocalBroadcasts}
                            onChange={(event) =>
                                setBlockConfirmedLocalBroadcasts(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>
                </div>
            </section>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Application Safety</h2>

                    <div className="settings-group-description">
                        Inspect BACnet service contents for unsafe or
                        nonsensical target values.
                    </div>
                </div>

                <div className="settings-group-body">
                    <FormField
                        label="Block Wildcard Targets"
                        hint="Block supported requests that use a wildcard device or object instance where a concrete target is required."
                        help={
                            <>
                                <p>
                                    BACnet reserves special maximum instance
                                    values for wildcard or unspecified object
                                    identifiers in some contexts.
                                </p>

                                <p>
                                    A request such as ReadProperty or
                                    SubscribeCOV should normally identify a
                                    specific destination object. Using a
                                    wildcard target can result in excessive,
                                    ambiguous, or invalid traffic.
                                </p>

                                <p>
                                    SuperRouter can inspect supported service
                                    payloads and suppress requests that use a
                                    wildcard identifier where a concrete device
                                    or object is expected.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={blockWildcardTargets}
                            onChange={(event) =>
                                setBlockWildcardTargets(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>
                </div>
            </section>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Rate Limiting</h2>

                    <div className="settings-group-description">
                        Limit repetitive discovery traffic without
                        blocking the service entirely.
                    </div>
                </div>

                <div className="settings-group-body">
                    <FormField
                        label="Rate Limit Who-Is"
                        hint="Limit the number of Who-Is requests accepted from a single source."
                        help={
                            <>
                                <p>
                                    Rate limiting can suppress malfunctioning
                                    or overly aggressive discovery clients while
                                    still allowing normal BACnet discovery.
                                </p>

                                <p>
                                    The limit is applied per source over a
                                    rolling sixty-second interval.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={rateLimitWhoIs}
                            onChange={(event) =>
                                setRateLimitWhoIs(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Who-Is Limit"
                        hint="Maximum Who-Is requests permitted per source every 60 seconds."
                    >
                        <input
                            type="number"
                            min={1}
                            max={10000}
                            value={whoIsLimit}
                            disabled={!rateLimitWhoIs}
                            onChange={(event) =>
                                setWhoIsLimit(
                                    Number(event.target.value),
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Rate Limit Who-Is-Router"
                        hint="Limit repeated Who-Is-Router-To-Network requests from a single source."
                        help={
                            <>
                                <p>
                                    Routing discovery can become particularly
                                    expensive when repeated rapidly across a
                                    large BACnet internetwork.
                                </p>

                                <p>
                                    Targeted requests remain useful, but a
                                    malfunctioning device should not be allowed
                                    to continuously trigger routing discovery.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={rateLimitWhoIsRouter}
                            onChange={(event) =>
                                setRateLimitWhoIsRouter(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Who-Is-Router Limit"
                        hint="Maximum routing discovery requests permitted per source every 60 seconds."
                    >
                        <input
                            type="number"
                            min={1}
                            max={10000}
                            value={whoIsRouterLimit}
                            disabled={!rateLimitWhoIsRouter}
                            onChange={(event) =>
                                setWhoIsRouterLimit(
                                    Number(event.target.value),
                                )
                            }
                        />
                    </FormField>
                </div>
            </section>
        </div>
    );
}