export interface ConfigState {
    interfaces: LocalEndpointConfig[];
    bbmds: BBMDConfig[];
}

export interface LocalEndpointConfig {
    id: number;

    name: string;

    /*
     * Local address on which SuperRouter binds its BACnet/IP socket.
     */
    bindAddress: string;

    /*
     * Address advertised to remote BACnet/IP peers.
     *
     * Normally this will match bindAddress, but may differ for
     * NAT, HA/VIP configurations, containers, etc.
     */
    advertiseAddress: string;

    /*
     * BACnet/IP UDP port.
     */
    port: number;
}

export interface BDTEntryConfig {
    address: string;
    mask: string;
}

export interface StaticNetworkConfig {
    network: number;
}

/*
 * A static COV forwarding rule may apply either to every COV
 * notification from a device or to one specific object.
 *
 * Using a discriminated union prevents invalid states such as
 * objectType being set while objectInstance is missing.
 */
export type COVForwardRule =
    | {
    scope: "device";
    deviceInstance: number;
}
    | {
    scope: "object";
    deviceInstance: number;
    objectType: number;
    objectInstance: number;
};

export interface BBMDConfig {
    name: string;
    address: string;

    /*
     * LocalEndpoint is configured separately. The BBMD only
     * references the endpoint it uses.
     */
    localEndpointId: number;

    manageBDT: boolean;
    additionalBDTEntries: BDTEntryConfig[];

    routes: {
        learnFromRouterAdvertisements: boolean;
        learnFromIAm: boolean;
        learnFromTraffic: boolean;

        answerTargetedRouteRequests: boolean;
        answerUntargetedRouteRequests: boolean;
        splitHorizon: boolean;

        /*
         * Normally discovery should be preferred. These are
         * administrative overrides that never age out.
         */
        staticNetworks: StaticNetworkConfig[];
    };

    cov: {
        learnSubscriptions: boolean;
        filterNotifications: boolean;
        forwardUnknown: boolean;

        staticRules: COVForwardRule[];
    };

    trafficPolicy: {
        /*
         * Routing control traffic.
         */
        blockWhoIsRouterToAll: boolean;
        blockTargetedWhoIsRouter: boolean;

        /*
         * Discovery traffic.
         */
        blockGlobalWhoIs: boolean;
        blockGlobalWhoHas: boolean;
        blockIAm: boolean;
        blockIHave: boolean;

        /*
         * Broadcast/application safety.
         */
        blockConfirmedGlobalBroadcasts: boolean;
        blockConfirmedLocalBroadcasts: boolean;
        blockWildcardTargets: boolean;

        /*
         * Rate limiting.
         */
        rateLimitWhoIs: boolean;
        whoIsLimit: number;

        rateLimitWhoIsRouter: boolean;
        whoIsRouterLimit: number;
    };
}



export interface COVOptimizationRule {
    id: string;
    enabled: boolean;

    foreignBBMDId?: string;

    deviceInstance?: number;
    objectType?: number;
    objectInstance?: number;

    refreshCoalesceSeconds: number;
    refreshForwarding: "source-path" | "subscriber-paths";
}
