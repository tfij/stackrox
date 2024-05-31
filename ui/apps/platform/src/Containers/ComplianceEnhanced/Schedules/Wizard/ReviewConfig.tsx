import React from 'react';
import { FormikContextType, useFormikContext } from 'formik';
import {
    Alert,
    Badge,
    Divider,
    Flex,
    FlexItem,
    List,
    ListItem,
    PageSection,
    Title,
} from '@patternfly/react-core';

import NotifierConfigurationView from 'Components/NotifierConfiguration/NotifierConfigurationView';
import useFeatureFlags from 'hooks/useFeatureFlags';
import { ComplianceIntegration } from 'services/ComplianceIntegrationService';

import {
    convertFormikParametersToSchedule,
    customBodyDefault,
    getSubjectDefault,
    ScanConfigFormValues,
} from '../compliance.scanConfigs.utils';
import ScanConfigParametersView from '../components/ScanConfigParametersView';
import ScanConfigProfilesView from '../components/ScanConfigProfilesView';

const headingLevel = 'h3';

export type ReviewConfigProps = {
    clusters: ComplianceIntegration[];
    errorMessage: string;
};

function ReviewConfig({ clusters, errorMessage }: ReviewConfigProps) {
    const { values: formikValues }: FormikContextType<ScanConfigFormValues> = useFormikContext();
    const { isFeatureFlagEnabled } = useFeatureFlags();
    const isComplianceReportingEnabled = isFeatureFlagEnabled('ROX_COMPLIANCE_REPORTING');

    const scanSchedule = convertFormikParametersToSchedule(formikValues.parameters);

    function findById<T, K extends keyof T>(selectedIds: string[], items: T[], idKey: K): T[] {
        return selectedIds
            .map((id) => items.find((item) => String(item[idKey]) === id))
            .filter((item): item is T => item !== undefined);
    }

    const selectedClusters = findById(formikValues.clusters, clusters, 'clusterId');

    return (
        <>
            <PageSection variant="light" padding={{ default: 'noPadding' }}>
                <Flex direction={{ default: 'column' }} className="pf-v5-u-py-lg pf-v5-u-px-lg">
                    <FlexItem>
                        <Title headingLevel="h2">Review</Title>
                    </FlexItem>
                    <FlexItem>Review and create your scan configuration</FlexItem>
                    {errorMessage && (
                        <Alert
                            title={'Scan configuration request failure'}
                            variant="danger"
                            isInline
                        >
                            {errorMessage}
                        </Alert>
                    )}
                </Flex>
            </PageSection>
            <Divider component="div" />
            <Flex
                direction={{ default: 'column' }}
                spaceItems={{ default: 'spaceItemsLg' }}
                className="pf-v5-u-pt-lg pf-v5-u-px-lg"
            >
                <ScanConfigParametersView
                    headingLevel={headingLevel}
                    scanName={formikValues.parameters.name}
                    description={formikValues.parameters.description}
                    scanSchedule={scanSchedule}
                />
                <Flex direction={{ default: 'column' }}>
                    <Flex spaceItems={{ default: 'spaceItemsSm' }}>
                        <Title headingLevel={headingLevel}>Clusters</Title>
                        <Badge isRead>{selectedClusters.length}</Badge>
                    </Flex>
                    <List isPlain>
                        {selectedClusters.map((cluster) => (
                            <ListItem key={cluster.id}>{cluster.clusterName}</ListItem>
                        ))}
                    </List>
                </Flex>
                <ScanConfigProfilesView
                    headingLevel={headingLevel}
                    profiles={formikValues.profiles}
                />
                {isComplianceReportingEnabled && (
                    <NotifierConfigurationView
                        customBodyDefault={customBodyDefault}
                        customSubjectDefault={getSubjectDefault(formikValues.parameters.name)}
                        notifierConfigurations={formikValues.report.notifierConfigurations}
                    />
                )}
            </Flex>
        </>
    );
}

export default ReviewConfig;
