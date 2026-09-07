const ipv4AddressPattern =
    /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?::(\d{1,5}))?$/;

export function isValidIPv4Address(
    value: string,
): boolean {
    const match = ipv4AddressPattern.exec(value);

    if (match === null) {
        return false;
    }

    for (let index = 1; index <= 4; index += 1) {
        const octet = Number(match[index]);

        if (octet < 0 || octet > 255) {
            return false;
        }
    }

    const port = match[5];

    if (port !== undefined) {
        const portNumber = Number(port);

        if (portNumber < 1 || portNumber > 65535) {
            return false;
        }
    }

    return true;
}

export function isIPv4AddressInput(
    value: string,
): boolean {
    return /^[0-9.:]*$/.test(value);
}