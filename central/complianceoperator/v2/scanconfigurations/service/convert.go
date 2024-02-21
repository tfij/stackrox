package service

import (
	"context"

	"github.com/gogo/protobuf/types"
	"github.com/pkg/errors"
	complianceDS "github.com/stackrox/rox/central/complianceoperator/v2/scanconfigurations/datastore"
	bindingsDS "github.com/stackrox/rox/central/complianceoperator/v2/scansettingbindings/datastore"
	suiteDS "github.com/stackrox/rox/central/complianceoperator/v2/suites/datastore"
	v2 "github.com/stackrox/rox/generated/api/v2"
	"github.com/stackrox/rox/generated/storage"
	"github.com/stackrox/rox/pkg/grpc/authn"
	"github.com/stackrox/rox/pkg/protoutils"
	"github.com/stackrox/rox/pkg/search"
)

/*
storage type to apiV2 type conversions
*/

var (
	v2IntervalTypeToStorage = map[v2.Schedule_IntervalType]storage.Schedule_IntervalType{
		v2.Schedule_UNSET:   storage.Schedule_UNSET,
		v2.Schedule_WEEKLY:  storage.Schedule_WEEKLY,
		v2.Schedule_MONTHLY: storage.Schedule_MONTHLY,
		v2.Schedule_DAILY:   storage.Schedule_DAILY,
	}

	storageIntervalTypeToV2 = map[storage.Schedule_IntervalType]v2.Schedule_IntervalType{
		storage.Schedule_UNSET:   v2.Schedule_UNSET,
		storage.Schedule_DAILY:   v2.Schedule_DAILY,
		storage.Schedule_WEEKLY:  v2.Schedule_WEEKLY,
		storage.Schedule_MONTHLY: v2.Schedule_MONTHLY,
	}
)

func convertStorageScanConfigToV2(ctx context.Context, scanConfig *storage.ComplianceOperatorScanConfigurationV2, configDS complianceDS.DataStore) (*v2.ComplianceScanConfiguration, error) {
	if scanConfig == nil {
		return nil, nil
	}

	scanClusters, err := configDS.GetScanConfigClusterStatus(ctx, scanConfig.GetId())
	if err != nil {
		return nil, err
	}

	clusters := make([]string, 0, len(scanClusters))
	for _, cluster := range scanClusters {
		clusters = append(clusters, cluster.GetClusterId())
	}

	profiles := make([]string, 0, len(scanConfig.GetProfiles()))
	for _, profile := range scanConfig.GetProfiles() {
		profiles = append(profiles, profile.GetProfileName())
	}

	return &v2.ComplianceScanConfiguration{
		Id:       scanConfig.GetId(),
		ScanName: scanConfig.GetScanConfigName(),
		Clusters: clusters,
		ScanConfig: &v2.BaseComplianceScanConfigurationSettings{
			OneTimeScan:  scanConfig.GetOneTimeScan(),
			ScanSchedule: convertProtoScheduleToV2(scanConfig.GetSchedule()),
			Profiles:     profiles,
			Description:  scanConfig.GetDescription(),
		},
	}, nil
}

func convertV2ScanConfigToStorage(ctx context.Context, scanConfig *v2.ComplianceScanConfiguration) *storage.ComplianceOperatorScanConfigurationV2 {
	if scanConfig == nil {
		return nil
	}

	profiles := make([]*storage.ComplianceOperatorScanConfigurationV2_ProfileName, 0, len(scanConfig.GetScanConfig().GetProfiles()))
	for _, profile := range scanConfig.GetScanConfig().GetProfiles() {
		profiles = append(profiles, &storage.ComplianceOperatorScanConfigurationV2_ProfileName{
			ProfileName: profile,
		})
	}

	clusters := make([]*storage.ComplianceOperatorScanConfigurationV2_Cluster, 0, len(scanConfig.GetClusters()))
	for _, cluster := range scanConfig.GetClusters() {
		clusters = append(clusters, &storage.ComplianceOperatorScanConfigurationV2_Cluster{
			ClusterId: cluster,
		})
	}

	return &storage.ComplianceOperatorScanConfigurationV2{
		Id:                     scanConfig.GetId(),
		ScanConfigName:         scanConfig.GetScanName(),
		AutoApplyRemediations:  false,
		AutoUpdateRemediations: false,
		OneTimeScan:            false,
		StrictNodeScan:         false,
		Schedule:               convertV2ScheduleToProto(scanConfig.GetScanConfig().GetScanSchedule()),
		Profiles:               profiles,
		ModifiedBy:             authn.UserFromContext(ctx),
		Description:            scanConfig.GetScanConfig().GetDescription(),
		Clusters:               clusters,
	}
}

// convertV2ScheduleToProto converts v2.Schedule to storage.Schedule. Does not validate v2.Schedule
func convertV2ScheduleToProto(schedule *v2.Schedule) *storage.Schedule {
	if schedule == nil {
		return nil
	}

	ret := &storage.Schedule{
		IntervalType: v2IntervalTypeToStorage[schedule.GetIntervalType()],
		Hour:         schedule.GetHour(),
		Minute:       schedule.GetMinute(),
	}
	switch schedule.Interval.(type) {
	case *v2.Schedule_DaysOfWeek_:
		ret.Interval = &storage.Schedule_DaysOfWeek_{
			DaysOfWeek: &storage.Schedule_DaysOfWeek{Days: schedule.GetDaysOfWeek().GetDays()},
		}
	case *v2.Schedule_DaysOfMonth_:
		ret.Interval = &storage.Schedule_DaysOfMonth_{
			DaysOfMonth: &storage.Schedule_DaysOfMonth{Days: schedule.GetDaysOfMonth().GetDays()},
		}
	}

	return ret
}

// convertProtoScheduleToV2 converts storage.Schedule to v2.Schedule. Does not validate storage.Schedule
func convertProtoScheduleToV2(schedule *storage.Schedule) *v2.Schedule {
	if schedule == nil {
		return nil
	}
	ret := &v2.Schedule{
		IntervalType: storageIntervalTypeToV2[schedule.GetIntervalType()],
		Hour:         schedule.GetHour(),
		Minute:       schedule.GetMinute(),
	}

	switch schedule.Interval.(type) {
	case *storage.Schedule_DaysOfWeek_:
		ret.Interval = &v2.Schedule_DaysOfWeek_{
			DaysOfWeek: &v2.Schedule_DaysOfWeek{Days: schedule.GetDaysOfWeek().GetDays()},
		}
	case *storage.Schedule_Weekly:
		ret.Interval = &v2.Schedule_DaysOfWeek_{
			DaysOfWeek: &v2.Schedule_DaysOfWeek{Days: schedule.GetDaysOfWeek().GetDays()},
		}
	case *storage.Schedule_DaysOfMonth_:
		ret.Interval = &v2.Schedule_DaysOfMonth_{
			DaysOfMonth: &v2.Schedule_DaysOfMonth{Days: schedule.GetDaysOfMonth().GetDays()},
		}
	}

	return ret
}

func getLatestBindingError(status *storage.ComplianceOperatorStatus) string {
	conditions := status.GetConditions()
	for _, c := range conditions {
		// If this either an invalid or suspended condition, only then is this an error case
		if c.GetType() == "READY" && c.GetStatus() == "False" {
			return c.GetMessage()
		}
	}
	return ""
}

func convertStorageScanConfigToV2ScanStatus(ctx context.Context,
	scanConfig *storage.ComplianceOperatorScanConfigurationV2, configDS complianceDS.DataStore,
	bindingsDS bindingsDS.DataStore, suiteDS suiteDS.DataStore) (*v2.ComplianceScanConfigurationStatus, error) {
	if scanConfig == nil {
		return nil, nil
	}

	scanClusters, err := configDS.GetScanConfigClusterStatus(ctx, scanConfig.GetId())
	if err != nil {
		return nil, err
	}

	profiles := make([]string, 0, len(scanConfig.GetProfiles()))
	for _, profile := range scanConfig.GetProfiles() {
		profiles = append(profiles, profile.GetProfileName())
	}

	suiteClusters, err := suiteDS.GetSuites(ctx, search.NewQueryBuilder().
		AddExactMatches(search.ComplianceOperatorSuiteName, scanConfig.GetScanConfigName()).ProtoQuery())
	if err != nil {
		return nil, err
	}
	clusterToSuiteMap := make(map[string]*v2.ClusterScanStatus_SuiteStatus, len(suiteClusters))
	for _, suite := range suiteClusters {
		var lastTransitionTime *types.Timestamp
		conditions := suite.GetStatus().GetConditions()
		for _, c := range conditions {
			if lastTransitionTime == nil || protoutils.After(c.LastTransitionTime, lastTransitionTime) {
				lastTransitionTime = c.LastTransitionTime
			}
		}
		clusterToSuiteMap[suite.ClusterId] = &v2.ClusterScanStatus_SuiteStatus{
			Phase:              suite.GetStatus().GetPhase(),
			Result:             suite.GetStatus().GetResult(),
			ErrorMessage:       suite.GetStatus().GetErrorMessage(),
			LastTransitionTime: lastTransitionTime,
		}
	}
	return &v2.ComplianceScanConfigurationStatus{
		Id:       scanConfig.GetId(),
		ScanName: scanConfig.GetScanConfigName(),
		ClusterStatus: func() []*v2.ClusterScanStatus {
			clusterStatuses := make([]*v2.ClusterScanStatus, 0, len(scanClusters))
			for _, cluster := range scanClusters {
				var errors []string
				bindings, err := bindingsDS.GetScanSettingBindings(ctx, search.NewQueryBuilder().
					AddExactMatches(search.ComplianceOperatorScanConfigName, scanConfig.GetScanConfigName()).
					AddExactMatches(search.ClusterID, cluster.ClusterId).ProtoQuery())
				if err != nil {
					continue
				}

				// We may not have received any bindings from sensor
				if len(bindings) != 0 {
					bindingError := getLatestBindingError(bindings[0].Status)
					if bindingError != "" {
						errors = append(errors, bindingError)
					}
				}

				errors = append(errors, cluster.GetErrors()...)
				clusterStatuses = append(clusterStatuses, &v2.ClusterScanStatus{
					ClusterId:   cluster.GetClusterId(),
					ClusterName: cluster.GetClusterName(),
					Errors:      errors,
					SuiteStatus: clusterToSuiteMap[cluster.GetClusterId()],
				})
			}
			return clusterStatuses
		}(),
		ScanConfig: &v2.BaseComplianceScanConfigurationSettings{
			OneTimeScan:  scanConfig.GetOneTimeScan(),
			ScanSchedule: convertProtoScheduleToV2(scanConfig.GetSchedule()),
			Profiles:     profiles,
			Description:  scanConfig.GetDescription(),
		},
		ModifiedBy: &v2.SlimUser{
			Id:   scanConfig.GetModifiedBy().GetId(),
			Name: scanConfig.GetModifiedBy().GetName(),
		},
		CreatedTime:     scanConfig.GetCreatedTime(),
		LastUpdatedTime: scanConfig.GetLastUpdatedTime(),
	}, nil
}

func convertStorageScanConfigToV2ScanStatuses(ctx context.Context,
	scanConfigs []*storage.ComplianceOperatorScanConfigurationV2,
	configDS complianceDS.DataStore, bindingDS bindingsDS.DataStore, suiteDS suiteDS.DataStore) ([]*v2.ComplianceScanConfigurationStatus, error) {
	if scanConfigs == nil {
		return nil, nil
	}

	scanStatuses := make([]*v2.ComplianceScanConfigurationStatus, 0, len(scanConfigs))
	for _, scanConfig := range scanConfigs {
		converted, err := convertStorageScanConfigToV2ScanStatus(ctx, scanConfig, configDS, bindingDS, suiteDS)
		if err != nil {
			return nil, errors.Wrapf(err, "Error converting storage compliance operator scan configuration status with name %s to response", scanConfig.GetScanConfigName())
		}

		scanStatuses = append(scanStatuses, converted)
	}

	return scanStatuses, nil
}
