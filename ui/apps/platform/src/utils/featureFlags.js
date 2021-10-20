export const types = {
    SHOW_DISALLOWED_CONNECTIONS: 'SHOW_DISALLOWED_CONNECTIONS',
};

// featureFlags defines UI specific feature flags.
export const UIfeatureFlags = {
    [types.SHOW_DISALLOWED_CONNECTIONS]: false,
};

// knownBackendFlags defines backend feature flags that are checked in the UI.
export const knownBackendFlags = {
    ROX_NETWORK_DETECTION_BASELINE_SIMULATION: 'ROX_NETWORK_DETECTION_BASELINE_SIMULATION',
    ROX_NETWORK_DETECTION_BLOCKED_FLOWS: 'ROX_NETWORK_DETECTION_BLOCKED_FLOWS',
    ROX_VULN_RISK_MANAGEMENT: 'ROX_VULN_RISK_MANAGEMENT',
    ROX_SYSTEM_HEALTH_PF: 'ROX_SYSTEM_HEALTH_PF',
    ROX_POLICIES_PATTERNFLY: 'ROX_POLICIES_PATTERNFLY',
};

// isBackendFeatureFlagEnabled returns whether a feature flag retrieved from the backend is enabled.
// The default should never be required unless there's a programming error.
export const isBackendFeatureFlagEnabled = (backendFeatureFlags, envVar, defaultVal) => {
    const featureFlag = backendFeatureFlags.find((flag) => flag.envVar === envVar);
    if (!featureFlag) {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.warn(`EnvVar ${envVar} not found in the backend list, possibly stale?`);
        }
        return defaultVal;
    }
    return featureFlag.enabled;
};
