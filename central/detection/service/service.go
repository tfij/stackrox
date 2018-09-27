package service

import (
	"context"

	buildTimeDetection "github.com/stackrox/rox/central/detection/buildtime"
	"github.com/stackrox/rox/generated/api/v1"
	"github.com/stackrox/rox/pkg/grpc"
	"github.com/stackrox/rox/pkg/images/enricher"
)

// Service provides the interface for running detection on images and containers.
type Service interface {
	grpc.APIService

	AuthFuncOverride(ctx context.Context, fullMethodName string) (context.Context, error)

	v1.DetectionServiceServer
}

// New returns a new Service instance using the given DataStore.
func New(imageEnricher enricher.ImageEnricher, buildTimeDetector buildTimeDetection.Detector) Service {
	return &serviceImpl{
		imageEnricher:     imageEnricher,
		buildTimeDetector: buildTimeDetector,
	}
}
