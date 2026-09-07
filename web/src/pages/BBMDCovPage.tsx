import { useState } from "react";

import FormField from "../components/FormFieldRow";

interface LearnedSubscription {
    subscriberDevice: number;
    sourceDevice: number;
    objectType: string;
    objectInstance: number;
    processId: number;
    expires: string;
    lastSeen: string;
}

interface StaticCOVForwardRule {
    id: number;
    deviceInstance: number;
    objectType: string;
    objectInstance: number;
}

const sampleSubscriptions: LearnedSubscription[] = [
    {
        subscriberDevice: 240341,
        sourceDevice: 110609,
        objectType: "Analog Input",
        objectInstance: 12,
        processId: 17,
        expires: "14m 23s",
        lastSeen: "8 seconds ago",
    },
    {
        subscriberDevice: 241436,
        sourceDevice: 80505,
        objectType: "Analog Value",
        objectInstance: 26,
        processId: 3,
        expires: "18m 01s",
        lastSeen: "2 minutes ago",
    },
];

const sampleStaticRules: StaticCOVForwardRule[] = [
    {
        id: 1,
        deviceInstance: 110609,
        objectType: "Analog Input",
        objectInstance: 12,
    },
];

export default function BBMDCovPage() {
    const [
        learnSubscriptions,
        setLearnSubscriptions,
    ] = useState(true);

    const [
        filterCOV,
        setFilterCOV,
    ] = useState(true);

    const [
        forwardUnknownCOV,
        setForwardUnknownCOV,
    ] = useState(false);

    const handleClearLearnedSubscriptions = () => {
        // TODO: DELETE learned subscriptions through backend.
        console.log("clear learned COV subscriptions");
    };

    const handleAddStaticRule = () => {
        // TODO: Open add-rule editor/dialog.
        console.log("add static COV forwarding rule");
    };

    const handleDeleteStaticRule = (
        ruleId: number,
    ) => {
        // TODO: DELETE static rule through backend.
        console.log(
            "delete static COV forwarding rule",
            ruleId,
        );
    };

    return (
        <div className="page">
            <h2>COV</h2>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>COV Forwarding Policy</h2>

                    <div className="settings-group-description">
                        Control how SuperRouter learns COV subscription
                        interest and forwards COV notifications toward
                        this BBMD path.
                    </div>
                </div>

                <div className="settings-group-body">
                    <FormField
                        label="Learn Subscriptions"
                        hint="Track COV subscriptions observed from devices reachable through this path."
                        help={
                            <>
                                <p>
                                    When enabled, SuperRouter records
                                    SubscribeCOV requests originating from
                                    devices reachable through this BBMD.
                                </p>

                                <p>
                                    The learned subscription state allows
                                    SuperRouter to determine which COV
                                    notifications are actually needed on
                                    this path.
                                </p>

                                <p>
                                    Subscription lifetime, process identifier,
                                    source device, object, and subscriber
                                    information are retained so the learned
                                    state can expire along with the BACnet
                                    subscription.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={learnSubscriptions}
                            onChange={(event) =>
                                setLearnSubscriptions(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Filter COV Notifications"
                        hint="Forward COV notifications toward this path only when there is matching subscription interest."
                        help={
                            <>
                                <p>
                                    When enabled, SuperRouter uses its learned
                                    subscription state and static forwarding
                                    rules to determine whether a COV
                                    notification should be forwarded toward
                                    this BBMD.
                                </p>

                                <p>
                                    If no device reachable through this path
                                    has requested the affected object, and no
                                    static rule matches it, the notification
                                    is not forwarded.
                                </p>

                                <p>
                                    This can substantially reduce unnecessary
                                    BACnet traffic on paths that would
                                    otherwise receive COV traffic for objects
                                    that no local consumer uses.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={filterCOV}
                            onChange={(event) =>
                                setFilterCOV(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Forward Unknown COV"
                        hint="Forward COV notifications when subscription state is unavailable or inconclusive."
                        help={
                            <>
                                <p>
                                    This controls the fallback behavior when
                                    SuperRouter cannot determine whether a
                                    COV notification is needed on this path.
                                </p>

                                <p>
                                    When enabled, unknown notifications are
                                    forwarded. This is a fail-open policy
                                    that favors compatibility over traffic
                                    reduction.
                                </p>

                                <p>
                                    When disabled, unknown notifications are
                                    suppressed while COV filtering is enabled.
                                    This provides stronger traffic reduction,
                                    but depends on accurate subscription
                                    learning and persisted state.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={forwardUnknownCOV}
                            onChange={(event) =>
                                setForwardUnknownCOV(
                                    event.target.checked,
                                )
                            }
                            disabled={!filterCOV}
                        />
                    </FormField>
                </div>
            </section>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Learned Subscriptions</h2>

                    <div className="settings-group-description">
                        COV subscriptions currently known to originate
                        from devices reachable through this BBMD path.
                    </div>
                </div>

                <div className="settings-group-body">
                    <div className="table-container">
                        <table>
                            <thead>
                            <tr>
                                <th>Subscriber</th>
                                <th>Source Device</th>
                                <th>Object</th>
                                <th>Process ID</th>
                                <th>Expires</th>
                                <th>Last Seen</th>
                            </tr>
                            </thead>

                            <tbody>
                            {sampleSubscriptions.map(
                                (subscription) => (
                                    <tr
                                        key={
                                            `${subscription.subscriberDevice}-` +
                                            `${subscription.sourceDevice}-` +
                                            `${subscription.objectType}-` +
                                            `${subscription.objectInstance}-` +
                                            `${subscription.processId}`
                                        }
                                    >
                                        <td>
                                            {
                                                subscription
                                                    .subscriberDevice
                                            }
                                        </td>

                                        <td>
                                            {
                                                subscription
                                                    .sourceDevice
                                            }
                                        </td>

                                        <td>
                                            {
                                                subscription.objectType
                                            }:
                                            {
                                                subscription
                                                    .objectInstance
                                            }
                                        </td>

                                        <td>
                                            {
                                                subscription.processId
                                            }
                                        </td>

                                        <td>
                                            {
                                                subscription.expires
                                            }
                                        </td>

                                        <td>
                                            {
                                                subscription.lastSeen
                                            }
                                        </td>
                                    </tr>
                                ),
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="button-row">
                        <button
                            type="button"
                            className="button"
                            onClick={
                                handleClearLearnedSubscriptions
                            }
                        >
                            Clear Learned Subscriptions
                        </button>
                    </div>
                </div>
            </section>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Static COV Forward Rules</h2>

                    <div className="settings-group-description">
                        Always permit matching COV notifications to be
                        forwarded toward this BBMD, even when no learned
                        subscription currently exists.
                    </div>
                </div>

                <div className="settings-group-body">
                    <div className="table-container">
                        <table>
                            <thead>
                            <tr>
                                <th>Device</th>
                                <th>Object Type</th>
                                <th>Object Instance</th>
                                <th></th>
                            </tr>
                            </thead>

                            <tbody>
                            {sampleStaticRules.map((rule) => (
                                <tr key={rule.id}>
                                    <td>
                                        {rule.deviceInstance}
                                    </td>

                                    <td>
                                        {rule.objectType}
                                    </td>

                                    <td>
                                        {rule.objectInstance}
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            className="button"
                                            onClick={() =>
                                                handleDeleteStaticRule(
                                                    rule.id,
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="button-row">
                        <button
                            type="button"
                            className="button"
                            onClick={handleAddStaticRule}
                        >
                            Add Static Rule
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}