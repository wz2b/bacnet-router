package model

import "time"

/*
ForeignDeviceRegistration represents a BACnet/IP foreign device that has
registered with one of our local BBMD endpoints.

Foreign-device registration is a BVLC-level relationship. It does not,
by itself, tell us the BACnet Device Instance or any BACnet network(s)
that may be reachable through the foreign device. Those are learned
separately from BACnet network-layer/application-layer traffic.
*/
type ForeignDeviceRegistration struct {
	ID uint `gorm:"primaryKey"`

	/*
		LocalEndpoint identifies which of our BBMD endpoints accepted
		the registration.

		The same foreign address could theoretically register with more
		than one of our local endpoints, so the registration is uniquely
		identified by LocalEndpointID + Address.
	*/
	LocalEndpointID uint `gorm:"not null;uniqueIndex:idx_fdr_endpoint_address"`
	LocalEndpoint   LocalEndpoint

	/*
		Address is the foreign device's B/IP address, including UDP port.
	*/
	Address string `gorm:"not null;uniqueIndex:idx_fdr_endpoint_address"`

	/*
		TTL is the Time-to-Live value supplied by the foreign device in
		its most recent Register-Foreign-Device request.
	*/
	TTL uint16 `gorm:"not null"`

	/*
		RegisteredAt is the time at which the most recent registration
		or renewal was received.
	*/
	RegisteredAt time.Time `gorm:"not null"`

	/*
		PurgeAt is the actual time at which the registration becomes
		invalid if it is not renewed.

		This includes the BACnet-defined grace period.
	*/
	PurgeAt time.Time `gorm:"not null"`
}
