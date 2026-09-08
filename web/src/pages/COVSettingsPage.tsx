import { useState } from "react";

type RefreshScope = "source-path" | "subscriber-paths";

interface COVOptimizationRule {
    id: number;
    enabled: boolean;
    path: string;
    deviceInstance?: number;
    objectType?: string;
    objectInstance?: number;
    refreshWindowSeconds: number;
    refreshScope: RefreshScope;
}

const sampleRules: COVOptimizationRule[] = [
    {
        id: 1,
        enabled: true,
        path: "Any",
        deviceInstance: 110609,
        objectType: "Analog Value",
        objectInstance: 12,
        refreshWindowSeconds: 10,
        refreshScope: "source-path",
    },
    {
        id: 2,
        enabled: true,
        path: "Any",
        deviceInstance: 110609,
        objectType: "Analog Value",
        objectInstance: 14,
        refreshWindowSeconds: 10,
        refreshScope: "source-path",
    },
    {
        id: 3,
        enabled: true,
        path: "BBMD 1",
        refreshWindowSeconds: 1,
        refreshScope: "source-path",
    },
];

function formatRuleObject(rule: COVOptimizationRule): string {
    if (!rule.objectType) {
        return "*";
    }

    if (rule.objectInstance === undefined) {
        return rule.objectType;
    }

    return `${rule.objectType} ${rule.objectInstance}`;
}

export default function COVSettingsPage() {
    const [rules, setRules] =
        useState<COVOptimizationRule[]>(sampleRules);
    const [showEditor, setShowEditor] = useState(false);

    const toggleRule = (id: number) => {
        setRules((current) =>
            current.map((rule) =>
                rule.id === id
                    ? {
                        ...rule,
                        enabled: !rule.enabled,
                    }
                    : rule,
            ),
        );
    };

    const deleteRule = (id: number) => {
        setRules((current) =>
            current.filter((rule) => rule.id !== id),
        );
    };

    return (
        <div className="page">
            <div className="cov-page-header">
                <div>
                    <h2>Settings</h2>

                    <div className="cov-page-description">
                        Configure how SuperRouter identifies and
                        coalesces subscription-refresh COV
                        notifications. Actual value changes are
                        forwarded immediately.
                    </div>
                </div>

                <button
                    type="button"
                    className="button button-primary"
                    onClick={() => setShowEditor(true)}
                >
                    Add Rule
                </button>
            </div>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Optimization Rules</h2>

                    <div className="settings-group-description">
                        Rules may apply globally or to a specific
                        BBMD/path, device, or BACnet object.
                        More-specific rules take precedence over
                        broader rules.
                    </div>
                </div>

                <div className="settings-group-body">
                    {rules.length === 0 ? (
                        <div className="cov-empty">
                            No COV optimization rules configured.
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>Enabled</th>
                                    <th>Path</th>
                                    <th>Device</th>
                                    <th>Object</th>
                                    <th>Refresh Window</th>
                                    <th>Refresh Forwarding</th>
                                    <th />
                                </tr>
                                </thead>

                                <tbody>
                                {rules.map((rule) => (
                                    <tr key={rule.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={rule.enabled}
                                                onChange={() =>
                                                    toggleRule(
                                                        rule.id,
                                                    )
                                                }
                                            />
                                        </td>

                                        <td>
                                            {rule.path}
                                        </td>

                                        <td>
                                            {rule.deviceInstance ??
                                                "*"}
                                        </td>

                                        <td>
                                            {formatRuleObject(
                                                rule,
                                            )}
                                        </td>

                                        <td>
                                            {
                                                rule.refreshWindowSeconds
                                            }{" "}
                                            sec
                                        </td>

                                        <td>
                                            <span className="status">
                                                {rule.refreshScope ===
                                                "source-path"
                                                    ? "Subscribing path only"
                                                    : "All subscriber paths"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="cov-row-actions">
                                                <button
                                                    type="button"
                                                    className="cov-link-button"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="cov-link-button danger"
                                                    onClick={() =>
                                                        deleteRule(
                                                            rule.id,
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {showEditor && (
                        <div className="cov-editor">
                            <div className="cov-form-grid">
                                <div className="cov-field">
                                    <label htmlFor="cov-path">
                                        BBMD / Path
                                    </label>

                                    <select
                                        id="cov-path"
                                        defaultValue="Any"
                                    >
                                        <option>Any</option>
                                        <option>BBMD 1</option>
                                        <option>BBMD 2</option>
                                    </select>

                                    <small>
                                        Limit the rule to one
                                        forwarding path, or apply it
                                        to all paths.
                                    </small>
                                </div>

                                <div className="cov-field">
                                    <label htmlFor="cov-device">
                                        Device Instance
                                    </label>

                                    <input
                                        id="cov-device"
                                        placeholder="*"
                                    />

                                    <small>
                                        Leave blank or use * for any
                                        device.
                                    </small>
                                </div>

                                <div className="cov-field">
                                    <label htmlFor="cov-object-type">
                                        Object Type
                                    </label>

                                    <select
                                        id="cov-object-type"
                                        defaultValue="Any"
                                    >
                                        <option>Any</option>
                                        <option>
                                            Analog Input
                                        </option>
                                        <option>
                                            Analog Value
                                        </option>
                                        <option>
                                            Binary Input
                                        </option>
                                        <option>
                                            Binary Value
                                        </option>
                                        <option>
                                            Multi-state Input
                                        </option>
                                        <option>
                                            Multi-state Value
                                        </option>
                                    </select>
                                </div>

                                <div className="cov-field">
                                    <label htmlFor="cov-object-instance">
                                        Object Instance
                                    </label>

                                    <input
                                        id="cov-object-instance"
                                        placeholder="*"
                                    />
                                </div>

                                <div className="cov-field">
                                    <label htmlFor="cov-window">
                                        Refresh Coalescing Window
                                    </label>

                                    <input
                                        id="cov-window"
                                        type="number"
                                        min={0}
                                        step={1}
                                        defaultValue={10}
                                    />

                                    <small>
                                        Seconds to collect redundant
                                        refresh notifications before
                                        forwarding one representative
                                        notification.
                                    </small>
                                </div>

                                <div className="cov-field">
                                    <label htmlFor="cov-scope">
                                        Refresh Forwarding
                                    </label>

                                    <select
                                        id="cov-scope"
                                        defaultValue="source-path"
                                    >
                                        <option value="source-path">
                                            Subscribing path only
                                        </option>
                                        <option value="subscriber-paths">
                                            All paths with active
                                            subscribers
                                        </option>
                                    </select>

                                    <small>
                                        Actual value changes are
                                        always forwarded immediately
                                        to paths with active
                                        subscribers.
                                    </small>
                                </div>
                            </div>

                            <div className="cov-form-actions">
                                <button
                                    type="button"
                                    className="button"
                                    onClick={() =>
                                        setShowEditor(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="button button-primary"
                                    onClick={() =>
                                        setShowEditor(false)
                                    }
                                >
                                    Save Rule
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="cov-note">
                        Safety rule: if the value or status changes
                        while a refresh coalescing window is open,
                        treat it as a real COV and forward it
                        immediately. Optimization should fail open
                        whenever classification is uncertain.
                    </div>
                </div>
            </section>
        </div>
    );
}
