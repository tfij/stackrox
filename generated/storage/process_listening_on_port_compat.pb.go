// Code generated by protoc-gen-go-compat. DO NOT EDIT.

package storage

func (m *ProcessListeningOnPort) Size() int                      { return m.SizeVT() }
func (m *ProcessListeningOnPort) Clone() *ProcessListeningOnPort { return m.CloneVT() }
func (m *ProcessListeningOnPort) Marshal() ([]byte, error)       { return m.MarshalVT() }
func (m *ProcessListeningOnPort) Unmarshal(dAtA []byte) error    { return m.UnmarshalVT(dAtA) }

func (m *ProcessListeningOnPort_Endpoint) Size() int { return m.SizeVT() }
func (m *ProcessListeningOnPort_Endpoint) Clone() *ProcessListeningOnPort_Endpoint {
	return m.CloneVT()
}
func (m *ProcessListeningOnPort_Endpoint) Marshal() ([]byte, error)    { return m.MarshalVT() }
func (m *ProcessListeningOnPort_Endpoint) Unmarshal(dAtA []byte) error { return m.UnmarshalVT(dAtA) }

func (m *ProcessListeningOnPortFromSensor) Size() int { return m.SizeVT() }
func (m *ProcessListeningOnPortFromSensor) Clone() *ProcessListeningOnPortFromSensor {
	return m.CloneVT()
}
func (m *ProcessListeningOnPortFromSensor) Marshal() ([]byte, error)    { return m.MarshalVT() }
func (m *ProcessListeningOnPortFromSensor) Unmarshal(dAtA []byte) error { return m.UnmarshalVT(dAtA) }

func (m *ProcessListeningOnPortStorage) Size() int                             { return m.SizeVT() }
func (m *ProcessListeningOnPortStorage) Clone() *ProcessListeningOnPortStorage { return m.CloneVT() }
func (m *ProcessListeningOnPortStorage) Marshal() ([]byte, error)              { return m.MarshalVT() }
func (m *ProcessListeningOnPortStorage) Unmarshal(dAtA []byte) error           { return m.UnmarshalVT(dAtA) }
