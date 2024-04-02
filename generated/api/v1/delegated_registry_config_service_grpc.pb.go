// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.3.0
// - protoc             v4.25.3
// source: api/v1/delegated_registry_config_service.proto

package v1

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

const (
	DelegatedRegistryConfigService_GetConfig_FullMethodName    = "/v1.DelegatedRegistryConfigService/GetConfig"
	DelegatedRegistryConfigService_GetClusters_FullMethodName  = "/v1.DelegatedRegistryConfigService/GetClusters"
	DelegatedRegistryConfigService_UpdateConfig_FullMethodName = "/v1.DelegatedRegistryConfigService/UpdateConfig"
)

// DelegatedRegistryConfigServiceClient is the client API for DelegatedRegistryConfigService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type DelegatedRegistryConfigServiceClient interface {
	// GetConfig returns the current delegated registry configuration
	GetConfig(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*DelegatedRegistryConfig, error)
	// GetClusters returns the list of clusters (id + name) and a flag indicating whether or not
	// the cluster is valid for use in the delegated registry config
	GetClusters(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*DelegatedRegistryClustersResponse, error)
	// UpdateConfig updates the stored delegated registry configuration
	UpdateConfig(ctx context.Context, in *DelegatedRegistryConfig, opts ...grpc.CallOption) (*DelegatedRegistryConfig, error)
}

type delegatedRegistryConfigServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewDelegatedRegistryConfigServiceClient(cc grpc.ClientConnInterface) DelegatedRegistryConfigServiceClient {
	return &delegatedRegistryConfigServiceClient{cc}
}

func (c *delegatedRegistryConfigServiceClient) GetConfig(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*DelegatedRegistryConfig, error) {
	out := new(DelegatedRegistryConfig)
	err := c.cc.Invoke(ctx, DelegatedRegistryConfigService_GetConfig_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *delegatedRegistryConfigServiceClient) GetClusters(ctx context.Context, in *Empty, opts ...grpc.CallOption) (*DelegatedRegistryClustersResponse, error) {
	out := new(DelegatedRegistryClustersResponse)
	err := c.cc.Invoke(ctx, DelegatedRegistryConfigService_GetClusters_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *delegatedRegistryConfigServiceClient) UpdateConfig(ctx context.Context, in *DelegatedRegistryConfig, opts ...grpc.CallOption) (*DelegatedRegistryConfig, error) {
	out := new(DelegatedRegistryConfig)
	err := c.cc.Invoke(ctx, DelegatedRegistryConfigService_UpdateConfig_FullMethodName, in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// DelegatedRegistryConfigServiceServer is the server API for DelegatedRegistryConfigService service.
// All implementations should embed UnimplementedDelegatedRegistryConfigServiceServer
// for forward compatibility
type DelegatedRegistryConfigServiceServer interface {
	// GetConfig returns the current delegated registry configuration
	GetConfig(context.Context, *Empty) (*DelegatedRegistryConfig, error)
	// GetClusters returns the list of clusters (id + name) and a flag indicating whether or not
	// the cluster is valid for use in the delegated registry config
	GetClusters(context.Context, *Empty) (*DelegatedRegistryClustersResponse, error)
	// UpdateConfig updates the stored delegated registry configuration
	UpdateConfig(context.Context, *DelegatedRegistryConfig) (*DelegatedRegistryConfig, error)
}

// UnimplementedDelegatedRegistryConfigServiceServer should be embedded to have forward compatible implementations.
type UnimplementedDelegatedRegistryConfigServiceServer struct {
}

func (UnimplementedDelegatedRegistryConfigServiceServer) GetConfig(context.Context, *Empty) (*DelegatedRegistryConfig, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetConfig not implemented")
}
func (UnimplementedDelegatedRegistryConfigServiceServer) GetClusters(context.Context, *Empty) (*DelegatedRegistryClustersResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetClusters not implemented")
}
func (UnimplementedDelegatedRegistryConfigServiceServer) UpdateConfig(context.Context, *DelegatedRegistryConfig) (*DelegatedRegistryConfig, error) {
	return nil, status.Errorf(codes.Unimplemented, "method UpdateConfig not implemented")
}

// UnsafeDelegatedRegistryConfigServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to DelegatedRegistryConfigServiceServer will
// result in compilation errors.
type UnsafeDelegatedRegistryConfigServiceServer interface {
	mustEmbedUnimplementedDelegatedRegistryConfigServiceServer()
}

func RegisterDelegatedRegistryConfigServiceServer(s grpc.ServiceRegistrar, srv DelegatedRegistryConfigServiceServer) {
	s.RegisterService(&DelegatedRegistryConfigService_ServiceDesc, srv)
}

func _DelegatedRegistryConfigService_GetConfig_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DelegatedRegistryConfigServiceServer).GetConfig(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: DelegatedRegistryConfigService_GetConfig_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DelegatedRegistryConfigServiceServer).GetConfig(ctx, req.(*Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _DelegatedRegistryConfigService_GetClusters_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DelegatedRegistryConfigServiceServer).GetClusters(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: DelegatedRegistryConfigService_GetClusters_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DelegatedRegistryConfigServiceServer).GetClusters(ctx, req.(*Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _DelegatedRegistryConfigService_UpdateConfig_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(DelegatedRegistryConfig)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(DelegatedRegistryConfigServiceServer).UpdateConfig(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: DelegatedRegistryConfigService_UpdateConfig_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(DelegatedRegistryConfigServiceServer).UpdateConfig(ctx, req.(*DelegatedRegistryConfig))
	}
	return interceptor(ctx, in, info, handler)
}

// DelegatedRegistryConfigService_ServiceDesc is the grpc.ServiceDesc for DelegatedRegistryConfigService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var DelegatedRegistryConfigService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "v1.DelegatedRegistryConfigService",
	HandlerType: (*DelegatedRegistryConfigServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetConfig",
			Handler:    _DelegatedRegistryConfigService_GetConfig_Handler,
		},
		{
			MethodName: "GetClusters",
			Handler:    _DelegatedRegistryConfigService_GetClusters_Handler,
		},
		{
			MethodName: "UpdateConfig",
			Handler:    _DelegatedRegistryConfigService_UpdateConfig_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "api/v1/delegated_registry_config_service.proto",
}