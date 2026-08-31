package model

import "time"

/*
ForeignDevicePath represents the persistent logical path to a BACnet/IP
Foreign Device.

A path is identified by the combination of:

  - one of our LocalEndpoints, and
  - the foreign device's BACnet/IP address.

The path is intentionally separate from ForeignDeviceRegistration.
A foreign-device registration is temporary and expires according to its
TTL, while the path and information learned through it may remain useful
after the registration expires.

For example, if a foreign device registers, we learn that networks 200
and 7132 are reachable through it, and the registration later expires,
we may retain those learned networks. If the same foreign device
registers again, it resumes using the same path and its previously
learned information is available immediately.

LearnedNetworks, LearnedDevices, and LearnedSubscriptions are separate
database rows associated with this path. Deleting the path deletes those
learned records as well.
*/
type ForeignDevicePath struct {
	ID uint `gorm:"primaryKey"`

	/*
		LocalEndpoint is the local BACnet/IP endpoint on which this foreign
		device registers and through which traffic for this path is sent.

		Only LocalEndpointID is stored in this table. LocalEndpoint is the
		GORM association used to access the corresponding LocalEndpoint.
	*/
	LocalEndpointID uint
	LocalEndpoint   LocalEndpoint

	// Address is the foreign device's BACnet/IP address and optional port.
	Address string

	/*
		Learned information belongs to the path, not to an individual
		ForeignDeviceRegistration. This allows it to survive registration
		expiration and subsequent renewal.
	*/
	LearnedNetworks      []LearnedNetwork      `gorm:"foreignKey:ForeignDevicePathID;constraint:OnDelete:CASCADE;"`
	LearnedDevices       []LearnedDevice       `gorm:"foreignKey:ForeignDevicePathID;constraint:OnDelete:CASCADE;"`
	LearnedSubscriptions []LearnedSubscription `gorm:"foreignKey:ForeignDevicePathID;constraint:OnDelete:CASCADE;"`
}

/*
LearnedNetwork records a BACnet network that we have observed as reachable
through a ForeignDevicePath.

Networks may be learned directly from BACnet network-layer routing messages,
such as I-Am-Router-To-Network. Other observed traffic may also provide enough
routing context to associate a network with this path.

There may be only one record for a given (path, network) pair. Rediscovery
updates LastSeen rather than creating another record.
*/
type LearnedNetwork struct {
	ID uint `gorm:"primaryKey"`

	ForeignDevicePathID uint      `gorm:"not null;index;uniqueIndex:idx_path_network"`
	Network             uint16    `gorm:"not null;uniqueIndex:idx_path_network"`
	LastSeen            time.Time `gorm:"not null"`
}

/*
LearnedDevice records a BACnet device that we have observed as reachable
through a ForeignDevicePath.

Devices will normally be learned from I-Am APDUs. The DeviceInstance comes
from the I-Am; routing and packet-source information identifies the path
through which the device was observed.

There may be only one record for a given (path, device instance) pair.
Rediscovery updates LastSeen rather than creating another record.
*/
type LearnedDevice struct {
	ID uint `gorm:"primaryKey"`

	ForeignDevicePathID uint      `gorm:"not null;index;uniqueIndex:idx_path_device"`
	DeviceInstance      uint32    `gorm:"not null;uniqueIndex:idx_path_device"`
	LastSeen            time.Time `gorm:"not null"`
}

/*
LearnedSubscription records COV subscription demand that we have observed
through a ForeignDevicePath.

These records are learned by observing SubscribeCOV traffic. They allow the
path's forwarding filter to determine which COV notifications should be sent
through this path without blindly propagating all COV traffic.

SubscriberDevice and SourceDevice may require information learned outside
the SubscribeCOV APDU itself; the APDU directly identifies the subscriber
process and monitored object, while device identity may be derived from the
surrounding BACnet addressing/routing state.

ExpiresAt records when the subscription ceases to be valid unless renewed.
LastSeen records when we most recently observed the subscription or renewal.
*/
type LearnedSubscription struct {
	ID uint `gorm:"primaryKey"`

	ForeignDevicePathID uint `gorm:"not null;index"`

	SubscriberDevice uint32
	SourceDevice     uint32
	ObjectType       uint16
	ObjectInstance   uint32

	ProcessID uint32

	ExpiresAt time.Time
	LastSeen  time.Time
}
