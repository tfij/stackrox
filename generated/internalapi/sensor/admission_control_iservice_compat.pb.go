// Code generated by protoc-gen-go-compat. DO NOT EDIT.

package sensor

func (m *MsgFromAdmissionControl) Size() int                       { return m.SizeVT() }
func (m *MsgFromAdmissionControl) Clone() *MsgFromAdmissionControl { return m.CloneVT() }
func (m *MsgFromAdmissionControl) Marshal() ([]byte, error)        { return m.MarshalVT() }
func (m *MsgFromAdmissionControl) Unmarshal(dAtA []byte) error     { return m.UnmarshalVT(dAtA) }

func (m *MsgToAdmissionControl) Size() int                     { return m.SizeVT() }
func (m *MsgToAdmissionControl) Clone() *MsgToAdmissionControl { return m.CloneVT() }
func (m *MsgToAdmissionControl) Marshal() ([]byte, error)      { return m.MarshalVT() }
func (m *MsgToAdmissionControl) Unmarshal(dAtA []byte) error   { return m.UnmarshalVT(dAtA) }
