import React from 'react';
import {
    PageSection,
    Title,
    Divider,
    Flex,
    FlexItem,
    Card,
    CardBody,
    ToolbarItem,
} from '@patternfly/react-core';
import { DropdownItem } from '@patternfly/react-core/deprecated';
import { useApolloClient } from '@apollo/client';

import PageTitle from 'Components/PageTitle';
import useURLStringUnion from 'hooks/useURLStringUnion';
import useURLPagination from 'hooks/useURLPagination';
import useURLSearch from 'hooks/useURLSearch';
import useAnalytics, { GLOBAL_SNOOZE_CVE } from 'hooks/useAnalytics';
import { getHasSearchApplied } from 'utils/searchUtils';

import TableEntityToolbar from 'Containers/Vulnerabilities/components/TableEntityToolbar';
import useMap from 'hooks/useMap';
import useURLSort from 'hooks/useURLSort';
import useSnoozeCveModal from 'Containers/Vulnerabilities/components/SnoozeCvesModal/useSnoozeCveModal';
import SnoozeCvesModal from 'Containers/Vulnerabilities/components/SnoozeCvesModal/SnoozeCvesModal';
import BulkActionsDropdown from 'Components/PatternFly/BulkActionsDropdown';

import { parseQuerySearchFilter } from 'Containers/Vulnerabilities/utils/searchUtils';
import AdvancedFiltersToolbar from 'Containers/Vulnerabilities/components/AdvancedFiltersToolbar';
import { clusterSearchFilterConfig, platformCVESearchFilterConfig } from '../../searchFilterConfig';
import SnoozeCveToggleButton from '../../components/SnoozedCveToggleButton';
import { DEFAULT_VM_PAGE_SIZE } from '../../constants';
import EntityTypeToggleGroup from '../../components/EntityTypeToggleGroup';
import { platformEntityTabValues } from '../../types';
import useHasLegacySnoozeAbility from '../../hooks/useHasLegacySnoozeAbility';

import ClustersTable, {
    defaultSortOption as clusterDefaultSortOption,
    sortFields as clusterSortFields,
} from './ClustersTable';
import CVEsTable, {
    defaultSortOption as cveDefaultSortOption,
    sortFields as cveSortFields,
} from './CVEsTable';
import { usePlatformCveEntityCounts } from './usePlatformCveEntityCounts';

const searchFilterConfig = {
    Cluster: clusterSearchFilterConfig,
    PlatformCVE: platformCVESearchFilterConfig,
};

function PlatformCvesOverviewPage() {
    const apolloClient = useApolloClient();
    const { analyticsTrack } = useAnalytics();

    const [activeEntityTabKey] = useURLStringUnion('entityTab', platformEntityTabValues);
    const { searchFilter, setSearchFilter } = useURLSearch();
    const pagination = useURLPagination(DEFAULT_VM_PAGE_SIZE);
    const { sortOption, getSortParams, setSortOption } = useURLSort({
        sortFields: activeEntityTabKey === 'CVE' ? cveSortFields : clusterSortFields,
        defaultSortOption:
            activeEntityTabKey === 'CVE' ? cveDefaultSortOption : clusterDefaultSortOption,
        onSort: () => pagination.setPage(1, 'replace'),
    });

    const querySearchFilter = parseQuerySearchFilter(searchFilter);
    const isFiltered = getHasSearchApplied(querySearchFilter);

    const isViewingSnoozedCves = querySearchFilter['CVE Snoozed']?.[0] === 'true';
    const hasLegacySnoozeAbility = useHasLegacySnoozeAbility();
    const selectedCves = useMap<string, { cve: string }>();
    const { snoozeModalOptions, setSnoozeModalOptions, snoozeActionCreator } = useSnoozeCveModal();

    function onEntityTabChange(entityTab: 'CVE' | 'Cluster') {
        pagination.setPage(1);
        setSortOption(
            entityTab === 'CVE' ? cveDefaultSortOption : clusterDefaultSortOption,
            'replace'
        );
    }

    const { data } = usePlatformCveEntityCounts(querySearchFilter);

    const entityCounts = {
        CVE: data?.platformCVECount ?? 0,
        Cluster: data?.clusterCount ?? 0,
    };

    function onClearFilters() {
        setSearchFilter({});
        pagination.setPage(1, 'replace');
    }

    const filterToolbar = (
        <AdvancedFiltersToolbar
            searchFilter={searchFilter}
            searchFilterConfig={searchFilterConfig}
            cveStatusFilterField="CLUSTER CVE FIXABLE"
            onFilterChange={(newFilter, { action }) => {
                setSearchFilter(newFilter);

                if (action === 'ADD') {
                    // TODO - Add analytics tracking ROX-24509
                }
            }}
            includeCveSeverityFilters={false}
        />
    );

    const entityToggleGroup = (
        <EntityTypeToggleGroup
            entityTabs={['CVE', 'Cluster']}
            entityCounts={entityCounts}
            onChange={onEntityTabChange}
        />
    );

    return (
        <>
            {snoozeModalOptions && (
                <SnoozeCvesModal
                    {...snoozeModalOptions}
                    onSuccess={(action, duration) => {
                        if (action === 'SNOOZE') {
                            analyticsTrack({
                                event: GLOBAL_SNOOZE_CVE,
                                properties: { type: 'PLATFORM', duration },
                            });
                        }
                        // Refresh the data after snoozing/unsnoozing CVEs
                        apolloClient.cache.evict({ fieldName: 'platformCVEs' });
                        apolloClient.cache.evict({ fieldName: 'platformCVECount' });
                        apolloClient.cache.gc();
                        selectedCves.clear();
                    }}
                    onClose={() => setSnoozeModalOptions(null)}
                />
            )}
            <PageTitle title="Platform CVEs Overview" />
            <Divider component="div" />
            <PageSection
                className="pf-v5-u-display-flex pf-v5-u-flex-direction-row pf-v5-u-align-items-center"
                variant="light"
            >
                <Flex alignItems={{ default: 'alignItemsCenter' }} className="pf-v5-u-flex-grow-1">
                    <Flex direction={{ default: 'column' }} className="pf-v5-u-flex-grow-1">
                        <Title headingLevel="h1">Platform CVEs</Title>
                        <FlexItem>Prioritize and manage scanned CVEs across clusters</FlexItem>
                    </Flex>
                    <FlexItem>
                        <SnoozeCveToggleButton
                            searchFilter={searchFilter}
                            setSearchFilter={setSearchFilter}
                        />
                    </FlexItem>
                </Flex>
            </PageSection>
            <PageSection isCenterAligned isFilled>
                <Card>
                    <CardBody>
                        <TableEntityToolbar
                            filterToolbar={filterToolbar}
                            entityToggleGroup={entityToggleGroup}
                            pagination={pagination}
                            tableRowCount={
                                activeEntityTabKey === 'CVE'
                                    ? entityCounts.CVE
                                    : entityCounts.Cluster
                            }
                            isFiltered={isFiltered}
                        >
                            {hasLegacySnoozeAbility && (
                                <ToolbarItem align={{ default: 'alignRight' }}>
                                    <BulkActionsDropdown isDisabled={selectedCves.size === 0}>
                                        <DropdownItem
                                            key="bulk-snooze-cve"
                                            component="button"
                                            onClick={() =>
                                                setSnoozeModalOptions({
                                                    action: isViewingSnoozedCves
                                                        ? 'UNSNOOZE'
                                                        : 'SNOOZE',
                                                    cveType: 'CLUSTER_CVE',
                                                    cves: Array.from(selectedCves.values()),
                                                })
                                            }
                                        >
                                            {isViewingSnoozedCves ? 'Unsnooze CVEs' : 'Snooze CVEs'}
                                        </DropdownItem>
                                    </BulkActionsDropdown>
                                </ToolbarItem>
                            )}
                        </TableEntityToolbar>
                        <Divider component="div" />
                        {activeEntityTabKey === 'CVE' && (
                            <CVEsTable
                                querySearchFilter={querySearchFilter}
                                isFiltered={isFiltered}
                                pagination={pagination}
                                selectedCves={selectedCves}
                                canSelectRows={hasLegacySnoozeAbility}
                                createRowActions={snoozeActionCreator(
                                    'CLUSTER_CVE',
                                    isViewingSnoozedCves ? 'UNSNOOZE' : 'SNOOZE'
                                )}
                                sortOption={sortOption}
                                getSortParams={getSortParams}
                                onClearFilters={onClearFilters}
                            />
                        )}
                        {activeEntityTabKey === 'Cluster' && (
                            <ClustersTable
                                querySearchFilter={querySearchFilter}
                                isFiltered={isFiltered}
                                pagination={pagination}
                                sortOption={sortOption}
                                getSortParams={getSortParams}
                                onClearFilters={onClearFilters}
                            />
                        )}
                    </CardBody>
                </Card>
            </PageSection>
        </>
    );
}

export default PlatformCvesOverviewPage;
