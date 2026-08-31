package model

/*
LocalEndpoint represents a local BACnet/IP endpoint available to the
SuperRouter.

A LocalEndpoint may be shared by any number of ForeignBBMD relationships.
*/
type LocalEndpoint struct {
	ID uint `gorm:"primaryKey"`

	// Name is a human-readable identifier for this endpoint.
	Name string

	/*
		BindAddress is the local IP address on which the SuperRouter binds
		its BACnet/IP socket.
	*/
	BindAddress string

	/*
		AdvertiseAddress is the address that should represent this endpoint
		to other BACnet/IP devices.

		It will normally be the same as BindAddress, but keeping the two
		concepts separate allows configurations involving NAT, virtual IP
		addresses, HA addresses, containers, etc.
	*/
	AdvertiseAddress string

	// Port is the UDP port used by this BACnet/IP endpoint.
	Port uint16
}
