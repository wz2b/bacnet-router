import {
    type ChangeEvent,
    useState,
} from "react";

import FormField from "../components/FormFieldRow";

import {
    isIPv4AddressInput,
    isValidIPv4Address,
} from "../utils/network";

type FDRAcceptMode = "all" | "allow-list";

export default function InterfaceSettingsPage() {
    const [name, setName] = useState("");

    const [bindAddress, setBindAddress] = useState("");
    const [bindAddressTouched, setBindAddressTouched] =
        useState(false);

    const [advertiseAddress, setAdvertiseAddress] =
        useState("");
    const [
        advertiseAddressTouched,
        setAdvertiseAddressTouched,
    ] = useState(false);

    const [port, setPort] = useState(47808);

    const [acceptFDRs, setAcceptFDRs] =
        useState(false);

    const [fdrAcceptMode, setFDRAcceptMode] =
        useState<FDRAcceptMode>("all");

    const [fdrAllowList, setFDRAllowList] =
        useState<string[]>([]);

    const [newFDRAddress, setNewFDRAddress] =
        useState("");

    const [newFDRAddressTouched, setNewFDRAddressTouched] =
        useState(false);

    /*
     * Our existing validator accepts an optional :port.
     *
     * For local bind/advertise addresses, we don't want a port
     * because Port is configured separately.
     */
    const isValidLocalAddress = (
        value: string,
    ): boolean => {
        return (
            value !== "" &&
            !value.includes(":") &&
            isValidIPv4Address(value)
        );
    };

    const bindAddressHasError =
        bindAddressTouched &&
        !isValidLocalAddress(bindAddress);

    const advertiseAddressHasError =
        advertiseAddressTouched &&
        !isValidLocalAddress(advertiseAddress);

    const newFDRAddressHasError =
        newFDRAddressTouched &&
        !isValidIPv4Address(newFDRAddress);

    const handleBindAddressChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value;

        if (
            isIPv4AddressInput(value) &&
            !value.includes(":")
        ) {
            setBindAddress(value);
        }
    };

    const handleAdvertiseAddressChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value;

        if (
            isIPv4AddressInput(value) &&
            !value.includes(":")
        ) {
            setAdvertiseAddress(value);
        }
    };

    const handleNewFDRAddressChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value;

        if (isIPv4AddressInput(value)) {
            setNewFDRAddress(value);
        }
    };

    const handleAddFDRAddress = () => {
        setNewFDRAddressTouched(true);

        if (!isValidIPv4Address(newFDRAddress)) {
            return;
        }

        if (fdrAllowList.includes(newFDRAddress)) {
            return;
        }

        setFDRAllowList([
            ...fdrAllowList,
            newFDRAddress,
        ]);

        setNewFDRAddress("");
        setNewFDRAddressTouched(false);
    };

    const handleRemoveFDRAddress = (
        address: string,
    ) => {
        setFDRAllowList(
            fdrAllowList.filter(
                (item) => item !== address,
            ),
        );
    };

    return (
        <div className="page">
            <h2>Settings</h2>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Interface Configuration</h2>

                    <div className="settings-group-description">
                        Configure the local BACnet/IP endpoint used
                        by SuperRouter.
                    </div>
                </div>

                <div className="settings-group-body">
                    <FormField
                        label="Name"
                        hint="A descriptive name used to identify this interface."
                        help={
                            <>
                                <p>
                                    This name is used only by SuperRouter
                                    for configuration and display.
                                </p>

                                <p>
                                    Examples include BACnet Primary,
                                    Controls VLAN, or HA Virtual IP.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value,
                                )
                            }
                            placeholder="BACnet Primary"
                        />
                    </FormField>

                    <FormField
                        label="Bind Address"
                        hint="Local IPv4 address on which SuperRouter listens for BACnet/IP traffic."
                        help={
                            <>
                                <p>
                                    SuperRouter binds its BACnet/IP UDP
                                    socket to this local address.
                                </p>

                                <p>
                                    This must normally be an address
                                    assigned to one of the host's local
                                    network interfaces.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="text"
                            value={bindAddress}
                            onChange={
                                handleBindAddressChange
                            }
                            onBlur={() =>
                                setBindAddressTouched(
                                    true,
                                )
                            }
                            placeholder="10.7.4.208"
                            spellCheck={false}
                            aria-invalid={
                                bindAddressHasError
                            }
                        />

                        {bindAddressHasError && (
                            <div className="form-field-error">
                                Enter a valid IPv4 address.
                            </div>
                        )}
                    </FormField>

                    <FormField
                        label="Advertise Address"
                        hint="Address that represents this endpoint to remote BACnet/IP devices."
                        help={
                            <>
                                <p>
                                    This will normally be the same as
                                    the Bind Address.
                                </p>

                                <p>
                                    A different value may be required
                                    when using NAT, a virtual IP address,
                                    containers, or a high-availability
                                    configuration.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="text"
                            value={advertiseAddress}
                            onChange={
                                handleAdvertiseAddressChange
                            }
                            onBlur={() =>
                                setAdvertiseAddressTouched(
                                    true,
                                )
                            }
                            placeholder="10.7.4.208"
                            spellCheck={false}
                            aria-invalid={
                                advertiseAddressHasError
                            }
                        />

                        {advertiseAddressHasError && (
                            <div className="form-field-error">
                                Enter a valid IPv4 address.
                            </div>
                        )}
                    </FormField>

                    <FormField
                        label="BACnet/IP Port"
                        hint="UDP port used by this BACnet/IP endpoint."
                        help={
                            <>
                                <p>
                                    BACnet/IP commonly uses UDP port
                                    47808, which is hexadecimal BAC0.
                                </p>

                                <p>
                                    Other ports may be used when multiple
                                    BACnet/IP applications share a host
                                    or when required by the network
                                    design.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="number"
                            min={1}
                            max={65535}
                            value={port}
                            onChange={(event) =>
                                setPort(
                                    Number(
                                        event.target.value,
                                    ),
                                )
                            }
                        />
                    </FormField>
                </div>
            </section>

            <section className="settings-group">
                <div className="settings-group-header">
                    <h2>Foreign Device Registration</h2>

                    <div className="settings-group-description">
                        Control whether BACnet/IP foreign devices may
                        register with this local endpoint.
                    </div>
                </div>

                <div className="settings-group-body">
                    <FormField
                        label="Accept Foreign Devices"
                        hint="Allow this interface to accept BACnet/IP Register-Foreign-Device requests."
                        help={
                            <>
                                <p>
                                    When enabled, SuperRouter acts as a
                                    BBMD capable of accepting foreign
                                    device registrations on this
                                    interface.
                                </p>

                                <p>
                                    Registered foreign devices receive
                                    forwarded BACnet broadcasts according
                                    to their active registration.
                                </p>
                            </>
                        }
                    >
                        <input
                            type="checkbox"
                            checked={acceptFDRs}
                            onChange={(event) =>
                                setAcceptFDRs(
                                    event.target.checked,
                                )
                            }
                        />
                    </FormField>

                    <FormField
                        label="Registration Policy"
                        hint="Choose which foreign devices are allowed to register."
                        help={
                            <>
                                <p>
                                    Allow All accepts valid registrations
                                    from any reachable BACnet/IP foreign
                                    device.
                                </p>

                                <p>
                                    Allow List accepts registrations only
                                    from addresses explicitly configured
                                    below.
                                </p>
                            </>
                        }
                    >
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="fdrAcceptMode"
                                    value="all"
                                    checked={
                                        fdrAcceptMode ===
                                        "all"
                                    }
                                    disabled={!acceptFDRs}
                                    onChange={() =>
                                        setFDRAcceptMode(
                                            "all",
                                        )
                                    }
                                />

                                {" "}
                                Allow all foreign devices
                            </label>
                        </div>

                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="fdrAcceptMode"
                                    value="allow-list"
                                    checked={
                                        fdrAcceptMode ===
                                        "allow-list"
                                    }
                                    disabled={!acceptFDRs}
                                    onChange={() =>
                                        setFDRAcceptMode(
                                            "allow-list",
                                        )
                                    }
                                />

                                {" "}
                                Only allow listed addresses
                            </label>
                        </div>
                    </FormField>

                    {acceptFDRs &&
                        fdrAcceptMode === "allow-list" && (
                            <div>
                                <FormField
                                    label="Allowed Address"
                                    hint="IPv4 address of a foreign device, optionally including its UDP port."
                                    help={
                                        <>
                                            <p>
                                                Enter an IP address to
                                                allow registrations from
                                                that host.
                                            </p>

                                            <p>
                                                A UDP port may optionally
                                                be specified when the
                                                registration should be
                                                restricted to one exact
                                                BACnet/IP endpoint.
                                            </p>

                                            <p>
                                                Examples:
                                            </p>

                                            <p>
                                                <code>
                                                    10.7.6.148
                                                </code>
                                                <br />
                                                <code>
                                                    10.7.6.148:47808
                                                </code>
                                            </p>
                                        </>
                                    }
                                >
                                    <input
                                        type="text"
                                        value={
                                            newFDRAddress
                                        }
                                        onChange={
                                            handleNewFDRAddressChange
                                        }
                                        onBlur={() =>
                                            setNewFDRAddressTouched(
                                                true,
                                            )
                                        }
                                        placeholder="10.7.6.148:47808"
                                        spellCheck={false}
                                        aria-invalid={
                                            newFDRAddressHasError
                                        }
                                    />

                                    {newFDRAddressHasError && (
                                        <div className="form-field-error">
                                            Enter a valid IPv4
                                            address with an
                                            optional port.
                                        </div>
                                    )}

                                    <div className="button-row">
                                        <button
                                            type="button"
                                            className="button"
                                            onClick={
                                                handleAddFDRAddress
                                            }
                                        >
                                            Add Address
                                        </button>
                                    </div>
                                </FormField>

                                {fdrAllowList.length > 0 && (
                                    <div className="table-container">
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>
                                                    Allowed Address
                                                </th>
                                                <th></th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {fdrAllowList.map(
                                                (
                                                    address,
                                                ) => (
                                                    <tr
                                                        key={
                                                            address
                                                        }
                                                    >
                                                        <td>
                                                            {
                                                                address
                                                            }
                                                        </td>

                                                        <td>
                                                            <button
                                                                type="button"
                                                                className="button"
                                                                onClick={() =>
                                                                    handleRemoveFDRAddress(
                                                                        address,
                                                                    )
                                                                }
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                </div>
            </section>
        </div>
    );
}