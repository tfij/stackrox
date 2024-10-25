import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { Telemetry } from 'types/config.proto';
import { selectors } from 'reducers';
import { UnionFrom, tupleTypeGuard } from 'utils/type.utils';

// Event Name Constants

// clusters
export const CLUSTER_CREATED = 'Cluster Created';

// invite users
export const INVITE_USERS_MODAL_OPENED = 'Invite Users Modal Opened';
export const INVITE_USERS_SUBMITTED = 'Invite Users Submitted';

// network graph
export const CLUSTER_LEVEL_SIMULATOR_OPENED = 'Network Graph: Cluster Level Simulator Opened';
export const GENERATE_NETWORK_POLICIES = 'Network Graph: Generate Network Policies';
export const DOWNLOAD_NETWORK_POLICIES = 'Network Graph: Download Network Policies';
export const CIDR_BLOCK_FORM_OPENED = 'Network Graph: CIDR Block Form Opened';

// watch images
export const WATCH_IMAGE_MODAL_OPENED = 'Watch Image Modal Opened';
export const WATCH_IMAGE_SUBMITTED = 'Watch Image Submitted';

// workflow cves
export const WORKLOAD_CVE_ENTITY_CONTEXT_VIEWED = 'Workload CVE Entity Context View';
export const WORKLOAD_CVE_FILTER_APPLIED = 'Workload CVE Filter Applied';
export const WORKLOAD_CVE_DEFAULT_FILTERS_CHANGED = 'Workload CVE Default Filters Changed';
export const WORKLOAD_CVE_DEFERRAL_EXCEPTION_REQUESTED =
    'Workload CVE Deferral Exception Requested';
export const WORKLOAD_CVE_FALSE_POSITIVE_EXCEPTION_REQUESTED =
    'Workload CVE False Positive Exception Requested';
export const COLLECTION_CREATED = 'Collection Created';
export const VULNERABILITY_REPORT_CREATED = 'Vulnerability Report Created';
export const VULNERABILITY_REPORT_DOWNLOAD_GENERATED = 'Vulnerability Report Download Generated';
export const VULNERABILITY_REPORT_SENT_MANUALLY = 'Vulnerability Report Sent Manually';

// node and platform CVEs
export const GLOBAL_SNOOZE_CVE = 'Global Snooze CVE';
export const NODE_CVE_FILTER_APPLIED = 'Node CVE Filter Applied';
export const NODE_CVE_ENTITY_CONTEXT_VIEWED = 'Node CVE Entity Context View';
export const PLATFORM_CVE_FILTER_APPLIED = 'Platform CVE Filter Applied';
export const PLATFORM_CVE_ENTITY_CONTEXT_VIEWED = 'Platform CVE Entity Context View';

// cluster-init-bundles
export const CREATE_INIT_BUNDLE_CLICKED = 'Create Init Bundle Clicked';
export const SECURE_A_CLUSTER_LINK_CLICKED = 'Secure a Cluster Link Clicked';
export const LEGACY_SECURE_A_CLUSTER_LINK_CLICKED = 'Legacy Secure a Cluster Link Clicked';
export const DOWNLOAD_INIT_BUNDLE = 'Download Init Bundle';
export const REVOKE_INIT_BUNDLE = 'Revoke Init Bundle';
export const LEGACY_CLUSTER_DOWNLOAD_YAML = 'Legacy Cluster Download YAML';
export const LEGACY_CLUSTER_DOWNLOAD_HELM_VALUES = 'Legacy Cluster Download Helm Values';

// policy violations

export const FILTERED_WORKFLOW_VIEW_SELECTED = 'Filtered Workflow View Selected';
export const POLICY_VIOLATIONS_FILTER_APPLIED = 'Policy Violations Filter Applied';

// compliance

export const COMPLIANCE_REPORT_DOWNLOAD_GENERATION_TRIGGERED =
    'Compliance Report Download Generation Triggered';
export const COMPLIANCE_REPORT_MANUAL_SEND_TRIGGERED = 'Compliance Report Manual Send Triggered';
export const COMPLIANCE_REPORT_JOBS_TABLE_VIEWED = 'Compliance Report Jobs Table Viewed';
export const COMPLIANCE_REPORT_JOBS_VIEW_TOGGLED = 'Compliance Report Jobs View Toggled';
export const COMPLIANCE_REPORT_RUN_STATE_FILTERED = 'Compliance Report Run State Filtered';
export const COMPLIANCE_SCHEDULES_WIZARD_SAVE_CLICKED = 'Compliance Schedules Wizard Save Clicked';
export const COMPLIANCE_SCHEDULES_WIZARD_STEP_CHANGED = 'Compliance Schedules Wizard Step Changed';

/**
 * Boolean fields should be tracked with 0 or 1 instead of true/false. This
 * allows us to use the boolean fields in numeric aggregations in the
 * analytics dashboard to retrieve an accurate count of the number of times
 * a property was enabled for an event.
 */
type AnalyticsBoolean = 0 | 1;

/**
 * A curated list of filters that we would like to track both the filter category and the
 * filter value. This list should exclude anything that could be considered sensitive or
 * specific to a customer environment. This items in this list must also match the casing of
 * the applied filter _exactly_, otherwise it will be tracked without the filter value.
 */
export const searchCategoriesWithFilter = [
    'Component Source',
    'SEVERITY',
    'FIXABLE',
    'CLUSTER CVE FIXABLE',
    'CVSS',
    'Node Top CVSS',
    'Category',
    'Severity',
    'Lifecycle Stage',
    'Resource Type',
    'Inactive Deployment',
] as const;

export const isSearchCategoryWithFilter = tupleTypeGuard(searchCategoriesWithFilter);
export type SearchCategoryWithFilter = UnionFrom<typeof searchCategoriesWithFilter>;

/**
 * An AnalyticsEvent is either a simple string that represents the event name,
 * or an object with an event name and additional properties.
 */
export type AnalyticsEvent =
    | typeof CLUSTER_CREATED
    | typeof INVITE_USERS_MODAL_OPENED
    | typeof INVITE_USERS_SUBMITTED
    /** Tracks each time a cluster level simulator is opened on Network Graph */
    | {
          event: typeof CLUSTER_LEVEL_SIMULATOR_OPENED;
          properties: {
              cluster: number;
              namespaces: number;
              deployments: number;
          };
      }
    /** Tracks each time network policies are generated on Network Graph */
    | {
          event: typeof GENERATE_NETWORK_POLICIES;
          properties: {
              cluster: number;
              namespaces: number;
              deployments: number;
          };
      }
    /** Tracks each time network policies are downloaded on Network Graph */
    | {
          event: typeof DOWNLOAD_NETWORK_POLICIES;
          properties: {
              cluster: number;
              namespaces: number;
              deployments: number;
          };
      }
    /** Tracks each time CIDR Block form opened on Network Graph */
    | {
          event: typeof CIDR_BLOCK_FORM_OPENED;
          properties: {
              cluster: number;
              namespaces: number;
              deployments: number;
          };
      }
    /** Tracks each time the user opens the "Watched Images" modal */
    | typeof WATCH_IMAGE_MODAL_OPENED
    /** Tracks each time the user submits a request to watch an image */
    | typeof WATCH_IMAGE_SUBMITTED
    /**
     * Tracks each view of a CVE entity context (CVE, Image, or Deployment). This is
     * controlled by the entity tabs on the Overview page and the CVE Detail page.
     */
    | {
          event: typeof WORKLOAD_CVE_ENTITY_CONTEXT_VIEWED;
          properties: {
              type: 'CVE' | 'Image' | 'Deployment';
              page: 'Overview' | 'CVE Detail';
          };
      }
    /**
     * Tracks each time the user applies a filter on a VM page.
     * This is controlled by the main search bar on all VM CVE pages.
     * We only track the value of the applied filter when it does not represent
     * specifics of a customer environment.
     */
    | {
          event:
              | typeof WORKLOAD_CVE_FILTER_APPLIED
              | typeof NODE_CVE_FILTER_APPLIED
              | typeof PLATFORM_CVE_FILTER_APPLIED;
          properties: { category: SearchCategoryWithFilter; filter: string } | { category: string };
      }
    /**
     * Tracks each time the user changes the default filters on the Workload CVE overview page.
     */
    | {
          event: typeof WORKLOAD_CVE_DEFAULT_FILTERS_CHANGED;
          properties: {
              SEVERITY_CRITICAL: AnalyticsBoolean;
              SEVERITY_IMPORTANT: AnalyticsBoolean;
              SEVERITY_MODERATE: AnalyticsBoolean;
              SEVERITY_LOW: AnalyticsBoolean;
              CVE_STATUS_FIXABLE: AnalyticsBoolean;
              CVE_STATUS_NOT_FIXABLE: AnalyticsBoolean;
          };
      }
    | {
          event: typeof WORKLOAD_CVE_DEFERRAL_EXCEPTION_REQUESTED;
          properties:
              | { expiryType: 'CUSTOM_DATE' | 'TIME'; expiryDays: number }
              | { expiryType: 'ALL_CVE_FIXABLE' | 'ANY_CVE_FIXABLE' | 'INDEFINITE' };
      }
    | {
          event: typeof WORKLOAD_CVE_FALSE_POSITIVE_EXCEPTION_REQUESTED;
          properties: Record<string, never>;
      }
    /**
     * Tracks each time the user creates a collection.
     */
    | {
          event: typeof COLLECTION_CREATED;
          properties: {
              source: 'Vulnerability Reporting' | 'Collections';
          };
      }
    /**
     *
     */
    | {
          event: typeof VULNERABILITY_REPORT_CREATED;
          properties: {
              SEVERITY_CRITICAL: AnalyticsBoolean;
              SEVERITY_IMPORTANT: AnalyticsBoolean;
              SEVERITY_MODERATE: AnalyticsBoolean;
              SEVERITY_LOW: AnalyticsBoolean;
              CVE_STATUS_FIXABLE: AnalyticsBoolean;
              CVE_STATUS_NOT_FIXABLE: AnalyticsBoolean;
              IMAGE_TYPE_DEPLOYED: AnalyticsBoolean;
              IMAGE_TYPE_WATCHED: AnalyticsBoolean;
              EMAIL_NOTIFIER: AnalyticsBoolean;
              TEMPLATE_MODIFIED: AnalyticsBoolean;
          };
      }
    /**
     * Tracks each time the user generates a vulnerability report download.
     */
    | typeof VULNERABILITY_REPORT_DOWNLOAD_GENERATED
    /**
     * Tracks each time the user sends a vulnerability report manually.
     */
    | typeof VULNERABILITY_REPORT_SENT_MANUALLY
    /**
     * Tracks each time the user snoozes a Node or Platform CVE via
     * Vulnerability Management 1.0
     */
    | {
          event: typeof GLOBAL_SNOOZE_CVE;
          properties: {
              type: 'NODE' | 'PLATFORM';
              duration: string;
          };
      }
    /**
     * Tracks each view of a CVE entity context (CVE or Node). This is
     * controlled by the entity tabs on the Overview page.
     */
    | {
          event: typeof NODE_CVE_ENTITY_CONTEXT_VIEWED;
          properties: {
              type: 'CVE' | 'Node';
              page: 'Overview';
          };
      }
    /**
     * Tracks each view of a CVE entity context (CVE or Cluster). This is
     * controlled by the entity tabs on the Overview page.
     */
    | {
          event: typeof PLATFORM_CVE_ENTITY_CONTEXT_VIEWED;
          properties: {
              type: 'CVE' | 'Cluster';
              page: 'Overview';
          };
      }
    /**
     * Tracks each time the user clicks the "Create Bundle" button
     */
    | {
          event: typeof CREATE_INIT_BUNDLE_CLICKED;
          properties: {
              source: 'No Clusters' | 'Cluster Init Bundles';
          };
      }
    /**
     * Tracks each time the user clicks a link to visit the "Secure a Cluster" page
     */
    | {
          event: typeof SECURE_A_CLUSTER_LINK_CLICKED;
          properties: {
              source: 'No Clusters' | 'Secure a Cluster Dropdown';
          };
      }
    /**
     * Tracks each time the user clicks a link to visit the legacy installation method page
     */
    | {
          event: typeof LEGACY_SECURE_A_CLUSTER_LINK_CLICKED;
          properties: {
              source: 'No Clusters' | 'Secure a Cluster Dropdown';
          };
      }
    /**
     * Tracks each time the user downloads an init bundle
     */
    | typeof DOWNLOAD_INIT_BUNDLE
    /**
     * Tracks each time the user revokes an init bundle
     */
    | typeof REVOKE_INIT_BUNDLE
    /**
     * Tracks each time the user downloads a cluster's YAML file and keys
     */
    | typeof LEGACY_CLUSTER_DOWNLOAD_YAML
    /**
     * Tracks each time the user downloads a cluster's Helm values
     */
    | typeof LEGACY_CLUSTER_DOWNLOAD_HELM_VALUES
    /**
     * Tracks each time the user selects a filtered workflow view
     */
    | {
          event: typeof FILTERED_WORKFLOW_VIEW_SELECTED;
          properties: {
              value: 'Application view' | 'Platform view' | 'Full view';
          };
      }
    /**
     * Tracks each time the user applies a filter on the Policy Violations page.
     * We only track the value of the applied filter when it does not represent
     * specifics of a customer environment.
     */
    | {
          event: typeof POLICY_VIOLATIONS_FILTER_APPLIED;
          properties: { category: string; filter: string } | { category: string };
      }
    /**
     * Tracks each time the user generates a compliance report download
     */
    | {
          event: typeof COMPLIANCE_REPORT_DOWNLOAD_GENERATION_TRIGGERED;
          properties: {
              source: 'Table row' | 'Details page';
          };
      }
    /**
     * Tracks each time the user sends a compliance report manually
     */
    | {
          event: typeof COMPLIANCE_REPORT_MANUAL_SEND_TRIGGERED;
          properties: {
              source: 'Table row' | 'Details page';
          };
      }
    /**
     * Tracks each time the user views the compliance report jobs table
     */
    | typeof COMPLIANCE_REPORT_JOBS_TABLE_VIEWED
    /**
     * Tracks each time the user clicks the "View only my jobs" toggle
     */
    | {
          event: typeof COMPLIANCE_REPORT_JOBS_VIEW_TOGGLED;
          properties: {
              view: 'My jobs';
              state: true | false;
          };
      }
    /**
     * Tracks each time the user filters by report run state
     */
    | {
          event: typeof COMPLIANCE_REPORT_RUN_STATE_FILTERED;
          properties: {
              value: ('WAITING' | 'PREPARING' | 'GENERATED' | 'DELIVERED' | 'FAILURE')[];
          };
      }
    | {
          event: typeof COMPLIANCE_SCHEDULES_WIZARD_SAVE_CLICKED;
          properties: {
              success: true | false;
              errorMessage: string;
          };
      }
    | {
          event: typeof COMPLIANCE_SCHEDULES_WIZARD_STEP_CHANGED;
          properties: {
              step: string;
          };
      };

const useAnalytics = () => {
    const telemetry = useSelector(selectors.publicConfigTelemetrySelector);
    const { enabled: isTelemetryEnabled } = telemetry || ({} as Telemetry);

    const analyticsPageVisit = useCallback(
        (type: string, name: string, additionalProperties = {}): void => {
            if (isTelemetryEnabled !== false) {
                window.analytics?.page(type, name, additionalProperties);
            }
        },
        [isTelemetryEnabled]
    );

    const analyticsTrack = useCallback(
        (analyticsEvent: AnalyticsEvent): void => {
            if (isTelemetryEnabled === false) {
                return;
            }

            if (typeof analyticsEvent === 'string') {
                window.analytics?.track(analyticsEvent);
            } else {
                window.analytics?.track(analyticsEvent.event, analyticsEvent.properties);
            }
        },
        [isTelemetryEnabled]
    );

    return { analyticsPageVisit, analyticsTrack };
};

export default useAnalytics;
